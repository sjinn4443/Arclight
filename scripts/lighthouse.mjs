import fs from "node:fs/promises";
import path from "node:path";
import { fork } from "node:child_process";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { chromium } from "@playwright/test";
import { runLighthouseWithRetries } from "./lighthouse-retry.mjs";

const server = fork("scripts/serve-quality.cjs", { silent: true });
const root = "http://127.0.0.1:4180";
const thresholds = {
  performance: 0.8,
  accessibility: 0.95,
  "best-practices": 0.95,
  seo: 0.9,
};
const dir = "quality-reports/lighthouse";
let session;
async function audit(url) {
  if (!session) {
    session = {
      profile: await fs.mkdtemp(path.resolve("tmp/lighthouse-profile-")),
    };
    session.chrome = await launch({
      userDataDir: session.profile,
      chromePath: process.env.CHROME_PATH || chromium.executablePath(),
      chromeFlags: ["--headless", "--no-sandbox"],
    });
    session.browser = await chromium.connectOverCDP(
      `http://127.0.0.1:${session.chrome.port}`,
    );
    const page = await session.browser.contexts()[0].newPage();
    await page.goto(root);
    await page.evaluate(() => {
      localStorage.setItem("arclight:onboarded", "1");
      localStorage.setItem("prefLang", "en");
    });
    await page.close();
    // For connectOverCDP, close disconnects Playwright from this external Chrome.
    // Leave Lighthouse as the only automation client during trace recording.
    await session.browser.close();
    session.browser = undefined;
  }
  return lighthouse(url, {
    port: session.chrome.port,
    output: ["html", "json"],
    logLevel: "error",
    disableStorageReset: true,
    onlyCategories: Object.keys(thresholds),
  });
}

async function closeBrowser() {
  if (!session) return;
  const { browser, chrome, profile } = session;
  session = undefined;
  try {
    if (browser) await browser.close();
  } finally {
    try {
      if (chrome) await chrome.kill();
    } finally {
      try {
        await fs.rm(profile, {
          recursive: true,
          force: true,
          maxRetries: 5,
          retryDelay: 200,
        });
      } catch (error) {
        // Windows may retain the launcher's log handles until Node exits.
        if (error.code !== "EPERM" && error.code !== "EBUSY") throw error;
        console.warn(
          `[lighthouse] Temporary profile cleanup deferred: ${profile}`,
        );
      }
    }
  }
}

try {
  await Promise.race([
    new Promise((resolve, reject) => {
      server.stdout.on("data", (data) => {
        if (String(data).includes("Quality server ready")) resolve();
      });
      server.on("exit", (code) =>
        reject(new Error(`Quality server exited ${code}`)),
      );
      server.on("error", reject);
    }),
    new Promise((_, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Quality server startup timed out")),
        30000,
      );
      timer.unref();
    }),
  ]);
  await fs.mkdir(dir, { recursive: true });
  await fs.mkdir("tmp", { recursive: true });
  const summary = [];
  for (const route of ["dashboard", "eyes"]) {
    const runs = [];
    for (let run = 1; run <= 3; run++) {
      console.log(`[lighthouse] Auditing ${route}, sample ${run}/3`);
      const result = await runLighthouseWithRetries(
        () => audit(`${root}/#/${route}`),
        {
          onFailure: async ({ attempt, error, result }) => {
            const prefix = `${dir}/${route}-${run}-attempt-${attempt}`;
            await fs.writeFile(
              `${prefix}-error.json`,
              JSON.stringify(
                { code: error.code, message: error.message },
                null,
                2,
              ),
            );
            if (result) {
              await fs.writeFile(`${prefix}.html`, result.report[0]);
              await fs.writeFile(`${prefix}.json`, result.report[1]);
            }
          },
          onRetry: async ({ attempt }) => {
            console.warn(
              `[lighthouse] ${route} run ${run}: NO_NAVSTART on attempt ${attempt}; retrying with a fresh browser`,
            );
            await closeBrowser();
          },
        },
      );
      await fs.writeFile(`${dir}/${route}-${run}.html`, result.report[0]);
      await fs.writeFile(`${dir}/${route}-${run}.json`, result.report[1]);
      runs.push(result.lhr.categories);
    }
    for (const [category, minimum] of Object.entries(thresholds)) {
      const score = runs
        .map((run) => run[category].score)
        .sort((a, b) => a - b)[1];
      summary.push({
        route,
        category,
        score,
        minimum,
        passed: score >= minimum,
      });
    }
  }
  await fs.writeFile(`${dir}/summary.json`, JSON.stringify(summary, null, 2));
  console.table(summary);
  if (summary.some((row) => !row.passed)) process.exitCode = 1;
} finally {
  try {
    await closeBrowser();
  } finally {
    server.kill();
  }
}

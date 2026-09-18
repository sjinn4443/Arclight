import fs from "node:fs/promises";
import { fork } from "node:child_process";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { chromium } from "@playwright/test";

const server = fork("scripts/serve-quality.cjs", { silent: true });
const root = "http://127.0.0.1:4180";
const thresholds = {
  performance: 0.8,
  accessibility: 0.95,
  "best-practices": 0.95,
  seo: 0.9,
};
const dir = "quality-reports/lighthouse";
let chrome;
let browser;
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
  const profile = await fs.mkdtemp("tmp/lighthouse-profile-");
  chrome = await launch({
    userDataDir: profile,
    chromePath: chromium.executablePath(),
    chromeFlags: ["--headless", "--no-sandbox"],
  });
  browser = await chromium.connectOverCDP(`http://127.0.0.1:${chrome.port}`);
  const page = await browser.contexts()[0].newPage();
  await page.goto(root);
  await page.evaluate(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
  await page.close();
  const summary = [];
  for (const route of ["dashboard", "eyes"]) {
    const runs = [];
    for (let run = 1; run <= 3; run++) {
      const result = await lighthouse(`${root}/#/${route}`, {
        port: chrome.port,
        output: ["html", "json"],
        logLevel: "error",
        disableStorageReset: true,
        onlyCategories: Object.keys(thresholds),
      });
      if (!result || result.lhr.runtimeError)
        throw new Error(
          result?.lhr.runtimeError?.message || "Missing Lighthouse result",
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
    if (browser) await browser.close();
    if (chrome) await chrome.kill();
  } finally {
    server.kill();
  }
}

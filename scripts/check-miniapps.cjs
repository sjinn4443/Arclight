const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { isSubappDevelopmentAsset } = require("../utils/subapp-assets.cjs");

const publicRoot = path.resolve(__dirname, "../public");
const subappRoot = path.join(publicRoot, "subapp");
const gallery = JSON.parse(
  fs.readFileSync(path.join(subappRoot, "gallery/apps.json")),
);
function checkPathCase(file) {
  let current = publicRoot;
  for (const part of path
    .relative(publicRoot, file)
    .split(path.sep)
    .filter(Boolean)) {
    assert.ok(
      fs.readdirSync(current).includes(part),
      `Case-sensitive deployment path mismatch: ${file}`,
    );
    current = path.join(current, part);
  }
}
async function check() {
  let precacheAssets = 0;
  for (const app of gallery.apps) {
    const entry = path.resolve(subappRoot, "gallery", app.entry);
    const dir = path.dirname(entry);
    const html = fs.readFileSync(entry, "utf8");
    assert.match(
      html,
      /\.\.\/i18n-lo\.js/,
      `${app.title}: host locale hook missing`,
    );
    const footerSource =
      app.title === "Glaucoma"
        ? fs.readFileSync(path.join(dir, "src/risk-config.js"), "utf8")
        : html;
    assert.match(
      footerSource,
      /30\/9\/2026/,
      `${app.title}: updated information footer missing`,
    );
    for (const match of html.matchAll(
      /<(?:script|img|link)\b[^>]*\b(?:src|href)=["']([^"']+)["']/gi,
    )) {
      const url = match[1];
      if (/^(?:data:|https?:|#)/.test(url)) continue;
      const file = url.startsWith("/")
        ? path.join(publicRoot, url)
        : path.resolve(dir, decodeURIComponent(url.split("?")[0]));
      assert.ok(
        fs.existsSync(file),
        `${app.title}: missing runtime asset ${url}`,
      );
      checkPathCase(file);
      assert.equal(
        isSubappDevelopmentAsset(path.relative(publicRoot, file)),
        false,
        `${app.title}: private asset referenced by HTML`,
      );
    }
    const workerName = ["service-worker.js", "sw.js"].find((name) =>
      fs.existsSync(path.join(dir, name)),
    );
    const code = fs.readFileSync(path.join(dir, workerName), "utf8");
    const listeners = {};
    const assets = [];
    const origin = "https://arclight.test";
    const workerUrl = `${origin}/subapp/${encodeURIComponent(path.basename(dir))}/${workerName}`;
    const sandbox = {
      URL,
      Response,
      console,
      self: {
        location: new URL(workerUrl),
        registration: { scope: new URL("./", workerUrl).href },
        addEventListener: (name, fn) => {
          listeners[name] = fn;
        },
        skipWaiting() {},
        clients: { claim() {} },
      },
      caches: {
        open: async () => ({
          addAll: async (values) => {
            assets.push(...values);
          },
        }),
      },
    };
    vm.runInNewContext(code, sandbox, { filename: workerName });
    let installation;
    listeners.install({
      waitUntil: (promise) => {
        installation = promise;
      },
    });
    await installation;
    for (const asset of assets) {
      const assetUrl = new URL(asset, workerUrl);
      const relative = decodeURIComponent(assetUrl.pathname).replace(/^\//, "");
      assert.equal(
        isSubappDevelopmentAsset(relative),
        false,
        `${app.title}: private precache asset ${asset}`,
      );
      assert.ok(
        fs.existsSync(path.join(publicRoot, relative)),
        `${app.title}: missing precache asset ${asset}`,
      );
      checkPathCase(path.join(publicRoot, relative));
      precacheAssets++;
    }
  }
  console.log(
    `Mini-app integration passed: ${gallery.apps.length} entries, locale hooks and ${precacheAssets} precache assets.`,
  );
}
check().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

const fs = require("node:fs");
const { execFileSync } = require("node:child_process");
const assert = require("node:assert/strict");
const { JSDOM } = require("jsdom");

const media = fs.readFileSync("public/js/mediaA11y.js", "utf8");
const html = fs.readFileSync("public/html/onboarding.html", "utf8");
const baseline = execFileSync(
  "C:/Program Files/Git/cmd/git.exe",
  ["show", "HEAD:public/js/i18n.js"],
  { encoding: "utf8" },
);
const fixed = fs.readFileSync("public/js/i18n.js", "utf8");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function check(source, label) {
  const dom = new JSDOM(html, {
    url: "http://localhost/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const w = dom.window;
  w.fetch = async (url) => ({
    ok: true,
    json: async () =>
      JSON.parse(
        fs.readFileSync("public/" + String(url).replace(/^\//, ""), "utf8"),
      ),
  });
  w.eval(
    media.replace(/export /g, "") +
      "\n" +
      source.replace(/^import .*;\r?\n/gm, "").replace(/export /g, ""),
  );
  const block = w.document
    .getElementById("practiceLevelTemplate")
    .content.firstElementChild.cloneNode(true);
  w.document.getElementById("experienceByRole").append(block);
  const select = block.querySelector("select");
  select.value = "2-5";
  select.focus();
  await delay(600);
  let mutations = 0;
  const observer = new w.MutationObserver((records) => {
    mutations += records.length;
  });
  observer.observe(w.document.body, {
    childList: true,
    characterData: true,
    subtree: true,
  });
  await delay(350);
  assert.equal(select.value, "2-5");
  assert.equal(w.document.activeElement, select);
  observer.disconnect();
  w.close();
  console.log(JSON.stringify({ label, idleMutationsIn350ms: mutations }));
  return mutations;
}
(async () => {
  const before = await check(baseline, "before");
  const after = await check(fixed, "after");
  assert.ok(before > 0, "Must reproduce the original idle mutation loop");
  assert.equal(after, 0, "Translation must settle while Experience is focused");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/** @jest-environment node */

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const runtimeSource = fs.readFileSync(
  path.join(process.cwd(), "public", "subapp", "i18n-lo.js"),
  "utf8",
);

test("the shared subapp runtime applies Spanish translations idempotently", async () => {
  const dom = new JSDOM(
    '<!doctype html><html lang="en"><body><p id="copy">pupil cataract refractive</p></body></html>',
    {
      runScripts: "outside-only",
      url: "http://localhost/subapp/test/",
    },
  );

  dom.window.localStorage.setItem("prefLang", "es");
  dom.window.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ i18nLiteral: {} }),
  });
  dom.window.eval(runtimeSource);

  await new Promise((resolve) => dom.window.setTimeout(resolve, 10));
  expect(dom.window.document.documentElement.lang).toBe("es");
  expect(dom.window.document.getElementById("copy").textContent).toBe(
    "pupila catarata refractivo",
  );

  await new Promise((resolve) => dom.window.setTimeout(resolve, 10));
  expect(dom.window.document.getElementById("copy").textContent).toBe(
    "pupila catarata refractivo",
  );
  dom.window.close();
});

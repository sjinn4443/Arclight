/** @jest-environment node */

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const runtimeSource = fs.readFileSync(
  path.join(process.cwd(), "public", "subapp", "i18n-lo.js"),
  "utf8",
);

test.each([
  ["ne", "nepali", "सुरु गर्नुहोस्"],
  ["fr", "french", "Commencer"],
  ["lg", "luganda", "Tandika"],
])(
  "the shared subapp runtime loads %s without Spanish fallbacks",
  async (code, name, translation) => {
    const dom = new JSDOM(
      '<p id="copy">Start</p><p id="score">4 questions. Pass mark 3.</p>',
      { runScripts: "outside-only", url: "http://localhost/subapp/test/" },
    );
    dom.window.localStorage.setItem("prefLang", code);
    dom.window.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ i18nLiteral: { Start: translation } }),
    });
    dom.window.eval(runtimeSource);
    await new Promise((resolve) => dom.window.setTimeout(resolve, 20));
    expect(dom.window.fetch.mock.calls[0][0]).toContain(
      `/translation/${name}.json`,
    );
    expect(dom.window.document.getElementById("copy").textContent).toBe(
      translation,
    );
    expect(
      dom.window.document.getElementById("score").textContent,
    ).not.toContain("preguntas");
    dom.window.close();
  },
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

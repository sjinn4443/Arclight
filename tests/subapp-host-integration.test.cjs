/** @jest-environment node */
const path = require("node:path");
const {
  resolveStaticHtmlFile,
  injectNonceIntoHtml,
} = require("../security/html-response.cjs");
const { applyMainAppCsp } = require("../security/csp.cjs");

test("encoded mini-app folder names use nonce-aware HTML serving", () => {
  const root = path.resolve("public");
  expect(
    resolveStaticHtmlFile(root, "/subapp/Fundal%20Reflex/index.html"),
  ).toBe(path.join(root, "subapp", "Fundal Reflex", "index.html"));
  expect(resolveStaticHtmlFile(root, "/subapp/Amsler/")).toBe(
    path.join(root, "subapp", "Amsler", "index.html"),
  );
  expect(resolveStaticHtmlFile(root, "/%2e%2e/private.html")).toBeNull();
  expect(resolveStaticHtmlFile(root, "/subapp/%zz/index.html")).toBeNull();
});

test("only Amsler permits the export library's fixed style rule", () => {
  for (const url of [
    "/subapp/Amsler/index.html",
    "/subapp/Fundal%20Reflex/index.html",
    "/index.html",
  ]) {
    const headers = {};
    const res = {
      locals: { cspNonce: "test-nonce" },
      set: (key, value) => {
        headers[key] = value;
      },
    };
    applyMainAppCsp({ path: url }, res, () => {});
    const style = headers["Content-Security-Policy"]
      .split("; ")
      .find((value) => value.startsWith("style-src "));
    expect(style).toContain("'nonce-test-nonce'");
    expect(style).not.toContain("'unsafe-inline'");
    expect(
      style.includes("sha256-UP0QZg7irvSMvOBz9mH2PIIE28+57UiavRfeVea0l3g="),
    ).toBe(url.startsWith("/subapp/Amsler/"));
  }
});

test("local external scripts expose the request nonce for trusted export styles", () => {
  expect(
    injectNonceIntoHtml(
      '<script src="app.bundle.js"></script>',
      "export-nonce",
    ),
  ).toBe('<script nonce="export-nonce" src="app.bundle.js"></script>');
});

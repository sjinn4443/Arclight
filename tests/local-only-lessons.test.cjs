/** @jest-environment node */
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { build } = require("esbuild");
const {
  isLocalOnlyLessonAsset,
  canServeLocalLessons,
  renderLocalLessonHtml,
} = require("../utils/local-only-lessons.cjs");
const {
  collectOfflineAssetManifest,
} = require("../utils/offline-manifest.cjs");

const localRequest = {
  headers: { host: "localhost:3000" },
  socket: { remoteAddress: "127.0.0.1" },
};

test("local lessons require loopback development, including when source files exist", () => {
  expect(canServeLocalLessons(localRequest)).toBe(true);
  expect(canServeLocalLessons(localRequest, { production: true })).toBe(false);
  expect(canServeLocalLessons(localRequest, { serveDist: true })).toBe(false);
  expect(
    canServeLocalLessons({
      ...localRequest,
      headers: { host: "arclight.example" },
    }),
  ).toBe(false);
  expect(
    canServeLocalLessons({
      ...localRequest,
      socket: { remoteAddress: "192.168.1.2" },
    }),
  ).toBe(false);
});

test.each([
  "/js/pupilsAdvancedScroll.js",
  "/js/%70upilsAdvancedScroll.js?cache=1",
  "/local-only/pupils-advanced-page.html",
  "/scrolly/coreexam/pupils-advanced/1/data.json",
  "/narration/pupils-advanced/full-animation/en.m4a",
])("%s is excluded from delivery and offline manifests", (url) => {
  expect(isLocalOnlyLessonAsset(url)).toBe(true);
});

test("the existing PDF and PEC guide stay public", () => {
  expect(
    isLocalOnlyLessonAsset(
      "/images/pdf/Workshop/CoreExamination/PupilsAdvanced.pdf",
    ),
  ).toBe(false);
  expect(isLocalOnlyLessonAsset("/js/pupilsPecScroll.js")).toBe(false);
});

test("ignored HTML is inserted only for a local preview and never enters the manifest", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "local-lesson-"));
  try {
    for (const dir of [
      "js",
      "local-only",
      "scrolly/coreexam/pupils-advanced",
      "narration/pupils-advanced",
    ])
      fs.mkdirSync(path.join(root, dir), { recursive: true });
    fs.writeFileSync(
      path.join(root, "js/pupilsAdvancedScroll.js"),
      "export const local = true",
    );
    fs.writeFileSync(path.join(root, "js/public.js"), "public");
    fs.writeFileSync(
      path.join(root, "local-only/pupils-advanced-page.html"),
      '<div id="pupilsAdvancedScrollPage"></div>',
    );
    fs.writeFileSync(
      path.join(root, "local-only/pupils-advanced-lesson.html"),
      '<div data-target="pupilsAdvancedScrollPage"></div>',
    );
    const html =
      "<!-- LOCAL_ONLY_PUPILS_ADVANCED_PAGE --><!-- LOCAL_ONLY_PUPILS_ADVANCED_LESSON -->";
    expect(renderLocalLessonHtml(html, root, true)).toContain(
      'id="pupilsAdvancedScrollPage"',
    );
    expect(renderLocalLessonHtml(html, root)).toBe("");
    expect((await collectOfflineAssetManifest(root)).urls).toEqual([
      "/js/public.js",
    ]);
    fs.unlinkSync(path.join(root, "js/pupilsAdvancedScroll.js"));
    expect(renderLocalLessonHtml(html, root, true)).toBe("");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("published bundles do not import the ignored Advanced lesson", async () => {
  const result = await build({
    entryPoints: ["public/js/main.js", "public/js/videos.js"],
    bundle: true,
    write: false,
    outdir: "tmp-local-only-bundle-check",
    metafile: true,
    logLevel: "silent",
  });
  expect(
    Object.keys(result.metafile.inputs).some((file) =>
      file.endsWith("/pupilsAdvancedScroll.js"),
    ),
  ).toBe(false);
});

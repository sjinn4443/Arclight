/**
 * @jest-environment node
 */

const fs = require("fs");
const path = require("path");

test("self-hosted executable assets match pinned npm dependency versions", () => {
  const root = path.join(__dirname, "..");
  const packageJson = require("../package.json");
  const versions = require("../public/vendor/versions.json");

  for (const packageName of [
    "@fortawesome/fontawesome-free",
    "html2canvas",
    "leaflet",
    "lottie-web",
  ]) {
    expect(packageJson.dependencies[packageName]).toBe(versions[packageName]);
    expect(packageJson.dependencies[packageName]).not.toMatch(/^[~^]/);
  }

  const sourceFiles = [
    "public/html/fundal_exam.html",
    "public/html/reports.html",
    "public/reports.html",
    "public/subapp/Allan/index.html",
    "public/subapp/Amsler/index.html",
    "public/subapp/Glaucoma/index.html",
    "public/subapp/Refract/index.html",
  ];
  const source = sourceFiles
    .map((file) => fs.readFileSync(path.join(root, file), "utf8"))
    .join("\n");
  expect(source).not.toMatch(/cdnjs\.cloudflare\.com|unpkg\.com/);
});

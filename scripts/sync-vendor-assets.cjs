const fs = require("fs");
const path = require("path");

const repoRoot = path.join(__dirname, "..");
const vendorRoot = path.join(repoRoot, "public", "vendor");

function packageVersion(packageName) {
  return require(
    path.join(repoRoot, "node_modules", packageName, "package.json"),
  ).version;
}

function copyFile(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyDirectory(source, target) {
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) copyDirectory(sourcePath, targetPath);
    else if (entry.isFile()) copyFile(sourcePath, targetPath);
  }
}

fs.mkdirSync(vendorRoot, { recursive: true });
copyFile(
  path.join(
    repoRoot,
    "node_modules",
    "lottie-web",
    "build",
    "player",
    "lottie.min.js",
  ),
  path.join(vendorRoot, "lottie.min.js"),
);

const leafletTarget = path.join(vendorRoot, "leaflet");
fs.rmSync(leafletTarget, { recursive: true, force: true });
copyFile(
  path.join(repoRoot, "node_modules", "leaflet", "dist", "leaflet.css"),
  path.join(leafletTarget, "leaflet.css"),
);
copyFile(
  path.join(repoRoot, "node_modules", "leaflet", "dist", "leaflet.js"),
  path.join(leafletTarget, "leaflet.js"),
);
copyDirectory(
  path.join(repoRoot, "node_modules", "leaflet", "dist", "images"),
  path.join(leafletTarget, "images"),
);

copyFile(
  path.join(
    repoRoot,
    "node_modules",
    "html2canvas",
    "dist",
    "html2canvas.min.js",
  ),
  path.join(vendorRoot, "html2canvas", "html2canvas.min.js"),
);

const fontAwesomeRoot = path.join(
  repoRoot,
  "node_modules",
  "@fortawesome",
  "fontawesome-free",
);
copyFile(
  path.join(fontAwesomeRoot, "css", "all.min.css"),
  path.join(vendorRoot, "fontawesome", "css", "all.min.css"),
);
copyDirectory(
  path.join(fontAwesomeRoot, "webfonts"),
  path.join(vendorRoot, "fontawesome", "webfonts"),
);

const versions = {
  "@fortawesome/fontawesome-free": packageVersion(
    "@fortawesome/fontawesome-free",
  ),
  html2canvas: packageVersion("html2canvas"),
  leaflet: packageVersion("leaflet"),
  "lottie-web": packageVersion("lottie-web"),
};
fs.writeFileSync(
  path.join(vendorRoot, "versions.json"),
  `${JSON.stringify(versions, null, 2)}\n`,
  "utf8",
);

console.log("Vendor assets synchronized from pinned npm dependencies.");

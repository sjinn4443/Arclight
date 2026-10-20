const fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve(__dirname, ".."),
  output = path.join(root, "glaucoma-eye-interactive.html");
const assets = {
  cupMorph: JSON.parse(
    fs.readFileSync(path.join(__dirname, "cup-landmarks.json"), "utf8"),
  ),
};
const embedded =
  '<script id="embedded-assets" type="application/json">' +
  JSON.stringify(assets) +
  "</script>";
let html = fs.readFileSync(path.join(__dirname, "layout.html"), "utf8");
html = html
  .replace("/* VIEWER_CSS */", () =>
    fs.readFileSync(path.join(__dirname, "styles.css"), "utf8"),
  )
  .replace("<!-- EMBEDDED_ASSETS -->", () => embedded)
  .replace("/* VIEWER_JS */", () =>
    fs.readFileSync(path.join(__dirname, "viewer.js"), "utf8"),
  );
fs.writeFileSync(output, html);
console.log("Built Arclight viewer:", output);

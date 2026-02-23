const esbuild = require("esbuild");
const fs = require("fs-extra");
const path = require("path");
const CleanCSS = require("clean-css");
const htmlMinifierTerser = require("html-minifier-terser");
const { execSync } = require("child_process");

function toIsoDateString(value) {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function resolveBuildVersionDate() {
  const envCandidates = [
    process.env.APP_VERSION_DATE,
    process.env.APP_PUSH_DATE,
    process.env.SOURCE_COMMIT_DATE,
    process.env.COMMIT_DATE,
    process.env.SOURCE_DATE_EPOCH,
    process.env.RAILWAY_DEPLOYMENT_CREATED_AT,
  ];

  for (const candidate of envCandidates) {
    // SOURCE_DATE_EPOCH can be numeric (seconds)
    if (/^\d+$/.test(String(candidate || "").trim())) {
      const epochMs = Number(candidate) * 1000;
      if (!Number.isNaN(epochMs)) {
        return new Date(epochMs).toISOString().slice(0, 10);
      }
    }

    const normalized = toIsoDateString(candidate);
    if (normalized) return normalized;
  }

  try {
    const gitIso = execSync("git log -1 --format=%cI", {
      cwd: path.join(__dirname, ".."),
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
    const normalized = toIsoDateString(gitIso);
    if (normalized) return normalized;
  } catch {
    // Ignore git lookup errors in environments where .git metadata is unavailable.
  }

  // Fallback to build date so deployed artifacts still have a stable version date.
  return new Date().toISOString().slice(0, 10);
}

// Helper function to recursively find files with a given extension
async function findFiles(dir, extension) {
  let results = [];
  const list = await fs.readdir(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      results = results.concat(await findFiles(filePath, extension));
    } else if (path.extname(file) === extension) {
      results.push(filePath);
    }
  }
  return results;
}

const build = async () => {
  console.log("Running build script...");

  // Add a small delay to allow file locks to be released
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const distPath = path.join(__dirname, "..", "dist");
  const publicPath = path.join(__dirname, "..", "public");
  const versionDate = resolveBuildVersionDate();

  try {
    // 1. Clean the 'dist' directory
    await fs.emptyDir(distPath);

    // 2. Copy 'public' directory contents to 'dist'
    await fs.copy(publicPath, distPath);

    // 2b. Write build/version metadata for runtime consumers (Railway-safe).
    await fs.writeJson(path.join(distPath, "version.json"), {
      versionDate,
    });

    // 3. Remove original js files from dist (esbuild will create new ones)
    // This ensures we don't have duplicate or unminified JS files from the copy step.
    const jsDistPath = path.join(distPath, "js");
    if (await fs.exists(jsDistPath)) {
      await fs.remove(jsDistPath);
    }

    // 4. Minify and bundle JS assets into dist/js using esbuild
    await esbuild.build({
      entryPoints: [
        "public/js/atomscard.js",
        "public/js/catalog-index.js",
        "public/js/config.js",
        "public/js/dashboard.js",
        "public/js/ears.js",
        "public/js/eyes.js",
        "public/js/interest.js",
        "public/js/intro.js",
        "public/js/languageinstall.js",
        "public/js/learningModules.js",
        "public/js/likes.js",
        "public/js/main.js",
        "public/js/menu.js",
        "public/js/misc.js",
        "public/js/mylearning.js",
        "public/js/navigation.js",
        "public/js/offline.js",
        "public/js/onboarding.js",
        "public/js/pwa.js",
        "public/js/quiz-launcher.js",
        "public/js/quizzes.js",
        "public/js/reports.js",
        "public/js/toc.js",
        "public/js/videoplayer.js",
        "public/js/videos.js",
      ],
      bundle: true,
      minify: true,
      outdir: "dist/js",
      sourcemap: true,
      target: "es2020",
    });

    // 5. Minify sw.js using esbuild
    await esbuild.build({
      entryPoints: ["public/sw.js"],
      bundle: true,
      minify: true,
      outfile: path.join(distPath, "sw.js"), // Output directly to dist/sw.js
      sourcemap: true,
      target: "es2020",
    });

    // 6. Minify CSS files in dist
    const cssFiles = await findFiles(distPath, ".css");
    const cleanCss = new CleanCSS();
    for (const file of cssFiles) {
      const content = await fs.readFile(file, "utf8");
      const minified = cleanCss.minify(content);
      if (minified.styles) {
        const cssToWrite = await Promise.resolve(String(minified.styles)); // Explicitly await and convert
        await fs.writeFile(file, cssToWrite);
      }
    }

    // 7. Minify HTML files in dist
    const htmlFiles = await findFiles(distPath, ".html");
    const htmlMinifierOptions = {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true, // Minify CSS within style tags
      minifyJS: true, // Minify JS within script tags
      // Add other options as needed for HTML minification
      // See https://github.com/terser/html-minifier-terser#options
    };
    for (const file of htmlFiles) {
      const content = await fs.readFile(file, "utf8");
      // html-minifier-terser returns a Promise<string>
      const minified = await htmlMinifierTerser.minify(
        content,
        htmlMinifierOptions,
      );
      await fs.writeFile(file, minified);
    }

    console.log("Build complete!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};

build();

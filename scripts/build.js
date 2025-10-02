const esbuild = require("esbuild");
const fs = require("fs-extra");
const path = require("path");
const terser = require("terser");

const build = async () => {
  console.log("Running build script...");

  // Add a small delay to allow file locks to be released
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const distPath = path.join(__dirname, "..", "dist");
  const publicPath = path.join(__dirname, "..", "public");

  try {
    // 1. Clean the 'dist' directory
    await fs.emptyDir(distPath);

    // 2. Copy 'public' directory contents to 'dist'
    await fs.copy(publicPath, distPath);

    // 3. Remove original js files from dist
    await fs.remove(path.join(distPath, "js"));

    // 4. Minify and bundle assets into dist/js
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
        "public/js/toc.js",
        "public/js/video.js",
        "public/js/videos.js",
      ],
      bundle: true,
      minify: true,
      outdir: "dist/js",
      sourcemap: true,
      target: "es2020",
    });

    // 5. Minify sw.js
    const swPath = path.join(distPath, "sw.js");
    const swContent = await fs.readFile(swPath, "utf8");
    const minifiedSw = await terser.minify(swContent);
    await fs.writeFile(swPath, minifiedSw.code);

    console.log("Build complete!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};

build();

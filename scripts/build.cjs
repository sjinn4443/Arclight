const esbuild = require("esbuild");
const fs = require("fs-extra");
const nodeFs = require("fs");
const path = require("path");
const CleanCSS = require("clean-css");
const htmlMinifierTerser = require("html-minifier-terser");
const { execSync } = require("child_process");

function toIsoDateString(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return null;
  const plainOrIsoLike = /^(\d{4}-\d{2}-\d{2})(?:$|[T\s])/.exec(trimmed);
  if (plainOrIsoLike) return plainOrIsoLike[1];

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function parsePositiveInt(value) {
  const raw = String(value ?? "").trim();
  if (!/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

function resolveBuildOutputDir() {
  const raw = String(process.env.BUILD_OUTPUT_DIR || "dist").trim();
  return raw || "dist";
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

function isShallowRepo(cwd) {
  try {
    const out = execSync("git rev-parse --is-shallow-repository", {
      cwd,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
    return out === "true";
  } catch {
    return false;
  }
}

function getFirstParentCommitDates(cwd) {
  try {
    const out = execSync("git log --first-parent --format=%cI", {
      cwd,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
    if (!out) return [];
    return out.split(/\r?\n/).filter(Boolean);
  } catch {
    return [];
  }
}

function tryDeepenGitHistory(cwd) {
  // In CI/deploy clones, git history is often shallow and returns only 1 commit.
  // Best-effort deepen helps recover same-day commit counts without failing builds.
  const commands = [
    "git fetch --unshallow --tags",
    "git fetch --deepen=200 --tags",
  ];
  for (const cmd of commands) {
    try {
      execSync(cmd, {
        cwd,
        stdio: ["ignore", "ignore", "ignore"],
      });
      return true;
    } catch {
      // Keep trying next fetch strategy.
    }
  }
  return false;
}

function parseRepoSlug(raw) {
  const value = String(raw || "").trim();
  if (!value) return null;

  const fullMatch = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/.exec(value);
  if (fullMatch) return `${fullMatch[1]}/${fullMatch[2]}`;

  const fromUrl =
    /github\.com[/:]([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?$/.exec(
      value,
    );
  if (fromUrl) return `${fromUrl[1]}/${fromUrl[2]}`;

  return null;
}

function resolveRepoSlugForFallback() {
  const directCandidates = [
    process.env.APP_GITHUB_REPOSITORY,
    process.env.GITHUB_REPOSITORY,
    process.env.RAILWAY_GIT_REPO_FULL_NAME,
    process.env.RAILWAY_GIT_REPO_SLUG,
    process.env.REPOSITORY,
    // Safe default for this repo.
    "sjinn4443/Arclight",
  ];

  for (const candidate of directCandidates) {
    const parsed = parseRepoSlug(candidate);
    if (parsed) return parsed;
  }

  const ownerCandidates = [
    process.env.GITHUB_REPOSITORY_OWNER,
    process.env.RAILWAY_GIT_REPO_OWNER,
  ];
  const nameCandidates = [
    process.env.RAILWAY_GIT_REPO_NAME,
    process.env.APP_GITHUB_REPO_NAME,
  ];

  for (const ownerRaw of ownerCandidates) {
    const owner = String(ownerRaw || "").trim();
    if (!owner) continue;
    for (const nameRaw of nameCandidates) {
      const name = String(nameRaw || "").trim();
      if (!name) continue;
      return `${owner}/${name}`;
    }
  }

  return null;
}

function resolveRepoBranchForFallback() {
  const candidates = [
    process.env.RAILWAY_GIT_BRANCH,
    process.env.GITHUB_REF_NAME,
    process.env.APP_GITHUB_BRANCH,
    "main",
  ];

  for (const candidate of candidates) {
    const value = String(candidate || "").trim();
    if (value) return value;
  }
  return "main";
}

async function resolveVersionSequenceFromGitHub(versionDate) {
  if (!versionDate) return null;

  const repoSlug = resolveRepoSlugForFallback();
  if (!repoSlug) return null;

  const branch = resolveRepoBranchForFallback();
  const [owner, repo] = repoSlug.split("/");
  if (!owner || !repo) return null;

  const since = `${versionDate}T00:00:00Z`;
  const until = `${versionDate}T23:59:59Z`;

  let page = 1;
  let total = 0;
  while (page <= 10) {
    const url =
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits` +
      `?sha=${encodeURIComponent(branch)}` +
      `&since=${encodeURIComponent(since)}` +
      `&until=${encodeURIComponent(until)}` +
      `&per_page=100&page=${page}`;

    let res;
    try {
      const token = String(
        process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "",
      ).trim();
      const headers = {
        Accept: "application/vnd.github+json",
        "User-Agent": "arclight-build-version-sequence",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      res = await fetch(url, {
        headers,
      });
    } catch {
      return null;
    }

    if (!res.ok) return null;

    let rows = null;
    try {
      rows = await res.json();
    } catch {
      return null;
    }
    if (!Array.isArray(rows)) return null;

    total += rows.length;
    if (rows.length < 100) break;
    page += 1;
  }

  return total > 0 ? total : null;
}

function resolveVersionSequenceFromGit(versionDate) {
  if (!versionDate) return null;
  const repoRoot = path.join(__dirname, "..");

  try {
    let gitCommitDates = getFirstParentCommitDates(repoRoot);

    let count = 0;
    for (const commitIso of gitCommitDates) {
      if (toIsoDateString(commitIso) === versionDate) count += 1;
    }
    if (count > 1) return count;

    if (
      count <= 1 &&
      isShallowRepo(repoRoot) &&
      tryDeepenGitHistory(repoRoot)
    ) {
      gitCommitDates = getFirstParentCommitDates(repoRoot);
      count = 0;
      for (const commitIso of gitCommitDates) {
        if (toIsoDateString(commitIso) === versionDate) count += 1;
      }
    }

    return count > 0 ? count : null;
  } catch {
    // Ignore git lookup errors in environments where .git metadata is unavailable.
    return null;
  }
}

async function resolveBuildVersionSequence(versionDate) {
  const envCandidates = [
    process.env.APP_VERSION_SEQUENCE,
    process.env.APP_PUSH_NUMBER,
  ];

  for (const candidate of envCandidates) {
    const normalized = parsePositiveInt(candidate);
    if (normalized) {
      console.log("[version] sequence source=env value=", normalized);
      return normalized;
    }
  }

  const gitCount = resolveVersionSequenceFromGit(versionDate);
  if (gitCount) {
    console.log("[version] sequence source=git value=", gitCount);
    return gitCount;
  }

  const githubCount = await resolveVersionSequenceFromGitHub(versionDate);
  if (githubCount) {
    console.log("[version] sequence source=github-api value=", githubCount);
    return githubCount;
  }

  console.log("[version] sequence source=fallback value=1");
  return 1;
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

function isPathWithinOrEqual(parent, candidate) {
  const relativePath = path.relative(parent, candidate);
  return (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !path.isAbsolute(relativePath))
  );
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureDirWithRetry(dir) {
  let lastError = null;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      await fs.ensureDir(dir);
      return;
    } catch (error) {
      lastError = error;
      await wait(250);
    }
  }
  throw lastError;
}

async function removeBuildCleanupDir(cleanupDir, parentDir) {
  if (!cleanupDir) return;

  const resolvedParent = path.resolve(parentDir);
  const resolvedCleanup = path.resolve(cleanupDir);
  if (
    !isPathWithinOrEqual(resolvedParent, resolvedCleanup) ||
    !path.basename(resolvedCleanup).startsWith(".build-cleanup-")
  ) {
    return;
  }

  try {
    await nodeFs.promises.rm(resolvedCleanup, {
      recursive: true,
      force: true,
      maxRetries: 10,
      retryDelay: 250,
    });
  } catch (error) {
    console.warn(
      `[build] deferred cleanup remains for later removal: ${path.basename(
        resolvedCleanup,
      )}`,
      error?.message || error,
    );
  }
}

async function cleanBuildOutputDir(dir) {
  if (!(await fs.pathExists(dir))) {
    await ensureDirWithRetry(dir);
    return;
  }

  const parentDir = path.dirname(dir);
  const outputName = path.basename(dir);
  const cleanupDir = path.join(
    parentDir,
    `.build-cleanup-${outputName}-${process.pid}-${Date.now()}`,
  );

  try {
    await nodeFs.promises.rename(dir, cleanupDir);
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      await nodeFs.promises.rm(dir, {
        recursive: true,
        force: true,
        maxRetries: 10,
        retryDelay: 250,
      });
    }
  }

  await ensureDirWithRetry(dir);
  await removeBuildCleanupDir(cleanupDir, parentDir);
}

const build = async () => {
  console.log("Running build script...");

  // Add a small delay to allow file locks to be released
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const buildOutputDir = resolveBuildOutputDir();
  const distPath = path.join(__dirname, "..", buildOutputDir);
  const publicPath = path.join(__dirname, "..", "public");
  const versionDate = resolveBuildVersionDate();
  const versionSequence = await resolveBuildVersionSequence(versionDate);

  try {
    // 1. Clean the build output directory
    console.log("[build] cleaning output directory");
    await cleanBuildOutputDir(distPath);

    // 2. Copy 'public' directory contents to the build output directory.
    // JS is bundled from source by esbuild below, so skip copied source files.
    console.log("[build] copying public assets");
    const publicJsPath = path.join(publicPath, "js");
    await fs.copy(publicPath, distPath, {
      filter: (src) => !isPathWithinOrEqual(publicJsPath, src),
    });

    // 2b. Write build/version metadata for runtime consumers (Railway-safe).
    await fs.writeJson(path.join(distPath, "version.json"), {
      versionDate,
      versionSequence,
    });

    // 3. Minify and bundle JS assets into the build output directory using esbuild.
    console.log("[build] bundling JS assets");
    await esbuild.build({
      entryPoints: [
        "public/js/atomscard.js",
        "public/js/catalog-index.js",
        "public/js/config.js",
        "public/js/dashboard.js",
        "public/js/ears.js",
        "public/js/eyes.js",
        "public/js/i18n.js",
        "public/js/interest.js",
        "public/js/intro.js",
        "public/js/language-picker.js",
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
        "public/js/reports.js",
        "public/js/runtime-bootstrap.js",
        "public/js/safe-console-init.js",
        "public/js/toc.js",
        "public/js/videoplayer.js",
        "public/js/videos.js",
      ],
      bundle: true,
      minify: true,
      outdir: path.join(distPath, "js"),
      sourcemap: true,
      target: "es2020",
    });

    // 4. Minify sw.js using esbuild
    console.log("[build] bundling service worker");
    await esbuild.build({
      entryPoints: ["public/sw.js"],
      bundle: true,
      minify: true,
      outfile: path.join(distPath, "sw.js"),
      sourcemap: true,
      target: "es2020",
    });

    // 5. Minify CSS files in the build output directory.
    console.log("[build] minifying CSS");
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

    // 6. Minify HTML files in the build output directory.
    console.log("[build] minifying HTML");
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

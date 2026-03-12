const fs = require("fs");
const { execFileSync, spawnSync } = require("child_process");

const ZERO_SHA = /^0+$/;
const EMPTY_TREE_SHA = "4b825dc642cb6eb9a060e54bf8d69288fbee4904";
const remoteName = String(process.argv[2] || "origin").trim() || "origin";

const FUNDAL_PATH_PATTERNS = [
  /^public\/js\/childhoodFundalPreparation\.js$/,
  /^public\/js\/main\.js$/,
  /^public\/html\/childhoodFundal.*\.html$/,
  /^public\/scrolly\/coreexam\/fundalreflex\//,
  /^public\/style\/components\.css$/,
  /^public\/style\/pages\.css$/,
  /^tests-e2e\/fundal-.*\.spec\.js$/,
  /^playwright\.config\.js$/,
  /^package\.json$/,
  /^\.github\/workflows\/ci-cd\.yml$/,
];

if (process.env.SKIP_FUNDAL_PRE_PUSH === "1") {
  console.log("[fundal pre-push] skipped via SKIP_FUNDAL_PRE_PUSH=1");
  process.exit(0);
}

const input = fs.readFileSync(0, "utf8");
const refLines = input
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

const changedFiles = collectChangedFiles(refLines);
const relevantFiles = changedFiles.filter((filePath) =>
  FUNDAL_PATH_PATTERNS.some((pattern) => pattern.test(filePath)),
);

if (relevantFiles.length === 0) {
  console.log("[fundal pre-push] no relevant fundal changes, skipping");
  process.exit(0);
}

console.log("[fundal pre-push] validating fundal changes before push:");
relevantFiles.forEach((filePath) => console.log(` - ${filePath}`));

const runResult = runNpmScript("test:fundal");

if (runResult.error) {
  console.error(
    `[fundal pre-push] failed to launch npm: ${runResult.error.message}`,
  );
  process.exit(1);
}

if (runResult.status !== 0) {
  process.exit(runResult.status || 1);
}

function collectChangedFiles(refLines) {
  const files = new Set();

  if (refLines.length === 0) {
    // Manual execution fallback: inspect committed changes against the push target.
    const fallbackRange = resolveFallbackDiffRange();
    if (!fallbackRange) return [];
    listDiffFiles(fallbackRange.base, fallbackRange.head).forEach((filePath) =>
      files.add(filePath),
    );
    return [...files];
  }

  refLines.forEach((line) => {
    const [localRef, localSha, remoteRef, remoteSha] = line.split(/\s+/);
    if (!localRef || !localSha || !remoteRef || !remoteSha) return;
    if (ZERO_SHA.test(localSha)) return;

    const baseSha = resolveBaseSha(localSha, remoteSha);
    listDiffFiles(baseSha, localSha).forEach((filePath) => files.add(filePath));
  });

  return [...files];
}

function resolveFallbackDiffRange() {
  const upstream = runGit([
    "rev-parse",
    "--abbrev-ref",
    "--symbolic-full-name",
    "@{push}",
  ]);
  if (upstream) {
    const mergeBase = runGit(["merge-base", "HEAD", upstream]);
    if (mergeBase) {
      return { base: mergeBase, head: "HEAD" };
    }
  }

  const headParent = runGit(["rev-parse", "HEAD^"]);
  if (headParent) {
    return { base: headParent, head: "HEAD" };
  }

  return { base: EMPTY_TREE_SHA, head: "HEAD" };
}

function resolveBaseSha(localSha, remoteSha) {
  if (!ZERO_SHA.test(remoteSha)) return remoteSha;

  const remoteMain = `${remoteName}/main`;
  const mergeBase = runGit(["merge-base", localSha, remoteMain]);
  if (mergeBase) return mergeBase;

  return EMPTY_TREE_SHA;
}

function listDiffFiles(baseSha, headSha) {
  const output = runGit(["diff", "--name-only", baseSha, headSha]);
  if (!output) return [];
  return output
    .split(/\r?\n/)
    .map((filePath) => filePath.trim())
    .filter(Boolean);
}

function runGit(args) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function runNpmScript(scriptName) {
  if (process.platform === "win32") {
    return spawnSync(
      process.env.ComSpec || "cmd.exe",
      ["/d", "/s", "/c", `npm.cmd run ${scriptName}`],
      {
        stdio: "inherit",
        shell: false,
      },
    );
  }

  return spawnSync("npm", ["run", scriptName], {
    stdio: "inherit",
    shell: false,
  });
}

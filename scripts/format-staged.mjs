import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import prettier from "prettier";

const TARGET_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".cjs",
  ".css",
  ".html",
  ".json",
  ".md",
]);

function normalizeLineEndings(content) {
  return content.replace(/\r\n/g, "\n");
}

function detectLineEnding(content) {
  return content.includes("\r\n") ? "\r\n" : "\n";
}

function applyLineEnding(content, lineEnding) {
  return lineEnding === "\r\n"
    ? content.replace(/\n/g, "\r\n")
    : normalizeLineEndings(content);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: options.encoding ?? "utf8",
    input: options.input,
    maxBuffer: 64 * 1024 * 1024,
  });

  if (result.status !== 0 && options.allowFailure !== true) {
    const stderr = String(result.stderr || "").trim();
    throw new Error(
      stderr
        ? `${command} ${args.join(" ")} failed: ${stderr}`
        : `${command} ${args.join(" ")} failed with exit code ${result.status}`,
    );
  }

  return result;
}

function git(args, options = {}) {
  return run("git", args, options);
}

function getBinaryStagedFiles() {
  const output = git([
    "diff",
    "--cached",
    "--numstat",
    "--diff-filter=ACMR",
  ]).stdout;

  const binaryFiles = new Set();

  for (const line of output.split(/\r?\n/)) {
    if (!line) continue;

    const [added, removed, ...pathParts] = line.split("\t");
    if (added === "-" && removed === "-" && pathParts.length > 0) {
      binaryFiles.add(pathParts.join("\t"));
    }
  }

  return binaryFiles;
}

async function mergeFormattedIntoWorkingTree({
  formattedContent,
  stagedContent,
  workingTreeContent,
}) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "format-staged-"));
  const oursPath = path.join(tempDir, "ours");
  const basePath = path.join(tempDir, "base");
  const theirsPath = path.join(tempDir, "theirs");

  try {
    await Promise.all([
      writeFile(oursPath, normalizeLineEndings(formattedContent), "utf8"),
      writeFile(basePath, normalizeLineEndings(stagedContent), "utf8"),
      writeFile(theirsPath, normalizeLineEndings(workingTreeContent), "utf8"),
    ]);

    const result = git(["merge-file", "-p", oursPath, basePath, theirsPath], {
      allowFailure: true,
    });

    if (result.status !== 0 && result.status !== 1) {
      const stderr = String(result.stderr || "").trim();
      throw new Error(stderr || "git merge-file failed");
    }

    return {
      conflicted: result.status === 1,
      output: result.stdout,
    };
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
}

async function getPrettierOptions(filePath) {
  const info = await prettier.getFileInfo(filePath, {
    resolveConfig: true,
  });
  if (info.ignored || !info.inferredParser) return null;

  const resolved = (await prettier.resolveConfig(filePath)) ?? {};
  return { ...resolved, filepath: filePath };
}

async function main() {
  const repoRoot = git(["rev-parse", "--show-toplevel"]).stdout.trim();
  const binaryStagedFiles = getBinaryStagedFiles();
  const stagedFiles = git([
    "diff",
    "--name-only",
    "--cached",
    "--diff-filter=ACMR",
  ])
    .stdout.split(/\r?\n/)
    .filter(Boolean)
    .filter((file) => !binaryStagedFiles.has(file))
    .filter((file) => TARGET_EXTENSIONS.has(path.extname(file).toLowerCase()));

  if (stagedFiles.length === 0) return;

  const pendingUpdates = [];
  const conflicts = [];

  for (const relativePath of stagedFiles) {
    const absolutePath = path.join(repoRoot, relativePath);
    const prettierOptions = await getPrettierOptions(absolutePath);
    if (!prettierOptions) continue;

    const stagedContent = git(["show", `:${relativePath}`]).stdout;
    const formattedContent = await prettier.format(
      normalizeLineEndings(stagedContent),
      prettierOptions,
    );

    if (formattedContent === stagedContent) continue;

    const workingTreeContent = await readFile(absolutePath, "utf8");
    const lineEnding = detectLineEnding(workingTreeContent);
    let mergedWorkingTreeContent = formattedContent;

    if (
      normalizeLineEndings(workingTreeContent) !==
      normalizeLineEndings(stagedContent)
    ) {
      const merged = await mergeFormattedIntoWorkingTree({
        formattedContent,
        stagedContent,
        workingTreeContent,
      });

      if (merged.conflicted) {
        try {
          mergedWorkingTreeContent = applyLineEnding(
            await prettier.format(
              normalizeLineEndings(workingTreeContent),
              prettierOptions,
            ),
            lineEnding,
          );
        } catch {
          conflicts.push(relativePath);
          continue;
        }
      } else {
        mergedWorkingTreeContent = applyLineEnding(merged.output, lineEnding);
      }
    } else {
      mergedWorkingTreeContent = applyLineEnding(formattedContent, lineEnding);
    }

    const modeLine = git(["ls-files", "--stage", "--", relativePath])
      .stdout.split(/\r?\n/)
      .find(Boolean);
    const mode = modeLine?.split(/\s+/)[0] || "100644";

    pendingUpdates.push({
      absolutePath,
      formattedContent,
      mergedWorkingTreeContent,
      mode,
      relativePath,
      workingTreeContent,
    });
  }

  if (conflicts.length > 0) {
    console.error(
      [
        "Prettier formatting conflicts with unstaged changes in:",
        ...conflicts.map((file) => `  - ${file}`),
        "Stage those files fully or apply formatting before committing.",
      ].join("\n"),
    );
    process.exitCode = 1;
    return;
  }

  for (const update of pendingUpdates) {
    const blob = git(["hash-object", "-w", "--stdin"], {
      encoding: "utf8",
      input: update.formattedContent,
    }).stdout.trim();

    git([
      "update-index",
      "--add",
      "--cacheinfo",
      `${update.mode},${blob},${update.relativePath}`,
    ]);

    if (update.mergedWorkingTreeContent !== update.workingTreeContent) {
      await writeFile(
        update.absolutePath,
        update.mergedWorkingTreeContent,
        "utf8",
      );
    }
  }

  if (pendingUpdates.length > 0) {
    console.log(
      `Formatted staged files with Prettier: ${pendingUpdates
        .map((update) => update.relativePath)
        .join(", ")}`,
    );
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});

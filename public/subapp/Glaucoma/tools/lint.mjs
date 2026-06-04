import { readdirSync, statSync } from 'node:fs'
import { join, extname, relative } from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = process.cwd()
const JS_EXTENSIONS = new Set(['.js', '.mjs'])
const SKIP_DIRECTORIES = new Set(['.git', '.vscode', 'memory-bank', 'node_modules'])

function walkFiles(directory, collected = []) {
  const entries = readdirSync(directory, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRECTORIES.has(entry.name)) {
        walkFiles(join(directory, entry.name), collected)
      }
      continue
    }

    const filePath = join(directory, entry.name)
    const extension = extname(filePath)
    if (JS_EXTENSIONS.has(extension)) {
      collected.push(filePath)
    }
  }
  return collected
}

function checkFileSyntax(filePath) {
  return spawnSync(process.execPath, ['--check', filePath], {
    encoding: 'utf8',
    stdio: 'pipe'
  })
}

const files = walkFiles(ROOT)
let hasFailures = false

for (const filePath of files) {
  const result = checkFileSyntax(filePath)
  if (result.status !== 0) {
    hasFailures = true
    const displayPath = relative(ROOT, filePath)
    process.stderr.write(`\nSyntax check failed: ${displayPath}\n`)
    if (result.stderr) {
      process.stderr.write(result.stderr)
    } else if (result.stdout) {
      process.stderr.write(result.stdout)
    }
  }
}

if (hasFailures) {
  process.exitCode = 1
} else {
  console.log(`Lint passed: syntax check completed for ${files.length} files.`)
}

import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = resolve(import.meta.dirname, '..')
const files = ['script.js', 'app.bundle.js', 'cup-achievement.js', 'sw.js', ...readdirSync(resolve(root, 'src')).filter((name) => name.endsWith('.js')).map((name) => `src/${name}`)]
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', resolve(root, file)], { stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status || 1)
}
console.log(`Syntax checked ${files.length} JavaScript files.`)

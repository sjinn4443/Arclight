import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { canRegisterServiceWorker } from '../src/pwa.js'
import { MCQ_LEVELS, MCQ_SOURCE_REFERENCES } from '../src/mcq-data.js'

const root = resolve(import.meta.dirname, '..')
const read = (path) => readFileSync(resolve(root, path), 'utf8')

function runContractTests() {
  const html = read('index.html')
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
  assert.equal(new Set(ids).size, ids.length)
  const references = [...html.matchAll(/\b(?:aria-controls|aria-labelledby|aria-describedby)="([^"]+)"/g)]
    .flatMap((match) => match[1].split(/\s+/))
  assert.deepEqual(references.filter((reference) => !ids.includes(reference)), [])
  assert.doesNotMatch(html, /https?:\/\//i)
  assert.match(html, /manifest\.webmanifest/)
  assert.match(html, /class="eye-selector"/)
  assert.match(html, /id="reportButton"/)
  assert.match(html, /id="reportModal"/)
  assert.match(html, /id="reportText"/)
  assert.match(html, />Copy report</)
  assert.match(html, /aria-live="polite"/)
  assert.match(html, /<caption class="visually-hidden">/)
  assert.equal((html.match(/<th scope="row"/g) || []).length, 4)
  assert.doesNotMatch(html, /value="20-24"/)
  assert.ok(existsSync(resolve(root, 'manifest.webmanifest')))
  const worker = read('sw.js')
  assert.match(worker, /arclight-glaucoma-/)
  for (const asset of ['01.webp', '04.webp', '07.webp', '09.webp', 'rim.webp', 'size.webp']) {
    assert.ok(existsSync(resolve(root, 'assets/images', asset)))
    assert.match(worker, new RegExp(asset.replace('.', '\\.')))
  }
  assert.equal(canRegisterServiceWorker({ protocol: 'file:' }, { serviceWorker: {} }), false)
  assert.equal(canRegisterServiceWorker({ protocol: 'https:' }, { serviceWorker: {} }), true)
  const source = read('scripts.js')
  assert.match(source, /Confirm new assessment/)
  assert.match(source, /initReportController/)
  const controller = read('src/risk-calculator-controller.js')
  assert.match(controller, /questionnaire\.dataset\.eye = state\.selectedEye/)
  assert.match(controller, /delete questionnaire\.dataset\.eye/)
  const layout = read('styles/layout.css')
  assert.match(layout, /\.questionnaire\[data-eye='LE'\] \.ratio-image/)
  assert.match(layout, /transform: scaleX\(-1\)/)
  const responsive = read('styles/responsive.css')
  assert.match(responsive, /\.iop-radio input\[type='radio'\]\s*\{[\s\S]*?width:\s*24px;[\s\S]*?height:\s*24px;/)
  const bundle = read('app.bundle.js')
  assert.match(bundle, /Confirm new assessment/)
  assert.match(bundle, /Referral floor applied/)
  assert.doesNotMatch(bundle, /INCOMPLETE: Select RE or LE/)
  assert.match(bundle, /Based only on the findings entered/)
  assert.match(bundle, /Copy unavailable\./)
  assert.match(bundle, /Correct answer:/)
  assert.match(bundle, /Why:/)
  assert.match(bundle, /Review the feedback and try a new set\./)
  assert.match(bundle, /dataset\.eye=/) // Source expression and browser behaviour are checked separately.
  assert.match(bundle, /v1 \\xB7 30\/9\/2026/)
  assert.match(bundle, /serviceWorker\.register\("\.\/sw\.js"/)

  assert.deepEqual(MCQ_LEVELS.map((level) => level.name), ['Primary', 'Intermediate', 'Advanced'])
  const allIds = new Set()
  for (const level of MCQ_LEVELS) {
    assert.ok(level.questions.length > level.totalQuestions, `${level.name} needs retry variation`)
    assert.ok(level.passScore > level.totalQuestions / 2, `${level.name} pass mark must exceed 50%`)
    const prompts = level.questions.map((question) => question.prompt.trim().toLowerCase())
    assert.equal(new Set(prompts).size, prompts.length, `${level.name} contains a duplicate prompt`)
    for (const question of level.questions) {
      assert.match(question.id, new RegExp(`^glaucoma-${level.name.toLowerCase()}-\\d{2}$`))
      assert.equal(allIds.has(question.id), false, `${question.id} must be unique`)
      allIds.add(question.id)
      assert.ok(question.options.length >= 3, `${level.name}: too few options`)
      assert.equal(new Set(question.options).size, question.options.length, `${level.name}: duplicate option`)
      assert.ok(question.answerIndex >= 0 && question.answerIndex < question.options.length, `${level.name}: invalid answer`)
      assert.ok(question.explanation.length >= 40, `${question.id}: rationale is missing`)
      assert.ok(MCQ_SOURCE_REFERENCES[question.source], `${question.id}: source is unknown`)
      assert.equal(question.reviewStatus, MCQ_SOURCE_REFERENCES[question.source].status)
    }
  }
  const promptCorpus = MCQ_LEVELS.flatMap((level) => level.questions).map((question) => question.prompt).join(' ')
  assert.doesNotMatch(promptCorpus, /\b(?:button|menu|screen|click|tap|app bar|drawer|guide)\b/i)
}

export { runContractTests }

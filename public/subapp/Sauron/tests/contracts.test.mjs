import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { canRegisterServiceWorker } from '../src/pwa.js'
import {
  CASE_LEVELS,
  CASE_SAFETY_BY_VALUE,
  getCaseList,
} from '../src/case-catalog.js'
import {
  DEFAULT_REFRACTION_VALUE,
  MCQ_BANK,
  MCQ_LEVEL_META,
  MCQ_SOURCE_REFERENCES,
  REFRACTION_GROUPS,
  TEST_REFRACTION_OPTIONS,
} from '../src/constants.js'
import { getLightResponsivePupilTargetScale, updateLightResponsivePupilScale } from '../src/structural-eye-effects.js'
import {
  getTimedTestCasePool,
  getTestRoundStartRotation,
} from '../src/test-mode.js'

const root = resolve(import.meta.dirname, '..')
const read = (path) => readFileSync(resolve(root, path), 'utf8')

export function runContractTests() {
  let scale;
  const eye = { querySelector: () => ({ style: { setProperty: (_name, value) => { scale = Number(value); } } }) };
  const pupilArgs = { eye, flags: {}, isActiveEye: false, pupilRadiusPx: 16, sweepX: 100, sweepY: 0, consensualScale: 0.925 };
  updateLightResponsivePupilScale(pupilArgs);
  assert.equal(scale, 0.925, 'fellow pupil must show consensual response');
  for (const override of [{ isDilated: true }, { flags: { aniridiaCase: true } }, { flags: { acgCase: true }, isActiveEye: true }]) {
    updateLightResponsivePupilScale({ ...pupilArgs, ...override });
    assert.equal(scale, 1, 'fixed teaching aperture must not constrict');
  }
  assert.doesNotMatch(read('src/case-catalog.js'), /Fast against movement with a narrow reflex/);
  assert.doesNotMatch(read('src/retinoscopy-case-metadata.js'), /Neutral meridian \(astigmatism\)/);
  assert.doesNotMatch(read('index.html'), /then adjust lenses/);
  const html = read('index.html')
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
  assert.equal(new Set(ids).size, ids.length, 'HTML IDs must remain unique')
  const references = [...html.matchAll(/\b(?:aria-controls|aria-labelledby|aria-describedby)="([^"]+)"/g)].flatMap((match) => match[1].split(/\s+/))
  assert.deepEqual(references.filter((reference) => !ids.includes(reference)), [], 'ARIA references must resolve')
  assert.doesNotMatch(html, /https?:\/\//i, 'normal runtime must not use external URLs')
  assert.match(html, /manifest\.webmanifest/)
  assert.ok(existsSync(resolve(root, 'manifest.webmanifest')))

  const caseValues = getCaseList().map((item) => item.value)
  assert.equal(new Set(caseValues).size, caseValues.length, 'case values must remain unique')
  assert.ok(caseValues.includes(DEFAULT_REFRACTION_VALUE), 'default case must remain in the catalogue')
  const configuredValues = REFRACTION_GROUPS.flatMap((group) => group.options.map((item) => item.value))
  assert.deepEqual([...caseValues].sort(), [...configuredValues].sort(), 'case catalogue and simulator configuration must remain aligned')
  for (const item of getCaseList()) {
    const thumbnailPath = item.thumbnailSrc.split('?')[0]
    assert.ok(existsSync(resolve(root, thumbnailPath)), `missing ${thumbnailPath}`)
  }
  const levelCounts = Object.fromEntries(
    CASE_LEVELS.map((level) => [
      level.value,
      getCaseList().filter((item) => item.level === level.value).length,
    ]),
  )
  assert.deepEqual(levelCounts, { primary: 5, intermediate: 10, advanced: 13 })
  const levelByValue = Object.fromEntries(getCaseList().map((item) => [item.value, item.level]))
  assert.equal(levelByValue['low-cylinder'], 'intermediate')
  assert.equal(levelByValue['central-sub-cortical-cataract'], 'advanced')
  assert.equal(levelByValue['dense-cataract'], 'intermediate')
  assert.equal(levelByValue.floaters, 'intermediate')
  const levelRank = Object.fromEntries(CASE_LEVELS.map((level, index) => [level.value, index]))
  assert.ok(
    getCaseList().every((item, index, cases) => index === 0 || levelRank[cases[index - 1].level] <= levelRank[item.level]),
    'case order must remain grouped by teaching level',
  )
  assert.deepEqual(
    Object.keys(CASE_SAFETY_BY_VALUE).sort(),
    ['acg', 'leucocoria', 'partial-retinal-detachment', 'vitreous-haemorrhage'],
  )
  for (const item of getCaseList()) {
    assert.equal(Boolean(item.safetyNote), Object.hasOwn(CASE_SAFETY_BY_VALUE, item.value))
    if (item.safetyNote) {
      assert.ok(item.safetyNote.title.length > 0)
      assert.ok(item.safetyNote.body.length > 0)
    }
  }
  assert.equal(TEST_REFRACTION_OPTIONS.length, REFRACTION_GROUPS.flatMap((group) => group.options).length - 1)
  assert.equal(TEST_REFRACTION_OPTIONS.some((item) => item.value === 'anisometropia'), false)
  const babyTestValues = getTimedTestCasePool({ babyOnly: true }).map((item) => item.value)
  const configuredBabyValues = new Set(
    getCaseList({ babyOnly: true }).map((item) => item.value),
  )
  assert.ok(babyTestValues.length > 0, 'Baby mode needs timed-test cases')
  assert.ok(
    babyTestValues.every((value) => configuredBabyValues.has(value)),
    'Baby timed-test pool must contain only Baby cases',
  )
  assert.equal(babyTestValues.includes('anisometropia'), false)
  assert.equal(babyTestValues.includes('poor-tear-film'), false)
  assert.equal(getTestRoundStartRotation(-61), -61)
  assert.equal(getTestRoundStartRotation(120), 90)
  assert.equal(getTestRoundStartRotation(Number.NaN), 0)
  const testModeSource = read('src/test-mode.js')
  assert.match(
    testModeSource,
    /const roundStartRotation = getTestRoundStartRotation[\s\S]*onCaseChange\(nextCondition\.value\)[\s\S]*setRetStreakRotation\(roundStartRotation\)/,
    'timed cases must restore the pre-round streak rotation after case setup',
  )
  const visualCasesSource = read('src/menu-visual-cases.js')
  assert.match(visualCasesSource, /shell\.appendChild\(button\)[\s\S]*shell\.appendChild\(safetyButton\)/)
  assert.match(visualCasesSource, /aria-label', `Safety note for \$\{caseItem\.label\}`/)
  assert.match(visualCasesSource, /caseModal\.toggleAttribute\('inert', isSuspended\)/)
  assert.match(visualCasesSource, /onAfterClose: \(\) => setCaseModalSuspended\(false\)/)
  assert.match(visualCasesSource, /onAfterOpen: \(\) => setCaseModalSuspended\(true\)/)
  assert.match(html, /id="caseSafetyModal"[\s\S]*aria-describedby="caseSafetyBody"/)
  assert.match(
    read('src/case-catalog.js'),
    /The exaggerated oval is a stylised teaching cue, not a diagnostic pupil shape\./,
  )

  const worker = read('sw.js')
  assert.match(worker, /arclight-sauron-/)
  assert.match(worker, /20260928-ui1/)
  const cachedThumbnailPaths = [
    ...worker.matchAll(/['"]\.\/(assets\/case-thumbnails\/[^'"]+\.webp)['"]/g),
  ].map((match) => match[1])
  const catalogueThumbnailPaths = getCaseList().map(
    (item) => item.thumbnailSrc.split('?')[0].replace(/^\.\//, ''),
  )
  assert.deepEqual(
    [...new Set(cachedThumbnailPaths)].sort(),
    [...new Set(catalogueThumbnailPaths)].sort(),
    'service-worker thumbnail precache must match the canonical case catalogue',
  )
  assert.match(worker, /if \(requestUrl\.search\)[\s\S]*fetch\(event\.request\)[\s\S]*ignoreSearch: true/)
  assert.equal(canRegisterServiceWorker({ protocol: 'file:' }, { serviceWorker: {} }), false)
  assert.equal(canRegisterServiceWorker({ protocol: 'https:' }, { serviceWorker: {} }), true)
  assert.match(read('src/reset-controller.js'), /Confirm reset/)
  assert.match(read('app.bundle.js'), /Confirm reset/)
  assert.match(read('app.bundle.js'), /serviceWorker\.register\("\.\/sw\.js"/)

  assert.deepEqual(Object.keys(MCQ_BANK), ['primary', 'intermediate', 'advanced'])
  const questionIds = []
  for (const [level, questions] of Object.entries(MCQ_BANK)) {
    const meta = MCQ_LEVEL_META[level]
    assert.ok(meta, `${level} metadata is missing`)
    assert.ok(questions.length > meta.questionCount, `${level} needs retry variation`)
    assert.ok(meta.passMark > meta.questionCount / 2, `${level} pass mark must require a majority`)
    const prompts = questions.map((question) => question.question.trim().toLowerCase())
    assert.equal(new Set(prompts).size, prompts.length, `${level} contains a duplicate prompt`)
    for (const question of questions) {
      assert.equal(question.options.length, 4, `${level}: ${question.question}`)
      assert.equal(new Set(question.options).size, question.options.length, `${level}: duplicate option`)
      assert.ok(question.answer >= 0 && question.answer < question.options.length, `${level}: invalid answer`)
      assert.match(question.id, /^sauron-(primary|intermediate|advanced)-\d{2}$/)
      assert.ok(question.explanation.length >= 40, `${question.id}: short explanation`)
      assert.ok(MCQ_SOURCE_REFERENCES[question.source], `${question.id}: unknown source`)
      assert.equal(question.reviewStatus, MCQ_SOURCE_REFERENCES[question.source].status)
      questionIds.push(question.id)
    }
  }
  assert.equal(new Set(questionIds).size, questionIds.length)
  const mcqController = read('src/menu-mcq.js')
  const mcqRenderer = read('src/mcq.js')
  assert.match(mcqController, /submitMcqButton\.textContent = didPass \? 'New attempt' : 'Try again'/)
  assert.match(mcqController, /Review and retry/)
  assert.match(mcqRenderer, /Why: \$\{question\.explanation\}/)
  assert.match(mcqRenderer, /Source: \$\{sourceMeta\?\.label/)

  const centredPupilScale = getLightResponsivePupilTargetScale({
    pupilRadiusPx: 16,
    sweepX: 0,
    sweepY: 0,
  })
  const horizontalPupilScale = getLightResponsivePupilTargetScale({
    pupilRadiusPx: 16,
    sweepX: 8,
    sweepY: 0,
  })
  const verticalPupilScale = getLightResponsivePupilTargetScale({
    pupilRadiusPx: 16,
    sweepX: 0,
    sweepY: 8,
  })
  const distantPupilScale = getLightResponsivePupilTargetScale({
    pupilRadiusPx: 16,
    sweepX: 100,
    sweepY: 100,
  })
  assert.equal(centredPupilScale, 0.925)
  assert.equal(horizontalPupilScale, verticalPupilScale)
  assert.ok(horizontalPupilScale > centredPupilScale)
  assert.equal(distantPupilScale, 1)

  assert.match(html, /data-eye="left"[^>]+aria-label="RE pupil size"/)
  assert.match(html, /data-eye="right"[^>]+aria-label="LE pupil size"/)
  assert.match(html, /data-eye="left"[^>]+aria-label="RE upper eyelid ptosis"/)
  assert.match(html, /data-eye="right"[^>]+aria-label="LE upper eyelid ptosis"/)
}

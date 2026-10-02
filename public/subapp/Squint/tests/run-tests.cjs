const assert = require("node:assert/strict");
const fs = require("node:fs");
const index = fs.readFileSync("index.html", "utf8");
const mcq = fs.readFileSync("mcq.js", "utf8");
const cover = fs.readFileSync("src/cover-controller.js", "utf8");
const gaze = fs.readFileSync("src/gaze-controller.js", "utf8");
const light = fs.readFileSync("src/light-controller.js", "utf8");
const style = fs.readFileSync("style.css", "utf8");
const analysisSource = fs.readFileSync("analysis.js", "utf8");
const controlsSource = fs.readFileSync("src/controls-controller.js", "utf8");
require("../src/sim-core.js");
require("../src/analysis-core.js");
globalThis.document = { addEventListener() {} };
require("../analysis.js");
const analysis = globalThis.SquintAnalysis;
const simCore = globalThis.SimCore;
assert.doesNotMatch(
  analysis.determineCondition(
    "large out and large down | large ptosis | dilated pupil",
  ),
  /definite/i,
);
for (const size of ["small", "med", "large"]) {
  assert.match(
    analysis.determineCondition(`${size} out and ${size} up`),
    /possible 4th nerve palsy/,
  );
}
globalThis.AppState = {
  BASE_PUPIL_SIZE: 32,
  state: {
    activeDiagnosticHints: { left: "", right: "" },
    activeLightSide: "none",
    rapdValue: 0,
  },
};
require("../src/output-writer.js");
require("../src/mcq-data.js");
const bank = globalThis.McqData.MCQ_BANK;
const sourceReferences = globalThis.McqData.MCQ_SOURCE_REFERENCES;
const diagnosticOffset = globalThis.OutputWriter.getDiagnosticOffset({
  manualOffset: { x: 8, y: -4 },
  presetOffset: { x: 5, y: 7 },
  gazeOffset: { x: 31, y: 23 },
  coverOffset: { x: -2, y: 3 },
});
assert.deepEqual(
  diagnosticOffset,
  { x: 11, y: 6 },
  "normal gaze must not enter diagnostic alignment",
);
assert.deepEqual(
  globalThis.OutputWriter.getDiagnosticOffset({
    gazeOffset: { x: 34, y: -24 },
  }),
  { x: 0, y: 0 },
  "gaze-only movement must remain diagnostically normal",
);
assert.doesNotMatch(index, /https?:\/\//i);
assert.match(index, /rel="manifest"/);
assert.match(index, /id="new-session-button"/);
assert.match(index, /RE: neutral[\s\S]*LE: neutral/);
assert.doesNotMatch(index, /moon\/sun|reflex colour/i);
assert.match(index, /v1 \u00b7 30\/9\/2026/);
assert.match(index, /id="cover-re-btn"[\s\S]*?aria-pressed="false"/);
assert.match(index, /id="cover-le-btn"[\s\S]*?aria-pressed="false"/);
assert.match(index, /id="gaze-trackpad"[\s\S]*?tabindex="0"/);
assert.match(
  index,
  /id="gaze-trackpad"[\s\S]*?aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Home Escape"/,
);
assert.match(index, /src\/output-writer\.js\?v=20260929-logic2/);
assert.match(index, /id="light-pill"[\s\S]*?role="slider"/);
assert.match(
  index,
  /id="light-pill"[\s\S]*?aria-keyshortcuts="ArrowLeft ArrowRight Home Escape"/,
);
assert.match(index, /id="near-target-btn"[\s\S]*?aria-pressed="false"/);
assert.match(index, /data-eye="left"[^>]+aria-label="RE pupil size"/);
assert.match(index, /data-eye="right"[^>]+aria-label="LE pupil size"/);
assert.match(index, /data-eye="left"[^>]+aria-label="RE upper eyelid ptosis"/);
assert.match(index, /data-eye="right"[^>]+aria-label="LE upper eyelid ptosis"/);
assert.match(
  index,
  /Alignment:<\/strong> drag an iris\.[\s\S]*Gaze tracker:<\/strong> moves both eyes and shows muscle demand; RE is screen-left, LE screen-right\./,
);
assert.match(
  index,
  /Muscles:<\/strong> SR superior rectus[\s\S]*IO inferior oblique\./,
);
assert.match(
  index,
  /Pain \/ headache[\s\S]*Head tilt[\s\S]*Fatigue[\s\S]*Eye drag/,
);
assert.match(index, /Direction[\s\S]*Horizontal[\s\S]*Waveform/);
assert.match(index, /RE torsion[\s\S]*LE torsion/);
assert.match(index, /id="cyclo-re" aria-label="RE torsion"/);
assert.match(index, /id="cyclo-le" aria-label="LE torsion"/);
assert.match(
  index,
  /class="slider-wrapper slider-wrapper-lid"[\s\S]*class="lid-eye-label">RE<[\s\S]*class="lid-eye-label">LE</,
);
assert.match(
  index,
  /analysis-pattern-row[\s\S]*No alignment pattern detected\.[\s\S]*analysis-observation-row/,
);
assert.match(
  index,
  /id="preset-filter"[\s\S]*type="search"[\s\S]*aria-label="Find a preset"/,
);
assert.match(
  index,
  /id="preset-filter-status"[\s\S]*role="status"[\s\S]*68 presets/,
);
assert.match(
  index,
  /class="fade-button" data-eye="left"[^>]+aria-label="Fade RE iris"[^>]+aria-pressed="false"/,
);
assert.match(
  index,
  /class="fade-button" data-eye="right"[^>]+aria-label="Fade LE iris"[^>]+aria-pressed="false"/,
);
assert.match(
  index,
  /id="gaze-muscles"[\s\S]*?data-eye="RE"[\s\S]*?id="gaze-trackpad"[\s\S]*?data-eye="LE"/,
);
assert.match(index, /class="card-title gaze-title">Gaze tracker<\/h2>/);
assert.match(
  index,
  /id="gaze-status" class="gaze-status" aria-live="polite">Primary<\/span>/,
);
assert.match(index, /id="gaze-trackpad"[\s\S]*?aria-label="Move gaze tracker"/);
assert.match(
  style,
  /\.gaze-thumb[\s\S]*?width: 22px[\s\S]*?radial-gradient\(circle, #111722/,
);
assert.match(
  style,
  /\.gaze-muscle-chip::before[\s\S]*?linear-gradient\(90deg, #ffe9a4 0%, #ffb000 100%\)/,
);
assert.match(
  mcq,
  /const returnFocus = mcqReturnFocus;[\s\S]*mcqReturnFocus = null;/,
);
assert.match(mcq, /requestAnimationFrame\(\(\) => returnFocus\.focus\(\)\)/);
assert.match(cover, /setAttribute\('aria-pressed'/);
assert.match(
  gaze,
  /activeArrowKeys\.has\('ArrowRight'\)[\s\S]*addEventListener\('keydown'/,
);
assert.match(light, /addEventListener\('keydown'[\s\S]*ArrowLeft/);
assert.match(light, /function setNearState\(/);
assert.match(light, /const SWING_TRANSFER_MIN_MS = 460;/);
assert.match(light, /const SWING_TRANSFER_MAX_MS = 880;/);
assert.match(light, /const LIGHT_PILL_FULL_SWEEP_MS = 700;/);
assert.match(
  analysisSource,
  /addEventListener\('squint:outputs-updated', updateAnalysisOutput\)/,
  "analysis must remain driven by the output update event",
);
assert.doesNotMatch(
  analysisSource,
  /setInterval\(updateAnalysisOutput/,
  "analysis must not poll after event-driven updates are available",
);
assert.match(
  controlsSource,
  /function updateOutputsAfterLayout\(\)[\s\S]*requestAnimationFrame\(\(\) => \{[\s\S]*OutputWriterRef\.updateAllOutputs\(\)/,
  "layout-dependent output refresh must use one animation-frame update",
);
assert.doesNotMatch(
  controlsSource,
  /function updateOutputsAfterLayout\(\)[\s\S]{0,300}setTimeout/,
  "layout-dependent output refresh must not schedule a duplicate delayed recomputation",
);
assert.match(light, /function animatePillSweep\(targetPosition/);
assert.match(light, /activeSideOnPress === tapSide/);
assert.match(light, /excursion = clampNumber\(\(0\.5 - pos\) \* 2, 0, 1\)/);
assert.match(light, /excursion = clampNumber\(\(pos - 0\.5\) \* 2, 0, 1\)/);
assert.match(
  light,
  /return excursion \* excursion \* \(3 - \(2 \* excursion\)\)/,
);
assert.match(style, /transition: left 0\.28s ease/);
assert.match(style, /\.light-pill\.is-sweeping/);
assert.match(
  style,
  /\.ambient-icon-room svg[\s\S]*?transform: rotate\(180deg\)/,
);
assert.match(index, /class="ambient-icon ambient-icon-room"[\s\S]*?<svg/);
assert.doesNotMatch(index, /class="ambient-icon[^"]*"[^>]*>\s*Light\s*</);
assert.match(light, /function applyNearConvergence\(active\)/);
assert.match(light, /const amountPx = active \? 4 : 0;/);
assert.match(cover, /const COVER_SETTLE_MS = 1080;/);
assert.match(cover, /Cover-uncover: observe/);
assert.match(cover, /Alternate cover: observe/);
assert.match(cover, /Uncover: observe alignment/);
assert.match(
  cover,
  /function clearCoverObservation\(\)[\s\S]*setCoverObservation\(''\)/,
);
assert.match(cover, /clearCoverObservation,/);
assert.match(
  gaze,
  /directionKey !== 'primary'[\s\S]*coverEye === 'none'[\s\S]*clearCoverObservation/,
);
assert.match(
  fs.readFileSync("analysis.js", "utf8"),
  /No alignment pattern detected\./,
);
assert.match(
  fs.readFileSync("analysis.js", "utf8"),
  /No urgency modifiers selected\./,
);
assert.match(
  fs.readFileSync("analysis.js", "utf8"),
  /analysis-pattern-row[\s\S]*analysis-observation-row/,
);
assert.match(
  style,
  /\.analysis-row[\s\S]*grid-template-columns: 82px minmax\(0, 1fr\)/,
);
assert.match(
  style,
  /\.advanced-extra-modifiers::before,[\s\S]*font-size: 0\.68rem/,
);
assert.match(
  style,
  /\.slider-wrapper-lid[\s\S]*grid-template-columns: 22px minmax\(0, 1fr\)/,
);
assert.match(
  style,
  /\.advanced-signs-sliders::before[\s\S]*Pupils, iris and lids/,
);
assert.match(style, /\.is-dependent-disabled[\s\S]*opacity: 0\.58/);
assert.match(style, /\.preset-filter-input[\s\S]*min-height: 44px/);
assert.match(
  fs.readFileSync("src/controls-controller.js", "utf8"),
  /function syncNystagmusControls\(\)[\s\S]*control\.disabled = !enabled/,
);
assert.match(
  fs.readFileSync("src/ui-shell.js", "utf8"),
  /function applyPresetFilter\(\)[\s\S]*button\.hidden[\s\S]*No matching presets/,
);
assert.match(
  fs.readFileSync("src/eye-controller.js", "utf8"),
  /setAttribute\('aria-pressed', String\(iris\.classList\.contains\('faded'\)\)\)/,
);
assert.match(
  fs.readFileSync("src/eye-controller.js", "utf8"),
  /iris\.nearOffset/,
);
assert.doesNotMatch(
  fs.readFileSync("src/output-writer.js", "utf8"),
  /nearOffset/,
);
assert.deepEqual(Object.keys(bank), ["primary", "intermediate", "advanced"]);
assert.deepEqual(
  Object.fromEntries(
    Object.entries(bank).map(([level, questions]) => [level, questions.length]),
  ),
  { primary: 10, intermediate: 14, advanced: 23 },
);
assert.match(mcq, /primary:\s*5,/);
assert.match(mcq, /intermediate:\s*6,/);
assert.match(mcq, /advanced:\s*8,/);
const mcqIds = [];
for (const [level, questions] of Object.entries(bank)) {
  const prompts = questions.map((question) =>
    question.question.trim().toLowerCase(),
  );
  assert.equal(
    new Set(prompts).size,
    prompts.length,
    `${level} contains a duplicate prompt`,
  );
  for (const question of questions) {
    assert.equal(question.options.length, 4, `${level}: ${question.question}`);
    assert.equal(
      new Set(question.options).size,
      question.options.length,
      `${level}: duplicate option`,
    );
    assert.ok(
      question.answer >= 0 && question.answer < question.options.length,
      `${level}: invalid answer`,
    );
    assert.match(question.id, /^squint-(primary|intermediate|advanced)-\d{2}$/);
    assert.ok(
      question.explanation.length >= 40,
      `${question.id}: short explanation`,
    );
    assert.ok(
      sourceReferences[question.source],
      `${question.id}: unknown source`,
    );
    assert.equal(
      question.reviewStatus,
      sourceReferences[question.source].status,
    );
    mcqIds.push(question.id);
  }
}
assert.equal(new Set(mcqIds).size, mcqIds.length);
assert.equal(bank.primary[9].id, "squint-primary-10");
assert.equal(bank.primary[9].source, "aao-neuro-pupil-reference");
assert.equal(bank.intermediate[10].id, "squint-intermediate-11");
assert.equal(bank.intermediate[10].source, "aao-cover-tests");
assert.equal(bank.advanced[21].id, "squint-advanced-22");
assert.equal(bank.advanced[21].source, "aao-cover-tests");
assert.doesNotMatch(bank.intermediate[10].question, /3rd nerve/);
assert.doesNotMatch(
  bank.advanced[21].question,
  /What does an alternate cover test demonstrate/,
);
assert.match(mcq, /firstUnansweredIndex/);
assert.match(mcq, /function restartMcqAttempt\(\)/);
assert.match(mcq, /ui\.card\.scrollTop = 0/);
assert.match(mcq, /Why: \$\{question\.explanation\}/);
assert.match(mcq, /Source: \$\{sourceMeta\?\.label/);
assert.match(
  mcq,
  /ui\.restartBtn\.textContent = pass \? 'New attempt' : 'Try again'/,
);
assert.ok(index.indexOf('id="mcq-result"') < index.indexOf('id="mcq-submit"'));

assert.equal(
  analysis.determineCondition("LE: large in"),
  "ESO",
  "plain esotropia must not be labelled as 6th palsy",
);
assert.doesNotMatch(
  analysis.determineCondition("LE: smaller pupil | med ptosis"),
  /horner/i,
  "plain miosis and ptosis must not establish Horner syndrome",
);
assert.match(
  analysis.determineCondition("LE: large in | SUDDEN | hint:sixth_nerve"),
  /6th nerve palsy/i,
  "the 6th nerve preset retains its diagnosis through a specific hint",
);
assert.match(
  analysis.determineCondition("LE: smaller pupil | med ptosis | hint:horner"),
  /Horner syndrome/i,
  "the Horner preset retains its diagnosis through a specific hint",
);
assert.match(
  analysis.determinePupilCondition("RE: slightly larger pupil", "LE: normal"),
  /confirm reactions and establish stability/i,
  "small anisocoria wording must remain conditional",
);
assert.equal(
  globalThis.AnalysisCore.shouldSuppressGenericPupilNote(
    "RE: hint:adie",
    "LE: normal",
  ),
  true,
  "specific pupil presets must suppress conflicting generic notes",
);
assert.match(
  globalThis.AnalysisCore.buildModifierGuidance(
    {
      sudden: true,
      pain: true,
      trauma: false,
      fatigable: false,
      diplopia: false,
      cyclo: false,
      nystagmus: false,
      headTilt: "none",
    },
    "probable acute angle-closure glaucoma",
    "",
  ),
  /immediate ophthalmic assessment/i,
  "acute angle-closure pain guidance must be ophthalmic",
);
assert.equal(simCore.computeAvPatternCue(-12, -5), "A-pattern cue (esotropia)");
assert.equal(simCore.computeAvPatternCue(-5, -12), "V-pattern cue (esotropia)");
assert.equal(simCore.computeAvPatternCue(5, 12), "A-pattern cue (exotropia)");
assert.equal(simCore.computeAvPatternCue(12, 5), "V-pattern cue (exotropia)");

require("../src/preset-runner.js");
const presetActions = [];
const presetApi = new Proxy(
  {},
  {
    get(_target, property) {
      return (...args) => presetActions.push([String(property), ...args]);
    },
  },
);
const allPresetValues = Object.values(simCore.CONDITION_LIBRARY)
  .flat()
  .map((item) => item.value);
assert.equal(
  allPresetValues.length,
  68,
  "condition audit inventory must contain 68 presets",
);
for (const preset of allPresetValues) {
  presetActions.length = 0;
  assert.equal(
    globalThis.PresetRunner.runPresetCase(preset, presetApi),
    true,
    `unhandled preset: ${preset}`,
  );
  assert.ok(presetActions.length > 0, `preset has no actions: ${preset}`);
}

function actionsFor(preset) {
  presetActions.length = 0;
  globalThis.PresetRunner.runPresetCase(preset, presetApi);
  return presetActions.map((entry) => entry.join(":")).join("|");
}
assert.match(
  actionsFor("myasthenic pattern"),
  /enableFatigable/,
  "myasthenia must enable fatigability",
);
assert.doesNotMatch(
  actionsFor("horner's syndrome"),
  /setFaded/,
  "Horner preset must not use iris colour as a diagnostic requirement",
);
assert.match(
  actionsFor("horner's syndrome"),
  /setPtosis:right:8/,
  "Horner preset should model mild ptosis",
);
assert.match(
  actionsFor("4th nerve palsy"),
  /setCyclo:left:out/,
  "4th nerve preset must include extorsion",
);
assert.match(
  actionsFor("dvd-like pattern"),
  /setCyclo:left:out/,
  "DVD preset must include extorsion",
);

assert.ok(
  simCore.CONDITION_LIBRARY.primary.some(
    (item) => item.value === "benign anisocoria",
  ),
);
assert.ok(
  simCore.CONDITION_LIBRARY.intermediate.some(
    (item) => item.value === "rapd (re marked)",
  ),
);
assert.ok(
  simCore.CONDITION_LIBRARY.advanced.some(
    (item) => item.value === "pupil-sparing 3rd nerve palsy",
  ),
);
const primaryCoverQuestion = bank.primary.find((item) =>
  /cover-uncover test/i.test(item.question),
);
assert.equal(
  primaryCoverQuestion.options[primaryCoverQuestion.answer],
  "A manifest deviation (tropia)",
);
assert.equal(primaryCoverQuestion.id, "squint-primary-01");
assert.equal(primaryCoverQuestion.source, "aao-cover-tests");
assert.match(primaryCoverQuestion.question, /covering the fixing eye/);
const intermediateRapdQuestion = bank.intermediate.find((item) =>
  /marked RAPD/i.test(item.question),
);
assert.equal(
  intermediateRapdQuestion.options[intermediateRapdQuestion.answer],
  "Both pupils dilate relative to the previous constriction",
);
const advancedThirdQuestion = bank.advanced.find((item) =>
  /appears pupil-sparing/i.test(item.question),
);
assert.equal(
  advancedThirdQuestion.options[advancedThirdQuestion.answer],
  "Pupil sparing does not exclude compression",
);
const advancedAvQuestion = bank.advanced.find((item) =>
  /^A-pattern exotropia means/i.test(item.question),
);
assert.equal(
  advancedAvQuestion.options[advancedAvQuestion.answer],
  "Exotropia is greater in downgaze than upgaze",
);
const sw = fs.readFileSync("service-worker.js", "utf8");
assert.match(index, /style\.css\?v=20260928-ui1/);
assert.match(sw, /squint-v1-1-20260929-logic2/);
assert.match(
  sw,
  /event\.request\.mode === 'navigate'[\s\S]*fetch\(event\.request\)[\s\S]*matchAppCache\('\.\/index\.html'\)/,
);
console.log("Squint contracts passed (run parity separately)");

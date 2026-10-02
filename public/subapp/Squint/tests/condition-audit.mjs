import fs from 'node:fs/promises';

const baseUrl = process.argv[2] || 'http://127.0.0.1:8090/Squint/index.html';
const port = process.argv[3] || '9335';
const routeLabel = process.argv[4] || 'http';
const outputDir = new URL('../output/playwright/', import.meta.url);
await fs.mkdir(outputDir, { recursive: true });

const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' })
  .then((response) => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});

let id = 0;
const pending = new Map();
const runtimeErrors = [];
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') {
    runtimeErrors.push(message.params?.exceptionDetails?.exception?.description || message.params?.exceptionDetails?.text || 'Runtime exception');
  }
  if (message.method === 'Runtime.consoleAPICalled' && message.params?.type === 'error') {
    runtimeErrors.push('Console error');
  }
  if (!message.id || !pending.has(message.id)) return;
  const request = pending.get(message.id);
  pending.delete(message.id);
  message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
};

function send(method, params = {}) {
  const callId = ++id;
  socket.send(JSON.stringify({ id: callId, method, params }));
  return new Promise((resolve, reject) => pending.set(callId, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  }
  return result.result.value;
}

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 360,
  height: 740,
  deviceScaleFactor: 1,
  mobile: true,
});
if (baseUrl.startsWith('http')) {
  await send('Storage.clearDataForOrigin', {
    origin: new URL(baseUrl).origin,
    storageTypes: 'all',
  });
}
await send('Page.navigate', { url: baseUrl });
await new Promise((resolve) => setTimeout(resolve, 1200));

const inventory = await evaluate(`Object.values(window.CONDITION_LIBRARY || {}).flat().map((item) => ({ label: item.label, value: item.value }))`);
const conditions = [];
for (const item of inventory) {
  const snapshot = await evaluate(`(() => {
    const value = ${JSON.stringify(item.value)};
    const label = ${JSON.stringify(item.label)};
    window.ControlsController.applyCondition(value, label, { suppressFlash: true });
    const rightIris = document.querySelector('.eye[data-eye="right"] .iris');
    return {
      label,
      value,
      right: document.getElementById('right-output')?.textContent || '',
      left: document.getElementById('left-output')?.textContent || '',
      analysis: document.getElementById('analysis-output')?.textContent || '',
      hints: { ...(window.AppState?.state?.activeDiagnosticHints || {}) },
      pupilModels: { ...(window.AppState?.state?.pupilModelByEye || {}) },
      fatigable: Boolean(document.getElementById('toggle-fatigable')?.checked),
      fadedRight: Boolean(rightIris?.classList.contains('faded')),
      cycloRe: document.getElementById('cyclo-re')?.value || 'none',
      cycloLe: document.getElementById('cyclo-le')?.value || 'none'
    };
  })()`);
  conditions.push(snapshot);
}

const dynamic = await evaluate(`(async () => {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const iris = (eye) => document.querySelector('.eye[data-eye="' + eye + '"] .iris');
  const pupilSize = (eye) => Number(document.querySelector('.eye[data-eye="' + eye + '"] .pupil')?.dataset.effectiveSize || 0);
  const peakNystagmusOffset = async (eye, samples = 5) => {
    let peak = { x: 0, y: 0 };
    for (let index = 0; index < samples; index += 1) {
      await wait(55);
      const current = { ...(iris(eye)?.nystagmusOffset || {}) };
      if (Math.hypot(Number(current.x || 0), Number(current.y || 0)) > Math.hypot(Number(peak.x || 0), Number(peak.y || 0))) {
        peak = current;
      }
    }
    return peak;
  };
  const gazePair = (condition, direction) => {
    window.ControlsController.applyCondition(condition, condition, { suppressFlash: true });
    window.GazeController.applyDirection(direction);
    const result = {
      left: { ...(iris('left')?.gazeOffset || {}) },
      right: { ...(iris('right')?.gazeOffset || {}) }
    };
    window.GazeController.resetToPrimary();
    return result;
  };
  const avPair = (condition) => {
    window.ControlsController.applyCondition(condition, condition, { suppressFlash: true });
    window.GazeController.applyDirection('up');
    const up = {
      left: { ...(iris('left')?.gazeOffset || {}) },
      right: { ...(iris('right')?.gazeOffset || {}) }
    };
    window.GazeController.applyDirection('down');
    const down = {
      left: { ...(iris('left')?.gazeOffset || {}) },
      right: { ...(iris('right')?.gazeOffset || {}) },
      cue: window.AppState?.state?.gazePatternCue || ''
    };
    window.GazeController.resetToPrimary();
    return { up, down };
  };
  const nearResponse = async (condition) => {
    window.ControlsController.applyCondition(condition, condition, { suppressFlash: true });
    await wait(320);
    const before = {
      left: pupilSize('left'),
      right: pupilSize('right'),
      offsets: {
        left: { ...(iris('left')?.nearOffset || {}) },
        right: { ...(iris('right')?.nearOffset || {}) }
      }
    };
    window.LightController.setNearState(true);
    await wait(620);
    const near = {
      left: pupilSize('left'),
      right: pupilSize('right'),
      offsets: {
        left: { ...(iris('left')?.nearOffset || {}) },
        right: { ...(iris('right')?.nearOffset || {}) }
      },
      analysis: document.getElementById('analysis-output')?.textContent || ''
    };
    window.LightController.setNearState(false);
    await wait(120);
    const releasedOffsets = {
      left: { ...(iris('left')?.nearOffset || {}) },
      right: { ...(iris('right')?.nearOffset || {}) }
    };
    return { before, near, releasedOffsets };
  };

  const third = {
    adduction: gazePair('3rd nerve palsy', 'left'),
    elevation: gazePair('3rd nerve palsy', 'up'),
    depression: gazePair('3rd nerve palsy', 'down')
  };
  const fourth = gazePair('4th nerve palsy', 'down-left');
  const av = {
    aEso: avPair('a-pattern esotropia'),
    vEso: avPair('v-pattern esotropia'),
    aExo: avPair('a-pattern exotropia'),
    vExo: avPair('v-pattern exotropia')
  };

  window.ControlsController.applyCondition('myasthenic pattern', 'myasthenic pattern', { suppressFlash: true });
  await wait(160);
  const myastheniaFirst = { ...(iris('right')?.conditionOffset || {}) };
  await wait(420);
  const myastheniaSecond = { ...(iris('right')?.conditionOffset || {}) };
  const myasthenia = {
    fatigable: Boolean(document.getElementById('toggle-fatigable')?.checked),
    first: myastheniaFirst,
    second: myastheniaSecond
  };

  window.ControlsController.applyCondition('latent nystagmus-like', 'latent nystagmus-like', { suppressFlash: true });
  await wait(180);
  const latentBinocular = { ...(iris('right')?.nystagmusOffset || {}) };
  window.EyeController.applyCoverState('left');
  const latentCoveredRe = {
    offset: await peakNystagmusOffset('right'),
    fastPhase: window.AppState?.state?.nystagmusFastPhase
  };
  window.EyeController.applyCoverState('right');
  const latentCoveredLe = {
    offset: await peakNystagmusOffset('right'),
    fastPhase: window.AppState?.state?.nystagmusFastPhase
  };
  window.EyeController.applyCoverState('none');

  window.ControlsController.applyCondition('gaze-evoked nystagmus-like', 'gaze-evoked nystagmus-like', { suppressFlash: true });
  await wait(160);
  const gazeEvokedPrimary = { ...(iris('right')?.nystagmusOffset || {}) };
  window.GazeController.applyDirection('left');
  const gazeEvokedLeft = {
    offset: await peakNystagmusOffset('right'),
    fastPhase: window.AppState?.state?.nystagmusFastPhase
  };
  window.GazeController.applyDirection('right');
  const gazeEvokedRight = {
    offset: await peakNystagmusOffset('right'),
    fastPhase: window.AppState?.state?.nystagmusFastPhase
  };
  window.GazeController.applyDirection('up');
  const gazeEvokedUp = {
    offset: await peakNystagmusOffset('right'),
    fastPhase: window.AppState?.state?.nystagmusFastPhase
  };
  window.GazeController.resetToPrimary();

  window.ControlsController.applyCondition('ino-like pattern', 'ino-like pattern', { suppressFlash: true });
  window.GazeController.applyDirection('left');
  const ino = {
    fellow: await peakNystagmusOffset('left'),
    affected: { ...(iris('right')?.nystagmusOffset || {}) },
    fastPhase: window.AppState?.state?.nystagmusFastPhase
  };
  window.GazeController.resetToPrimary();

  window.ControlsController.applyCondition('duane type i-like', 'duane type i-like', { suppressFlash: true });
  window.GazeController.applyDirection('left');
  const duaneEye = document.querySelector('.eye[data-eye="right"]');
  const duane = {
    retracting: Boolean(duaneEye?.classList.contains('is-duane-retracting')),
    fissureScale: Number.parseFloat(getComputedStyle(duaneEye).getPropertyValue('--fissure-scale')) || 1
  };
  window.GazeController.resetToPrimary();

  window.ControlsController.applyCondition('dvd-like pattern', 'dvd-like pattern', { suppressFlash: true });
  window.EyeController.applyCoverState('right');
  await wait(40);
  const dvd = {
    coverOffset: { ...(iris('right')?.coverOffset || {}) },
    cycloLe: document.getElementById('cyclo-le')?.value || 'none'
  };
  window.EyeController.applyCoverState('none');

  window.ControlsController.applyCondition("adie's pupil", "Adie's pupil", { suppressFlash: true });
  await wait(80);
  const manualPupilReset = {
    before: {
      models: { ...(window.AppState?.state?.pupilModelByEye || {}) },
      hints: { ...(window.AppState?.state?.activeDiagnosticHints || {}) }
    }
  };
  const manualPupilSlider = document.querySelector('.slider[data-eye="right"]');
  if (manualPupilSlider) {
    manualPupilSlider.value = '40';
    manualPupilSlider.dispatchEvent(new Event('input', { bubbles: true }));
  }
  await wait(80);
  manualPupilReset.after = {
    models: { ...(window.AppState?.state?.pupilModelByEye || {}) },
    reactivity: { ...(window.AppState?.state?.pupilReactivityByEye || {}) },
    hints: { ...(window.AppState?.state?.activeDiagnosticHints || {}) },
    rapd: Number(window.AppState?.state?.rapdValue || 0)
  };

  window.ControlsController.applyCondition('exophoria (small)', 'Exophoria (S)', { suppressFlash: true });
  const coverButtonRe = document.getElementById('cover-re-btn');
  coverButtonRe?.click();
  await wait(280);
  const coverEarly = {
    offset: { ...(iris('left')?.coverOffset || {}) },
    observation: window.AppState?.state?.coverObservation || ''
  };
  await wait(1160);
  const coverSettled = {
    offset: { ...(iris('left')?.coverOffset || {}) },
    observation: window.AppState?.state?.coverObservation || ''
  };
  document.getElementById('cover-le-btn')?.click();
  await wait(40);
  const coverAlternate = window.AppState?.state?.coverObservation || '';
  document.getElementById('cover-le-btn')?.click();
  await wait(40);
  const coverUncovered = window.AppState?.state?.coverObservation || '';

  return {
    third,
    fourth,
    av,
    myasthenia,
    near: {
      adie: await nearResponse("adie's pupil"),
      argyllRobertson: await nearResponse('argyll robertson pupils'),
      pharmacologicalMydriasis: await nearResponse('pharmacological mydriasis')
    },
    latent: {
      binocular: latentBinocular,
      coveredRe: latentCoveredRe,
      coveredLe: latentCoveredLe
    },
    gazeEvoked: {
      primary: gazeEvokedPrimary,
      left: gazeEvokedLeft,
      right: gazeEvokedRight,
      up: gazeEvokedUp
    },
    ino,
    duane,
    dvd,
    manualPupilReset,
    coverSequence: {
      early: coverEarly,
      settled: coverSettled,
      alternate: coverAlternate,
      uncovered: coverUncovered
    }
  };
})()`);

const report = {
  route: routeLabel,
  viewport: await evaluate(`({ width: document.documentElement.clientWidth, height: window.innerHeight, scrollWidth: document.documentElement.scrollWidth })`),
  conditionCount: conditions.length,
  conditions,
  dynamic,
  runtimeErrors,
};

const failures = [];
const find = (value) => conditions.find((condition) => condition.value === value);
const magnitude = (offset) => Math.hypot(Number(offset?.x || 0), Number(offset?.y || 0));
const changed = (a, b) => magnitude({ x: Number(a?.x || 0) - Number(b?.x || 0), y: Number(a?.y || 0) - Number(b?.y || 0) }) > 0.15;
const pupilConstriction = (response, eye) => Number(response?.before?.[eye] || 0) - Number(response?.near?.[eye] || 0);

if (conditions.length !== 68 || new Set(conditions.map((condition) => condition.value)).size !== 68) failures.push('68-condition inventory');
if (conditions.some((condition) => !condition.analysis.trim())) failures.push('empty condition analysis');
if (['esotropia (small)', 'esotropia (medium)', 'esotropia (large)'].some((value) => /6th nerve/i.test(find(value)?.analysis || ''))) failures.push('plain esotropia overdiagnosis');
if (/6th nerve/i.test(find('mixed squint')?.analysis || '')) failures.push('mixed squint overdiagnosis');
if (/horner/i.test(find('unilateral constricted pupil')?.analysis || '')) failures.push('unilateral miosis overdiagnosis');
if (!/ophthalmic assessment/i.test(find('acute angle-closure pupil')?.analysis || '') || /benign anisocoria|neurological cause|adie's/i.test(find('acute angle-closure pupil')?.analysis || '')) failures.push('acute angle-closure interpretation');
if (find("horner's syndrome")?.fadedRight || find("horner's syndrome")?.hints?.right !== 'horner') failures.push('Horner preset specificity');
if (!find('myasthenic pattern')?.fatigable || !dynamic.myasthenia.fatigable || !changed(dynamic.myasthenia.first, dynamic.myasthenia.second)) failures.push('myasthenic variability');
if (!(Math.abs(dynamic.third.adduction.right.x) < Math.abs(dynamic.third.adduction.left.x))) failures.push('3rd palsy adduction restriction');
if (!(Math.abs(dynamic.third.elevation.right.y) < Math.abs(dynamic.third.elevation.left.y))) failures.push('3rd palsy elevation restriction');
if (!(Math.abs(dynamic.third.depression.right.y) < Math.abs(dynamic.third.depression.left.y))) failures.push('3rd palsy depression restriction');
if (find('4th nerve palsy')?.cycloLe !== 'out') failures.push('4th palsy extorsion');
if (!/A-pattern/.test(dynamic.av.aEso.down.cue) || !/V-pattern/.test(dynamic.av.vEso.down.cue) || !/A-pattern/.test(dynamic.av.aExo.down.cue) || !/V-pattern/.test(dynamic.av.vExo.down.cue)) failures.push('A/V pattern cue classification');
if (!(Math.abs(dynamic.av.aExo.down.right.x) > Math.abs(dynamic.av.aExo.up.right.x))) failures.push('A-pattern exotropia direction');
if (!(Math.abs(dynamic.av.vExo.up.right.x) > Math.abs(dynamic.av.vExo.down.right.x))) failures.push('V-pattern exotropia direction');
if (magnitude(dynamic.latent.binocular) > 0.1 || magnitude(dynamic.latent.coveredRe.offset) < 0.4 || magnitude(dynamic.latent.coveredLe.offset) < 0.4 || dynamic.latent.coveredRe.fastPhase === dynamic.latent.coveredLe.fastPhase) failures.push('latent nystagmus cover behaviour');
if (magnitude(dynamic.gazeEvoked.primary) > 0.1 || magnitude(dynamic.gazeEvoked.left.offset) < 0.4 || magnitude(dynamic.gazeEvoked.right.offset) < 0.4 || magnitude(dynamic.gazeEvoked.up.offset) < 0.4 || dynamic.gazeEvoked.left.fastPhase === dynamic.gazeEvoked.right.fastPhase) failures.push('gaze-evoked nystagmus');
if (magnitude(dynamic.ino.fellow) < 0.4 || magnitude(dynamic.ino.affected) > 0.1) failures.push('INO fellow-eye nystagmus');
if (!dynamic.duane.retracting || dynamic.duane.fissureScale >= 0.98) failures.push('Duane retraction');
if (dynamic.dvd.coverOffset.y > -10 || dynamic.dvd.cycloLe !== 'out') failures.push('DVD dissociation/extorsion');
if (pupilConstriction(dynamic.near.adie, 'right') < 4 || !/tonic near response/i.test(dynamic.near.adie.near.analysis)) failures.push('Adie near response');
if (pupilConstriction(dynamic.near.argyllRobertson, 'right') < 4 || !/constrict to near/i.test(dynamic.near.argyllRobertson.near.analysis)) failures.push('Argyll Robertson near response');
if (Math.abs(pupilConstriction(dynamic.near.pharmacologicalMydriasis, 'right')) > 0.6) failures.push('pharmacological mydriasis near response');
if (!(Number(dynamic.near.adie.near.offsets.left.x) > Number(dynamic.near.adie.before.offsets.left.x))
  || !(Number(dynamic.near.adie.near.offsets.right.x) < Number(dynamic.near.adie.before.offsets.right.x))
  || magnitude(dynamic.near.adie.releasedOffsets.left) > 0.1
  || magnitude(dynamic.near.adie.releasedOffsets.right) > 0.1) failures.push('visual near convergence');
if (dynamic.manualPupilReset.before.models.right !== 'adie'
  || dynamic.manualPupilReset.after.models.left !== 'normal'
  || dynamic.manualPupilReset.after.models.right !== 'normal'
  || Number(dynamic.manualPupilReset.after.reactivity.left) !== 1
  || Number(dynamic.manualPupilReset.after.reactivity.right) !== 1
  || dynamic.manualPupilReset.after.hints.left
  || dynamic.manualPupilReset.after.hints.right
  || dynamic.manualPupilReset.after.rapd !== 0) failures.push('manual pupil physiology reset');
if (magnitude(dynamic.coverSequence.early.offset) > 0.1
  || magnitude(dynamic.coverSequence.settled.offset) < 0.4
  || !/Cover-uncover:/i.test(dynamic.coverSequence.early.observation)
  || !/Under cover:/i.test(dynamic.coverSequence.settled.observation)
  || !/Alternate cover:/i.test(dynamic.coverSequence.alternate)
  || !/Uncover:/i.test(dynamic.coverSequence.uncovered)) failures.push('cover sequence and observations');
if (report.viewport.width !== 360 || report.viewport.height !== 740 || report.viewport.scrollWidth !== 360) failures.push('360 x 740 viewport');
if (runtimeErrors.length) failures.push('runtime errors');

report.failures = failures;
await fs.writeFile(
  new URL(`squint-condition-audit-${routeLabel}.json`, outputDir),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
);
socket.close();

if (failures.length) {
  throw new Error(`Squint condition audit failed: ${failures.join(', ')}`);
}
console.log(`Squint condition audit passed: ${conditions.length}/68 presets at 360 x 740`);

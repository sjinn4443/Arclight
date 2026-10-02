import fs from 'node:fs/promises';

const baseUrl = process.argv[2] || 'http://127.0.0.1:8090/Squint/index.html';
const port = process.argv[3] || '9333';
const routeLabel = process.argv[4] || 'http';
const outputDir = new URL('../output/playwright/', import.meta.url);
await fs.mkdir(outputDir, { recursive: true });

const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' }).then((response) => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let id = 0;
const pending = new Map();
const runtimeErrors = [];
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params?.exceptionDetails?.text || 'Runtime exception');
  if (message.method === 'Runtime.consoleAPICalled' && message.params?.type === 'error') runtimeErrors.push('Console error');
  if (!message.id || !pending.has(message.id)) return;
  const request = pending.get(message.id);
  pending.delete(message.id);
  message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
};
const send = (method, params = {}) => {
  const callId = ++id;
  socket.send(JSON.stringify({ id: callId, method, params }));
  return new Promise((resolve, reject) => pending.set(callId, { resolve, reject }));
};
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function screenshot(state) {
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await fs.writeFile(new URL(`squint-${routeLabel}-${state}-360x740.png`, outputDir), Buffer.from(data, 'base64'));
}

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 360, height: 740, deviceScaleFactor: 1, mobile: true });
if (baseUrl.startsWith('http')) await send('Storage.clearDataForOrigin', { origin: new URL(baseUrl).origin, storageTypes: 'all' });
await send('Page.navigate', { url: baseUrl });
await new Promise((resolve) => setTimeout(resolve, 1400));

const report = {
  route: routeLabel,
  untouched: await evaluate(`({
    width: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    right: document.getElementById('right-output')?.textContent,
    left: document.getElementById('left-output')?.textContent,
    analysis: document.getElementById('analysis-output')?.textContent,
    resultHierarchy: {
      pattern: document.querySelector('.analysis-pattern-row .analysis-value')?.textContent?.trim(),
      observations: document.querySelector('.analysis-observation-row .analysis-value')?.textContent?.trim(),
      rowCount: document.querySelectorAll('#analysis-output .analysis-row').length
    },
    fonts: document.fonts.status,
    ambientGlyph: {
      visibleText: document.querySelector('.ambient-icon')?.textContent?.trim() || '',
      hasSvg: Boolean(document.querySelector('.ambient-icon svg')),
      accessibleName: document.querySelector('.ambient-control')?.getAttribute('aria-label'),
      transform: getComputedStyle(document.querySelector('.ambient-icon svg')).transform
    },
    radii: {
      controls: getComputedStyle(document.querySelector('.controls-card')).borderRadius,
      eyes: getComputedStyle(document.querySelector('.eyes-card')).borderRadius,
      result: getComputedStyle(document.querySelector('.result-card')).borderRadius
    },
    italicClasses: [...document.querySelectorAll('main *')].filter((node) => getComputedStyle(node).fontStyle === 'italic').map((node) => node.className || node.id).slice(0, 20)
  })`),
  touchTargets: await evaluate(`(() => {
    const measure = (element) => {
      const rect = element?.getBoundingClientRect();
      return rect ? { width: rect.width, height: rect.height } : null;
    };
    return {
      gazeTile: measure(document.getElementById('gaze-toggle')?.closest('.toggle-item-main')),
      dilatedTile: measure(document.getElementById('toggle-dilated')?.closest('.toggle-item-main')),
      babyTile: measure(document.getElementById('baby-toggle')?.closest('.toggle-item-main')),
      advanced: measure(document.getElementById('advanced-signs-toggle')),
      ambient: measure(document.getElementById('ambient-toggle')?.closest('label'))
    };
  })()`),
  lightLayout: await evaluate(`(() => {
    const slider = document.getElementById('light-drag-zone')?.getBoundingClientRect();
    const near = document.getElementById('near-target-btn')?.getBoundingClientRect();
    if (!slider || !near) return null;
    return {
      slider: { left: slider.left, right: slider.right, top: slider.top, bottom: slider.bottom },
      near: { left: near.left, right: near.right, top: near.top, bottom: near.bottom },
      centreDelta: Math.abs(((slider.left + slider.right) / 2) - ((near.left + near.right) / 2)),
      belowSlider: near.top >= slider.bottom,
      transitionDuration: getComputedStyle(document.getElementById('light-pill')).transitionDuration
    };
  })()`),
  gazeUi: await evaluate(`(() => {
    const padEl = document.getElementById('gaze-trackpad');
    const pad = padEl?.getBoundingClientRect();
    const thumb = document.getElementById('gaze-thumb')?.getBoundingClientRect();
    const padStyle = padEl ? getComputedStyle(padEl) : null;
    const neutralX = pad && padStyle
      ? pad.left + (pad.width * (Number.parseFloat(padStyle.getPropertyValue('--gaze-neutral-x')) / 100))
      : null;
    const neutralY = pad && padStyle
      ? pad.top + (pad.height * (Number.parseFloat(padStyle.getPropertyValue('--gaze-neutral-y')) / 100))
      : null;
    return {
      title: document.querySelector('.gaze-title')?.textContent?.trim(),
      status: document.getElementById('gaze-status')?.textContent?.trim(),
      statusActive: document.getElementById('gaze-status')?.classList.contains('is-active'),
      pad: pad ? { width: pad.width, height: pad.height, neutralX, neutralY } : null,
      thumb: thumb ? { width: thumb.width, height: thumb.height, centreX: (thumb.left + thumb.right) / 2, centreY: (thumb.top + thumb.bottom) / 2 } : null,
      thumbBackground: getComputedStyle(document.getElementById('gaze-thumb')).backgroundImage
    };
  })()`)
};
await screenshot('untouched');

await evaluate(`document.getElementById('advanced-signs-toggle')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 180));
report.dense = await evaluate(`(() => {
  const panel = document.getElementById('advanced-signs-panel');
  const sectionNodes = [...document.querySelectorAll('.advanced-extra-modifiers, .advanced-signs-grid, .advanced-signs-sliders')];
  const rect = panel?.getBoundingClientRect();
  const controlOverflow = [...document.querySelectorAll('#advanced-signs-panel .toggle-item, #advanced-signs-panel .slider-inline-row')]
    .filter((control) => {
      const controlRect = control.getBoundingClientRect();
      const sectionRect = control.parentElement?.getBoundingClientRect();
      return sectionRect && (controlRect.left < sectionRect.left - 1 || controlRect.right > sectionRect.right + 1);
    })
    .map((control) => control.textContent?.trim());
  return {
    open: panel?.hidden === false,
    expanded: document.getElementById('advanced-signs-toggle')?.getAttribute('aria-expanded'),
    scrollWidth: document.documentElement.scrollWidth,
    panel: rect ? {
      left: rect.left,
      right: rect.right,
      width: rect.width,
      clientWidth: panel.clientWidth,
      scrollWidth: panel.scrollWidth
    } : null,
    sections: sectionNodes.map((section) => ({
      name: getComputedStyle(section, '::before').content.replaceAll('"', '').replaceAll("'", ''),
      headingSize: Number.parseFloat(getComputedStyle(section, '::before').fontSize),
      labelSizes: [...section.querySelectorAll('.toggle-label, .slider-inline-title')]
        .map((label) => Number.parseFloat(getComputedStyle(label).fontSize))
    })),
    labels: [...document.querySelectorAll('#advanced-signs-panel .toggle-label')].map((label) => label.textContent?.trim()),
    clippedLabels: [...document.querySelectorAll('#advanced-signs-panel .toggle-label')]
      .filter((label) => label.scrollWidth > label.clientWidth + 1 || label.scrollHeight > label.clientHeight + 1)
      .map((label) => label.textContent?.trim()),
    lidLabels: [...document.querySelectorAll('#advanced-signs-panel .lid-eye-label')].map((label) => label.textContent?.trim()),
    directionOptions: [...document.getElementById('nyst-direction')?.options || []].map((option) => option.textContent?.trim()),
    nystDependencies: ['nyst-direction', 'nyst-wave', 'nyst-rate'].map((id) => {
      const control = document.getElementById(id);
      return {
        id,
        disabled: control?.disabled,
        ariaDisabled: control?.getAttribute('aria-disabled'),
        cardDisabled: control?.closest('.toggle-item')?.classList.contains('is-dependent-disabled')
      };
    }),
    controlOverflow
  };
})()`);
await screenshot('dense');
await evaluate(`document.getElementById('toggle-nystagmus')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 80));
report.dense.nystEnabled = await evaluate(`['nyst-direction', 'nyst-wave', 'nyst-rate'].map((id) => {
  const control = document.getElementById(id);
  return {
    id,
    disabled: control?.disabled,
    ariaDisabled: control?.getAttribute('aria-disabled'),
    cardDisabled: control?.closest('.toggle-item')?.classList.contains('is-dependent-disabled')
  };
})`);
await evaluate(`document.getElementById('toggle-nystagmus')?.click()`);

await evaluate(`document.getElementById('info-toggle')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 180));
report.info = await evaluate(`({
  open: document.getElementById('info-popup')?.hidden === false,
  focused: document.activeElement?.id,
  expanded: document.getElementById('info-toggle')?.getAttribute('aria-expanded'),
  rect: (() => { const r = document.getElementById('info-popup')?.getBoundingClientRect(); return r ? { left:r.left, right:r.right, top:r.top,bottom:r.bottom } : null; })(),
  body: (() => {
    const body = document.querySelector('#info-popup .info-popup-body');
    return body ? { clientHeight: body.clientHeight, scrollHeight: body.scrollHeight } : null;
  })(),
  hasOrientationGuide: /RE is screen-left, LE screen-right/i.test(document.getElementById('info-popup')?.textContent || ''),
  hasAlignmentGuide: /Alignment:\\s*drag an iris/i.test(document.getElementById('info-popup')?.textContent || ''),
  hasMuscleGuide: /SR superior rectus/i.test(document.getElementById('info-popup')?.textContent || '')
})`);
await screenshot('info');
await evaluate(`document.getElementById('info-close')?.click(); document.getElementById('sidebar-toggle')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 180));
report.drawer = await evaluate(`({
  open: document.getElementById('sidebar')?.classList.contains('is-open'),
  focused: document.activeElement?.id,
  expanded: document.getElementById('sidebar-toggle')?.getAttribute('aria-expanded'),
  scrollWidth: document.documentElement.scrollWidth
})`);
await screenshot('drawer');
await evaluate(`(() => {
  const input = document.getElementById('preset-filter');
  if (!input) return;
  input.value = 'duane';
  input.dispatchEvent(new Event('input', { bubbles: true }));
})()`);
await new Promise((resolve) => setTimeout(resolve, 120));
report.presetFilter = await evaluate(`(() => {
  const input = document.getElementById('preset-filter');
  const rect = input?.getBoundingClientRect();
  const visibleButtons = [...document.querySelectorAll('.preset-button')].filter((button) => !button.hidden);
  return {
    query: input?.value,
    input: rect ? { width: rect.width, height: rect.height } : null,
    status: document.getElementById('preset-filter-status')?.textContent?.trim(),
    visibleCount: visibleButtons.length,
    visibleLabels: visibleButtons.map((button) => button.textContent?.trim()),
    visibleGroups: [...document.querySelectorAll('.preset-group-shell')].filter((group) => !group.hidden).length,
    scrollWidth: document.documentElement.scrollWidth
  };
})()`);
await screenshot('drawer-filter');
await evaluate(`(() => {
  const input = document.getElementById('preset-filter');
  input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
})()`);
await new Promise((resolve) => setTimeout(resolve, 120));
report.presetFilter.restored = await evaluate(`({
  query: document.getElementById('preset-filter')?.value,
  status: document.getElementById('preset-filter-status')?.textContent?.trim(),
  visibleCount: [...document.querySelectorAll('.preset-button')].filter((button) => !button.hidden).length,
  drawerOpen: document.getElementById('sidebar')?.classList.contains('is-open')
})`);

await evaluate(`document.getElementById('open-mcq-btn')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 120));
report.mcqOpen = await evaluate(`({
  open: document.getElementById('mcq-card')?.hidden === false,
  focused: document.activeElement?.id
})`);
await evaluate(`document.getElementById('mcq-close-btn')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 120));
report.mcqClose = await evaluate(`({
  closed: document.getElementById('mcq-card')?.hidden === true,
  focused: document.activeElement?.id
})`);

report.completed = await evaluate(`(() => {
  const button = [...document.querySelectorAll('.preset-button')].find((candidate) => !/orthophoria|normal/i.test(candidate.textContent));
  button?.click();
  const flash = document.getElementById('preset-flash-label')?.getBoundingClientRect();
  const ambient = document.querySelector('.ambient-control')?.getBoundingClientRect();
  const overlapWidth = flash && ambient ? Math.max(0, Math.min(flash.right, ambient.right) - Math.max(flash.left, ambient.left)) : 0;
  const overlapHeight = flash && ambient ? Math.max(0, Math.min(flash.bottom, ambient.bottom) - Math.max(flash.top, ambient.top)) : 0;
  return {
    preset: button?.textContent,
    right: document.getElementById('right-output')?.textContent,
    left: document.getElementById('left-output')?.textContent,
    analysis: document.getElementById('analysis-output')?.textContent,
    drawerOpen: document.getElementById('sidebar')?.classList.contains('is-open'),
    scrollWidth: document.documentElement.scrollWidth,
    presetFlashOverlap: overlapWidth * overlapHeight
  };
})()`);
await new Promise((resolve) => setTimeout(resolve, 180));
await evaluate(`document.querySelector('.result-card')?.scrollIntoView({ block: 'end' })`);
await new Promise((resolve) => setTimeout(resolve, 120));
await screenshot('completed');

await evaluate(`document.getElementById('sidebar-toggle')?.click(); document.getElementById('new-session-button')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 150));
await evaluate(`document.getElementById('new-session-button')?.scrollIntoView({ block: 'center' })`);
await new Promise((resolve) => setTimeout(resolve, 120));
report.resetArmed = await evaluate(`({
  armed: document.getElementById('new-session-button')?.dataset.armed,
  status: document.getElementById('new-session-status')?.textContent,
  focused: document.activeElement?.id
})`);
await screenshot('reset-armed');
await evaluate(`document.getElementById('new-session-button')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 1000));
report.reset = await evaluate(`({
  right: document.getElementById('right-output')?.textContent,
  left: document.getElementById('left-output')?.textContent,
  analysis: document.getElementById('analysis-output')?.textContent,
  advancedOpen: document.getElementById('advanced-signs-panel')?.hidden === false,
  drawerOpen: document.getElementById('sidebar')?.classList.contains('is-open'),
  scrollWidth: document.documentElement.scrollWidth
})`);
await screenshot('reset-complete');

report.nearResponse = {
  before: await evaluate(`(() => {
    const iris = (eye) => document.querySelector('.eye[data-eye="' + eye + '"] .iris');
    const pupil = (eye) => Number(document.querySelector('.eye[data-eye="' + eye + '"] .pupil')?.dataset.effectiveSize || 0);
    return {
      pupils: { left: pupil('left'), right: pupil('right') },
      offsets: {
        left: { ...(iris('left')?.nearOffset || {}) },
        right: { ...(iris('right')?.nearOffset || {}) }
      }
    };
  })()`)
};
await evaluate(`window.LightController?.setNearState(true)`);
await new Promise((resolve) => setTimeout(resolve, 620));
report.nearResponse.active = await evaluate(`(() => {
  const iris = (eye) => document.querySelector('.eye[data-eye="' + eye + '"] .iris');
  const pupil = (eye) => Number(document.querySelector('.eye[data-eye="' + eye + '"] .pupil')?.dataset.effectiveSize || 0);
  return {
    pupils: { left: pupil('left'), right: pupil('right') },
    offsets: {
      left: { ...(iris('left')?.nearOffset || {}) },
      right: { ...(iris('right')?.nearOffset || {}) }
    },
    rightOutput: document.getElementById('right-output')?.textContent,
    leftOutput: document.getElementById('left-output')?.textContent
  };
})()`);
await screenshot('near');
await evaluate(`window.LightController?.setNearState(false)`);
await new Promise((resolve) => setTimeout(resolve, 140));
report.nearResponse.released = await evaluate(`(() => {
  const iris = (eye) => document.querySelector('.eye[data-eye="' + eye + '"] .iris');
  return {
    left: { ...(iris('left')?.nearOffset || {}) },
    right: { ...(iris('right')?.nearOffset || {}) }
  };
})()`);

await evaluate(`document.getElementById('cover-re-btn')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 1200));
report.coverAccessibility = await evaluate(`(() => {
  const button = document.getElementById('cover-re-btn');
  const pressed = button?.getAttribute('aria-pressed');
  const eye = document.querySelector('.eye[data-eye="left"]')?.getBoundingClientRect();
  const occluderElement = document.querySelector('.eye[data-eye="left"] .eye-occluder');
  const occluder = occluderElement?.getBoundingClientRect();
  const occluderStyle = occluderElement ? getComputedStyle(occluderElement) : null;
  const stage = document.querySelector('.eyes-card')?.getBoundingClientRect();
  const lightControls = document.querySelector('.light-controls')?.getBoundingClientRect();
  const geometry = eye && occluder ? {
    eye: { width: eye.width, height: eye.height },
    occluder: { width: occluder.width, height: occluder.height },
    circular: Math.abs(occluder.width - occluder.height) < 1,
    coversEyeHeight: occluder.height > eye.height,
    containedInStage: Boolean(stage && occluder.left >= stage.left && occluder.right <= stage.right),
    clearsLightControls: Boolean(lightControls && occluder.bottom <= lightControls.top),
    visibleEdge: parseFloat(occluderStyle?.borderTopWidth || '0') >= 1
  } : null;
  return {
    pressed,
    geometry,
    observation: window.AppState?.state?.coverObservation || '',
    analysis: document.getElementById('analysis-output')?.textContent || ''
  };
})()`);
await screenshot('cover');
await evaluate(`document.getElementById('cover-re-btn')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 120));
report.coverAccessibility.released = await evaluate(`document.getElementById('cover-re-btn')?.getAttribute('aria-pressed')`);
report.coverAccessibility.releaseObservation = await evaluate(`window.AppState?.state?.coverObservation || ''`);

report.normalMotility = await evaluate(`(() => {
  const directions = ['left', 'right', 'up', 'down', 'up-left', 'up-right', 'down-left', 'down-right'];
  const samples = directions.map((direction) => {
    window.GazeController?.applyDirection(direction);
    const activeMuscles = [...document.querySelectorAll('.gaze-muscle-chip.is-on, .gaze-muscle-chip.is-mid')].length;
    return {
      direction,
      right: document.getElementById('right-output')?.textContent,
      left: document.getElementById('left-output')?.textContent,
      analysis: document.getElementById('analysis-output')?.textContent,
      activeMuscles
    };
  });
  window.GazeController?.resetToPrimary();
  return {
    samples,
    released: {
      direction: window.AppState?.state?.gazeDirection,
      right: document.getElementById('right-output')?.textContent,
      left: document.getElementById('left-output')?.textContent
    }
  };
})()`);

await evaluate(`window.GazeController?.applyDirection('up-right')`);
await new Promise((resolve) => setTimeout(resolve, 80));
report.gazeUi.active = await evaluate(`({
  status: document.getElementById('gaze-status')?.textContent?.trim(),
  statusActive: document.getElementById('gaze-status')?.classList.contains('is-active'),
  activeMuscles: document.querySelectorAll('.gaze-muscle-chip.is-on, .gaze-muscle-chip.is-mid').length,
  thumbTransform: getComputedStyle(document.getElementById('gaze-thumb')).transform,
  coverObservation: window.AppState?.state?.coverObservation || '',
  analysis: document.getElementById('analysis-output')?.textContent || ''
})`);
await screenshot('gaze-tracker-active');
await evaluate(`window.GazeController?.resetToPrimary()`);

report.manualAlignment = await evaluate(`(() => {
  const eye = document.querySelector('.eye[data-eye="right"]');
  const iris = eye?.querySelector('.iris');
  if (!iris) return null;
  iris.manualOffset = { x: 18, y: 0 };
  window.EyeController?.updateIrisTransform(iris);
  window.OutputWriter?.updateAllOutputs();
  const outward = {
    right: document.getElementById('right-output')?.textContent,
    left: document.getElementById('left-output')?.textContent,
    analysis: document.getElementById('analysis-output')?.textContent
  };
  iris.manualOffset = { x: 28, y: 28 };
  window.EyeController?.updateIrisTransform(iris);
  window.OutputWriter?.updateAllOutputs();
  const downAndOut = {
    right: document.getElementById('right-output')?.textContent,
    left: document.getElementById('left-output')?.textContent,
    analysis: document.getElementById('analysis-output')?.textContent
  };
  window.ControlsController?.resetEyes();
  window.OutputWriter?.updateAllOutputs();
  return { outward, downAndOut };
})()`);

report.abnormalMotility = await evaluate(`(() => {
  const capture = (condition, direction) => {
    window.ControlsController?.applyCondition(condition, condition, { suppressFlash: true });
    window.GazeController?.applyDirection(direction);
    const leftIris = document.querySelector('.eye[data-eye="left"] .iris');
    const rightIris = document.querySelector('.eye[data-eye="right"] .iris');
    const result = {
      condition,
      direction,
      leftGaze: { ...(leftIris?.gazeOffset || {}) },
      rightGaze: { ...(rightIris?.gazeOffset || {}) },
      analysis: document.getElementById('analysis-output')?.textContent
    };
    window.GazeController?.resetToPrimary();
    return result;
  };
  const brown = capture('brown syndrome-like', 'up-left');
  const duane = capture('duane type i-like', 'right');
  window.ControlsController?.applyCondition('a-pattern esotropia', 'a-pattern esotropia', { suppressFlash: true });
  window.GazeController?.applyDirection('up');
  window.GazeController?.applyDirection('down');
  const aPattern = {
    cue: window.AppState?.state?.gazePatternCue,
    analysis: document.getElementById('analysis-output')?.textContent
  };
  window.ControlsController?.resetEyes();
  window.OutputWriter?.updateAllOutputs();
  return { brown, duane, aPattern };
})()`);

report.gazeKeyboard = await evaluate(`(() => {
  const trackpad = document.getElementById('gaze-trackpad');
  trackpad?.focus();
  trackpad?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  const active = {
    direction: window.AppState?.state?.gazeDirection,
    classActive: trackpad?.classList.contains('is-active')
  };
  trackpad?.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight', bubbles: true }));
  return {
    active,
    released: {
      direction: window.AppState?.state?.gazeDirection,
      classActive: trackpad?.classList.contains('is-active')
    }
  };
})()`);

const lightZonePoint = await evaluate(`(() => {
  const rect = document.getElementById('light-drag-zone')?.getBoundingClientRect();
  return rect ? {
    left: rect.left + 8,
    right: rect.right - 8,
    centre: (rect.left + rect.right) / 2,
    y: (rect.top + rect.bottom) / 2
  } : null;
})()`);
async function tapLightAt(x, y) {
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
}
const lightSweepSnapshot = () => evaluate(`({
  position: Number(window.AppState?.state?.lightPillPos || 0),
  side: window.AppState?.state?.activeLightSide || 'none',
  valueText: document.getElementById('light-pill')?.getAttribute('aria-valuetext'),
  activeAlpha: (() => {
    const patch = document.querySelector('.torch-patch.is-active');
    return patch ? Number.parseFloat(patch.style.getPropertyValue('--torch-alpha') || '0') : 0;
  })()
})`);

await tapLightAt(lightZonePoint.left, lightZonePoint.y);
await new Promise((resolve) => setTimeout(resolve, 420));
report.lightSweep = { left: await lightSweepSnapshot() };
await tapLightAt(lightZonePoint.right, lightZonePoint.y);
await new Promise((resolve) => setTimeout(resolve, 180));
report.lightSweep.early = await lightSweepSnapshot();
await new Promise((resolve) => setTimeout(resolve, 200));
report.lightSweep.middle = await lightSweepSnapshot();
await screenshot('light-sweep-mid');
await new Promise((resolve) => setTimeout(resolve, 400));
report.lightSweep.right = await lightSweepSnapshot();
await screenshot('light-sweep-right');
await tapLightAt(lightZonePoint.right, lightZonePoint.y);
await new Promise((resolve) => setTimeout(resolve, 420));
report.lightSweep.returned = await lightSweepSnapshot();

const dragX = (position) => lightZonePoint.left + ((lightZonePoint.right - lightZonePoint.left) * position);
await send('Input.dispatchMouseEvent', {
  type: 'mousePressed',
  x: lightZonePoint.centre,
  y: lightZonePoint.y,
  button: 'left',
  buttons: 1,
  clickCount: 1
});
await send('Input.dispatchMouseEvent', {
  type: 'mouseMoved',
  x: dragX(0.56),
  y: lightZonePoint.y,
  button: 'left',
  buttons: 1
});
await new Promise((resolve) => setTimeout(resolve, 80));
report.lightDrag = { slight: await lightSweepSnapshot() };
await screenshot('light-drag-slight');
await send('Input.dispatchMouseEvent', {
  type: 'mouseMoved',
  x: dragX(0.75),
  y: lightZonePoint.y,
  button: 'left',
  buttons: 1
});
await new Promise((resolve) => setTimeout(resolve, 80));
report.lightDrag.halfway = await lightSweepSnapshot();
await send('Input.dispatchMouseEvent', {
  type: 'mouseMoved',
  x: lightZonePoint.right,
  y: lightZonePoint.y,
  button: 'left',
  buttons: 1
});
await new Promise((resolve) => setTimeout(resolve, 80));
report.lightDrag.edge = await lightSweepSnapshot();
await send('Input.dispatchMouseEvent', {
  type: 'mouseReleased',
  x: lightZonePoint.right,
  y: lightZonePoint.y,
  button: 'left',
  buttons: 0,
  clickCount: 1
});
await new Promise((resolve) => setTimeout(resolve, 420));
report.lightDrag.returned = await lightSweepSnapshot();

await evaluate(`(() => {
  const pill = document.getElementById('light-pill');
  pill?.focus();
  pill?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
})()`);
await new Promise((resolve) => setTimeout(resolve, 420));
report.lightKeyboard = {
  active: await evaluate(`(() => {
    const pill = document.getElementById('light-pill');
    return {
      side: window.AppState?.state?.activeLightSide,
      value: pill?.getAttribute('aria-valuenow'),
      valueText: pill?.getAttribute('aria-valuetext')
    };
  })()`)
};
await evaluate(`(() => {
  const pill = document.getElementById('light-pill');
  pill?.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight', bubbles: true }));
})()`);
await new Promise((resolve) => setTimeout(resolve, 420));
report.lightKeyboard.released = await evaluate(`(() => {
  const pill = document.getElementById('light-pill');
  return {
      side: window.AppState?.state?.activeLightSide,
      value: pill?.getAttribute('aria-valuenow'),
      valueText: pill?.getAttribute('aria-valuetext')
  };
})()`);
report.runtimeErrors = runtimeErrors;

await fs.writeFile(new URL(`squint-mobile-report-${routeLabel}.json`, outputDir), `${JSON.stringify(report, null, 2)}\n`);
socket.close();

const failures = [];
const touchTargetEntries = Object.entries(report.touchTargets);
if (touchTargetEntries.some(([, value]) => !value || value.width < 44 || value.height < 44)) failures.push('touch targets');
if (/\bnil\s*\|\s*nil\b/i.test(report.untouched.analysis || '')
  || report.untouched.resultHierarchy.pattern !== 'No alignment pattern detected.'
  || report.untouched.resultHierarchy.observations !== 'No urgency modifiers selected.'
  || report.untouched.resultHierarchy.rowCount !== 2) failures.push('untouched result hierarchy');
if (!report.dense.open
  || report.dense.expanded !== 'true'
  || report.dense.scrollWidth > 360
  || report.dense.panel.scrollWidth > report.dense.panel.clientWidth
  || report.dense.controlOverflow.length
  || report.dense.sections.map((section) => section.name).join('|') !== 'Context|Movement|Pupils, iris and lids'
  || report.dense.sections.some((section) => section.headingSize < 10)
  || report.dense.sections.some((section) => section.labelSizes.some((size) => size < 12))
  || report.dense.clippedLabels.length
  || report.dense.lidLabels.join('|') !== 'RE|LE'
  || report.dense.directionOptions.join('|') !== 'Horizontal|Vertical|Mixed'
  || report.dense.nystDependencies.some((item) => !item.disabled || item.ariaDisabled !== 'true' || !item.cardDisabled)
  || report.dense.nystEnabled.some((item) => item.disabled || item.ariaDisabled !== 'false' || item.cardDisabled)) failures.push('advanced panel hierarchy');
if (!report.info.hasOrientationGuide
  || !report.info.hasAlignmentGuide
  || !report.info.hasMuscleGuide
  || report.info.body.scrollHeight > report.info.body.clientHeight + 1) failures.push('information guide layout');
if (report.presetFilter.query !== 'duane'
  || report.presetFilter.input.height < 44
  || report.presetFilter.scrollWidth > 360
  || report.presetFilter.visibleCount < 1
  || report.presetFilter.visibleLabels.some((label) => !/duane/i.test(label))
  || report.presetFilter.visibleGroups !== 1
  || report.presetFilter.restored.query
  || report.presetFilter.restored.status !== '68 presets'
  || report.presetFilter.restored.visibleCount !== 68
  || !report.presetFilter.restored.drawerOpen) failures.push('preset filter');
if (!report.mcqOpen.open || report.mcqOpen.focused !== 'mcq-close-btn') failures.push('MCQ open focus');
if (!report.mcqClose.closed || report.mcqClose.focused !== 'sidebar-toggle') failures.push('MCQ close focus');
if (report.completed.presetFlashOverlap !== 0) failures.push('preset flash overlap');
if (report.coverAccessibility.pressed !== 'true' || report.coverAccessibility.released !== 'false') failures.push('cover ARIA state');
if (!/Cover-uncover:/i.test(report.coverAccessibility.observation) || !/Uncover:/i.test(report.coverAccessibility.releaseObservation)) failures.push('cover observations');
if (!(Number(report.nearResponse.active.offsets.left.x) > Number(report.nearResponse.before.offsets.left.x))
  || !(Number(report.nearResponse.active.offsets.right.x) < Number(report.nearResponse.before.offsets.right.x))
  || Number(report.nearResponse.active.pupils.left) >= Number(report.nearResponse.before.pupils.left)
  || Number(report.nearResponse.active.pupils.right) >= Number(report.nearResponse.before.pupils.right)
  || Math.hypot(Number(report.nearResponse.released.left.x || 0), Number(report.nearResponse.released.left.y || 0)) > 0.1
  || Math.hypot(Number(report.nearResponse.released.right.x || 0), Number(report.nearResponse.released.right.y || 0)) > 0.1
  || report.nearResponse.active.rightOutput !== 'RE: NEAR'
  || report.nearResponse.active.leftOutput !== 'LE: NEAR') failures.push('near visual response');
if (!String(report.lightLayout?.transitionDuration || '').startsWith('0.28s')) failures.push('torch visual transfer timing');
if (report.gazeUi.title !== 'Gaze tracker'
  || report.gazeUi.status !== 'Primary'
  || report.gazeUi.statusActive
  || report.gazeUi.thumb.width < 22
  || report.gazeUi.thumb.height < 22
  || Math.abs(report.gazeUi.thumb.centreX - report.gazeUi.pad.neutralX) > 1
  || Math.abs(report.gazeUi.thumb.centreY - report.gazeUi.pad.neutralY) > 1
  || !/gradient/i.test(report.gazeUi.thumbBackground)
  || report.gazeUi.active.status !== 'Up-right'
  || !report.gazeUi.active.statusActive
  || report.gazeUi.active.activeMuscles < 1
  || report.gazeUi.active.coverObservation
  || /Uncover:/i.test(report.gazeUi.active.analysis || '')
  || !/Gaze:\s*Up-right/i.test(report.gazeUi.active.analysis || '')) failures.push('gaze tracker UI');
if (report.untouched.ambientGlyph.visibleText
  || !report.untouched.ambientGlyph.hasSvg
  || report.untouched.ambientGlyph.accessibleName !== 'Ambient light'
  || report.untouched.ambientGlyph.transform === 'none') failures.push('ambient ceiling-light glyph');
if (report.lightSweep.left.side !== 'left'
  || report.lightSweep.left.position > 0.02
  || report.lightSweep.left.activeAlpha < 0.8
  || !(report.lightSweep.early.position > 0.02 && report.lightSweep.early.position < 0.5)
  || !(report.lightSweep.early.activeAlpha > 0.2 && report.lightSweep.early.activeAlpha < report.lightSweep.left.activeAlpha)
  || !(report.lightSweep.middle.position > report.lightSweep.early.position && report.lightSweep.middle.position < 0.98)
  || !(report.lightSweep.middle.activeAlpha < report.lightSweep.early.activeAlpha)
  || report.lightSweep.right.side !== 'right'
  || report.lightSweep.right.position < 0.98
  || report.lightSweep.right.activeAlpha < 0.8
  || report.lightSweep.returned.side !== 'none'
  || Math.abs(report.lightSweep.returned.position - 0.5) > 0.02) failures.push('full torch sweep');
if (!(report.lightDrag.slight.position > 0.5 && report.lightDrag.slight.position < 0.64)
  || report.lightDrag.slight.activeAlpha > 0.12
  || !(report.lightDrag.halfway.activeAlpha > report.lightDrag.slight.activeAlpha)
  || !(report.lightDrag.edge.activeAlpha > report.lightDrag.halfway.activeAlpha)
  || report.lightDrag.edge.activeAlpha < 0.8
  || report.lightDrag.returned.side !== 'none'
  || Math.abs(report.lightDrag.returned.position - 0.5) > 0.02) failures.push('position-proportional torch drag');
if (report.normalMotility.samples.some((sample) => sample.right !== 'RE: normal' || sample.left !== 'LE: normal')) failures.push('normal gaze diagnostic output');
if (report.normalMotility.samples.some((sample) => /palsy|tropia|mixed/i.test(sample.analysis || ''))) failures.push('normal gaze false condition');
if (report.normalMotility.samples.some((sample) => sample.activeMuscles < 1)) failures.push('normal gaze muscle readout');
if (report.normalMotility.released.direction !== 'primary') failures.push('normal gaze release');
if (!/medium out/i.test(report.manualAlignment?.outward?.left || '') || /3rd nerve/i.test(report.manualAlignment?.outward?.analysis || '')) failures.push('manual outward alignment');
if (!/down/i.test(report.manualAlignment?.downAndOut?.left || '') || !/3rd nerve/i.test(report.manualAlignment?.downAndOut?.analysis || '')) failures.push('manual down-and-out alignment');
if (!(Math.abs(report.abnormalMotility.brown.rightGaze.y) < Math.abs(report.abnormalMotility.brown.leftGaze.y))) failures.push('Brown motility restriction');
if (!(Math.abs(report.abnormalMotility.duane.rightGaze.x) < Math.abs(report.abnormalMotility.duane.leftGaze.x))) failures.push('Duane motility restriction');
if (!/A-pattern cue/i.test(report.abnormalMotility.aPattern.cue || '')) failures.push('A-pattern gaze cue');
if (report.gazeKeyboard.active.direction !== 'right' || report.gazeKeyboard.released.direction !== 'primary') failures.push('gaze keyboard');
if (report.lightKeyboard.active.side !== 'right'
  || Number(report.lightKeyboard.active.value) < 98
  || report.lightKeyboard.released.side !== 'none'
  || Math.abs(Number(report.lightKeyboard.released.value) - 50) > 2) failures.push('light keyboard');
if (runtimeErrors.length) failures.push('runtime errors');
if (failures.length) throw new Error(`Squint browser review failed: ${failures.join(', ')}`);
console.log(JSON.stringify(report, null, 2));

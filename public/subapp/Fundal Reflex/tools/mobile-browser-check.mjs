import fs from 'node:fs/promises';

const baseUrl = process.argv[2] || 'http://127.0.0.1:8765/Fundal%20Reflex/index.html';
const port = process.argv[3] || '9333';
const routeLabel = process.argv[4] || 'http';
const outputDir = new URL('../output/playwright/', import.meta.url);
await fs.mkdir(outputDir, { recursive: true });

const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' }).then((r) => r.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });

let id = 0;
const pending = new Map();
const runtimeErrors = [];
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') {
    runtimeErrors.push(message.params?.exceptionDetails?.text || 'Uncaught runtime exception');
  }
  if (message.method === 'Runtime.consoleAPICalled' && message.params?.type === 'error') {
    runtimeErrors.push('Console error');
  }
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  message.error ? reject(new Error(message.error.message)) : resolve(message.result);
};
function send(method, params = {}) {
  const callId = ++id;
  socket.send(JSON.stringify({ id: callId, method, params }));
  return new Promise((resolve, reject) => pending.set(callId, { resolve, reject }));
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function screenshot(name) {
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await fs.writeFile(new URL(name, outputDir), Buffer.from(data, 'base64'));
}

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 360, height: 740, deviceScaleFactor: 1, mobile: true });
await send('Page.navigate', { url: baseUrl });
await new Promise((resolve) => setTimeout(resolve, 1500));

const report = { route: routeLabel, viewport: await evaluate(`({innerWidth,innerHeight,scrollWidth:document.documentElement.scrollWidth,ready:document.body.classList.contains('app-ready')})`) };
report.visualSystem = await evaluate(`(() => {
  const style = (selector) => {
    const node = document.querySelector(selector);
    if (!node) return null;
    const computed = getComputedStyle(node);
    return { borderRadius: computed.borderRadius, fontSize: computed.fontSize, fontStyle: computed.fontStyle };
  };
  return {
    controls: style('.top-controls'),
    advancedSection: style('.advanced-section'),
    simulator: style('.eyes-wrapper'),
    result: style('.results-panel'),
    italicText: [...document.querySelectorAll('main *')].filter((node) => getComputedStyle(node).fontStyle === 'italic').map((node) => node.className || node.id).slice(0, 20)
  };
})()`);
await screenshot(`fundal-${routeLabel}-untouched-360x740.png`);

await evaluate(`document.getElementById('advanced-dock-toggle')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 250));
report.dense = await evaluate(`({scrollWidth:document.documentElement.scrollWidth, advanced:document.getElementById('advanced-panel')?.hidden === false, expanded:document.getElementById('advanced-dock-toggle')?.getAttribute('aria-expanded')})`);
await screenshot(`fundal-${routeLabel}-dense-360x740.png`);

await evaluate(`document.getElementById('burger-icon')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 250));
report.transient = await evaluate(`({menuOpen:document.getElementById('sideMenu')?.classList.contains('open'), expanded:document.getElementById('burger-icon')?.getAttribute('aria-expanded')})`);
await screenshot(`fundal-${routeLabel}-transient-360x740.png`);

await evaluate(`document.getElementById('burger-icon')?.click(); document.querySelector('.results-details')?.setAttribute('open','')`);
await new Promise((resolve) => setTimeout(resolve, 250));
report.completed = await evaluate(`({referral:document.getElementById('results-urgency')?.textContent, summary:document.getElementById('results-summary')?.textContent, scrollWidth:document.documentElement.scrollWidth})`);
await screenshot(`fundal-${routeLabel}-completed-360x740.png`);

await evaluate(`document.getElementById('burger-icon')?.click(); document.getElementById('new-session-button')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 150));
report.resetArmed = await evaluate(`({armed:document.getElementById('new-session-button')?.dataset.armed, status:document.getElementById('new-session-status')?.textContent})`);
await screenshot(`fundal-${routeLabel}-reset-armed-360x740.png`);
await evaluate(`document.getElementById('new-session-button')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 1000));
report.reset = await evaluate(`({
  menuOpen:document.getElementById('sideMenu')?.classList.contains('open'),
  advancedOpen:document.getElementById('advanced-panel')?.hidden === false,
  caseLabel:document.getElementById('visual-case-current-label')?.textContent,
  referral:document.getElementById('results-urgency')?.textContent,
  scrollWidth:document.documentElement.scrollWidth
})`);
await screenshot(`fundal-${routeLabel}-reset-complete-360x740.png`);

report.mcq = await evaluate(`(async () => {
  document.getElementById('burger-icon')?.click();
  document.querySelector('.mcq-level-button[data-level="primary"]')?.click();
  document.getElementById('submitMcqButton')?.click();
  const guard = document.getElementById('mcqResult')?.textContent || '';
  document.querySelectorAll('#mcqContainer fieldset.question').forEach((question) => {
    question.querySelector('input[type="radio"]')?.click();
  });
  document.getElementById('submitMcqButton')?.click();
  const optionHeights = [...document.querySelectorAll('#mcqContainer .options label')]
    .map((label) => label.getBoundingClientRect().height);
  const review = {
    guard,
    questionCount: document.querySelectorAll('#mcqContainer fieldset.question').length,
    explanationCount: document.querySelectorAll('#mcqContainer .mcq-explanation:not([hidden])').length,
    minOptionHeight: Math.min(...optionHeights),
    result: document.getElementById('mcqResult')?.textContent || '',
    resultFocused: document.activeElement === document.getElementById('mcqResult'),
    scrollWidth: document.documentElement.scrollWidth
  };
  return review;
})()`);
if (!/answer all questions/i.test(report.mcq.guard)) throw new Error('MCQ unanswered guard failed');
if (report.mcq.questionCount !== 5 || report.mcq.explanationCount !== 5) throw new Error('MCQ review count failed');
if (report.mcq.minOptionHeight < 44 || report.mcq.scrollWidth !== 360) {
  throw new Error(`MCQ mobile geometry failed: ${JSON.stringify(report.mcq)}`);
}
if (!report.mcq.resultFocused) throw new Error('MCQ result focus failed');
await new Promise((resolve) => setTimeout(resolve, 300));
report.mcqSurface = await evaluate(`(() => {
  const modal = getComputedStyle(document.querySelector('#mcqModal .modal-content'));
  const backdrop = getComputedStyle(document.getElementById('mcqModal'));
  return {
    opacity: modal.opacity,
    backgroundImage: modal.backgroundImage,
    backdropBackground: backdrop.backgroundColor,
    animationName: modal.animationName
  };
})()`);
if (report.mcqSurface.opacity !== '1' || !report.mcqSurface.backgroundImage.includes('rgb(255, 255, 255)')) {
  throw new Error(`MCQ modal surface is not opaque: ${JSON.stringify(report.mcqSurface)}`);
}
await screenshot(`fundal-${routeLabel}-mcq-review-360x740.png`);
report.mcqFlow = await evaluate(`(() => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  const escapeClosed = document.getElementById('mcqModal')?.getAttribute('aria-hidden') === 'true';
  const escapeFocus = document.activeElement?.textContent?.trim() || document.activeElement?.id || '';
  document.getElementById('burger-icon')?.click();
  document.querySelector('.mcq-level-button[data-level="primary"]')?.click();
  document.querySelectorAll('#mcqContainer fieldset.question').forEach((question) => {
    question.querySelector('input[type="radio"]')?.click();
  });
  document.getElementById('submitMcqButton')?.click();
  document.getElementById('retryMcqButton')?.click();
  return {
    escapeClosed,
    escapeFocus,
    retryQuestionCount: document.querySelectorAll('#mcqContainer fieldset.question').length,
    retryFocused: document.activeElement?.matches('#mcqContainer input[type="radio"]') || false
  };
})()`);
if (
  !report.mcqFlow.escapeClosed ||
  report.mcqFlow.escapeFocus !== 'burger-icon' ||
  report.mcqFlow.retryQuestionCount !== 5 ||
  !report.mcqFlow.retryFocused
) {
  throw new Error('MCQ Escape or retry contract failed');
}
report.runtimeErrors = runtimeErrors;

await fs.writeFile(new URL(`fundal-mobile-report-${routeLabel}.json`, outputDir), `${JSON.stringify(report, null, 2)}\n`);
socket.close();
console.log(JSON.stringify(report, null, 2));

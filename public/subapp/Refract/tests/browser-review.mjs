import fs from 'node:fs/promises';

const baseUrl = process.argv[2] || 'http://127.0.0.1:8090/Refract/index.html';
const port = process.argv[3] || '9333';
const routeLabel = process.argv[4] || 'http';
const outputDir = new URL('../output/playwright/', import.meta.url);
await fs.mkdir(outputDir, { recursive: true });

const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' }).then((response) => response.json());
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
    runtimeErrors.push(message.params?.exceptionDetails?.text || 'Uncaught runtime exception');
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
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function screenshot(state) {
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await fs.writeFile(new URL(`refract-${routeLabel}-${state}-360x740.png`, outputDir), Buffer.from(data, 'base64'));
}

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 360, height: 740, deviceScaleFactor: 1, mobile: true });
if (baseUrl.startsWith('http')) {
  await send('Storage.clearDataForOrigin', { origin: new URL(baseUrl).origin, storageTypes: 'all' });
}
await send('Page.navigate', { url: baseUrl });
await new Promise((resolve) => setTimeout(resolve, 1200));

const report = {
  route: routeLabel,
  untouched: await evaluate(`({
    innerWidth,
    innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    output: document.getElementById('output-re-sph')?.value,
    fonts: document.fonts.status,
    radii: {
      context: getComputedStyle(document.querySelector('.context-control-box')).borderRadius,
      row: getComputedStyle(document.querySelector('.rx-pair-grid')).borderRadius,
      popup: getComputedStyle(document.getElementById('info-popup')).borderRadius
    },
    italicCount: [...document.querySelectorAll('main *')].filter((node) => getComputedStyle(node).fontStyle === 'italic').length
  })`)
};
await screenshot('untouched');

await evaluate(`document.getElementById('toggle-simple')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 180));
report.dense = await evaluate(`({
  advanced: document.getElementById('toggle-simple')?.checked,
  cylVisible: document.getElementById('current-re-cyl')?.closest('.spinner-container')?.offsetParent !== null,
  scrollWidth: document.documentElement.scrollWidth
})`);
await screenshot('dense');

await evaluate(`(() => {
  const values = {
    age: '50',
    'current-re-sph': '1', 'current-re-cyl': '0.5', 'current-re-axis': '90',
    'current-le-sph': '1', 'current-le-cyl': '0.5', 'current-le-axis': '90',
    'objective-re-sph': '1.5', 'objective-re-cyl': '0.75', 'objective-re-axis': '95',
    'objective-le-sph': '1.5', 'objective-le-cyl': '0.75', 'objective-le-axis': '95',
    'current-le-add': '1.5'
  };
  for (const [fieldId, value] of Object.entries(values)) {
    const input = document.getElementById(fieldId);
    input.value = value;
  }
  for (const fieldId of ['current-re-cyl', 'current-le-cyl', 'objective-re-cyl', 'objective-le-cyl']) {
    const wrapper = document.getElementById(fieldId).closest('.spinner-container');
    wrapper.dataset.sign = '-';
    wrapper.querySelector('.field-sign').textContent = '-';
  }
  for (const fieldId of Object.keys(values)) {
    const input = document.getElementById(fieldId);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
})()`);
await new Promise((resolve) => setTimeout(resolve, 300));
report.completed = await evaluate(`({
  re: [document.getElementById('output-re-sph')?.value, document.getElementById('output-re-cyl')?.value, document.getElementById('output-re-axis')?.value],
  le: [document.getElementById('output-le-sph')?.value, document.getElementById('output-le-cyl')?.value, document.getElementById('output-le-axis')?.value],
  add: document.getElementById('output-le-add')?.value,
  scrollWidth: document.documentElement.scrollWidth
})`);
await screenshot('completed');

await evaluate(`document.getElementById('transpose-btn')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 180));
report.transpose = await evaluate(`({
  currentRe: [document.getElementById('current-re-sph')?.value, document.getElementById('current-re-cyl')?.value, document.getElementById('current-re-axis')?.value],
  scrollWidth: document.documentElement.scrollWidth
})`);

await evaluate(`document.getElementById('info-icon')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 180));
report.guide = await evaluate(`({
  open: document.getElementById('info-popup')?.getAttribute('aria-hidden') === 'false',
  expanded: document.getElementById('info-icon')?.getAttribute('aria-expanded'),
  focused: document.activeElement?.id,
  rect: (() => { const r = document.getElementById('info-popup')?.getBoundingClientRect(); return r ? { left: r.left, right: r.right, top: r.top, bottom: r.bottom } : null; })()
})`);
await screenshot('guide');
await evaluate(`document.getElementById('close-popup')?.click(); document.getElementById('burger-icon')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 180));
report.drawer = await evaluate(`({
  open: document.getElementById('sideMenu')?.classList.contains('open'),
  expanded: document.getElementById('burger-icon')?.getAttribute('aria-expanded'),
  scrollWidth: document.documentElement.scrollWidth
})`);
await screenshot('drawer');

await evaluate(`document.getElementById('new-case-button')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 120));
report.resetArmed = await evaluate(`({
  armed: document.getElementById('new-case-button')?.dataset.armed,
  status: document.getElementById('new-case-status')?.textContent
})`);
await screenshot('reset-armed');
await evaluate(`document.getElementById('new-case-button')?.click()`);
await new Promise((resolve) => setTimeout(resolve, 900));
report.reset = await evaluate(`({
  age: document.getElementById('age')?.value,
  currentRe: document.getElementById('current-re-sph')?.value,
  outputRe: document.getElementById('output-re-sph')?.value,
  drawerOpen: document.getElementById('sideMenu')?.classList.contains('open'),
  scrollWidth: document.documentElement.scrollWidth
})`);
await screenshot('reset-complete');
report.runtimeErrors = runtimeErrors;

await fs.writeFile(new URL(`refract-mobile-report-${routeLabel}.json`, outputDir), `${JSON.stringify(report, null, 2)}\n`);
socket.close();
console.log(JSON.stringify(report, null, 2));

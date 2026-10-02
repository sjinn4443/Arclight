import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const port = Number(process.env.GLAUCOMA_CDP_PORT || 9224)
const targetUrl = process.env.GLAUCOMA_REVIEW_URL || 'http://127.0.0.1:8765/Glaucoma/index.html'
const outputRoot = process.env.GLAUCOMA_REVIEW_OUTPUT || resolve(import.meta.dirname, '..', 'output', 'playwright')
const outputPrefix = process.env.GLAUCOMA_REVIEW_PREFIX || 'glaucoma'
await mkdir(outputRoot, { recursive: true })
const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())
const target = targets.find((entry) => entry.type === 'page')
if (!target) throw new Error('No Chrome page target available')

const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})
let messageId = 0
const pending = new Map()
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  if (!message.id || !pending.has(message.id)) return
  const { resolve, reject } = pending.get(message.id)
  pending.delete(message.id)
  if (message.error) reject(new Error(message.error.message))
  else resolve(message.result)
})
function send(method, params = {}) {
  const id = ++messageId
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
  return result.result.value
}
async function shot(name) {
  const { data } = await send('Page.captureScreenshot', { format: 'png', fromSurface: true })
  await writeFile(`${outputRoot}\\${outputPrefix}-${name}.png`, Buffer.from(data, 'base64'))
}

await send('Page.enable')
await send('Runtime.enable')
await send('Network.enable')
await send('Network.setCacheDisabled', { cacheDisabled: true })
await send('Network.setBypassServiceWorker', { bypass: true })
await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__glaucomaErrors=[]; addEventListener('error',(event)=>window.__glaucomaErrors.push(event.message)); addEventListener('unhandledrejection',(event)=>window.__glaucomaErrors.push(String(event.reason)));` })
await send('Emulation.setDeviceMetricsOverride', { width: 360, height: 740, deviceScaleFactor: 1, mobile: true })
await send('Page.navigate', { url: targetUrl })
await new Promise((resolve) => setTimeout(resolve, 1500))
const untouched = await evaluate(`(() => ({
  width: document.documentElement.clientWidth,
  scrollWidth: document.documentElement.scrollWidth,
  scrollHeight: document.documentElement.scrollHeight,
  final: document.querySelector('#final-message').textContent,
  reasoning: document.querySelector('#reasoning-window').textContent,
  fonts: document.fonts.status
}))()`)
await shot('untouched-360x740')

const lateralityVisual = await evaluate(`(async () => {
  const image = document.querySelector('.ratio-image');
  const questionnaire = document.querySelector('.questionnaire');
  const initial = getComputedStyle(image).transform;
  document.querySelector('.eye-button[data-eye="RE"]').click();
  await new Promise((resolve) => setTimeout(resolve, 200));
  const right = getComputedStyle(image).transform;
  document.querySelector('.eye-button[data-eye="LE"]').click();
  await new Promise((resolve) => setTimeout(resolve, 200));
  const left = getComputedStyle(image).transform;
  return { initial, right, left, selectedEye: questionnaire.dataset.eye };
})()`)
await shot('left-eye-360x740')

const completed = await evaluate(`(() => {
  document.querySelector('#burger-icon').click();
  const reset = document.querySelector('#newAssessmentButton');
  reset.click();
  reset.click();
  document.querySelector('#burger-icon').click();
  document.querySelector('input[name="iop"][value="gte30"]').click();
  document.querySelector('.ratio-button[data-ratio="0.9-1"]').click();
  return {
    final: document.querySelector('#final-message').textContent,
    reportEnabled: !document.querySelector('#reportButton').disabled,
    selectedEye: document.querySelector('.questionnaire').dataset.eye || null,
    scrollHeight: document.documentElement.scrollHeight
  };
})()`)
await shot('completed-360x740')

const report = await evaluate(`(() => {
  const trigger = document.querySelector('#reportButton');
  trigger.focus();
  trigger.click();
  const modal = document.querySelector('#reportModal');
  const content = modal.querySelector('.modal-content').getBoundingClientRect();
  return {
    open: modal.classList.contains('open'),
    hidden: modal.getAttribute('aria-hidden'),
    text: document.querySelector('#reportText').textContent,
    active: document.activeElement.className,
    contentBottom: content.bottom,
    viewport: innerHeight
  };
})()`)
await shot('report-360x740')
const reportClose = await evaluate(`(() => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  return {
    open: document.querySelector('#reportModal').classList.contains('open'),
    active: document.activeElement.id
  };
})()`)

const dense = await evaluate(`(() => {
  document.querySelector('input[name="thin_rims"]').click();
  document.querySelector('input[name="field_of_vision_problem"]').click();
  document.querySelectorAll('input[name="other_risk_factors"]').forEach((input) => input.click());
  document.querySelector('#vision').value='HM'; document.querySelector('#vision').dispatchEvent(new Event('change',{bubbles:true}));
  return { final: document.querySelector('#final-message').textContent, scrollHeight: document.documentElement.scrollHeight };
})()`)
await shot('dense-360x740')

const transient = await evaluate(`(() => {
  document.querySelector('#info-icon').click();
  const popup=document.querySelector('#info-popup');
  return { open: popup.classList.contains('active'), bottom: popup.getBoundingClientRect().bottom, viewport: innerHeight, active: document.activeElement?.getAttribute('aria-label') };
})()`)
await shot('info-360x740')

const reset = await evaluate(`(() => {
  document.querySelector('#info-icon').click(); document.querySelector('#burger-icon').click();
  const reset=document.querySelector('#newAssessmentButton'); reset.click(); reset.click();
  return { final: document.querySelector('#final-message').textContent, reasoning: document.querySelector('#reasoning-window').textContent, reportDisabled: document.querySelector('#reportButton').disabled, selectedRatio: !!document.querySelector('.ratio-button.selected'), selectedEye: !!document.querySelector('.eye-button.selected'), eyeDataset: document.querySelector('.questionnaire').dataset.eye || null, imageTransform: getComputedStyle(document.querySelector('.ratio-image')).transform, medium: document.querySelector('.disc-button[data-size="Medium"]').classList.contains('selected') };
})()`)
await shot('reset-360x740')

const semantics = await evaluate(`(() => {
  const eye = document.querySelector('.eye-button[data-eye="RE"]');
  eye.click();
  const ratio = document.querySelector('.ratio-button[data-ratio="0-0.2"]');
  ratio.click();
  const palpation = document.querySelector('.palpation-button[data-palpation="normal"]');
  palpation.click();
  return {
    eyePressed: eye.getAttribute('aria-pressed'),
    ratioPressed: ratio.getAttribute('aria-pressed'),
    palpationPressed: palpation.getAttribute('aria-pressed'),
    caption: document.querySelector('.risk-grid-table caption')?.textContent,
    rowHeaders: document.querySelectorAll('.risk-grid-table th[scope="row"]').length,
    live: document.querySelector('.risk-live')?.getAttribute('aria-live'),
    eyeSize: { width: eye.getBoundingClientRect().width, height: eye.getBoundingClientRect().height },
    ratioSize: { width: ratio.getBoundingClientRect().width, height: ratio.getBoundingClientRect().height },
    palpationSize: { width: palpation.getBoundingClientRect().width, height: palpation.getBoundingClientRect().height }
  };
})()`)

const safetyStates = await evaluate(`(() => {
  document.querySelector('input[name="thin_rims"]').click();
  const referralFloor = document.querySelector('#final-message').textContent;
  const reset = document.querySelector('#newAssessmentButton'); reset.click(); reset.click();
  document.querySelector('input[name="iop"][value="lte20"]').click();
  document.querySelector('.ratio-button[data-ratio="0-0.2"]').click();
  const withoutLaterality = document.querySelector('#final-message').textContent;
  reset.click(); reset.click();
  document.querySelector('.palpation-button[data-palpation="rock"]').click();
  const rockEmergency = document.querySelector('#final-message').textContent;
  return { referralFloor, withoutLaterality, rockEmergency };
})()`)

const mcq = await evaluate(`(() => {
  document.querySelector('#burger-icon').click();
  document.querySelector('.mcq-level-button[data-level-index="0"]').click();
  document.querySelector('#submitMcqButton').click();
  const guard = document.querySelector('#mcqResult').textContent;
  document.querySelectorAll('.mcq-question').forEach((question) => question.querySelector('input').click());
  document.querySelector('#submitMcqButton').click();
  const options = [...document.querySelectorAll('.mcq-option')];
  return {
    guard,
    title: document.querySelector('#mcqTitle').textContent,
    questionCount: document.querySelectorAll('.mcq-question').length,
    reviewCount: document.querySelectorAll('.mcq-answer-review').length,
    minOptionHeight: Math.min(...options.map((option) => option.getBoundingClientRect().height)),
    result: document.querySelector('#mcqResult').textContent,
    resultFocused: document.activeElement === document.querySelector('#mcqResult'),
    markedCount: document.querySelectorAll('.mcq-option.is-correct, .mcq-option.is-wrong').length,
    scrollWidth: document.documentElement.scrollWidth
  };
})()`)
await shot('mcq-review-360x740')
if (!/answer all questions/i.test(mcq.guard)) throw new Error('MCQ unanswered guard failed')
if (mcq.questionCount !== 4 || mcq.reviewCount !== 4 || mcq.markedCount < 4) throw new Error('MCQ review count failed')
if (mcq.minOptionHeight < 44 || mcq.scrollWidth !== 360 || !mcq.resultFocused) throw new Error('MCQ mobile geometry or focus failed')
const mcqFlow = await evaluate(`(() => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  const escapeClosed = document.querySelector('#mcqModal').getAttribute('aria-hidden') === 'true';
  const escapeFocus = document.activeElement?.textContent?.trim() || document.activeElement?.id || '';
  document.querySelector('#burger-icon').click();
  document.querySelector('.mcq-level-button[data-level-index="0"]').click();
  document.querySelectorAll('.mcq-question').forEach((question) => question.querySelector('input').click());
  document.querySelector('#submitMcqButton').click();
  document.querySelector('#retryMcqButton').click();
  return {
    escapeClosed,
    escapeFocus,
    retryQuestionCount: document.querySelectorAll('.mcq-question').length,
    retryFocused: document.activeElement?.matches('.mcq-question input[type="radio"]') || false
  };
})()`)
if (!mcqFlow.escapeClosed || mcqFlow.retryQuestionCount !== 4 || !mcqFlow.retryFocused) throw new Error('MCQ Escape or retry contract failed')

const errors = await evaluate(`window.__glaucomaErrors || []`)
console.log(JSON.stringify({ untouched, lateralityVisual, completed, report, reportClose, dense, transient, reset, semantics, safetyStates, mcq, mcqFlow, errors }, null, 2))
socket.close()

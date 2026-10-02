import { writeFile } from 'node:fs/promises'

const port = Number(process.env.SAURON_CDP_PORT || 9225)
const targetUrl = process.env.SAURON_REVIEW_URL || 'http://127.0.0.1:8765/Sauron/index.html'
const outputRoot = process.env.TEMP || '.'
const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())
const target = targets.find((entry) => entry.type === 'page')
if (!target) throw new Error('No Chrome page target available')
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
let id = 0
const pending = new Map()
socket.addEventListener('message', (event) => { const message = JSON.parse(event.data); if (!pending.has(message.id)) return; const job = pending.get(message.id); pending.delete(message.id); message.error ? job.reject(new Error(message.error.message)) : job.resolve(message.result) })
const send = (method, params = {}) => new Promise((resolve, reject) => { const next = ++id; pending.set(next, { resolve, reject }); socket.send(JSON.stringify({ id: next, method, params })) })
async function evaluate(expression) { const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.text); return result.result.value }
async function shot(name) { const { data } = await send('Page.captureScreenshot', { format: 'png', fromSurface: true }); await writeFile(`${outputRoot}\\sauron-${name}-360x740.png`, Buffer.from(data, 'base64')) }

await send('Page.enable'); await send('Runtime.enable')
await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__sauronErrors=[]; addEventListener('error',(event)=>window.__sauronErrors.push(event.message)); addEventListener('unhandledrejection',(event)=>window.__sauronErrors.push(String(event.reason)));` })
await send('Emulation.setDeviceMetricsOverride', { width: 360, height: 740, deviceScaleFactor: 1, mobile: true })
await send('Page.navigate', { url: targetUrl }); await new Promise((resolve) => setTimeout(resolve, 1800))
const baseline = await evaluate(`({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,caseLabel:document.querySelector('#case-trigger-label').textContent,activeEye:document.querySelector('.ret-eye-button.is-active').textContent.trim(),fonts:document.fonts.status})`); await shot('baseline')
const advanced = await evaluate(`(() => { document.querySelector('.advanced-panel').open=true; return {bottom:document.querySelector('.eyes-wrapper').getBoundingClientRect().bottom,viewport:innerHeight,scrollWidth:document.documentElement.scrollWidth}; })()`); await shot('advanced')
await evaluate(`document.querySelector('#case-trigger-button').click()`); await new Promise((resolve) => setTimeout(resolve, 300))
const cases = await evaluate(`(() => { const box=document.querySelector('#caseModalContent').getBoundingClientRect(); return {open:document.querySelector('#caseModal').getAttribute('aria-hidden')==='false',top:box.top,bottom:box.bottom,viewport:innerHeight,focused:document.activeElement?.id}; })()`); await shot('cases')
await evaluate(`document.querySelector('#closeCaseModal').click(); document.querySelector('[data-ret-eye="right"]').click(); document.querySelector('#gaze-toggle').click(); document.querySelector('#burger-icon').click()`); await new Promise((resolve) => setTimeout(resolve, 300))
const reset = await evaluate(`(() => { const button=document.querySelector('#reset-simulator-button'); button.click(); return {label:button.textContent,status:document.querySelector('#reset-simulator-status').textContent,activeEye:document.querySelector('.ret-eye-button.is-active').textContent.trim(),activeEyePressed:document.querySelector('.ret-eye-button.is-active').getAttribute('aria-pressed'),gaze:document.querySelector('#gaze-toggle').checked,menuOpen:document.querySelector('#sideMenu').classList.contains('open')}; })()`); await shot('reset-confirm')
const errorsBeforeReset = await evaluate(`window.__sauronErrors || []`)
await evaluate(`document.querySelector('#reset-simulator-button').click()`); await new Promise((resolve) => setTimeout(resolve, 1000))
const resetComplete = await evaluate(`({caseLabel:document.querySelector('#case-trigger-label').textContent,activeEye:document.querySelector('.ret-eye-button.is-active').textContent.trim(),activeEyePressed:document.querySelector('.ret-eye-button.is-active').getAttribute('aria-pressed'),gaze:document.querySelector('#gaze-toggle').checked,menuOpen:document.querySelector('#sideMenu').classList.contains('open'),scrollWidth:document.documentElement.scrollWidth})`); await shot('reset-complete')
const errorsAfterReset = await evaluate(`window.__sauronErrors || []`)
console.log(JSON.stringify({ baseline, advanced, cases, reset, resetComplete, errors: [...errorsBeforeReset, ...errorsAfterReset] }, null, 2)); socket.close()

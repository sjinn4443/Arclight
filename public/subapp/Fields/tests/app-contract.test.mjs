import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFile(resolve(appRoot, path), "utf8");

test("runtime is local and retains direct-file compatible classic scripts", async () => {
    const html = await read("home.html");
    assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\./i);
    assert.doesNotMatch(html, /<script[^>]+type=["']module["']/i);
    assert.match(html, /src="src\/assessment-state\.js\?v=20260928-logic1"/);
    assert.match(html, /src="src\/state\.js\?v=20260928-logic1"/);
    assert.match(html, /src="src\/output\.js\?v=20260928-logic1"/);
    assert.match(html, /src="src\/main\.js\?v=20260726-refactor1"/);
    assert.ok(html.indexOf("assessment-state.js") < html.indexOf("src/state.js"));
});

test("untouched assessment, completion and reset contracts are present", async () => {
    const [html, state, output, main] = await Promise.all([
        read("home.html"),
        read("src/state.js"),
        read("src/output.js"),
        read("src/main.js"),
    ]);
    assert.match(html, /id="complete-assessment"/);
    assert.match(html, /id="new-assessment"/);
    assert.match(state, /initialiseFieldAssessment/);
    assert.match(state, /shouldCompleteRemaining/);
    assert.match(state, /completeUnassessedFieldPointsSeen/);
    assert.match(output, /Not assessed/);
    assert.match(output, /Unable to interpret/);
    assert.doesNotMatch(
        output,
        /condition\s*=\s*["']<em>Normal<\/em>\s*<strong>Full Fields of Vision<\/strong>["']/
    );
    assert.match(main, /button\.textContent = 'Clear\?'/);
});

test("manifest and scoped offline worker are wired without affecting file protocol", async () => {
    const [html, manifestText, register, worker] = await Promise.all([
        read("home.html"),
        read("manifest.webmanifest"),
        read("pwa-register.js"),
        read("service-worker.js"),
    ]);
    const manifest = JSON.parse(manifestText);
    assert.match(html, /rel="manifest"/);
    assert.equal(manifest.start_url, "./home.html");
    assert.equal(manifest.scope, "./");
    assert.match(register, /window\.location\.protocol !== "http:"/);
    assert.match(worker, /arclight-fields-/);
});

test("MCQ sources and UI release assets use their current tokens", async () => {
    const [html, worker] = await Promise.all([
        read("home.html"),
        read("service-worker.js"),
    ]);
    assert.match(html, /styles\.css\?v=20260928-ui1/);
    assert.match(html, /src\/mcq-data\/core\.js\?v=20260726-mcq2/);
    assert.match(html, /src\/mcq-data\/library\.js\?v=20260726-mcq2/);
    assert.match(html, /src\/mcq-data\/sets\.js\?v=20260726-mcq2/);
    assert.match(html, /src\/mcq-data\.js\?v=20260726-mcq2/);
    assert.match(html, /src\/mcq\.js\?v=20260930-ui1/);
    assert.match(worker, /\$\{CACHE_PREFIX\}20260928-logic1/);
    assert.match(worker, /styles\.css\?v=20260928-ui1/);
});

test("MCQ modal keeps stable identities, fail-safe submission, rationales and retry", async () => {
    const [html, source, css] = await Promise.all([
        read("home.html"),
        read("src/mcq.js"),
        read("styles.css"),
    ]);
    assert.match(html, /id="mcq-result"[^>]+role="status"[^>]+tabindex="-1"/);
    assert.match(source, /id: `\$\{q\.id\}-\$\{opt\.key\}`/);
    assert.match(source, /firstUnansweredIndex[\s\S]*\.focus\(\)/);
    assert.match(source, /mcq-question-feedback/);
    assert.match(source, /q\.explanation/);
    assert.match(source, /dom\.result\.focus\(\)/);
    assert.match(source, /buildQuiz\(state\.activeLevel\)[\s\S]*querySelector\("input"\)\?\.focus\(\)/);
    assert.match(css, /\.mcq-option\s*\{[\s\S]*min-height: 44px/);
    assert.match(css, /\.mcq-close\s*\{[\s\S]*width: 44px[\s\S]*height: 44px/);
});

test("interactive overlays expose dialog and trigger state semantics", async () => {
    const html = await read("home.html");
    assert.match(html, /id="side-menu"[^>]+role="dialog"[^>]+aria-modal="true"/);
    assert.match(html, /id="info-popup"[^>]+role="dialog"[^>]+aria-modal="true"/);
    assert.match(html, /id="menu-icon"[^>]+aria-expanded="false"/);
    assert.match(html, /id="info-icon"[^>]+aria-expanded="false"/);

    const ids = Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, "home.html must not contain duplicate IDs");
    const controlledIds = Array.from(html.matchAll(/\saria-controls="([^"]+)"/g), (match) => match[1]);
    controlledIds.forEach((id) => assert.ok(ids.includes(id), `aria-controls target is missing: ${id}`));
});

test("assessment changes use one guarded output refresh route", async () => {
    const [main, state, output] = await Promise.all([
        read("src/main.js"),
        read("src/state.js"),
        read("src/output.js"),
    ]);
    assert.match(output, /let assessmentRefreshInProgress = false;/);
    assert.match(output, /function refreshAssessmentOutputs\(\)/);
    assert.match(output, /try \{[\s\S]*updateOutput\(\)[\s\S]*updateAnalysisOutput\(eyeState\)[\s\S]*finally/);
    assert.doesNotMatch(main, /updateOutput\(\)[\s\S]{0,100}updateAnalysisOutput/);
    assert.doesNotMatch(state, /updateOutput\(\)[\s\S]{0,100}updateAnalysisOutput/);
    assert.doesNotMatch(output, /toggle\.addEventListener\("input", onModeChanged\)/);
    assert.match(output, /toggle\.addEventListener\("change", onModeChanged\)/);
});

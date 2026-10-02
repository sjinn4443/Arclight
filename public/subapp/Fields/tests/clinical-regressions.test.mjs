import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const ctx = { console, document: {}, localStorage: { getItem() { return null; } } };
ctx.window = ctx;
ctx.globalThis = ctx;
vm.createContext(ctx);
for (const file of ['field-core', 'rules/helpers', 'rules/anterior', 'rules/chiasmal', 'rules/posterior', 'rules', 'summary', 'output-text-rules', 'output-lesion-map', 'output', 'pathway']) {
    vm.runInContext(fs.readFileSync(new URL(`../src/${file}.js`, import.meta.url), 'utf8'), ctx);
}
const eye = (changes = {}) => ({ st: 'R', sn: 'R', it: 'R', in: 'R', c: 'R', ...changes });
const summary = (r, l) => ctx.summarizeCondition({ right: eye(r), left: eye(l) });

test('clean homonymous hemi has no invented mixed alternative', () => {
    const result = summary({ st: 'W', it: 'W' }, { sn: 'W', in: 'W' });
    assert.match(result, /Right Homonymous Hemianopia/);
    assert.doesNotMatch(result, /Also:|Mixed pattern/);
});
test('central involvement retains bitemporal localisation', () => {
    for (const c of ['?', 'W']) {
        const result = summary({ st: 'W', it: 'W', c }, { st: 'W', it: 'W', c });
        assert.match(result, /Bitemporal Hemianopia/);
        assert.match(result, /central involvement/);
        assert.match(ctx.mapConditionToLesionCore(result), /chiasmal/);
    }
});
test('tunnel headline names the observed pattern not definite glaucoma', () => {
    const result = summary({ st: 'W', sn: 'W', it: 'W', in: 'W' }, {});
    assert.match(result, /Peripheral Constriction/);
    assert.doesNotMatch(result, /Glaucoma/);
    assert.match(ctx.toSimpleCondition(result), /Tunnel vision in right eye/);
});
test('bilateral total loss retains cortical possibility in text and diagram', () => {
    const all = { st: 'W', sn: 'W', it: 'W', in: 'W', c: 'W' };
    const result = summary(all, all);
    const site = ctx.mapConditionToLesionCore(result);
    assert.match(site, /cortical/);
    const targets = ctx.getPathwayTargetIds(result, site);
    assert.ok(targets.includes('part-v1-left') && targets.includes('part-v1-right'));
});
test('mixed altitudinal explanation and diagram account for both eyes', () => {
    const result = summary({ st: 'W', sn: 'W' }, { it: 'W', in: 'W' });
    const site = ctx.mapConditionToLesionCore(result);
    assert.match(site, /inferior.*superior/);
    const targets = ctx.getPathwayTargetIds(result, site);
    assert.ok(targets.includes('part-retina-right') && targets.includes('part-retina-left'));
});
test('retinal detachment stays suspected regardless of field confidence', () => {
    const result = ctx.buildRetinaPriorityCondition(summary({ st: 'W' }, {}), 'advanced');
    assert.match(result, /^<em>Suspected/);
    assert.doesNotMatch(result, /<em>Definite<\/em> <strong>Right eye retinal/);
});
test('RAPD allows asymmetric bilateral disease and retinal involvement', () => {
    const bilateral = ctx.applyBilateralRapdConsistencyNote('Bilateral pattern.', 'right');
    assert.match(bilateral, /asymmetric/);
    assert.doesNotMatch(bilateral, /inconsistency/);
    const result = summary({ c: 'W' }, {});
    const source = ctx.classifySourceAssessment(result, 'right', {});
    assert.equal(source.category, 'anterior_mixed');
    assert.match(source.text, /retinal or optic nerve/);
});

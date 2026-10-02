import assert from 'node:assert/strict';
import fs from 'node:fs';
import { formatRuleSentences, prescriptionInputSignature, readPrescriptionContext } from '../src/ui/prescription-form.js';

assert.equal(formatRuleSentences(['first', 'second', 'third'], [
  ['first', '', 'First explanation'],
  ['second', '', 'Second explanation.'],
  ['third', '', 'Already punctuated?']
]), 'First explanation. Second explanation. Already punctuated?', 'Rule descriptions must remain separate sentences without duplicate punctuation');

const fields = new Map();
const root = { getElementById: (id) => fields.get(id) };
assert.deepEqual(readPrescriptionContext(root), {
  simple: true, vaGood: false, precise: false, accurate: false, health: false,
  repeat: null, calm: null, rightQuality: null, leftQuality: null
}, 'untouched context must not become a recorded No or quality zero');

for (const id of ['context-repeat', 'context-calm']) {
  for (const [value, expected] of [['', null], ['0', false], ['1', true], ['invalid', null]]) {
    fields.set(id, { value });
    assert.equal(readPrescriptionContext(root)[id === 'context-repeat' ? 'repeat' : 'calm'], expected);
  }
}
for (const [id, key] of [['quality-right', 'rightQuality'], ['quality-left', 'leftQuality']]) {
  for (const [value, expected] of [['', null], ['0', 0], ['5', 5], ['10', 10], ['-1', null], ['11', null], ['4.5', null], ['invalid', null]]) {
    fields.set(id, { value });
    assert.equal(readPrescriptionContext(root)[key], expected);
  }
}
fields.set('toggle-accurate', { checked: true });
fields.set('quality-right', { value: '0' });
fields.set('quality-left', { value: '' });
const qualityContext = readPrescriptionContext(root);
assert.equal(qualityContext.accurate, true);
assert.equal(qualityContext.rightQuality, 0, 'explicit zero is preserved for engine precedence');
assert.equal(qualityContext.leftQuality, null, 'blank quality leaves the accurate shortcut available');

const signatureFields = [
  { id: 'current-re-sph', value: '1.00', checked: false, sign: '+' },
  { id: 'toggle-simple', value: 'on', checked: false },
  { id: 'context-repeat', value: '', checked: false }
].map(field => ({ ...field, closest() { return this.sign ? { dataset: { sign: this.sign } } : null; } }));
const signatureRoot = { querySelectorAll: () => signatureFields };
const originalSignature = prescriptionInputSignature(signatureRoot);
assert.equal(prescriptionInputSignature(signatureRoot), originalSignature, 'unchanged raw entry gives a stable signature');
for (const [index, key, value] of [[0, 'value', '1.25'], [0, 'sign', '-'], [1, 'checked', true], [2, 'value', '0']]) {
  const original = signatureFields[index][key];
  signatureFields[index][key] = value;
  assert.notEqual(prescriptionInputSignature(signatureRoot), originalSignature, `${key} change invalidates output`);
  signatureFields[index][key] = original;
}

const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const styles = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
assert.match(styles, /body:not\(\.advanced-mode\) \.spinner-container\[data-placeholder='cyl'\],[\s\S]*?body:not\(\.advanced-mode\) \.spinner-container\[data-placeholder='axis'\] \{\s*display: none;/, 'simple-mode fields must be hidden before JavaScript starts');
for (const id of ['context-repeat', 'context-calm', 'quality-right', 'quality-left']) {
  const select = index.match(new RegExp(`<select[^>]*id="${id}"[^>]*>([\\s\\S]*?)</select>`));
  assert.ok(select, `${id} must be a native select`);
  assert.match(select[1], /^\s*<option value="">/, `${id} must start unrecorded`);
  assert.doesNotMatch(select[1], /selected/);
}
assert.match(index, /<details id="measurement-quality" class="measurement-quality">/);
assert.match(index, /A score replaces the accurate switch for that eye/);
const form = fs.readFileSync(new URL('../src/ui/prescription-form.js', import.meta.url), 'utf8');
assert.match(form, /querySelectorAll\('input, select'\)/, 'select changes must immediately recalculate');
assert.match(form, /inputSignature === renderedInputSignature/, 'duplicate input and change notifications are deduplicated');
console.log('Optional context UI contracts passed');

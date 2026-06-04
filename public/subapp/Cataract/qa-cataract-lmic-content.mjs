import fs from 'node:fs';
import path from 'node:path';

import { ACTION_TEXT_BY_CODE, NOTE_TEXT_BY_CODE, UI_COPY } from './src/cataract-copy.js';

const OUTPUT_REPORT_FILE = 'lmic-content-audit-report.txt';

const DISALLOWED_PATTERNS = [
  { label: 'MRI', regex: /\bmri\b/i },
  { label: 'OCT', regex: /\boct\b/i },
  { label: 'ultrasound', regex: /\bultrasound\b/i },
  { label: 'imaging', regex: /\b(imaging|neuroimaging)\b/i },
  { label: 'CT scan', regex: /\bct\s*scan\b/i }
];

const USER_FACING_FILES = ['index.html', 'src/cataract-copy.js'];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function countWords(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function flattenUserCopyTexts() {
  return [
    ...Object.values(ACTION_TEXT_BY_CODE),
    ...Object.values(NOTE_TEXT_BY_CODE),
    UI_COPY?.infoPopup?.intro || '',
    ...(Array.isArray(UI_COPY?.infoPopup?.bullets) ? UI_COPY.infoPopup.bullets : []),
    UI_COPY?.infoPopup?.outro || ''
  ];
}

function runDisallowedTermChecks() {
  const findings = [];

  USER_FACING_FILES.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      DISALLOWED_PATTERNS.forEach(({ label, regex }) => {
        if (regex.test(line)) {
          findings.push(`${filePath}:${index + 1} disallowed term "${label}" in "${line.trim()}"`);
        }
      });
    });
  });

  assert(findings.length === 0, `Disallowed specialist-resource terms found:\n${findings.join('\n')}`);
}

function runSnappyActionChecks() {
  const maxWords = 12;
  const violations = Object.entries(ACTION_TEXT_BY_CODE)
    .filter(([, text]) => String(text || '').trim().length > 0)
    .map(([code, text]) => ({ code, text, words: countWords(text) }))
    .filter((entry) => entry.words > maxWords);

  assert(
    violations.length === 0,
    `Action texts exceed ${maxWords} words:\n${violations
      .map((entry) => `${entry.code} (${entry.words}): ${entry.text}`)
      .join('\n')}`
  );
}

function runPlainLanguageChecks() {
  const disallowedJargon = ['lamina cribrosa', 'dioptre', 'staphyloma'];
  const texts = flattenUserCopyTexts();
  const hits = [];

  texts.forEach((text) => {
    const normalized = String(text || '').toLowerCase();
    disallowedJargon.forEach((term) => {
      if (normalized.includes(term)) {
        hits.push(`Found "${term}" in "${text}"`);
      }
    });
  });

  assert(hits.length === 0, `Specialist jargon found in user copy:\n${hits.join('\n')}`);
}

function run() {
  runDisallowedTermChecks();
  runSnappyActionChecks();
  runPlainLanguageChecks();

  const lines = [];
  lines.push('Cataract LMIC Content Audit Report');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('Checks');
  lines.push('------');
  lines.push('1. No disallowed specialist-resource terms (MRI/OCT/ultrasound/imaging/CT scan).');
  lines.push('2. Action text length <= 12 words.');
  lines.push('3. Plain-language copy excludes selected specialist jargon.');
  lines.push('');
  lines.push('Result: PASS');

  const report = lines.join('\n');
  fs.writeFileSync(path.join(process.cwd(), OUTPUT_REPORT_FILE), report, 'utf8');
  console.log(report);
  console.log('');
  console.log(`Report written to: ${OUTPUT_REPORT_FILE}`);
}

try {
  run();
} catch (error) {
  console.error(`LMIC content audit failed: ${error.message}`);
  process.exit(1);
}

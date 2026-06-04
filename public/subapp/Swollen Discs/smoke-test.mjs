#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readTextFile(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

function hasId(html, id) {
  const idPattern = new RegExp(`id=["']${id}["']`);
  return idPattern.test(html);
}

function run() {
  const requiredFiles = [
    'index.html',
    'styles.css',
    'script.js',
    'app-state.js',
    'state-machine.js',
    'app-constants.js',
    'viewer.js',
    'viewer-math.js',
    'modal-manager.js',
    'mcq-controller.js',
    'timed-test.js',
    'mcq-engine.mjs',
    'questions.js',
    'assets/images/ret180.webp',
    'assets/images/ret180_2.webp',
    'assets/images/ret180_4.webp',
    'assets/images/phone.webp'
  ];

  requiredFiles.forEach((file) => {
    assert(fs.existsSync(path.join(process.cwd(), file)), `Missing required file: ${file}`);
  });

  const html = readTextFile('index.html');
  const questionsJs = readTextFile('questions.js');

  const requiredIds = [
    'fundusCanvas',
    'fovToggle',
    'eyeToggle',
    'cataractSlider',
    'viewSummary',
    'burger-icon',
    'info-icon',
    'sideMenu',
    'cupAchievement',
    'cupAchievementLabel',
    'cupAchievementCode',
    'downloadCupCertificateButton',
    'infoModal',
    'testModal',
    'mcqTimer',
    'timedGuessBox',
    'submitTimedGuessButton'
  ];

  requiredIds.forEach((id) => {
    assert(hasId(html, id), `Missing required DOM id in index.html: #${id}`);
  });

  const scriptRefs = [...html.matchAll(/<script\s+src="([^"]+)"\s+type="module"><\/script>/g)].map(
    (match) => match[1]
  );
  const scriptJsRefs = scriptRefs.filter((ref) => ref === 'script.js');
  assert(scriptJsRefs.length === 1, 'index.html must load script.js exactly once as a module');

  const dataImageRefs = [...html.matchAll(/data-image="([^"]+)"/g)].map((match) => match[1]);
  const dataConditionRefs = [...html.matchAll(/data-condition="([^"]+)"/g)].map(
    (match) => match[1]
  );
  assert(
    dataImageRefs.length >= 3,
    'Expected at least 3 condition buttons with data-image attributes'
  );
  assert(
    ['normal', 'suspicious', 'swollen'].every((condition) => dataConditionRefs.includes(condition)),
    'Expected condition buttons to include normal, suspicious and swollen data-condition attributes'
  );

  [...new Set(dataImageRefs)].forEach((imagePath) => {
    assert(
      fs.existsSync(path.join(process.cwd(), imagePath)),
      `Condition button image does not exist: ${imagePath}`
    );
  });

  const cataractStopCount = (html.match(/class="cataract-stop(?:\s|")/g) || []).length;
  assert(cataractStopCount === 4, `Expected 4 cataract stops, found ${cataractStopCount}`);

  const questionCount = (questionsJs.match(/\bquestion\s*:/g) || []).length;
  assert(
    questionCount >= 7,
    `Expected question bank to contain >= 7 questions, found ${questionCount}`
  );

  console.log('Smoke test passed.');
  console.log(
    `Checked ${requiredFiles.length} files, ${requiredIds.length} required DOM hooks, and script syntax.`
  );
}

try {
  run();
} catch (error) {
  console.error(`Smoke test failed: ${error.message}`);
  process.exit(1);
}

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);

test('all pathway visual tiers build distinct labelled options with the authored answer', () => {
    const context = { console, document: {}, localStorage: { getItem: () => null, setItem() {} } };
    context.window = context;
    vm.createContext(context);
    for (const file of ['src/mcq-data/core.js', 'src/mcq-data/library.js', 'src/mcq-data/sets.js', 'src/mcq-data.js', 'src/mcq.js']) {
        vm.runInContext(fs.readFileSync(new URL(file, root), 'utf8'), context, { filename: file });
    }
    for (const level of ['primary', 'intermediate', 'advanced']) {
        const questions = context.buildPathwayQuestions(level);
        assert.ok(questions.length > 0, level);
        assert.equal(new Set(questions.map(question => question.id)).size, questions.length);
        for (const question of questions) {
            assert.equal(new Set(question.options.map(option => option.label)).size, question.options.length);
            assert.equal(question.options.filter(option => option.key === question.answerKey).length, 1);
            assert.ok(question.explanation);
            assert.ok(question.sourceIds.length > 0);
            assert.ok(question.reviewStatus);
        }
    }
});

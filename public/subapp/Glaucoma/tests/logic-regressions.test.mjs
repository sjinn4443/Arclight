import assert from 'node:assert/strict'
import { calculateRiskOutcome as calculate, canCalculateRisk } from '../src/risk-engine.js'
import { buildGlaucomaReport } from '../src/report.js'

export function runLogicRegressions() {
  assert.equal(canCalculateRisk({}), false)
  for (const inputs of [
    { thinRim: true }, { suspiciousFields: true }, { iop: 'gte30' },
    { iop: '25-29' }, { palpation: 'firm' }
  ]) {
    assert.equal(canCalculateRisk(inputs), true)
    const output = calculate(inputs)
    assert.match(output.urgencyMessage, /SOON/)
    assert.equal(output.cellId, null)
    assert.match(output.gridNote, /incomplete/)
  }
  for (const inputs of [{ vision: 'HM' }, { suspiciousPupils: true }]) {
    assert.equal(canCalculateRisk(inputs), true)
    for (const axes of [{}, { iop: 'lte20', cupDiscRatio: '0-0.2' }]) {
      assert.match(calculate({ ...inputs, ...axes }).urgencyMessage, /^CHECK:/)
    }
  }
  let cases = 0
  for (const concern of [{ vision: 'HM' }, { suspiciousPupils: true }]) {
    for (const axes of [
      { cupDiscRatio: '0.9-1', iop: 'lte20' },
      { cupDiscRatio: '0.9-1', palpation: 'rock' },
      { palpation: 'rock' }
    ]) {
      const output = calculate({ ...axes, ...concern })
      assert.match(output.urgencyMessage, /Assess reduced vision or abnormal pupils; cause may not be glaucoma/)
      if (axes.cupDiscRatio) assert.match(output.urgencyMessage, /END-STAGE/)
      if (axes.palpation) assert.match(output.urgencyMessage, /^EMERGENCY/)
    }
  }
  for (const iop of [null, 'lte20', '21-24', '25-29', 'gte30']) {
    for (const discSize of ['Small', 'Medium', 'Large']) {
      for (const palpation of [null, 'normal', 'firm', 'rock']) {
        const inputs = { iop, discSize, palpation, cupDiscRatio: '0.9-1' }
        const output = calculate(inputs)
        assert.equal(canCalculateRisk(inputs), true)
        assert.equal(output.colNum, 4)
        assert.equal(output.isEndStage, true)
        assert.match(output.urgencyMessage, /END-STAGE/)
        if (!iop && palpation === 'rock') assert.match(output.urgencyMessage, /^EMERGENCY/)
        cases++
      }
    }
  }
  const inputs = { iop: 'lte20', cupDiscRatio: '0-0.2', thinRim: true }
  const outcome = calculate(inputs)
  assert.equal(outcome.cellColour, 'white')
  assert.match(outcome.gridNote, /override/)
  const report = buildGlaucomaReport({ inputs, outcome })
  assert.match(report, /override/)
  assert.match(report, /Supporting points \(C\/D shown on chart\)/)
  assert.match(report, /emergency assessment/)
  console.log(`Logic regressions passed, including ${cases} end-stage combinations.`)
}

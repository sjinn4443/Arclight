import assert from 'node:assert/strict'

import { buildReasoningHtml, calculateRiskOutcome, canCalculateRisk } from '../src/risk-engine.js'

function runRiskEngineTests() {
  assert.equal(canCalculateRisk({ iop: null, cupDiscRatio: '0-0.2' }), false)
  assert.equal(canCalculateRisk({ iop: null, palpation: 'normal', cupDiscRatio: '0-0.2' }), true)
  assert.equal(canCalculateRisk({ iop: null, palpation: 'rock', cupDiscRatio: null }), true)
  assert.equal(canCalculateRisk({ iop: 'lte20', cupDiscRatio: null }), false)
  assert.equal(canCalculateRisk({ iop: 'lte20', cupDiscRatio: '0-0.2' }), true)
  assert.equal(canCalculateRisk({ iop: 'lte20', cupDiscRatio: 'bad-ratio' }), false)
  assert.equal(canCalculateRisk({ iop: 'bad-band', cupDiscRatio: '0-0.2' }), false)

  const baseline = calculateRiskOutcome({
    iop: 'lte20',
    cupDiscRatio: '0-0.2',
    discSize: 'Medium'
  })
  assert.equal(baseline.cellId, 'cell_r4_c1')
  assert.equal(baseline.cellColour, 'white')
  assert.equal(baseline.urgencyMessage, 'LOW GRID CONCERN: Routine check-up')

  const urgent = calculateRiskOutcome({
    iop: 'gte30',
    cupDiscRatio: '0.9-1',
    discSize: 'Medium'
  })
  assert.equal(urgent.cellId, 'cell_r1_c4')
  assert.equal(urgent.cellColour, 'red')
  assert.equal(urgent.urgencyMessage, 'URGENT: See specialist within 3 weeks · END-STAGE: Assess fellow eye')

  const shiftedRow = calculateRiskOutcome({
    iop: '21-24',
    cupDiscRatio: '0.6-0.8',
    discSize: 'Medium',
    thinRim: true,
    suspiciousFields: true
  })
  assert.equal(shiftedRow.cellId, 'cell_r2_c3')
  assert.equal(shiftedRow.togglePoints, 2)

  const endStage = calculateRiskOutcome({
    iop: '25-29',
    cupDiscRatio: '0.9-1',
    discSize: 'Medium'
  })
  assert.equal(endStage.cellColour, 'darkgrey')
  assert.equal(endStage.urgencyMessage, 'END-STAGE: Escalate affected eye and assess fellow eye')

  const palpationOnly = calculateRiskOutcome({
    iop: null,
    palpation: 'firm',
    cupDiscRatio: '0.3-0.5',
    discSize: 'Medium'
  })
  assert.equal(palpationOnly.resolvedIopBand, 'gte30')
  assert.equal(palpationOnly.isProvisionalPressure, true)
  assert.match(palpationOnly.urgencyMessage, /^PROVISIONAL \(No tonometer\):/)

  const rockPalpation = calculateRiskOutcome({
    iop: null,
    palpation: 'rock',
    cupDiscRatio: '0.9-1',
    discSize: 'Medium'
  })
  assert.equal(rockPalpation.resolvedIopBand, 'gte30')
  assert.equal(rockPalpation.cellId, 'cell_r1_c4')
  assert.equal(rockPalpation.isRockAcuteWarning, true)
  assert.match(rockPalpation.urgencyMessage, /^EMERGENCY WARNING:/)
  assert.equal(rockPalpation.urgencyTextColour, 'red')

  const rockWithoutCupDisc = calculateRiskOutcome({
    iop: null,
    palpation: 'rock',
    cupDiscRatio: null,
    discSize: 'Medium'
  })
  assert.equal(rockWithoutCupDisc.cellId, null)
  assert.equal(rockWithoutCupDisc.isRockAcuteWarning, true)
  assert.match(rockWithoutCupDisc.urgencyMessage, /^EMERGENCY WARNING:/)

  const measuredIopOverridesPalpation = calculateRiskOutcome({
    iop: '21-24',
    palpation: 'rock',
    cupDiscRatio: '0.6-0.8',
    discSize: 'Medium'
  })
  assert.equal(measuredIopOverridesPalpation.isRockAcuteWarning, false)
  assert.equal(measuredIopOverridesPalpation.isProvisionalPressure, false)
  assert.equal(measuredIopOverridesPalpation.hasPressureConflict, true)
  assert.match(
    measuredIopOverridesPalpation.reasoningDetails.join('; '),
    /Measured IOP selected; palpation ignored/
  )
  assert.equal(measuredIopOverridesPalpation.urgencyMessage, 'SOON: See specialist within 2 months')

  const invalidPressureInput = calculateRiskOutcome({
    iop: 'bad-band',
    palpation: null,
    cupDiscRatio: '0.3-0.5',
    discSize: 'Medium'
  })
  assert.equal(invalidPressureInput.resolvedIopBand, null)
  assert.equal(invalidPressureInput.pressureSource, 'none')
  assert.equal(invalidPressureInput.urgencyMessage, 'INCOMPLETE: Select a valid pressure input')

  const invalidCupDiscInput = calculateRiskOutcome({
    iop: '21-24',
    cupDiscRatio: 'bad-ratio',
    discSize: 'Small'
  })
  assert.equal(invalidCupDiscInput.cupDiscRatio, null)
  assert.equal(invalidCupDiscInput.cellId, null)
  assert.equal(invalidCupDiscInput.urgencyMessage, 'INCOMPLETE: Select C/D to complete risk grid')

  const invalidDiscSizeDefaultsToMedium = calculateRiskOutcome({
    iop: 'lte20',
    cupDiscRatio: '0.6-0.8',
    discSize: 'bad-disc'
  })
  assert.equal(invalidDiscSizeDefaultsToMedium.discSize, 'Medium')
  assert.equal(invalidDiscSizeDefaultsToMedium.cellId, 'cell_r4_c3')
  assert.equal(invalidDiscSizeDefaultsToMedium.riskScore, 0)

  const invalidRiskFactorsAreIgnored = calculateRiskOutcome({
    iop: 'lte20',
    cupDiscRatio: '0-0.2',
    discSize: 'Medium',
    riskFactors: ['Age', 'Age', 'Injected']
  })
  assert.equal(invalidRiskFactorsAreIgnored.riskScore, 0.2)
  assert.deepEqual(invalidRiskFactorsAreIgnored.riskFactorStrings, ['Age: +0.2'])

  const suspiciousFieldFloor = calculateRiskOutcome({
    iop: 'lte20',
    cupDiscRatio: '0-0.2',
    discSize: 'Medium',
    suspiciousFields: true
  })
  assert.equal(suspiciousFieldFloor.cellId, 'cell_r4_c1')
  assert.equal(suspiciousFieldFloor.hasReferralFloor, true)
  assert.equal(suspiciousFieldFloor.urgencyMessage, 'SOON: See specialist within 2 months')

  const suspiciousRimFloor = calculateRiskOutcome({
    iop: 'lte20',
    cupDiscRatio: '0-0.2',
    discSize: 'Medium',
    thinRim: true
  })
  assert.equal(suspiciousRimFloor.hasReferralFloor, true)
  assert.equal(suspiciousRimFloor.urgencyMessage, 'SOON: See specialist within 2 months')

  const reasoning = buildReasoningHtml({
    eye: 'RE',
    cupDiscRatio: '0.3-0.5',
    discSize: 'Small',
    reasoningDetails: ['IOP 25-29: +2', 'Small disc: +2'],
    riskFactorStrings: ['Age: +0.2'],
    riskScore: 4.2
  })
  assert.match(reasoning, /C\/D: 0\.3-0\.5/)
  assert.match(reasoning, /Eye: RE/)
  assert.match(reasoning, /DS: Small/)
  assert.match(reasoning, /Supporting points \(C\/D shown on chart\): <b>4\.2<\/b>/)

  const escapedReasoning = buildReasoningHtml({
    cupDiscRatio: '<img src=x onerror=alert(1)>',
    discSize: '<b>bad</b>',
    reasoningDetails: ['<script>alert(1)</script>'],
    riskFactorStrings: ['Age: <img src=x onerror=alert(2)>'],
    riskScore: 1
  })
  assert.doesNotMatch(escapedReasoning, /<script|<img|<b>bad<\/b>/)
  assert.match(escapedReasoning, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/)

  const iopBands = [null, 'lte20', '21-24', '25-29', 'gte30']
  const palpationStates = [null, 'normal', 'firm', 'rock']
  const cupDiscRatios = [null, '0-0.2', '0.3-0.5', '0.6-0.8', '0.9-1']
  const discSizes = ['Small', 'Medium', 'Large']
  const flagStates = [
    [false, false, false],
    [true, false, false],
    [false, true, false],
    [false, false, true],
    [true, true, false],
    [true, false, true],
    [false, true, true],
    [true, true, true]
  ]
  const visions = ['', '6/6', '6/12', '6/36', '6/60', 'HM']
  const riskFactorSets = [
    [],
    ['Age'],
    ['Race'],
    ['Family Hist'],
    ['Myopia'],
    ['Age', 'Race', 'Family Hist', 'Myopia', 'Diabetes/BP']
  ]
  let combinationCount = 0

  for (const iop of iopBands) {
    for (const palpation of palpationStates) {
      for (const cupDiscRatio of cupDiscRatios) {
        for (const discSize of discSizes) {
          for (const [thinRim, suspiciousFields, suspiciousPupils] of flagStates) {
            for (const vision of visions) {
              for (const riskFactors of riskFactorSets) {
                const outcome = calculateRiskOutcome({
                  iop,
                  palpation,
                  cupDiscRatio,
                  discSize,
                  thinRim,
                  suspiciousFields,
                  suspiciousPupils,
                  vision,
                  riskFactors
                })
                combinationCount += 1
                assert.ok(Number.isFinite(outcome.riskScore))
                assert.ok(outcome.rowNum === null || (outcome.rowNum >= 1 && outcome.rowNum <= 4))
                assert.ok(outcome.colNum === null || (outcome.colNum >= 1 && outcome.colNum <= 4))
                assert.ok(outcome.urgencyMessage.length > 0)
                if (!iop && palpation === 'rock') {
                  assert.equal(outcome.isRockAcuteWarning, true)
                }
              }
            }
          }
        }
      }
    }
  }
  assert.equal(combinationCount, 86400)
}

export { runRiskEngineTests }

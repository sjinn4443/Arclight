import assert from 'node:assert/strict'
import { buildGlaucomaReport } from '../src/report.js'

function runReportTests() {
  assert.equal(buildGlaucomaReport({}), '')

  const noEyeReport = buildGlaucomaReport({
    inputs: {
      eye: null,
      iop: '21-24',
      palpation: null,
      cupDiscRatio: '0.3-0.5',
      discSize: 'Medium',
      thinRim: false,
      suspiciousFields: false,
      suspiciousPupils: false,
      vision: '',
      riskFactors: []
    },
    outcome: {
      urgencyMessage: 'REVIEW: Check in 1 year',
      riskScore: 1,
      discSize: 'Medium'
    },
    date: new Date(2026, 6, 25)
  })

  assert.match(noEyeReport, /Glaucoma report - 25\/7\/2026/)
  assert.match(noEyeReport, /Eye: Not recorded/)
  assert.match(noEyeReport, /Pressure: Measured IOP 21-24 mmHg/)
  assert.match(noEyeReport, /Additional findings: None marked/)
  assert.match(noEyeReport, /Output: REVIEW: Check in 1 year/)
  assert.match(noEyeReport, /Teaching and triage support, not a diagnosis\./)

  const denseReport = buildGlaucomaReport({
    inputs: {
      eye: 'LE',
      iop: null,
      palpation: 'rock',
      cupDiscRatio: '0.9-1',
      discSize: 'Small',
      thinRim: true,
      suspiciousFields: true,
      suspiciousPupils: true,
      vision: 'HM',
      riskFactors: ['Age', 'Family Hist']
    },
    outcome: {
      urgencyMessage: 'EMERGENCY WARNING: Immediate specialist review.',
      riskScore: 8.9,
      discSize: 'Small'
    },
    date: new Date(2026, 6, 25)
  })

  assert.match(denseReport, /Eye: LE/)
  assert.match(denseReport, /Rock-hard by palpation \(emergency warning\)/)
  assert.match(denseReport, /Thin\/notched rim or related disc sign; Suspicious fields; Suspicious pupils/)
  assert.match(denseReport, /Risk factors: Age; Family Hist/)
}

export { runReportTests }

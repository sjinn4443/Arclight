import assert from 'node:assert/strict'
import { createQuestionnaireChangeHandler } from '../src/risk-calculator-controller.js'

function runControllerTests() {
  let clearCount = 0
  let calculationCount = 0
  const handler = createQuestionnaireChangeHandler({
    clearPalpationSelection: () => { clearCount += 1 },
    recalculateRisk: () => { calculationCount += 1 }
  })

  handler({ target: { name: 'iop', checked: true } })
  assert.equal(clearCount, 1)
  assert.equal(calculationCount, 1)

  handler({ target: { name: 'other_risk_factors', checked: true } })
  assert.equal(clearCount, 1)
  assert.equal(calculationCount, 2)
}

export { runControllerTests }

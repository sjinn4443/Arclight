import { runMcqEngineTests } from './mcq-engine.test.mjs'
import { runRiskEngineTests } from './risk-engine.test.mjs'
import { runContractTests } from './contracts.test.mjs'
import { runReportTests } from './report.test.mjs'
import { runControllerTests } from './controller.test.mjs'
import { runLogicRegressions } from './logic-regressions.test.mjs'

try {
  runRiskEngineTests()
  runLogicRegressions()
  runMcqEngineTests()
  runReportTests()
  runControllerTests()
  runContractTests()
  console.log('All tests passed.')
} catch (error) {
  console.error(error)
  process.exitCode = 1
}

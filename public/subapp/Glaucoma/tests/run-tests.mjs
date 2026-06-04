import { runMcqEngineTests } from './mcq-engine.test.mjs'
import { runRiskEngineTests } from './risk-engine.test.mjs'

try {
  runRiskEngineTests()
  runMcqEngineTests()
  console.log('All tests passed.')
} catch (error) {
  console.error(error)
  process.exitCode = 1
}

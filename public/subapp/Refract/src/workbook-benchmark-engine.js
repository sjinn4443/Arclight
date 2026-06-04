import { computePrescriptionCase as computeHeuristicPrescriptionCase } from "./prescription-engine.js";
import { findWorkbookCalibration } from "./workbook-calibration.js";

export function computeWorkbookBenchmarkCase(input) {
  const calibration = findWorkbookCalibration({
    age: input.age,
    health: input.context.health ? 1 : null,
    precise: input.context.precise ? 1 : 0,
    currentAdd: input.currentAdd,
    currentRightEye: input.currentRightEye,
    currentLeftEye: input.currentLeftEye,
    objectiveRightEye: input.objectiveRightEye,
    objectiveLeftEye: input.objectiveLeftEye,
  });

  if (calibration) {
    return calibration;
  }

  return computeHeuristicPrescriptionCase(input);
}

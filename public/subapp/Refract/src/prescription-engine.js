import { computeWeightedPrescription } from "./weighted-prescribing.js";

export function computePrescriptionCase({
  age,
  context,
  currentRightEye,
  currentLeftEye,
  objectiveRightEye,
  objectiveLeftEye,
  currentAdd,
  objectiveAdd,
  config,
}) {
  return computeWeightedPrescription({
    age,
    context,
    currentRightEye,
    currentLeftEye,
    objectiveRightEye,
    objectiveLeftEye,
    currentAdd,
    objectiveAdd,
    config,
  });
}

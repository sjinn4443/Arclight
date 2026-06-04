import { processEye, selectReadingAddition } from "./prescription-logic.js";

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
  const rightAccurate = context.rightAccurate ?? context.accurate;
  const leftAccurate = context.leftAccurate ?? context.accurate;

  return {
    rightEye: processEye(
      currentRightEye,
      objectiveRightEye,
      context.vaGood,
      context.precise,
      rightAccurate,
      config,
    ),
    leftEye: processEye(
      currentLeftEye,
      objectiveLeftEye,
      context.vaGood,
      context.precise,
      leftAccurate,
      config,
    ),
    readingAdd: selectReadingAddition(
      age,
      context.health,
      currentAdd,
      objectiveAdd,
      config,
    ),
  };
}

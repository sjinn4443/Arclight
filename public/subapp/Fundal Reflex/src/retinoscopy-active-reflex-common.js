export function getBeamLightState({
  centredBase,
  centredPower,
  centredRange = 210,
  centredScale,
  focusedRange,
  retStreakOffset,
}) {
  const localBeamDistance = Math.abs(retStreakOffset);
  const centredBeamFactor = Math.max(
    0,
    1 - Math.min(1, localBeamDistance / centredRange),
  );
  const localIlluminationFactor =
    centredBase + Math.pow(centredBeamFactor, centredPower) * centredScale;
  const focusedBeamBoost = Math.max(
    0,
    1 - Math.min(1, localBeamDistance / focusedRange),
  );

  return {
    focusedBeamBoost,
    localBeamDistance,
    localIlluminationFactor,
  };
}

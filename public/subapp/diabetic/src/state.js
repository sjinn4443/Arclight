import {
  AREA_OPTIONS,
  LESION_FINDING_KEYS,
  createEmptyFindings,
} from "./findings.js?v=20260518-findingdropdown";

function createEyeState() {
  return {
    distanceVA: "",
    viewQuality: "",
    areaSeen: "",
    findings: createEmptyFindings(),
  };
}

export function createInitialState() {
  return {
    mode: "arclight-do",
    dilation: "no",
    systemicChecks: {
      bp: false,
      lipids: false,
      hba1c: false,
    },
    eyes: {
      right: createEyeState(),
      left: createEyeState(),
    },
  };
}

export function setMode(state, mode) {
  state.mode = mode;
  Object.keys(state.eyes).forEach((eyeKey) => {
    const eye = state.eyes[eyeKey];
    if (!AREA_OPTIONS[mode].some((option) => option.value === eye.areaSeen)) {
      eye.areaSeen = "";
    }
  });
}

export function setDilation(state, value) {
  state.dilation = value;
}

export function setSystemicCheck(state, key, checked) {
  state.systemicChecks[key] = checked;
}

export function setDistanceVA(state, eyeKey, value) {
  state.eyes[eyeKey].distanceVA = value;
}

export function setEyeField(state, eyeKey, field, value) {
  state.eyes[eyeKey][field] = value;
}

export function setFinding(state, eyeKey, findingKey, checked) {
  const findings = state.eyes[eyeKey].findings;

  if (findingKey === "noReferableSignsSeen") {
    findings.noReferableSignsSeen = checked;
    if (checked) {
      LESION_FINDING_KEYS.forEach((key) => {
        findings[key] = false;
      });
    }
    return;
  }

  findings[findingKey] = checked;
  if (checked) {
    findings.noReferableSignsSeen = false;
  }
}

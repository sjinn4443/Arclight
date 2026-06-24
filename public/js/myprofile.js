import { fetchDictionary, get, getLanguage } from "./i18n.js";
import {
  PROFILE_UPDATED_EVENT,
  createProfileAvatarDataUrl,
  getAchievementBadges,
  getProfileInterests,
  getProfileName,
  getProfileRoles,
  humanizeStoredValue,
  readPracticeByRole,
  renderProfileAvatar,
  setProfileAvatarDataUrl,
  setProfileInterests,
} from "./profileData.js";

const INTEREST_LABEL_KEYS = Object.freeze({
  eyes: "onboarding.field_eyes",
  ears: "onboarding.field_ears",
  skin: "onboarding.field_skin",
  generalist: "onboarding.field_generalist",
});

const INTEREST_FALLBACKS = Object.freeze({
  eyes: "Eyes",
  ears: "Ears",
  skin: "Skin",
  generalist: "Generalist",
});

const ROLE_LABEL_KEYS = Object.freeze({
  ophthalmologist: "onboarding.job_ophthalmologist",
  optometrist: "onboarding.job_optometrist",
  ophthalmic_clinical_officer: "onboarding.job_ophthalmic_clinical_officer",
  ophthalmic_nurse: "onboarding.job_ophthalmic_nurse",
  orthoptist: "onboarding.job_orthoptist",
  general_practitioner: "onboarding.job_general_practitioner",
  clinical_officer: "onboarding.job_clinical_officer",
  primary_health_care_nurse: "onboarding.job_primary_health_care_nurse",
  community_health_worker: "onboarding.job_community_health_worker",
  village_health_worker: "onboarding.job_village_health_worker",
  lady_community_health_worker: "onboarding.job_lady_community_health_worker",
  health_extension_worker: "onboarding.job_health_extension_worker",
  medical_student: "onboarding.job_medical_student",
  eye_care_practitioner_other: "onboarding.job_eye_care_practitioner_other",
  ophthalmology_lecturer: "onboarding.job_ophthalmology_lecturer",
  optometry_lecturer: "onboarding.job_optometry_lecturer",
  eye_care_clinical_educator: "onboarding.job_eye_care_clinical_educator",
  consultant_teaching_role: "onboarding.job_consultant_teaching_role",
  programme_trainer_eye_health: "onboarding.job_programme_trainer_eye_health",
  school_teacher_vision_programmes:
    "onboarding.job_school_teacher_vision_programmes",
  ent_specialist: "onboarding.job_ent_specialist",
  audiologist: "onboarding.job_audiologist",
  ear_care_practitioner: "onboarding.job_ear_care_practitioner",
  dermatologist: "onboarding.job_dermatologist",
});

const ROLE_FALLBACKS = Object.freeze({
  ophthalmologist: "Ophthalmologist",
  optometrist: "Optometrist",
  ophthalmic_clinical_officer: "Ophthalmic Clinical Officer",
  ophthalmic_nurse: "Ophthalmic Nurse",
  orthoptist: "Orthoptist",
  general_practitioner: "General Practitioner",
  clinical_officer: "Clinical Officer",
  primary_health_care_nurse: "Primary Health Care Nurse",
  community_health_worker: "Community Health Worker",
  village_health_worker: "Village Health Worker",
  lady_community_health_worker: "Lady Community Health Worker",
  health_extension_worker: "Health Extension Worker",
  medical_student: "Medical Student",
  eye_care_practitioner_other: "Other Eye Care Practitioner",
  ophthalmology_lecturer: "Ophthalmology Lecturer",
  optometry_lecturer: "Optometry Lecturer",
  eye_care_clinical_educator: "Eye Care Clinical Educator",
  consultant_teaching_role: "Consultant (Teaching role)",
  programme_trainer_eye_health: "NGO / Programme Trainer (Eye Health)",
  school_teacher_vision_programmes: "School Teacher (Vision programmes)",
  ent_specialist: "ENT Specialist",
  audiologist: "Audiologist",
  ear_care_practitioner: "Ear Care Practitioner",
  dermatologist: "Dermatologist",
});

const STUDENT_EXPERIENCE_LABEL_KEYS = Object.freeze({
  lt1: "onboarding.experience_lt1",
  1: "onboarding.experience_1",
  2: "onboarding.experience_2",
  3: "onboarding.experience_3",
  4: "onboarding.experience_4",
  5: "onboarding.experience_5",
  6: "onboarding.experience_6",
  7: "onboarding.experience_7",
});

const STUDENT_EXPERIENCE_FALLBACKS = Object.freeze({
  lt1: "Pre-clinical",
  1: "Early Clinical",
  2: "Final Year / Senior Medical Student",
  3: "Observation",
  4: "Supervised Participation",
  5: "Elective / Internship",
  6: "Simulation Training",
  7: "Other",
});

const PRACTICE_RANGE_FALLBACKS = Object.freeze({
  "0-2": "0-2 years",
  "2-5": "2-5 years",
  "5-10": "5-10 years",
  "10+": "10+ years",
});

const NOT_SET_LABEL = "Not set";
const DEFAULT_NAME_LABEL = "Your name";

let renderSequence = 0;

async function createProfileTranslator() {
  const lang = getLanguage();
  const [dict, fallbackDict] = await Promise.all([
    fetchDictionary(lang),
    fetchDictionary("en"),
  ]);

  return (path, fallback) => {
    if (!path) return fallback;
    return String(get(dict, path) ?? get(fallbackDict, path) ?? fallback);
  };
}

function getMappedLabel(value, keyMap, fallbackMap, translate) {
  return translate(
    keyMap[value],
    fallbackMap[value] || humanizeStoredValue(value),
  );
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.textContent = value;
}

function updateInterestSelect(interests, translate) {
  const select = document.querySelector("[data-profile-interest]");
  if (!select) return;

  const current = interests[0] || "eyes";
  select.innerHTML = "";
  Object.keys(INTEREST_FALLBACKS).forEach((interest) => {
    const option = document.createElement("option");
    option.value = interest;
    option.selected = interest === current;
    option.textContent = getMappedLabel(
      interest,
      INTEREST_LABEL_KEYS,
      INTEREST_FALLBACKS,
      translate,
    );
    select.appendChild(option);
  });
  select.disabled = false;
  select.removeAttribute("aria-readonly");
  select.setAttribute("data-i18n-skip", "");
}

function buildScallopPoints(cx, cy, outerRadius, innerRadius, steps) {
  return Array.from({ length: steps * 2 }, (_, index) => {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / (steps * 2);
    return `${(cx + Math.cos(angle) * radius).toFixed(1)},${(
      cy +
      Math.sin(angle) * radius
    ).toFixed(1)}`;
  }).join(" ");
}

function createAchievementBadgeSvg(badge, index) {
  const svgNamespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNamespace, "svg");
  const safeId = String(badge.id || `badge-${index}`).replace(
    /[^a-zA-Z0-9_-]/g,
    "-",
  );
  const titleId = `achievementBadgeTitle-${safeId}-${index}`;
  const pathId = `achievementBadgeRing-${safeId}-${index}`;
  const ringText = `${badge.ringText || "MODULES COMPLETE"} \u2022 ${
    badge.ringText || "MODULES COMPLETE"
  } \u2022`;

  svg.classList.add("achievement-badge__svg");
  svg.setAttribute("viewBox", "0 0 160 160");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-labelledby", titleId);

  const title = document.createElementNS(svgNamespace, "title");
  title.id = titleId;
  title.textContent = badge.label;
  svg.appendChild(title);

  const defs = document.createElementNS(svgNamespace, "defs");
  const textPathGuide = document.createElementNS(svgNamespace, "path");
  textPathGuide.id = pathId;
  textPathGuide.setAttribute(
    "d",
    "M80 80 m -51 0 a 51 51 0 1 1 102 0 a 51 51 0 1 1 -102 0",
  );
  defs.appendChild(textPathGuide);
  svg.appendChild(defs);

  const scallop = document.createElementNS(svgNamespace, "polygon");
  scallop.classList.add("achievement-badge__svg-scallop");
  scallop.setAttribute("points", buildScallopPoints(80, 80, 74, 67, 32));
  svg.appendChild(scallop);

  [
    ["achievement-badge__svg-disc", 80, 80, 63],
    [
      "achievement-badge__svg-ring achievement-badge__svg-ring--outer",
      80,
      80,
      56,
    ],
    [
      "achievement-badge__svg-ring achievement-badge__svg-ring--middle",
      80,
      80,
      45,
    ],
    [
      "achievement-badge__svg-ring achievement-badge__svg-ring--inner",
      80,
      80,
      31,
    ],
  ].forEach(([className, cx, cy, radius]) => {
    const circle = document.createElementNS(svgNamespace, "circle");
    circle.setAttribute("class", className);
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", radius);
    svg.appendChild(circle);
  });

  const ring = document.createElementNS(svgNamespace, "text");
  ring.classList.add("achievement-badge__svg-ring-text");
  const ringPath = document.createElementNS(svgNamespace, "textPath");
  ringPath.setAttribute("href", `#${pathId}`);
  ringPath.setAttribute("startOffset", "50%");
  ringPath.setAttribute("text-anchor", "middle");
  ringPath.textContent = ringText;
  ring.appendChild(ringPath);
  svg.appendChild(ring);

  const number = document.createElementNS(svgNamespace, "text");
  number.classList.add("achievement-badge__svg-number");
  number.setAttribute("x", "80");
  number.setAttribute("y", "82");
  number.textContent = badge.title;
  svg.appendChild(number);

  return svg;
}

function renderAchievements() {
  const host = document.querySelector("#profileAchievements");
  if (!host) return;

  host.innerHTML = "";
  const badges = getAchievementBadges();
  if (!badges.length) {
    const empty = document.createElement("p");
    empty.className = "achievements-empty";
    empty.textContent = "Complete 10 modules to earn your first badge.";
    host.appendChild(empty);
    return;
  }

  badges.forEach((badge, index) => {
    const item = document.createElement("div");
    item.className = "achievement-tile achievement-badge";
    item.classList.add(`achievement-badge--${badge.theme || "red"}`);
    item.appendChild(createAchievementBadgeSvg(badge, index));
    host.appendChild(item);
  });
}

function formatExperience(roles, roleLabels, translate) {
  const studentYears = localStorage.getItem("studentYears") || "";
  const practiceByRole = readPracticeByRole();
  const lines = [];

  roles.forEach((role, index) => {
    if (role === "medical_student") {
      if (!studentYears) return;
      lines.push(
        `${roleLabels[index]}: ${getMappedLabel(
          studentYears,
          STUDENT_EXPERIENCE_LABEL_KEYS,
          STUDENT_EXPERIENCE_FALLBACKS,
          translate,
        )}`,
      );
      return;
    }

    const range = practiceByRole[role]?.range || "";
    if (!range) return;
    lines.push(
      `${roleLabels[index]}: ${PRACTICE_RANGE_FALLBACKS[range] || range}`,
    );
  });

  return lines;
}

async function renderMyProfile() {
  const currentRender = ++renderSequence;
  const translate = await createProfileTranslator();
  if (currentRender !== renderSequence) return;

  const name = getProfileName();
  const interests = getProfileInterests();
  const roles = getProfileRoles();
  const roleLabels = roles.map((role) =>
    getMappedLabel(role, ROLE_LABEL_KEYS, ROLE_FALLBACKS, translate),
  );
  const notSet = NOT_SET_LABEL;

  setText("#profileName", name || DEFAULT_NAME_LABEL);
  setText("#profileRole", roleLabels.length ? roleLabels.join(", ") : notSet);
  setText("#profileRoles", roleLabels.length ? roleLabels.join(", ") : notSet);
  setText(
    "#profileExperience",
    formatExperience(roles, roleLabels, translate).join("\n") || notSet,
  );

  updateInterestSelect(interests, translate);
  renderProfileAvatar(document.querySelector("#profileAvatar"));
  renderAchievements();
}

function wireAvatarEditor() {
  const input = document.querySelector("#profileAvatarInput");
  const button = document.querySelector("#profileAvatarEditBtn");
  if (!input || !button || button.dataset.profileAvatarWired === "1") return;

  button.dataset.profileAvatarWired = "1";
  button.addEventListener("click", () => input.click());
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;

    try {
      const dataUrl = await createProfileAvatarDataUrl(file);
      setProfileAvatarDataUrl(dataUrl);
      renderProfileAvatar(document.querySelector("#profileAvatar"));
    } catch (error) {
      console.warn("[myprofile] avatar update failed", error);
    }
  });
}

function wireInterestSelect() {
  const select = document.querySelector("[data-profile-interest]");
  if (!select || select.dataset.profileInterestWired === "1") return;
  select.dataset.profileInterestWired = "1";
  select.addEventListener("change", () => {
    setProfileInterests([select.value]);
    void renderMyProfile();
  });
}

export function initializeMyProfile() {
  void renderMyProfile();
  wireAvatarEditor();
  wireInterestSelect();

  if (window.__myProfileLanguageListenerBound) return;
  window.__myProfileLanguageListenerBound = true;

  window.addEventListener("i18n:languageChanged", () => {
    if (document.getElementById("myProfilePage")) void renderMyProfile();
  });
  document.addEventListener("language:updated", () => {
    if (document.getElementById("myProfilePage")) void renderMyProfile();
  });
  document.addEventListener(PROFILE_UPDATED_EVENT, () => {
    if (document.getElementById("myProfilePage")) void renderMyProfile();
  });
}

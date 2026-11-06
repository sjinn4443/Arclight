import { fetchDictionary, get, getLanguage } from "./i18n.js";
import {
  PROFILE_UPDATED_EVENT,
  getAchievementBadges,
  getCompletedModuleRecords,
  getProfileInterests,
  getProfileName,
  getProfileRoles,
  humanizeStoredValue,
  readPracticeByRole,
  renderProfileAvatar,
} from "./profileData.js";
import { openProfileEditor } from "./editProfile.js";

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
  other: "onboardingFlow.other",
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
  other: "Other",
});

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

function renderProfileCardDetails(interests, roles, roleLabels, translate) {
  const notAdded = translate("profileLayout.not_added", "Not added yet");
  const setDetail = (selector, value) => {
    setText(selector, value || notAdded);
    document.querySelector(selector)?.toggleAttribute("data-empty", !value);
  };
  setDetail("#profileInterests", interests.join(" · "));

  let experience = {};
  try {
    const stored = JSON.parse(
      localStorage.getItem("arclightExperience") || "{}",
    );
    if (stored && typeof stored === "object" && !Array.isArray(stored))
      experience = stored;
  } catch {
    // Older profiles may have no Arclight experience answers.
  }
  const frequencies = {
    occasionally: ["interest.chip_learning_to_use", "Occasionally"],
    regularly: ["interest.chip_use_regularly", "Regularly"],
    rarely: ["interest.chip_teaching_others2", "Rarely"],
    no_device: ["interest.chip_no_device", "No device"],
  };
  const frequency = Object.hasOwn(frequencies, experience.frequency)
    ? frequencies[experience.frequency]
    : null;
  setDetail("#profileDeviceUse", frequency ? translate(...frequency) : "");
  const purposes = new Set(
    Array.isArray(experience.purposes) ? experience.purposes : [],
  );
  setDetail(
    "#profilePurposes",
    [
      purposes.has("studying")
        ? translate("interest.chip_for_my_studies", "Studying")
        : "",
      purposes.has("teaching")
        ? translate("interest.chip_teaching_others", "Teaching")
        : "",
    ]
      .filter(Boolean)
      .join(" · "),
  );

  const practice = readPracticeByRole();
  const studentYears = localStorage.getItem("studentYears") || "";
  const studentLabels = {
    lt1: "Pre-clinical",
    1: "Early Clinical",
    2: "Final Year / Senior Medical Student",
    3: "Observation",
    4: "Supervised Participation",
    5: "Elective / Internship",
    6: "Simulation Training",
    7: "Other",
  };
  const clinicalExperience = roles
    .map((role, index) => {
      let label = "";
      if (
        role === "medical_student" &&
        Object.hasOwn(studentLabels, studentYears)
      ) {
        label = translate(
          `onboarding.experience_${studentYears}`,
          studentLabels[studentYears],
        );
      } else if (role !== "medical_student" && practice[role]?.range) {
        label = translate("profileLayout.years", "{range} years").replace(
          "{range}",
          practice[role].range,
        );
      }
      return (
        label && (roles.length > 1 ? `${roleLabels[index]}: ${label}` : label)
      );
    })
    .filter(Boolean)
    .join("\n");
  setText("#profileClinicalExperience", clinicalExperience);
  document
    .getElementById("profileClinicalExperienceRow")
    ?.toggleAttribute("hidden", !clinicalExperience);
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

function renderAchievements(translate) {
  const host = document.querySelector("#profileAchievements");
  if (!host) return;

  host.innerHTML = "";
  const badges = getAchievementBadges();
  setText("#profileCompletedCount", getCompletedModuleRecords().length);
  setText("#profileStampCount", badges.length);
  if (!badges.length) {
    [10, 20, 30].forEach((milestone, index) => {
      const item = document.createElement("div");
      item.className =
        "achievement-tile achievement-badge achievement-badge--locked";
      const label = translate(
        "myprofile.badge_locked",
        "Not yet earned: complete {count} modules",
      ).replace("{count}", milestone);
      item.appendChild(
        createAchievementBadgeSvg(
          {
            id: `preview-${milestone}`,
            title: String(milestone),
            label,
            ringText: translate(
              "myprofile.modules_complete",
              "MODULES COMPLETE",
            ),
          },
          index,
        ),
      );
      const caption = document.createElement("span");
      caption.className = "achievement-badge__caption";
      caption.textContent = translate(
        "myprofile.badge_goal",
        "Complete {count} modules",
      ).replace("{count}", milestone);
      item.appendChild(caption);
      host.appendChild(item);
    });
    const empty = document.createElement("p");
    empty.className = "achievements-empty";
    empty.textContent = translate(
      "myprofile.badge_progress",
      "{count} of 10 modules complete. Earn your first stamp at 10!",
    ).replace("{count}", getCompletedModuleRecords().length);
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
  setText("#profileName", name || DEFAULT_NAME_LABEL);
  setText(
    "#profileRole",
    roleLabels.join(", ") ||
      translate("profileLayout.role_not_added", "Role not added"),
  );
  document.querySelector("#profileRole")?.removeAttribute("hidden");
  const interestLabels = interests.map((interest) =>
    getMappedLabel(
      interest,
      INTEREST_LABEL_KEYS,
      INTEREST_FALLBACKS,
      translate,
    ),
  );
  renderProfileCardDetails(interestLabels, roles, roleLabels, translate);
  renderProfileAvatar(document.querySelector("#profileAvatar"));
  renderAchievements(translate);
  document.dispatchEvent(new CustomEvent("arclight:account-ui-ready"));
}

export function initializeMyProfile() {
  void renderMyProfile();
  const button = document.getElementById("profileEditBtn");
  if (button && !button.dataset.bound) {
    button.dataset.bound = "true";
    button.addEventListener("click", async () => {
      button.disabled = true;
      const error = document.getElementById("profileEditError");
      if (error) error.hidden = true;
      try {
        await openProfileEditor(button);
      } catch (failure) {
        console.warn("[myprofile] could not open editor", failure);
        const translate = await createProfileTranslator();
        if (error?.isConnected) {
          error.textContent = translate(
            "profileLayout.editor_error",
            "Could not open profile editing. Please try again.",
          );
          error.hidden = false;
        }
      } finally {
        button.disabled = false;
      }
    });
    button.disabled = false;
  }

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

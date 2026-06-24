import { fetchDictionary, get, getLanguage } from "./i18n.js";
import { loadPage } from "./navigation.js";
import {
  createProfileAvatarDataUrl,
  getProfileInterests,
  getProfileName,
  getProfileRoles,
  readPracticeByRole,
  renderProfileAvatar,
  setProfileAvatarDataUrl,
  setProfileInterests,
  setProfileName,
  setProfileRoles,
  writePracticeByRole,
} from "./profileData.js";

const INTERESTS = Object.freeze([
  { value: "eyes", key: "onboarding.field_eyes", label: "Eyes" },
  { value: "ears", key: "onboarding.field_ears", label: "Ears" },
  { value: "skin", key: "onboarding.field_skin", label: "Skin" },
  {
    value: "generalist",
    key: "onboarding.field_generalist",
    label: "Generalist",
  },
]);

const ROLES = Object.freeze([
  {
    value: "ophthalmologist",
    key: "onboarding.job_ophthalmologist",
    label: "Ophthalmologist",
  },
  {
    value: "optometrist",
    key: "onboarding.job_optometrist",
    label: "Optometrist",
  },
  {
    value: "ophthalmic_clinical_officer",
    key: "onboarding.job_ophthalmic_clinical_officer",
    label: "Ophthalmic Clinical Officer",
  },
  {
    value: "ophthalmic_nurse",
    key: "onboarding.job_ophthalmic_nurse",
    label: "Ophthalmic Nurse",
  },
  {
    value: "orthoptist",
    key: "onboarding.job_orthoptist",
    label: "Orthoptist",
  },
  {
    value: "general_practitioner",
    key: "onboarding.job_general_practitioner",
    label: "General Practitioner",
  },
  {
    value: "clinical_officer",
    key: "onboarding.job_clinical_officer",
    label: "Clinical Officer",
  },
  {
    value: "primary_health_care_nurse",
    key: "onboarding.job_primary_health_care_nurse",
    label: "Primary Health Care Nurse",
  },
  {
    value: "community_health_worker",
    key: "onboarding.job_community_health_worker",
    label: "Community Health Worker",
  },
  {
    value: "village_health_worker",
    key: "onboarding.job_village_health_worker",
    label: "Village Health Worker",
  },
  {
    value: "lady_community_health_worker",
    key: "onboarding.job_lady_community_health_worker",
    label: "Lady Community Health Worker",
  },
  {
    value: "health_extension_worker",
    key: "onboarding.job_health_extension_worker",
    label: "Health Extension Worker",
  },
  {
    value: "medical_student",
    key: "onboarding.job_medical_student",
    label: "Medical Student",
  },
  {
    value: "eye_care_practitioner_other",
    key: "onboarding.job_eye_care_practitioner_other",
    label: "Other Eye Care Practitioner",
  },
  {
    value: "ophthalmology_lecturer",
    key: "onboarding.job_ophthalmology_lecturer",
    label: "Ophthalmology Lecturer",
  },
  {
    value: "optometry_lecturer",
    key: "onboarding.job_optometry_lecturer",
    label: "Optometry Lecturer",
  },
  {
    value: "eye_care_clinical_educator",
    key: "onboarding.job_eye_care_clinical_educator",
    label: "Eye Care Clinical Educator",
  },
  {
    value: "consultant_teaching_role",
    key: "onboarding.job_consultant_teaching_role",
    label: "Consultant (Teaching role)",
  },
  {
    value: "programme_trainer_eye_health",
    key: "onboarding.job_programme_trainer_eye_health",
    label: "NGO / Programme Trainer (Eye Health)",
  },
  {
    value: "school_teacher_vision_programmes",
    key: "onboarding.job_school_teacher_vision_programmes",
    label: "School Teacher (Vision programmes)",
  },
  {
    value: "ent_specialist",
    key: "onboarding.job_ent_specialist",
    label: "ENT Specialist",
  },
  {
    value: "audiologist",
    key: "onboarding.job_audiologist",
    label: "Audiologist",
  },
  {
    value: "ear_care_practitioner",
    key: "onboarding.job_ear_care_practitioner",
    label: "Ear Care Practitioner",
  },
  {
    value: "dermatologist",
    key: "onboarding.job_dermatologist",
    label: "Dermatologist",
  },
]);

const STUDENT_EXPERIENCE = Object.freeze([
  { value: "lt1", key: "onboarding.experience_lt1", label: "Pre-clinical" },
  { value: "1", key: "onboarding.experience_1", label: "Early Clinical" },
  {
    value: "2",
    key: "onboarding.experience_2",
    label: "Final Year / Senior Medical Student",
  },
  { value: "3", key: "onboarding.experience_3", label: "Observation" },
  {
    value: "4",
    key: "onboarding.experience_4",
    label: "Supervised Participation",
  },
  {
    value: "5",
    key: "onboarding.experience_5",
    label: "Elective / Internship",
  },
  { value: "6", key: "onboarding.experience_6", label: "Simulation Training" },
  { value: "7", key: "onboarding.experience_7", label: "Other" },
]);

const PRACTICE_RANGES = Object.freeze(["0-2", "2-5", "5-10", "10+"]);

async function createTranslator() {
  const lang = getLanguage();
  const [dict, fallbackDict] = await Promise.all([
    fetchDictionary(lang),
    fetchDictionary("en"),
  ]);
  return (path, fallback) =>
    String(get(dict, path) ?? get(fallbackDict, path) ?? fallback);
}

function selectedValues(select) {
  return Array.from(select?.selectedOptions || [])
    .map((option) => option.value)
    .filter(Boolean);
}

function renderInterestChips(translate) {
  const host = document.getElementById("editProfileInterests");
  if (!host) return;
  const current = new Set(getProfileInterests());
  host.innerHTML = "";

  INTERESTS.forEach((interest) => {
    const label = document.createElement("label");
    label.className = "profile-edit-chip";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = interest.value;
    input.checked = current.has(interest.value);

    const span = document.createElement("span");
    span.textContent = translate(interest.key, interest.label);

    label.append(input, span);
    host.appendChild(label);
  });
}

function renderRoles(translate) {
  const select = document.getElementById("editProfileRoles");
  if (!select) return;
  const current = new Set(getProfileRoles());
  select.innerHTML = "";

  ROLES.forEach((role) => {
    const option = document.createElement("option");
    option.value = role.value;
    option.textContent = translate(role.key, role.label);
    option.selected = current.has(role.value);
    select.appendChild(option);
  });
}

function createSelect(options, value, translate) {
  const select = document.createElement("select");
  select.className = "profile-edit-inline-select";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = translate(
    "onboarding.experience_placeholder",
    "Select",
  );
  select.appendChild(placeholder);

  options.forEach((optionDef) => {
    const option = document.createElement("option");
    option.value = optionDef.value || optionDef;
    option.textContent = optionDef.key
      ? translate(optionDef.key, optionDef.label)
      : `${optionDef} years`;
    option.selected = option.value === value;
    select.appendChild(option);
  });

  return select;
}

function renderExperienceFields(translate) {
  const host = document.getElementById("editProfileExperience");
  const roleSelect = document.getElementById("editProfileRoles");
  if (!host || !roleSelect) return;

  const roles = selectedValues(roleSelect);
  const practiceByRole = readPracticeByRole();
  const currentStudentYears = localStorage.getItem("studentYears") || "";
  host.innerHTML = "";

  if (!roles.length) return;

  const title = document.createElement("h3");
  title.textContent = translate("onboarding.experience_label", "Experience");
  host.appendChild(title);

  if (roles.includes("medical_student")) {
    const row = document.createElement("label");
    row.className = "profile-edit-experience-row";
    row.textContent = translate(
      "onboarding.job_medical_student",
      "Medical Student",
    );
    const select = createSelect(
      STUDENT_EXPERIENCE,
      currentStudentYears,
      translate,
    );
    select.id = "editProfileStudentYears";
    row.appendChild(select);
    host.appendChild(row);
  }

  roles
    .filter((role) => role !== "medical_student")
    .forEach((role) => {
      const row = document.createElement("label");
      row.className = "profile-edit-experience-row";
      row.dataset.role = role;
      const label = ROLES.find((item) => item.value === role);
      row.append(
        document.createTextNode(
          label ? translate(label.key, label.label) : role,
        ),
      );
      const select = createSelect(
        PRACTICE_RANGES,
        practiceByRole[role]?.range || "",
        translate,
      );
      select.dataset.role = role;
      row.appendChild(select);
      host.appendChild(row);
    });
}

function saveProfileEdits() {
  const nameInput = document.getElementById("editProfileName");
  const roleSelect = document.getElementById("editProfileRoles");
  const interests = Array.from(
    document.querySelectorAll("#editProfileInterests input:checked"),
  ).map((input) => input.value);
  const roles = selectedValues(roleSelect);

  setProfileName(nameInput?.value || "");
  setProfileInterests(interests);
  setProfileRoles(roles);

  const studentSelect = document.getElementById("editProfileStudentYears");
  if (roles.includes("medical_student") && studentSelect?.value) {
    localStorage.setItem("studentYears", studentSelect.value);
  } else {
    localStorage.removeItem("studentYears");
  }

  const practiceByRole = {};
  document
    .querySelectorAll("#editProfileExperience select[data-role]")
    .forEach((select) => {
      if (select.value)
        practiceByRole[select.dataset.role] = { range: select.value };
    });
  writePracticeByRole(practiceByRole);
}

function wireAvatar() {
  const input = document.getElementById("editProfileAvatarInput");
  const button = document.getElementById("editProfileAvatarBtn");
  button?.addEventListener("click", () => input?.click());
  input?.addEventListener("change", async () => {
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    try {
      setProfileAvatarDataUrl(await createProfileAvatarDataUrl(file));
      renderProfileAvatar(document.getElementById("editProfileAvatar"));
    } catch (error) {
      console.warn("[editProfile] avatar update failed", error);
    }
  });
}

export async function initializeEditProfile() {
  const translate = await createTranslator();
  const nameInput = document.getElementById("editProfileName");
  const roleSelect = document.getElementById("editProfileRoles");
  const form = document.getElementById("editProfileForm");
  const cancel = document.getElementById("editProfileCancel");

  if (nameInput) nameInput.value = getProfileName();
  renderProfileAvatar(document.getElementById("editProfileAvatar"));
  renderInterestChips(translate);
  renderRoles(translate);
  renderExperienceFields(translate);
  wireAvatar();

  roleSelect?.addEventListener("change", () =>
    renderExperienceFields(translate),
  );
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    saveProfileEdits();
    loadPage("myprofile", { replace: true });
  });
  cancel?.addEventListener("click", () =>
    loadPage("myprofile", { replace: true }),
  );
}

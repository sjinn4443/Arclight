import { s as b } from "./chunk-C3DWFWW5.js";
import {
  d as y,
  e as g,
  f as h,
  g as f,
  i as v,
  j as k,
  k as E,
  l as P,
  m as C,
  n as m,
  p as S,
} from "./chunk-P2HPNKQY.js";
import { a as s, b as p, c as u } from "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
var O = Object.freeze([
    { value: "eyes", key: "onboarding.field_eyes", label: "Eyes" },
    { value: "ears", key: "onboarding.field_ears", label: "Ears" },
    { value: "skin", key: "onboarding.field_skin", label: "Skin" },
    {
      value: "generalist",
      key: "onboarding.field_generalist",
      label: "Generalist",
    },
  ]),
  x = Object.freeze([
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
  ]),
  N = Object.freeze([
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
    {
      value: "6",
      key: "onboarding.experience_6",
      label: "Simulation Training",
    },
    { value: "7", key: "onboarding.experience_7", label: "Other" },
  ]),
  R = Object.freeze(["0-2", "2-5", "5-10", "10+"]);
async function A() {
  let t = p(),
    [l, o] = await Promise.all([u(t), u("en")]);
  return (e, a) => String(s(l, e) ?? s(o, e) ?? a);
}
function B(t) {
  return Array.from(t?.selectedOptions || [])
    .map((l) => l.value)
    .filter(Boolean);
}
function T(t) {
  let l = document.getElementById("editProfileInterests");
  if (!l) return;
  let o = new Set(h());
  ((l.innerHTML = ""),
    O.forEach((e) => {
      let a = document.createElement("label");
      a.className = "profile-edit-chip";
      let n = document.createElement("input");
      ((n.type = "checkbox"),
        (n.value = e.value),
        (n.checked = o.has(e.value)));
      let r = document.createElement("span");
      ((r.textContent = t(e.key, e.label)), a.append(n, r), l.appendChild(a));
    }));
}
function L(t) {
  let l = document.getElementById("editProfileRoles");
  if (!l) return;
  let o = new Set(v());
  ((l.innerHTML = ""),
    x.forEach((e) => {
      let a = document.createElement("option");
      ((a.value = e.value),
        (a.textContent = t(e.key, e.label)),
        (a.selected = o.has(e.value)),
        l.appendChild(a));
    }));
}
function I(t, l, o) {
  let e = document.createElement("select");
  e.className = "profile-edit-inline-select";
  let a = document.createElement("option");
  return (
    (a.value = ""),
    (a.textContent = o("onboarding.experience_placeholder", "Select")),
    e.appendChild(a),
    t.forEach((n) => {
      let r = document.createElement("option");
      ((r.value = n.value || n),
        (r.textContent = n.key ? o(n.key, n.label) : `${n} years`),
        (r.selected = r.value === l),
        e.appendChild(r));
    }),
    e
  );
}
function j(t) {
  let l = document.getElementById("editProfileExperience"),
    o = document.getElementById("editProfileRoles");
  if (!l || !o) return;
  let e = B(o),
    a = E(),
    n = localStorage.getItem("studentYears") || "";
  if (((l.innerHTML = ""), !e.length)) return;
  let r = document.createElement("h3");
  if (
    ((r.textContent = t("onboarding.experience_label", "Experience")),
    l.appendChild(r),
    e.includes("medical_student"))
  ) {
    let i = document.createElement("label");
    ((i.className = "profile-edit-experience-row"),
      (i.textContent = t("onboarding.job_medical_student", "Medical Student")));
    let c = I(N, n, t);
    ((c.id = "editProfileStudentYears"), i.appendChild(c), l.appendChild(i));
  }
  e.filter((i) => i !== "medical_student").forEach((i) => {
    let c = document.createElement("label");
    ((c.className = "profile-edit-experience-row"), (c.dataset.role = i));
    let d = x.find((w) => w.value === i);
    c.append(document.createTextNode(d ? t(d.key, d.label) : i));
    let _ = I(R, a[i]?.range || "", t);
    ((_.dataset.role = i), c.appendChild(_), l.appendChild(c));
  });
}
function H() {
  let t = document.getElementById("editProfileName"),
    l = document.getElementById("editProfileRoles"),
    o = Array.from(
      document.querySelectorAll("#editProfileInterests input:checked"),
    ).map((r) => r.value),
    e = B(l);
  (g(t?.value || ""), f(o), k(e));
  let a = document.getElementById("editProfileStudentYears");
  e.includes("medical_student") && a?.value
    ? localStorage.setItem("studentYears", a.value)
    : localStorage.removeItem("studentYears");
  let n = {};
  (document
    .querySelectorAll("#editProfileExperience select[data-role]")
    .forEach((r) => {
      r.value && (n[r.dataset.role] = { range: r.value });
    }),
    P(n));
}
function Y() {
  let t = document.getElementById("editProfileAvatarInput");
  (document
    .getElementById("editProfileAvatarBtn")
    ?.addEventListener("click", () => t?.click()),
    t?.addEventListener("change", async () => {
      let o = t.files?.[0];
      if (((t.value = ""), !!o))
        try {
          (C(await S(o)), m(document.getElementById("editProfileAvatar")));
        } catch (e) {
          console.warn("[editProfile] avatar update failed", e);
        }
    }));
}
async function W() {
  let t = await A(),
    l = document.getElementById("editProfileName"),
    o = document.getElementById("editProfileRoles"),
    e = document.getElementById("editProfileForm"),
    a = document.getElementById("editProfileCancel");
  (l && (l.value = y()),
    m(document.getElementById("editProfileAvatar")),
    T(t),
    L(t),
    j(t),
    Y(),
    o?.addEventListener("change", () => j(t)),
    e?.addEventListener("submit", (n) => {
      (n.preventDefault(), H(), b("myprofile", { replace: !0 }));
    }),
    a?.addEventListener("click", () => b("myprofile", { replace: !0 })));
}
export { W as initializeEditProfile };

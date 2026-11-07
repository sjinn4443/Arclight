import {
  a as S,
  c as L,
  d as C,
  f as P,
  g as j,
  i as x,
  k as O,
  m as w,
  n as y,
  p as N,
  q as T,
} from "./chunk-P2HPNKQY.js";
import { a as f, b as A, c as b } from "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
var D = Object.freeze({
    eyes: "onboarding.field_eyes",
    ears: "onboarding.field_ears",
    skin: "onboarding.field_skin",
    generalist: "onboarding.field_generalist",
  }),
  k = Object.freeze({
    eyes: "Eyes",
    ears: "Ears",
    skin: "Skin",
    generalist: "Generalist",
  }),
  z = Object.freeze({
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
  }),
  q = Object.freeze({
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
  }),
  F = Object.freeze({
    lt1: "onboarding.experience_lt1",
    1: "onboarding.experience_1",
    2: "onboarding.experience_2",
    3: "onboarding.experience_3",
    4: "onboarding.experience_4",
    5: "onboarding.experience_5",
    6: "onboarding.experience_6",
    7: "onboarding.experience_7",
  }),
  U = Object.freeze({
    lt1: "Pre-clinical",
    1: "Early Clinical",
    2: "Final Year / Senior Medical Student",
    3: "Observation",
    4: "Supervised Participation",
    5: "Elective / Internship",
    6: "Simulation Training",
    7: "Other",
  }),
  H = Object.freeze({
    "0-2": "0-2 years",
    "2-5": "2-5 years",
    "5-10": "5-10 years",
    "10+": "10+ years",
  }),
  W = "Not set",
  K = "Your name",
  I = 0;
async function Y() {
  let t = A(),
    [n, e] = await Promise.all([b(t), b("en")]);
  return (r, o) => (r ? String(f(n, r) ?? f(e, r) ?? o) : o);
}
function E(t, n, e, r) {
  return r(n[t], e[t] || L(t));
}
function g(t, n) {
  let e = document.querySelector(t);
  e && (e.textContent = n);
}
function G(t, n) {
  let e = document.querySelector("[data-profile-interest]");
  if (!e) return;
  let r = t[0] || "eyes";
  ((e.innerHTML = ""),
    Object.keys(k).forEach((o) => {
      let i = document.createElement("option");
      ((i.value = o),
        (i.selected = o === r),
        (i.textContent = E(o, D, k, n)),
        e.appendChild(i));
    }),
    (e.disabled = !1),
    e.removeAttribute("aria-readonly"),
    e.setAttribute("data-i18n-skip", ""));
}
function V(t, n, e, r, o) {
  return Array.from({ length: o * 2 }, (i, a) => {
    let l = a % 2 === 0 ? e : r,
      c = -Math.PI / 2 + (Math.PI * 2 * a) / (o * 2);
    return `${(t + Math.cos(c) * l).toFixed(1)},${(n + Math.sin(c) * l).toFixed(1)}`;
  }).join(" ");
}
function X(t, n) {
  let e = "http://www.w3.org/2000/svg",
    r = document.createElementNS(e, "svg"),
    o = String(t.id || `badge-${n}`).replace(/[^a-zA-Z0-9_-]/g, "-"),
    i = `achievementBadgeTitle-${o}-${n}`,
    a = `achievementBadgeRing-${o}-${n}`,
    l = `${t.ringText || "MODULES COMPLETE"} \u2022 ${t.ringText || "MODULES COMPLETE"} \u2022`;
  (r.classList.add("achievement-badge__svg"),
    r.setAttribute("viewBox", "0 0 160 160"),
    r.setAttribute("role", "img"),
    r.setAttribute("aria-labelledby", i));
  let c = document.createElementNS(e, "title");
  ((c.id = i), (c.textContent = t.label), r.appendChild(c));
  let v = document.createElementNS(e, "defs"),
    u = document.createElementNS(e, "path");
  ((u.id = a),
    u.setAttribute(
      "d",
      "M80 80 m -51 0 a 51 51 0 1 1 102 0 a 51 51 0 1 1 -102 0",
    ),
    v.appendChild(u),
    r.appendChild(v));
  let h = document.createElementNS(e, "polygon");
  (h.classList.add("achievement-badge__svg-scallop"),
    h.setAttribute("points", V(80, 80, 74, 67, 32)),
    r.appendChild(h),
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
    ].forEach(([B, M, R, $]) => {
      let _ = document.createElementNS(e, "circle");
      (_.setAttribute("class", B),
        _.setAttribute("cx", M),
        _.setAttribute("cy", R),
        _.setAttribute("r", $),
        r.appendChild(_));
    }));
  let p = document.createElementNS(e, "text");
  p.classList.add("achievement-badge__svg-ring-text");
  let s = document.createElementNS(e, "textPath");
  (s.setAttribute("href", `#${a}`),
    s.setAttribute("startOffset", "50%"),
    s.setAttribute("text-anchor", "middle"),
    (s.textContent = l),
    p.appendChild(s),
    r.appendChild(p));
  let d = document.createElementNS(e, "text");
  return (
    d.classList.add("achievement-badge__svg-number"),
    d.setAttribute("x", "80"),
    d.setAttribute("y", "82"),
    (d.textContent = t.title),
    r.appendChild(d),
    r
  );
}
function Z() {
  let t = document.querySelector("#profileAchievements");
  if (!t) return;
  t.innerHTML = "";
  let n = T();
  if (!n.length) {
    let e = document.createElement("p");
    ((e.className = "achievements-empty"),
      (e.textContent = "Complete 10 modules to earn your first badge."),
      t.appendChild(e));
    return;
  }
  n.forEach((e, r) => {
    let o = document.createElement("div");
    ((o.className = "achievement-tile achievement-badge"),
      o.classList.add(`achievement-badge--${e.theme || "red"}`),
      o.appendChild(X(e, r)),
      t.appendChild(o));
  });
}
function J(t, n, e) {
  let r = localStorage.getItem("studentYears") || "",
    o = O(),
    i = [];
  return (
    t.forEach((a, l) => {
      if (a === "medical_student") {
        if (!r) return;
        i.push(`${n[l]}: ${E(r, F, U, e)}`);
        return;
      }
      let c = o[a]?.range || "";
      c && i.push(`${n[l]}: ${H[c] || c}`);
    }),
    i
  );
}
async function m() {
  let t = ++I,
    n = await Y();
  if (t !== I) return;
  let e = C(),
    r = P(),
    o = x(),
    i = o.map((l) => E(l, z, q, n)),
    a = W;
  (g("#profileName", e || K),
    g("#profileRole", i.length ? i.join(", ") : a),
    g("#profileRoles", i.length ? i.join(", ") : a),
    g(
      "#profileExperience",
      J(o, i, n).join(`
`) || a,
    ),
    G(r, n),
    y(document.querySelector("#profileAvatar")),
    Z());
}
function Q() {
  let t = document.querySelector("#profileAvatarInput"),
    n = document.querySelector("#profileAvatarEditBtn");
  !t ||
    !n ||
    n.dataset.profileAvatarWired === "1" ||
    ((n.dataset.profileAvatarWired = "1"),
    n.addEventListener("click", () => t.click()),
    t.addEventListener("change", async () => {
      let e = t.files?.[0];
      if (((t.value = ""), !!e))
        try {
          let r = await N(e);
          (w(r), y(document.querySelector("#profileAvatar")));
        } catch (r) {
          console.warn("[myprofile] avatar update failed", r);
        }
    }));
}
function ee() {
  let t = document.querySelector("[data-profile-interest]");
  !t ||
    t.dataset.profileInterestWired === "1" ||
    ((t.dataset.profileInterestWired = "1"),
    t.addEventListener("change", () => {
      (j([t.value]), m());
    }));
}
function ne() {
  (m(),
    Q(),
    ee(),
    !window.__myProfileLanguageListenerBound &&
      ((window.__myProfileLanguageListenerBound = !0),
      window.addEventListener("i18n:languageChanged", () => {
        document.getElementById("myProfilePage") && m();
      }),
      document.addEventListener("language:updated", () => {
        document.getElementById("myProfilePage") && m();
      }),
      document.addEventListener(S, () => {
        document.getElementById("myProfilePage") && m();
      })));
}
export { ne as initializeMyProfile };

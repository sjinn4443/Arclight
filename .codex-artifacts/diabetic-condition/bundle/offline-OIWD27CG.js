import { c as d, j as c } from "./chunk-5EBOJBSE.js";
import "./chunk-EMS3ZYZ5.js";
import "./chunk-UEXRDOY7.js";
import "./chunk-W6GCFL5V.js";
import "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
function a(e, n = !1) {
  let t = document.getElementById("offlineDownloadStatus");
  (t ||
    ((t = document.createElement("p")),
    (t.id = "offlineDownloadStatus"),
    document.querySelector("#offlineContentModal .modal-content")?.append(t)),
    t.setAttribute("role", n ? "alert" : "status"),
    (t.textContent = p(e)));
}
function E() {
  (y(), f());
}
function f() {
  let e = document.getElementById("offlineContentModal");
  e && (e.style.display = "flex");
}
function m() {
  let e = document.getElementById("offlineContentModal");
  e && (e.style.display = "none");
}
function p(e, n = e) {
  return window.I18N?.translateLiteral?.(e, n) || n;
}
async function h() {
  let e = Array.from(
      document.querySelectorAll("#offlineContentModal input:checked"),
    ).map((l) => l.value),
    n = {
      cataract: /cataract/i,
      visualAcuity: /visual.?acuity|near.?vision|\/va\//i,
      directOphthalmoscopy: /ophthalmoscopy|\/do[_/]/i,
      frontOfEye: /front.?of.?eye|anterior/i,
      interactiveLearning: /\/subapp\/|interactive|\/quiz\//i,
      atomsCard: /atoms?card|\/atoms\//i,
      pupils: /pupil/i,
      fundalReflex: /fundal/i,
      rapd: /rapd|pupil/i,
      childhoodEyeScreening: /childhood|usaid/i,
      howToUseArclight: /arclight|howtouse/i,
      mobilePhoneAttachment: /phone|attachment/i,
      mires: /mires/i,
      morph: /morph/i,
      squintPalsy: /squint|palsy/i,
      caseBasedLearning: /case.?study|case.?based/i,
      anteriorSegmentVideo: /anterior|front.?of.?eye/i,
    };
  if (!e.length) {
    a("No assets selected for download.");
    return;
  }
  let t = document.getElementById("downloadSelectedAssetsBtn");
  t && (t.disabled = !0);
  try {
    a("Preparing download\u2026");
    let [l, s] = await Promise.all([d(), fetch("/shell-assets.json")]);
    if (!s.ok) throw new Error("Shell manifest unavailable");
    let u = new Set((await s.json()).urls),
      r = l.assets.filter(
        (o) =>
          u.has(o.url) || e.some((i) => n[i]?.test(decodeURIComponent(o.url))),
      );
    if (
      (await c({
        urls: r.map((o) => o.url),
        bytes: r.reduce((o, i) => o + i.bytes, 0),
        label: "Selected content",
      })) === !1
    ) {
      a("Download paused");
      return;
    }
    a("Download complete. Content is ready offline.");
  } catch (l) {
    (console.error(l),
      a("Download incomplete. Reconnect and try again to resume.", !0));
  } finally {
    t && (t.disabled = !1);
  }
}
function y() {
  (document
    .getElementById("closeOfflineContentModalBtn")
    ?.addEventListener("click", m),
    document
      .getElementById("downloadSelectedAssetsBtn")
      ?.addEventListener("click", h),
    document.querySelectorAll(".showOfflineContentModalBtn").forEach((e) => {
      e.addEventListener("click", f);
    }));
}
export {
  m as closeOfflineContentModal,
  h as downloadSelectedAssets,
  E as initializeOffline,
  f as showOfflineContentModal,
};

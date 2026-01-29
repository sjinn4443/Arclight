// public/js/childhoodEyeScreeningWorkshop.js
import { loadPage } from "./navigation.js";

function normaliseVideosSubpageId(raw) {
  if (!raw) return "";

  let t = String(raw).trim();

  // allow "#fundalExamPage" style
  if (t.startsWith("#")) t = t.slice(1);

  // If workshop uses short aliases, map them to the real ids in videos.html
  const ALIASES = {
    visualAcuity: "visualAcuityPage",
    vaWho: "vaWhoPage",
    vaNearVision: "vaNearVisionPage",
    mumVision: "mumVisionPage",

    fundalReflex: "fundalReflexPage",
    fundalExam: "fundalExamPage",
    fundalStill: "fundalStillPage",
    fundalReal: "fundalRealPage",

    pupils: "pupilsPage",
    pupilExamPEC: "pupilExamPECPage",
    pupilFullExam: "pupilFullExamPage",
    pupilPathways: "pupilPathwaysPage",

    rapdTestVideo: "rapdTestVideoPage",
    directOphthalmoscopy: "directOphthalmoscopyVideoPage",
    directOphthalmoscopyVideo: "directOphthalmoscopyVideoPage",

    childhoodEyeScreening: "childhoodEyeScreeningPage",
    howToArclight: "howToArclightPage",
    assessmentVision: "assessmentVisionPage",
    normalAbnormal: "normalAbnormalPage",
    frontOfEye: "frontOfEyePage",
    assessingVisualFunction: "assessingVisualFunctionPage",
  };

  if (ALIASES[t]) return ALIASES[t];

  // If it already looks like a real id, keep it
  if (t.endsWith("Page")) return t;

  // Common case: workshop uses "fundalExam" but videos.html uses "fundalExamPage"
  return `${t}Page`;
}

function setupWorkshopSeeAllToggles(page) {
  const cards = page.querySelectorAll(".pupil-card.module-card");
  cards.forEach((card) => {
    const subtitles = card.querySelectorAll("p.section-subtitle");
    subtitles.forEach((subtitle) => {
      // subtitle 다음에 나오는 lesson-row들을, 다음 section-subtitle 나오기 전까지 그룹으로 묶음
      const groupRows = [];
      let el = subtitle.nextElementSibling;

      while (el) {
        if (el.matches && el.matches("p.section-subtitle")) break;
        if (el.classList && el.classList.contains("lesson-row"))
          groupRows.push(el);
        el = el.nextElementSibling;
      }

      // "한 항목에 3개 초과" => 4개 이상일 때만 토글 생성
      if (groupRows.length <= 3) return;

      // 이미 토글이 붙어있으면 중복 생성 방지
      if (subtitle.querySelector(".see-all-toggle")) return;

      // 기본 상태: 2개만 보여주고 나머지는 숨김
      groupRows.slice(2).forEach((row) => {
        row.setAttribute("data-collapsible-hidden", "true");
      });

      const toggle = document.createElement("span");
      toggle.className = "see-all-toggle";
      toggle.setAttribute("role", "button");
      toggle.setAttribute("tabindex", "0");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "See all >";

      const open = () => {
        groupRows.forEach((row) =>
          row.removeAttribute("data-collapsible-hidden"),
        );
        toggle.textContent = "Close ^";
        toggle.setAttribute("aria-expanded", "true");
      };

      const close = () => {
        groupRows.slice(2).forEach((row) => {
          row.setAttribute("data-collapsible-hidden", "true");
        });
        toggle.textContent = "See all >";
        toggle.setAttribute("aria-expanded", "false");
      };

      const toggleNow = (e) => {
        // 카드가 <button>이라 이벤트가 섞이지 않게 완전히 차단
        e.preventDefault();
        e.stopPropagation();

        const expanded = toggle.getAttribute("aria-expanded") === "true";
        if (expanded) close();
        else open();
      };

      toggle.addEventListener("click", toggleNow);
      toggle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") toggleNow(e);
      });

      // subtitle 오른쪽에 붙이기
      subtitle.appendChild(toggle);
    });
  });
}

export function initializeChildhoodEyeScreeningWorkshop() {
  const page = document.getElementById("childhoodEyeScreeningWorkshopPage");
  if (!page) return;
  setupWorkshopSeeAllToggles(page);
  const rows = page.querySelectorAll(".lesson-row[data-target]");
  rows.forEach((row) => {
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";

    row.addEventListener("click", async (event) => {
      event.preventDefault();

      const targetRaw = row.getAttribute("data-target");
      if (!targetRaw) return;

      // ✅ quizzes that are separate routes
      if (targetRaw === "childhoodAssessmentPage") {
        await loadPage("childhoodAssessment");
        return;
      }
      if (targetRaw === "behavioursquizPage") {
        await loadPage("behavioursquiz");
        return;
      }

      // ✅ scroll/standalone pages that are separate routes (NOT videos subpages)
      // public/js/childhoodEyeScreeningWorkshop.js

      // ...중략...

      const DIRECT_ROUTES = {
        // Eye & Brain
        visualsystemeyesbrainPage: "visualsystemeyesbrain",
        childhoodEyeBrainImagesPage: "childhoodEyeBrainImages",

        // ✅ [ADD] Visual development + QnO도 childhoodEyeBrainImages route로!
        childhoodIntroVisualDevelopmentPage: "childhoodEyeBrainImages",
        childhoodNormalVisualDevelopmentPage: "childhoodEyeBrainImages",
        childhoodAskQuestionsObservePage: "childhoodEyeBrainImages",

        // Signs of visual impairment → Cases
        signsVICasesPage: "signsVICases",

        // Childhood eye screening → Refer
        childhoodReferPage: "childhoodRefer",

        // (안전망)
        visualImpairmentPage: "visualImpairment",
      };

      if (DIRECT_ROUTES[targetRaw]) {
        const route = DIRECT_ROUTES[targetRaw];
        await loadPage(route);

        // ✅ 같은 route 안에 targetRaw 페이지 섹션이 있으면 그걸 정확히 보여주기
        const el = document.getElementById(targetRaw);
        if (el) {
          if (typeof window.showPage === "function") {
            window.showPage(targetRaw);
          } else {
            // fallback: showPage가 없을 때 최소 동작
            document
              .querySelectorAll(".page")
              .forEach((p) => (p.style.display = "none"));
            el.style.display = "block";
          }
        }

        try {
          window.scrollTo(0, 0);
        } catch {}
        return;
      }

      // ✅ videos.html 안의 서브페이지(비디오)로 보내기
      const target = normaliseVideosSubpageId(targetRaw);

      // target이 비디오 페이지 id처럼 생겼으면 videos route로 이동해서 열기
      if (target && target.endsWith("Page")) {
        try {
          // videos.js가 사용하는 딥링크 방식에 맞춰 세팅
          window.__videosPendingTarget = target;
          window.__videosSuppressFlash = true;
          sessionStorage.setItem("gotoSubPage", target);
        } catch {
          // sessionStorage가 막혀도 최소한 loadPage는 되게
        }

        await loadPage("videos");

        // 가능하면 videos.js의 helper로 즉시 해당 섹션 보여주기
        try {
          const { goToVideosSection } = await import("./videos.js");
          if (typeof goToVideosSection === "function") {
            goToVideosSection(target, { skipDefault: true });
          } else {
            // fallback: videos.js가 sessionStorage 읽어서 열도록 둠
            sessionStorage.setItem("gotoSubPage", target);
          }
        } catch {
          // fallback 유지
          try {
            sessionStorage.setItem("gotoSubPage", target);
          } catch {}
        }
        return;
      }
    });
  });

  // 2. Visual Impairment 버튼 연결 (추가된 부분)
  const viRow = document.getElementById("visualImpairmentRow");
  if (viRow && viRow.dataset.wired !== "1") {
    viRow.dataset.wired = "1";
    viRow.addEventListener("click", async (e) => {
      e.preventDefault();
      await loadPage("visualImpairment");
    });
  }

  // 3. PDF 관련 버튼들 (Atoms, Fundal 등)
  const pdfLinks = [
    { id: "atomsHandout1Row", route: "atomsHandout1" },
    { id: "atomsHandout2Row", route: "atomsHandout2" },
    { id: "fundalReflexPdfRow", route: "fundalReflexPdf" },
  ];

  pdfLinks.forEach((link) => {
    const el = document.getElementById(link.id);
    if (el && el.dataset.wiredPdf !== "1") {
      el.dataset.wiredPdf = "1";
      el.addEventListener("click", async (e) => {
        e.preventDefault();
        await loadPage(link.route);
      });
    }
  });
}

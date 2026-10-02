import { MCQ_LEVEL_META } from "./constants.js";
import { createModalController } from "./modal.js";
import {
  getMcqAnswers,
  gradeMcq,
  renderMcqQuestions,
  revealMcqFeedback,
  sampleQuestions,
} from "./mcq.js";

export function initMenuMcq({ state, dom, onBeforeOpenMcq }) {
  const {
    body,
    burgerIcon,
    sideMenu,
    mcqModal,
    mcqModalContent,
    closeMcqModalButton,
    mcqTitle,
    mcqIntro,
    mcqContainer,
    submitMcqButton,
    mcqResult,
    mcqLevelButtons,
  } = dom;

  if (
    !body ||
    !burgerIcon ||
    !sideMenu ||
    !mcqModal ||
    !mcqModalContent ||
    !closeMcqModalButton ||
    !mcqTitle ||
    !mcqIntro ||
    !mcqContainer ||
    !submitMcqButton ||
    !mcqResult
  ) {
    return;
  }

  const setSideMenuOpen = (isOpen) => {
    sideMenu.classList.toggle("open", isOpen);
    sideMenu.setAttribute("aria-hidden", String(!isOpen));
    if (isOpen) {
      sideMenu.removeAttribute("inert");
      sideMenu
        .querySelector("button:not([disabled])")
        ?.focus({ preventScroll: true });
    } else {
      sideMenu.setAttribute("inert", "");
    }
    burgerIcon.setAttribute("aria-expanded", String(isOpen));
    burgerIcon.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };

  const mcqModalController = createModalController({
    body,
    focusRoot: mcqModalContent,
    initialFocusElement: closeMcqModalButton,
    modal: mcqModal,
  });
  let mcqGraded = false;

  const openMcqLevel = (level, triggerElement) => {
    const meta = MCQ_LEVEL_META[level];
    if (!meta) {
      return;
    }

    if (typeof onBeforeOpenMcq === "function") {
      onBeforeOpenMcq();
    }

    state.activeMcqLevel = level;
    state.activeMcqQuestions = sampleQuestions(level, meta.questionCount || 5);

    mcqTitle.textContent = `${meta.title} MCQ`;
    mcqIntro.textContent = `${state.activeMcqQuestions.length} questions. Pass mark ${meta.passMark}.`;
    renderMcqQuestions(mcqContainer, state.activeMcqQuestions);
    mcqResult.textContent = "";
    mcqResult.className = "result-text";
    mcqResult.hidden = true;
    mcqGraded = false;
    submitMcqButton.textContent = "Submit answers";
    submitMcqButton.disabled = false;

    setSideMenuOpen(false);
    mcqModalController.open({ triggerElement: burgerIcon });
  };

  burgerIcon.addEventListener("click", () => {
    setSideMenuOpen(!sideMenu.classList.contains("open"));
  });

  mcqLevelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openMcqLevel(button.dataset.level, button);
    });
  });

  closeMcqModalButton.addEventListener("click", () => {
    mcqModalController.close();
  });

  submitMcqButton.addEventListener("click", () => {
    if (!state.activeMcqQuestions.length) {
      return;
    }
    if (mcqGraded) {
      openMcqLevel(state.activeMcqLevel, burgerIcon);
      return;
    }

    const answers = getMcqAnswers(state.activeMcqQuestions);
    if (!answers) {
      mcqResult.textContent = "Please answer all questions before submitting.";
      mcqResult.className = "result-text is-review";
      mcqResult.hidden = false;
      Array.from(mcqContainer.querySelectorAll("fieldset.question"))
        .find((question) => !question.querySelector("input:checked"))
        ?.querySelector("input")
        ?.focus();
      return;
    }

    const score = gradeMcq(state.activeMcqQuestions, answers);
    revealMcqFeedback(mcqContainer, state.activeMcqQuestions, answers);
    mcqResult.hidden = false;

    const passMark = MCQ_LEVEL_META[state.activeMcqLevel].passMark;
    const didPass = score >= passMark;
    if (didPass) {
      const star = document.createElement("span");
      star.className = "result-star";
      star.setAttribute("aria-label", "star earned");
      star.textContent = String.fromCharCode(9733);

      mcqResult.replaceChildren(
        document.createTextNode(
          `Score ${score}/${state.activeMcqQuestions.length} - Pass `,
        ),
        star,
      );
      mcqResult.className = "result-text is-pass";
    } else {
      mcqResult.textContent = `Score ${score}/${state.activeMcqQuestions.length} - Review and retry`;
      mcqResult.className = "result-text is-review";
    }
    mcqGraded = true;
    submitMcqButton.textContent = didPass ? "New attempt" : "Try again";
    submitMcqButton.disabled = false;
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target === mcqModal) {
      mcqModalController.close();
      return;
    }

    if (sideMenu.classList.contains("open") && target instanceof Node) {
      const clickedInsideMenu = sideMenu.contains(target);
      const clickedBurger = burgerIcon.contains(target);
      if (!clickedInsideMenu && !clickedBurger) {
        setSideMenuOpen(false);
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    const menuWasOpen = sideMenu.classList.contains("open");
    setSideMenuOpen(false);
    if (menuWasOpen) {
      burgerIcon.focus({ preventScroll: true });
    }
    mcqModalController.close();
  });
}

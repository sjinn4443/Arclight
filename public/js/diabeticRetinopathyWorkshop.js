import { loadPage } from "./navigation.js";

const HISTORY_IMAGE_MATCH_CASES = Object.freeze([
  {
    id: "case1",
    label: "Cataract",
    imageSrc: "/images/casestudy/case1_eye.webp",
    historyLines: ["Slow vision loss over months", "No pain, only shadows"],
    answerLines: [
      "Vision worsened slowly without pain.",
      "No red eye or discharge suggests cataract.",
    ],
  },
  {
    id: "case2",
    label: "Retinoblastoma",
    imageSrc: "/images/casestudy/case2_eye.webp",
    historyLines: ["White pupil in a baby", "Poor visual attention"],
    answerLines: [
      "A white pupil in a baby is a danger sign.",
      "Poor visual attention supports retinoblastoma.",
    ],
  },
  {
    id: "case3",
    label: "Gonococcal/Chlamydial conjunctivitis",
    imageSrc: "/images/casestudy/case3_eye.webp",
    historyLines: [
      "Pink sticky eyes, yellow discharge",
      "Started in one eye, then both",
    ],
    answerLines: [
      "Thick yellow discharge suggests bacterial conjunctivitis.",
      "This pattern fits gonococcal/chlamydial infection.",
    ],
  },
  {
    id: "case4",
    label: "Trachomatous trichiasis with corneal scarring",
    imageSrc: "/images/casestudy/case4_eye.webp",
    historyLines: ["Long gritty painful eyes", "Blur + chronic surface damage"],
    answerLines: [
      "Long gritty pain suggests chronic surface damage.",
      "This pattern fits trichiasis with corneal scarring.",
    ],
  },
  {
    id: "case5",
    label: "Bacterial / fungal corneal ulcer",
    imageSrc: "/images/casestudy/case5_eye.webp",
    historyLines: ["Bush scratch before pain", "Sticky red eye, only shadows"],
    answerLines: [
      "Severe pain after bush trauma suggests corneal ulcer.",
      "Discharge and very poor vision support infection.",
    ],
  },
  {
    id: "case6",
    label: "Herpes simplex keratitis",
    imageSrc: "/images/casestudy/case6_eye.webp",
    historyLines: ["Painful photophobic red eye", "Recent lip sores"],
    answerLines: [
      "One painful light-sensitive eye suggests keratitis.",
      "Recent lip sores support herpes simplex keratitis.",
    ],
  },
  {
    id: "case7",
    label: "Anterior Uveitis",
    imageSrc: "/images/casestudy/case7_eye.webp",
    historyLines: [
      "One painful photophobic eye",
      "Blur, similar episodes before",
    ],
    answerLines: [
      "Photophobia and pain suggest uveitis.",
      "Repeated similar episodes support anterior uveitis.",
    ],
  },
  {
    id: "case8",
    label: "Pterygium",
    imageSrc: "/images/casestudy/case8_eye.webp",
    historyLines: ["Slow pink growth on eye", "Outdoor UV exposure"],
    answerLines: [
      "A slow-growing pink patch suggests pterygium.",
      "Long outdoor work makes this diagnosis likely.",
    ],
  },
  {
    id: "case9",
    label: "Corneal foreign body with early infection",
    imageSrc: "/images/casestudy/case9_eye.webp",
    historyLines: [
      "Metal work before symptoms",
      "Photophobia, blur, infection",
    ],
    answerLines: [
      "Metal work suggests a corneal foreign body.",
      "Blur and photophobia suggest early infection.",
    ],
  },
  {
    id: "case10",
    label: "Traumatic hyphaema",
    imageSrc: "/images/casestudy/case10_eye.webp",
    historyLines: ["Blunt trauma, sudden blur", "Red eye, shadow vision"],
    answerLines: [
      "Sudden blur after blunt trauma suggests hyphaema.",
      "Painful red watering eye supports the diagnosis.",
    ],
  },
  {
    id: "case11",
    label: "Penetrating corneal laceration with iris prolapse",
    imageSrc: "/images/casestudy/case11_eye.webp",
    historyLines: [
      "Stick injury, worsening pain",
      "Open globe / iris prolapse",
    ],
    answerLines: [
      "Stick injury with worsening blur suggests open globe.",
      "This pattern fits corneal laceration with iris prolapse.",
    ],
  },
  {
    id: "case12",
    label: "Penetrating injury causing traumatic cataract",
    imageSrc: "/images/casestudy/case12_eye.webp",
    historyLines: ["Recent stick injury", "Painful red eye, fast vision loss"],
    answerLines: [
      "Severe vision loss after stick trauma suggests penetration.",
      "Painful red eye with fast decline supports traumatic cataract.",
    ],
  },
]);

const HISTORY_IMAGE_MATCH_LOOKUP = new Map(
  HISTORY_IMAGE_MATCH_CASES.map((item) => [item.id, item]),
);

const HISTORY_IMAGE_MATCH_ROUND_SIZE = 4;

const RETINAL_STRUCTURE_TAP_STEPS = Object.freeze([
  {
    id: "optic-disc",
    label: "Optic Disc",
    tip: "The optic disc is the bright circular area where the vessels meet.",
    explanation:
      "The optic disc is the pale nerve head on the nasal side of the retina.",
    target: { cx: 0.286, cy: 0.441, rx: 0.104, ry: 0.122 },
  },
  {
    id: "fovea",
    label: "Fovea",
    tip: "The fovea is the darker spot temporal to the optic disc.",
    explanation:
      "The fovea is the small dark central pit temporal to the optic disc.",
    target: { cx: 0.884, cy: 0.482, rx: 0.075, ry: 0.075 },
  },
  {
    id: "nasal-retina",
    label: "Nasal Retina",
    tip: "Nasal retina sits on the same side as the optic disc.",
    explanation:
      "The nasal retina is the retinal area on the optic-disc side of the fundus.",
    target: { cx: 0.109, cy: 0.63, rx: 0.15, ry: 0.2 },
  },
  {
    id: "superior-temporal-vessels",
    label: "Superior Temporal Vessels",
    tip: "Follow the upper vascular arcade running temporally from the disc.",
    explanation:
      "The superior temporal vessels form the upper arcade curving away from the disc.",
    target: { cx: 0.515, cy: 0.145, rx: 0.205, ry: 0.095 },
  },
  {
    id: "inferior-temporal-vessels",
    label: "Inferior Temporal Vessels",
    tip: "Follow the lower vascular arcade running temporally from the disc.",
    explanation:
      "The inferior temporal vessels form the lower arcade curving away from the disc.",
    target: { cx: 0.64, cy: 0.79, rx: 0.25, ry: 0.11 },
  },
]);

function shuffleItems(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function chunkItems(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function showPageById(id) {
  if (!id) return;

  if (typeof window.showPage === "function") {
    window.showPage(id);
  } else if (typeof window.minimalShowPage === "function") {
    window.minimalShowPage(id);
    document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));
  } else {
    document.querySelectorAll(".page").forEach((page) => {
      page.classList.remove("active");
      page.style.display = "none";
    });
    const target = document.getElementById(id);
    if (!target) return;
    target.classList.add("active");
    target.style.display = "block";
    document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));
  }

  try {
    window.scrollTo(0, 0);
  } catch {}
}

function updateWorkshopFolderItemBadges(page) {
  const folderRows = page.querySelectorAll(
    "#diabeticWorkshopFolders .diabetic-folder-row[data-folder]",
  );

  folderRows.forEach((row) => {
    const sectionKey = row.getAttribute("data-folder");
    if (!sectionKey) return;

    const section = page.querySelector(
      `.diabetic-section-card[data-section="${sectionKey}"]`,
    );
    if (!section) return;

    const itemCount = section.querySelectorAll(
      ".lesson-row[data-lesson], .lesson-row[data-target]",
    ).length;
    const thumb = row.querySelector(".thumb");
    if (!thumb) return;

    let badge = thumb.querySelector(".diabetic-folder-item-count");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "diabetic-folder-item-count";
      thumb.appendChild(badge);
    }

    badge.textContent = String(itemCount);
    row.setAttribute("data-item-count", String(itemCount));
  });
}

function setupWorkshopFolders(page) {
  const folders = page.querySelectorAll(
    "#diabeticWorkshopFolders .diabetic-folder-row",
  );
  const sectionCards = page.querySelectorAll(".diabetic-section-card");
  const foldersContainer = page.querySelector("#diabeticWorkshopFolders");
  if (!foldersContainer) return;

  updateWorkshopFolderItemBadges(page);

  const hideAllSectionCards = () => {
    sectionCards.forEach((card) => {
      card.style.display = "none";
      const titleEl = card.querySelector("h3");
      titleEl?.querySelector(".see-all-toggle")?.remove();
    });
  };

  const showSectionByKey = (key) => {
    const card = page.querySelector(
      `.diabetic-section-card[data-section="${key}"]`,
    );
    const openFolderRow = page.querySelector(
      `#diabeticWorkshopFolders .diabetic-folder-row[data-folder="${key}"]`,
    );
    if (!card || !openFolderRow) return;

    hideAllSectionCards();
    folders.forEach((row) => {
      row.style.display = "";
    });

    openFolderRow.style.display = "none";
    page.classList.add("diabetic-folder-open");
    openFolderRow.insertAdjacentElement("afterend", card);
    card.style.display = "";

    const titleEl = card.querySelector("h3");
    if (!titleEl) return;

    titleEl.style.display = "flex";
    titleEl.style.alignItems = "center";
    titleEl.style.width = "100%";

    const toggle = document.createElement("span");
    toggle.className = "see-all-toggle";
    toggle.setAttribute("role", "button");
    toggle.setAttribute("tabindex", "0");
    toggle.setAttribute("aria-expanded", "true");
    toggle.textContent = "Close ^";
    toggle.style.marginLeft = "auto";
    toggle.style.marginRight = "30px";
    toggle.style.whiteSpace = "nowrap";

    const closeNow = (event) => {
      event.preventDefault();
      event.stopPropagation();
      card.style.display = "none";
      toggle.remove();
      openFolderRow.style.display = "";
      page.classList.remove("diabetic-folder-open");
    };

    toggle.addEventListener("click", closeNow);
    toggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") closeNow(event);
    });

    titleEl.appendChild(toggle);
  };

  page.__showSectionByKey = showSectionByKey;

  hideAllSectionCards();
  folders.forEach((row) => {
    row.style.display = "";
  });
  foldersContainer.style.display = "";
  page.classList.remove("diabetic-folder-open");

  folders.forEach((row) => {
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";

    const key = row.getAttribute("data-folder");
    if (!key) return;

    const openNow = (event) => {
      event.preventDefault();
      event.stopPropagation();
      showSectionByKey(key);
    };

    row.addEventListener("click", openNow);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") openNow(event);
    });
  });
}

function initializeHistoryImageMatchPage(workshopPage) {
  const page = document.getElementById("diabeticHistoryImageMatchPage");
  if (!page || page.dataset.inited === "1") return;

  const imageBank = page.querySelector("#diabeticHistoryImageMatchBank");
  const promptList = page.querySelector("#diabeticHistoryImageMatchSlots");
  const hint = page.querySelector("#diabeticHistoryImageMatchHint");
  const progress = page.querySelector("#diabeticHistoryImageMatchProgress");
  const progressLabel = page.querySelector(
    "#diabeticHistoryImageMatchProgressLabel",
  );
  const submitButton = page.querySelector("#diabeticHistoryImageMatchSubmit");
  const feedback = page.querySelector("#diabeticHistoryImageMatchFeedback");
  const introModal = page.querySelector("#diabeticHistoryImageMatchIntroModal");
  const resultsModal = page.querySelector(
    "#diabeticHistoryImageMatchResultsModal",
  );
  const resultsSummary = page.querySelector(
    "#diabeticHistoryImageMatchResultsSummary",
  );
  const resultsList = page.querySelector(
    "#diabeticHistoryImageMatchResultsList",
  );
  const introCloseButtons = page.querySelectorAll(
    "[data-history-match-modal-close]",
  );
  const resultsCloseButtons = page.querySelectorAll(
    "[data-history-match-results-close]",
  );

  if (
    !imageBank ||
    !promptList ||
    !hint ||
    !progress ||
    !progressLabel ||
    !submitButton ||
    !feedback ||
    !introModal ||
    !resultsModal ||
    !resultsSummary ||
    !resultsList
  ) {
    return;
  }

  page.dataset.inited = "1";
  page
    .querySelectorAll(".diabetic-history-match__modal-close")
    .forEach((button) => {
      button.innerHTML = "&times;";
    });

  const state = {
    rounds: [],
    currentRoundIndex: 0,
    hasCompletedQuiz: false,
    dragImageId: null,
    dragPointerId: null,
    dragSourceEl: null,
    dragGhostEl: null,
    dragCleanup: null,
    dropPromptId: null,
    dropRowEl: null,
  };

  const buildRounds = () =>
    chunkItems(HISTORY_IMAGE_MATCH_CASES, HISTORY_IMAGE_MATCH_ROUND_SIZE).map(
      (items) => ({
        items,
        imageOrder: items.map((item) => item.id),
        promptOrder: shuffleItems(items.map((item) => item.id)),
        assignments: new Map(),
      }),
    );

  const getCurrentRound = () => state.rounds[state.currentRoundIndex] || null;

  const getAssignedPromptId = (imageId) => {
    const round = getCurrentRound();
    if (!round) return null;

    for (const [promptId, assignedImageId] of round.assignments.entries()) {
      if (assignedImageId === imageId) return promptId;
    }
    return null;
  };

  const clearAssignmentForImage = (imageId) => {
    const promptId = getAssignedPromptId(imageId);
    if (!promptId) return;

    getCurrentRound()?.assignments.delete(promptId);
  };

  const setFeedback = (text = "", variant = "") => {
    feedback.textContent = "";
    feedback.className = "diabetic-history-match__feedback";
    if (!text) return;

    feedback.textContent = text;
    if (variant) feedback.classList.add(variant);
  };

  const setHint = (text, isActive = false) => {
    hint.textContent = text;
    hint.classList.toggle("is-active", isActive);
  };

  const openIntroModal = () => {
    introModal.classList.add("is-open");
    introModal.setAttribute("aria-hidden", "false");
  };

  const closeIntroModal = () => {
    introModal.classList.remove("is-open");
    introModal.setAttribute("aria-hidden", "true");
  };

  const openResultsModal = () => {
    resultsModal.classList.add("is-open");
    resultsModal.setAttribute("aria-hidden", "false");
  };

  const closeResultsModal = () => {
    resultsModal.classList.remove("is-open");
    resultsModal.setAttribute("aria-hidden", "true");
  };

  const clearDropTarget = () => {
    if (state.dropRowEl) {
      state.dropRowEl.classList.remove("is-drop-target");
    }
    state.dropRowEl = null;
    state.dropPromptId = null;
  };

  const removeDragGhost = () => {
    state.dragGhostEl?.remove();
    state.dragGhostEl = null;
  };

  const updateDragGhostPosition = (event) => {
    if (!state.dragGhostEl) return;
    state.dragGhostEl.style.left = `${event.clientX - 42}px`;
    state.dragGhostEl.style.top = `${event.clientY - 42}px`;
  };

  const createDragGhost = (imageId) => {
    const item = HISTORY_IMAGE_MATCH_LOOKUP.get(imageId);
    if (!item) return null;

    const ghost = document.createElement("div");
    ghost.className = "diabetic-history-match__drag-ghost";

    const image = document.createElement("img");
    image.src = item.imageSrc;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");

    ghost.appendChild(image);
    document.body.appendChild(ghost);
    state.dragGhostEl = ghost;
    return ghost;
  };

  const getImageNumber = (imageId) => {
    const round = getCurrentRound();
    if (!round) return 0;
    return round.imageOrder.indexOf(imageId) + 1;
  };

  const renderProgress = () => {
    progress.innerHTML = "";

    state.rounds.forEach((_, index) => {
      const step = document.createElement("span");
      step.className = "diabetic-history-match__progress-step";

      if (state.hasCompletedQuiz || index < state.currentRoundIndex) {
        step.classList.add("is-complete");
      } else if (index === state.currentRoundIndex) {
        step.classList.add("is-active");
      }

      progress.appendChild(step);
    });

    const currentStep = Math.min(
      state.currentRoundIndex + 1,
      state.rounds.length || 1,
    );
    progressLabel.textContent = `Set ${currentStep} of ${state.rounds.length}`;
  };

  const updateDropTarget = (clientX, clientY) => {
    const hit = document.elementFromPoint(clientX, clientY);
    const row = hit?.closest?.(".diabetic-history-match__row[data-prompt-id]");

    if (!row || !promptList.contains(row)) {
      clearDropTarget();
      return;
    }

    const promptId = row.getAttribute("data-prompt-id");
    if (!promptId) {
      clearDropTarget();
      return;
    }

    if (state.dropRowEl === row && state.dropPromptId === promptId) return;

    clearDropTarget();
    state.dropRowEl = row;
    state.dropPromptId = promptId;
    row.classList.add("is-drop-target");
  };

  const assignImageToPrompt = (imageId, promptId) => {
    const round = getCurrentRound();
    if (!round) return;

    clearAssignmentForImage(imageId);
    round.assignments.set(promptId, imageId);
    setFeedback("");
    setHint("Placed. Drag a filled photo to change a match.", true);
    render();
  };

  const finishDrag = ({ applyDrop }) => {
    if (applyDrop && state.dragImageId && state.dropPromptId) {
      assignImageToPrompt(state.dragImageId, state.dropPromptId);
    } else if (!state.hasCompletedQuiz) {
      setHint("Drag an image onto the matching history card.");
    }

    state.dragCleanup?.();
    state.dragCleanup = null;

    if (state.dragSourceEl) {
      state.dragSourceEl.classList.remove("is-dragging");
    }

    removeDragGhost();
    clearDropTarget();
    state.dragImageId = null;
    state.dragPointerId = null;
    state.dragSourceEl = null;
  };

  const startDrag = (imageId, event, sourceEl) => {
    if (typeof event.button === "number" && event.button !== 0) return;
    event.preventDefault();

    finishDrag({ applyDrop: false });

    state.dragImageId = imageId;
    state.dragPointerId = event.pointerId;
    state.dragSourceEl = sourceEl;

    sourceEl.classList.add("is-dragging");
    createDragGhost(imageId);
    updateDragGhostPosition(event);
    updateDropTarget(event.clientX, event.clientY);
    setHint("Drop on the matching history card.", true);

    try {
      sourceEl.setPointerCapture(event.pointerId);
    } catch {}

    const handlePointerMove = (moveEvent) => {
      if (moveEvent.pointerId !== state.dragPointerId) return;
      updateDragGhostPosition(moveEvent);
      updateDropTarget(moveEvent.clientX, moveEvent.clientY);
    };

    const handlePointerUp = (upEvent) => {
      if (upEvent.pointerId !== state.dragPointerId) return;
      updateDragGhostPosition(upEvent);
      updateDropTarget(upEvent.clientX, upEvent.clientY);
      finishDrag({ applyDrop: true });
    };

    const handlePointerCancel = (cancelEvent) => {
      if (cancelEvent.pointerId !== state.dragPointerId) return;
      finishDrag({ applyDrop: false });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);

    state.dragCleanup = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);

      try {
        sourceEl.releasePointerCapture?.(event.pointerId);
      } catch {}
    };
  };

  const renderImageBank = () => {
    imageBank.innerHTML = "";
    const round = getCurrentRound();
    if (!round) return;

    const createImageButton = (imageId, className = "") => {
      const item = HISTORY_IMAGE_MATCH_LOOKUP.get(imageId);
      if (!item) return null;

      const button = document.createElement("button");
      button.type = "button";
      button.className =
        `diabetic-history-match__image-button ${className}`.trim();
      button.setAttribute(
        "aria-label",
        `Drag image ${getImageNumber(imageId)}`,
      );
      button.draggable = false;

      button.addEventListener("pointerdown", (event) =>
        startDrag(imageId, event, button),
      );
      button.addEventListener("dragstart", (event) => event.preventDefault());

      const order = document.createElement("span");
      order.className = "diabetic-history-match__image-order";
      order.textContent = String(getImageNumber(imageId));

      const image = document.createElement("img");
      image.className = "diabetic-history-match__image";
      image.src = item.imageSrc;
      image.alt = item.label;
      image.loading = "lazy";
      image.draggable = false;

      button.appendChild(order);
      button.appendChild(image);
      return button;
    };

    round.imageOrder.forEach((imageId) => {
      if (getAssignedPromptId(imageId)) return;

      const button = createImageButton(
        imageId,
        "diabetic-history-match__image-button--bank",
      );
      if (!button) return;
      imageBank.appendChild(button);
    });
  };

  const renderPromptList = () => {
    promptList.innerHTML = "";
    const round = getCurrentRound();
    if (!round) return;

    round.promptOrder.forEach((promptId, index) => {
      const item = HISTORY_IMAGE_MATCH_LOOKUP.get(promptId);
      if (!item) return;

      const assignedImageId = round.assignments.get(promptId) || null;
      const assignedItem = assignedImageId
        ? HISTORY_IMAGE_MATCH_LOOKUP.get(assignedImageId)
        : null;

      const row = document.createElement("div");
      row.className = "diabetic-history-match__row";
      row.setAttribute("data-prompt-id", promptId);
      row.setAttribute("aria-label", `History card ${index + 1}`);

      if (assignedItem) row.classList.add("is-filled");

      const slot = document.createElement("div");
      slot.className = "diabetic-history-match__slot";

      if (assignedItem) {
        const button = document.createElement("button");
        button.type = "button";
        button.className =
          "diabetic-history-match__image-button diabetic-history-match__image-button--slot";
        button.setAttribute(
          "aria-label",
          `Drag image ${getImageNumber(assignedImageId)}`,
        );
        button.draggable = false;
        button.addEventListener("pointerdown", (event) =>
          startDrag(assignedImageId, event, button),
        );
        button.addEventListener("dragstart", (event) => event.preventDefault());

        const order = document.createElement("span");
        order.className = "diabetic-history-match__image-order";
        order.textContent = String(getImageNumber(assignedImageId));

        const image = document.createElement("img");
        image.className = "diabetic-history-match__image";
        image.src = assignedItem.imageSrc;
        image.alt = assignedItem.label;
        image.loading = "lazy";
        image.draggable = false;

        button.appendChild(order);
        button.appendChild(image);
        slot.appendChild(button);
      } else {
        const placeholder = document.createElement("span");
        placeholder.className = "diabetic-history-match__slot-placeholder";
        placeholder.textContent = "Drop";
        slot.appendChild(placeholder);
      }

      const card = document.createElement("div");
      card.className = "diabetic-history-match__card";

      const meta = document.createElement("div");
      meta.className = "diabetic-history-match__card-meta";

      const number = document.createElement("span");
      number.className = "diabetic-history-match__card-label";
      number.textContent = `History ${index + 1}`;
      meta.appendChild(number);

      const list = document.createElement("ul");
      list.className = "diabetic-history-match__history-list";
      item.historyLines.forEach((line) => {
        const bullet = document.createElement("li");
        bullet.textContent = line;
        list.appendChild(bullet);
      });

      card.appendChild(meta);
      card.appendChild(list);
      row.appendChild(slot);
      row.appendChild(card);
      promptList.appendChild(row);
    });
  };

  const render = () => {
    renderProgress();
    renderImageBank();
    renderPromptList();
    submitButton.textContent =
      state.currentRoundIndex === state.rounds.length - 1
        ? "Submit answer"
        : "Next case";
  };

  const appendSummary = (target, correct, total) => {
    target.textContent = "";
    target.appendChild(document.createTextNode("You got "));
    const correctValue = document.createElement("b");
    correctValue.textContent = String(correct);
    target.appendChild(correctValue);
    target.appendChild(document.createTextNode(" out of "));
    const totalValue = document.createElement("b");
    totalValue.textContent = String(total);
    target.appendChild(totalValue);
    target.appendChild(document.createTextNode(" correct."));
  };

  const renderResults = () => {
    let correct = 0;
    const total = HISTORY_IMAGE_MATCH_CASES.length;

    resultsList.innerHTML = "";

    state.rounds.forEach((round, roundIndex) => {
      const section = document.createElement("section");
      section.className = "diabetic-history-match__results-section";

      const sectionTitle = document.createElement("h4");
      sectionTitle.className = "diabetic-history-match__results-section-title";
      sectionTitle.textContent = `Set ${roundIndex + 1}`;
      section.appendChild(sectionTitle);

      round.promptOrder.forEach((promptId) => {
        const item = HISTORY_IMAGE_MATCH_LOOKUP.get(promptId);
        if (!item) return;

        const assignedImageId = round.assignments.get(promptId) || null;
        const isCorrect = assignedImageId === promptId;
        if (isCorrect) correct += 1;

        const row = document.createElement("div");
        row.className = "diabetic-history-match__result-row";

        const thumb = document.createElement("img");
        thumb.className = "diabetic-history-match__result-thumb";
        thumb.src = item.imageSrc;
        thumb.alt = item.label;
        thumb.loading = "lazy";

        const body = document.createElement("div");
        body.className = "diabetic-history-match__result-body";

        const head = document.createElement("div");
        head.className = "diabetic-history-match__result-head";

        const title = document.createElement("p");
        title.className = "diabetic-history-match__result-title";
        title.textContent = item.label;

        const status = document.createElement("span");
        status.className = "diabetic-history-match__result-status";
        if (isCorrect) {
          status.classList.add("is-correct");
          status.textContent = "Correct";
        } else {
          status.classList.add("is-wrong");
          status.textContent = "Wrong";
        }

        const list = document.createElement("ul");
        list.className = "diabetic-history-match__result-list";
        item.answerLines.forEach((line) => {
          const bullet = document.createElement("li");
          bullet.textContent = line;
          list.appendChild(bullet);
        });

        head.appendChild(title);
        head.appendChild(status);
        body.appendChild(head);
        body.appendChild(list);
        row.appendChild(thumb);
        row.appendChild(body);
        section.appendChild(row);
      });

      resultsList.appendChild(section);
    });

    appendSummary(resultsSummary, correct, total);
    return correct;
  };

  const resetQuiz = () => {
    finishDrag({ applyDrop: false });
    state.rounds = buildRounds();
    state.currentRoundIndex = 0;
    state.hasCompletedQuiz = false;
    closeResultsModal();
    setFeedback("");
    setHint("Drag an image onto the matching history card.");
    render();
  };

  submitButton.addEventListener("click", () => {
    const round = getCurrentRound();
    if (!round) return;

    if (round.assignments.size !== round.items.length) {
      setFeedback(
        `Match all ${round.items.length} histories before continuing.`,
        "is-reviewed",
      );
      setHint("Complete all matches to continue.", true);
      return;
    }

    setFeedback("");

    if (state.currentRoundIndex < state.rounds.length - 1) {
      state.currentRoundIndex += 1;
      setHint("Drag an image onto the matching history card.");
      render();
      try {
        window.scrollTo(0, 0);
      } catch {}
      return;
    }

    state.hasCompletedQuiz = true;
    render();
    renderResults();
    openResultsModal();
  });

  introCloseButtons.forEach((button) => {
    if (button.dataset.wired === "1") return;
    button.dataset.wired = "1";
    button.addEventListener("click", closeIntroModal);
  });

  introModal.addEventListener("click", (event) => {
    if (event.target === introModal) closeIntroModal();
  });

  resultsCloseButtons.forEach((button) => {
    if (button.dataset.wired === "1") return;
    button.dataset.wired = "1";
    button.addEventListener("click", closeResultsModal);
  });

  resultsModal.addEventListener("click", (event) => {
    if (event.target === resultsModal) closeResultsModal();
  });

  if (page.dataset.shownWired !== "1") {
    page.dataset.shownWired = "1";
    document.addEventListener("page:shown", (event) => {
      if (event.detail?.id !== "diabeticHistoryImageMatchPage") return;
      resetQuiz();
      openIntroModal();
    });
  }

  resetQuiz();
}

function initializeRetinalStructureTapPage() {
  const page = document.getElementById("diabeticRetinalStructureTapPage");
  if (!page || page.dataset.inited === "1") return;

  const progress = page.querySelector("#retinalStructureTapProgress");
  const progressLabel = page.querySelector("#retinalStructureTapProgressLabel");
  const prompt = page.querySelector("#retinalStructureTapPrompt");
  const promptCard = page.querySelector("#retinalStructureTapPromptCard");
  const stage = page.querySelector("#retinalStructureTapStage");
  const overlay = page.querySelector("#retinalStructureTapOverlay");
  const idle = page.querySelector("#retinalStructureTapIdle");
  const tip = page.querySelector("#retinalStructureTapTip");
  const result = page.querySelector("#retinalStructureTapResult");
  const banner = page.querySelector("#retinalStructureTapBanner");
  const bannerBadge = page.querySelector("#retinalStructureTapBannerBadge");
  const bannerTitle = page.querySelector("#retinalStructureTapBannerTitle");
  const bannerCopy = page.querySelector("#retinalStructureTapBannerCopy");
  const explanation = page.querySelector("#retinalStructureTapExplanation");
  const nextButton = page.querySelector("#retinalStructureTapNext");
  const introModal = page.querySelector("#retinalStructureTapIntroModal");
  const resultsModal = page.querySelector("#retinalStructureTapResultsModal");
  const resultsSummary = page.querySelector(
    "#retinalStructureTapResultsSummary",
  );
  const resultsList = page.querySelector("#retinalStructureTapResultsList");
  const introCloseButtons = page.querySelectorAll(
    "[data-retinal-structure-modal-close]",
  );
  const resultsCloseButtons = page.querySelectorAll(
    "[data-retinal-structure-results-close]",
  );

  if (
    !progress ||
    !progressLabel ||
    !prompt ||
    !promptCard ||
    !stage ||
    !overlay ||
    !idle ||
    !tip ||
    !result ||
    !banner ||
    !bannerBadge ||
    !bannerTitle ||
    !bannerCopy ||
    !explanation ||
    !nextButton ||
    !introModal ||
    !resultsModal ||
    !resultsSummary ||
    !resultsList
  ) {
    return;
  }

  page.dataset.inited = "1";
  page
    .querySelectorAll(".retinal-structure-tap__modal-close")
    .forEach((button) => {
      button.innerHTML = "&times;";
    });

  const state = {
    currentIndex: 0,
    answers: [],
    hasAnsweredCurrent: false,
    isComplete: false,
  };

  const getCurrentStep = () => RETINAL_STRUCTURE_TAP_STEPS[state.currentIndex];

  const getCurrentAnswer = () => state.answers[state.currentIndex] || null;

  const setModalState = (modal, isOpen) => {
    modal.classList.toggle("is-open", isOpen);
    modal.setAttribute("aria-hidden", isOpen ? "false" : "true");
  };

  const openIntroModal = () => setModalState(introModal, true);
  const closeIntroModal = () => setModalState(introModal, false);
  const openResultsModal = () => setModalState(resultsModal, true);
  const closeResultsModal = () => setModalState(resultsModal, false);

  const renderProgress = () => {
    progress.innerHTML = "";

    RETINAL_STRUCTURE_TAP_STEPS.forEach((_, index) => {
      const stepEl = document.createElement("span");
      stepEl.className = "retinal-structure-tap__progress-step";

      if (state.isComplete || index < state.currentIndex) {
        stepEl.classList.add("is-complete");
      } else if (index === state.currentIndex) {
        stepEl.classList.add("is-active");
      }

      progress.appendChild(stepEl);
    });

    const current = Math.min(
      state.currentIndex + 1,
      RETINAL_STRUCTURE_TAP_STEPS.length,
    );
    progressLabel.textContent = `Structure ${current} of ${RETINAL_STRUCTURE_TAP_STEPS.length}`;
  };

  const appendTargetArea = (target, className) => {
    const area = document.createElement("span");
    area.className = `retinal-structure-tap__target ${className}`.trim();
    area.style.left = `${(target.cx - target.rx) * 100}%`;
    area.style.top = `${(target.cy - target.ry) * 100}%`;
    area.style.width = `${target.rx * 200}%`;
    area.style.height = `${target.ry * 200}%`;
    overlay.appendChild(area);
  };

  const appendTapMarker = (tapX, tapY) => {
    const marker = document.createElement("span");
    marker.className = "retinal-structure-tap__tap-marker";
    marker.style.left = `${tapX * 100}%`;
    marker.style.top = `${tapY * 100}%`;
    overlay.appendChild(marker);
  };

  const renderOverlay = () => {
    overlay.innerHTML = "";

    if (!state.hasAnsweredCurrent) return;

    const step = getCurrentStep();
    const answer = getCurrentAnswer();
    if (!step || !answer) return;

    appendTargetArea(
      step.target,
      answer.correct
        ? "retinal-structure-tap__target--correct"
        : "retinal-structure-tap__target--answer",
    );
    appendTapMarker(answer.tapX, answer.tapY);
  };

  const renderResult = () => {
    const step = getCurrentStep();
    const answer = getCurrentAnswer();
    if (!step || !answer) return;

    banner.classList.remove("is-correct", "is-wrong");
    bannerBadge.classList.remove("is-correct", "is-wrong");

    if (answer.correct) {
      banner.classList.add("is-correct");
      bannerBadge.classList.add("is-correct");
      bannerBadge.textContent = "✓";
      bannerTitle.textContent = "Correct!";
      bannerCopy.textContent = "You tapped the correct structure.";
    } else {
      banner.classList.add("is-wrong");
      bannerBadge.classList.add("is-wrong");
      bannerBadge.textContent = "!";
      bannerTitle.textContent = "Not quite";
      bannerCopy.textContent = "Your tap was outside the correct area.";
    }

    explanation.textContent = step.explanation;
    nextButton.textContent =
      state.currentIndex === RETINAL_STRUCTURE_TAP_STEPS.length - 1
        ? "See results"
        : "Next >";
  };

  const renderPrompt = () => {
    const step = getCurrentStep();
    if (!step) return;

    prompt.textContent = step.label;
    tip.textContent = step.tip;
    promptCard.classList.toggle("is-answered", state.hasAnsweredCurrent);
  };

  const renderResultsList = () => {
    let correctCount = 0;
    resultsList.innerHTML = "";

    RETINAL_STRUCTURE_TAP_STEPS.forEach((step, index) => {
      const answer = state.answers[index];
      if (answer?.correct) correctCount += 1;

      const row = document.createElement("div");
      row.className = "retinal-structure-tap__results-row";

      const number = document.createElement("span");
      number.className = "retinal-structure-tap__results-number";
      number.textContent = String(index + 1);

      const body = document.createElement("div");
      body.className = "retinal-structure-tap__results-body";

      const title = document.createElement("p");
      title.className = "retinal-structure-tap__results-title";
      title.textContent = step.label;

      const copy = document.createElement("p");
      copy.className = "retinal-structure-tap__results-copy";
      copy.textContent = step.explanation;

      const status = document.createElement("span");
      status.className = "retinal-structure-tap__results-status";
      if (answer?.correct) {
        status.classList.add("is-correct");
        status.textContent = "Correct";
      } else {
        status.classList.add("is-wrong");
        status.textContent = "Wrong";
      }

      body.appendChild(title);
      body.appendChild(copy);
      row.appendChild(number);
      row.appendChild(body);
      row.appendChild(status);
      resultsList.appendChild(row);
    });

    resultsSummary.textContent = `You got ${correctCount} out of ${RETINAL_STRUCTURE_TAP_STEPS.length} correct.`;
  };

  const render = () => {
    renderProgress();
    renderPrompt();
    renderOverlay();

    idle.style.display = state.hasAnsweredCurrent ? "none" : "";
    result.style.display = state.hasAnsweredCurrent ? "" : "none";
    nextButton.style.display = state.hasAnsweredCurrent ? "" : "none";
    stage.disabled = state.hasAnsweredCurrent;

    if (state.hasAnsweredCurrent) {
      renderResult();
    }
  };

  const isInsideTarget = (tapX, tapY, target) => {
    const dx = (tapX - target.cx) / target.rx;
    const dy = (tapY - target.cy) / target.ry;
    return dx * dx + dy * dy <= 1;
  };

  const resetQuiz = () => {
    state.currentIndex = 0;
    state.answers = [];
    state.hasAnsweredCurrent = false;
    state.isComplete = false;
    closeResultsModal();
    render();
  };

  stage.addEventListener("pointerup", (event) => {
    if (state.hasAnsweredCurrent) return;

    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const tapX = (event.clientX - rect.left) / rect.width;
    const tapY = (event.clientY - rect.top) / rect.height;
    const step = getCurrentStep();
    if (!step) return;

    state.answers[state.currentIndex] = {
      tapX,
      tapY,
      correct: isInsideTarget(tapX, tapY, step.target),
    };
    state.hasAnsweredCurrent = true;
    render();
  });

  nextButton.addEventListener("click", () => {
    if (!state.hasAnsweredCurrent) return;

    if (state.currentIndex < RETINAL_STRUCTURE_TAP_STEPS.length - 1) {
      state.currentIndex += 1;
      state.hasAnsweredCurrent = false;
      render();
      try {
        window.scrollTo(0, 0);
      } catch {}
      return;
    }

    state.isComplete = true;
    render();
    renderResultsList();
    openResultsModal();
  });

  introCloseButtons.forEach((button) => {
    if (button.dataset.wired === "1") return;
    button.dataset.wired = "1";
    button.addEventListener("click", closeIntroModal);
  });

  resultsCloseButtons.forEach((button) => {
    if (button.dataset.wired === "1") return;
    button.dataset.wired = "1";
    button.addEventListener("click", closeResultsModal);
  });

  introModal.addEventListener("click", (event) => {
    if (event.target === introModal) closeIntroModal();
  });

  resultsModal.addEventListener("click", (event) => {
    if (event.target === resultsModal) closeResultsModal();
  });

  if (page.dataset.shownWired !== "1") {
    page.dataset.shownWired = "1";
    document.addEventListener("page:shown", (event) => {
      if (event.detail?.id !== "diabeticRetinalStructureTapPage") return;
      resetQuiz();
      openIntroModal();
    });
  }

  resetQuiz();
}

export function initializeDiabeticRetinopathyWorkshop() {
  const page = document.getElementById("diabeticRetinopathyWorkshopPage");
  if (!page) return;
  setupWorkshopFolders(page);

  const rows = page.querySelectorAll(".lesson-row[data-target]");
  rows.forEach((row) => {
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";

    const activate = async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const targetId = row.getAttribute("data-target");
      if (!targetId) return;

      const routeName = row.getAttribute("data-route");
      if (routeName) {
        await loadPage(routeName);
      }

      if (!document.getElementById(targetId)) return;
      showPageById(targetId);
    };

    row.addEventListener("click", activate);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") activate(event);
    });
  });

  initializeHistoryImageMatchPage(page);
  initializeRetinalStructureTapPage();
}

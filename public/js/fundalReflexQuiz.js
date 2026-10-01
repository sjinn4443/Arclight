import { setLessonProgress } from "./lessonProgress.js";
const SIGNS = [
  "symmetrical brightness in colour",
  "asymmetrical. difference in colours and the brightness",
  "loss of reflex",
  "partial loss of reflex in on eye",
  "healthy reflex",
];

// Matched against slide 100, not inferred from the appearance of the stills.
// The two normal descriptions are synonymous; either is accepted for case 2.
const CASES = [
  {
    normal: "No",
    signs: [1, 2],
    requireAllSigns: true,
    explanation:
      "The reflex is absent in one eye, making the two reflexes asymmetrical. Select both asymmetry and loss of reflex for full credit; either finding alone earns half credit.",
  },
  {
    normal: "Yes",
    signs: [0, 4],
    explanation:
      "Both eyes show symmetrical colour and brightness: a healthy reflex. Both ‘symmetrical brightness in colour’ and ‘healthy reflex’ are accepted.",
  },
  {
    normal: "No",
    signs: [1],
    explanation:
      "The two reflexes differ in colour and brightness. The matching video labels this asymmetry as abnormal.",
  },
  {
    normal: "No",
    signs: [1, 3],
    requireAllSigns: true,
    explanation:
      "The reflex is largely absent in one eye, with only a small residual reflex visible. Select both asymmetry and partial loss of reflex for full credit; either finding alone earns half credit.",
  },
  {
    normal: "No",
    signs: [1],
    explanation:
      "One reflex is red and brighter; the other is a different colour and brightness. The video shows this asymmetry as an abnormal finding.",
  },
];

export { CASES as FUNDAL_REFLEX_CASES };

export function initializeFundalReflexQuiz() {
  const page = document.getElementById("fundalReflexQuizPage");
  if (!page || page.dataset.wired === "1") return;
  page.dataset.wired = "1";
  const questions = page.querySelector("#frqQuestions");
  const submit = page.querySelector("#frqSubmit");
  const restart = page.querySelector("#frqRestart");
  const dialog = page.querySelector("#frqResults");
  const why = page.querySelector("#frqSeeWhy");
  const status = page.querySelector("#frqStatus");
  const answers = CASES.map(() => ({ normal: null, signs: [] }));
  let reviewing = false;
  let submitted = false;
  let activeDrag = null;

  function updateProgress() {
    const count = answers.filter(
      (a) => a.normal !== null && a.signs.length > 0,
    ).length;
    page.querySelector("#frqProgress").textContent =
      `${count} / ${CASES.length} answered`;
    submit.disabled = count !== CASES.length || submitted;
    status.textContent =
      count === CASES.length
        ? ""
        : "Answer both columns in all five questions to submit.";
    status.hidden = count === CASES.length;
  }

  function syncAnswers(card) {
    const answer = answers[Number(card.dataset.index)];
    answer.normal =
      card.querySelector('.frq-zone[data-field="normal"] .frq-chip')?.dataset
        .value ?? null;
    answer.signs = [
      ...card.querySelectorAll('.frq-zone[data-field="sign"] .frq-chip'),
    ].map((chip) => Number(chip.dataset.value));
    card.querySelectorAll(".frq-zone").forEach((zone) => {
      zone.querySelector(".frq-placeholder").hidden = Boolean(
        zone.querySelector(".frq-chip"),
      );
    });
    updateProgress();
  }

  function returnChip(chip) {
    if (submitted) return;
    const card = chip.closest(".frq-card");
    const bank = card.querySelector(
      `.frq-bank[data-field="${chip.dataset.field}"]`,
    );
    const next = [...bank.children].find(
      (item) => Number(item.dataset.order) > Number(chip.dataset.order),
    );
    bank.insertBefore(chip, next || null);
    syncAnswers(card);
  }

  function placeChip(chip, zone) {
    if (
      submitted ||
      chip.dataset.field !== zone.dataset.field ||
      chip.closest(".frq-card") !== zone.closest(".frq-card")
    )
      return;
    const card = zone.closest(".frq-card");
    const field = chip.dataset.field;
    const previous = zone.querySelector(".frq-chip");
    if (zone.contains(chip)) return;
    if (field === "normal" && previous) returnChip(previous);
    zone.querySelector(".frq-placeholder").hidden = true;
    zone.append(chip);
    syncAnswers(card);
  }

  function wireChip(chip, card) {
    let pointer = null;
    let suppressClick = false;
    const zone = card.querySelector(
      `.frq-zone[data-field="${chip.dataset.field}"]`,
    );
    chip.addEventListener("click", (event) => {
      if (suppressClick && event.detail !== 0) {
        suppressClick = false;
        return;
      }
      if (zone.contains(chip)) returnChip(chip);
      else placeChip(chip, zone);
    });
    chip.addEventListener("dragstart", (event) => {
      if (submitted) {
        event.preventDefault();
        return;
      }
      activeDrag = chip;
      event.dataTransfer.setData("text/plain", chip.id);
      event.dataTransfer.effectAllowed = "move";
    });
    chip.addEventListener("dragend", () => {
      activeDrag = null;
      page
        .querySelectorAll(".is-over")
        .forEach((el) => el.classList.remove("is-over"));
    });
    chip.addEventListener("pointerdown", (event) => {
      suppressClick = false;
      if (submitted || event.pointerType === "mouse" || !event.isPrimary)
        return;
      pointer = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        ghost: null,
      };
      chip.setPointerCapture(event.pointerId);
    });
    chip.addEventListener("pointermove", (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      if (
        !pointer.ghost &&
        Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) < 6
      )
        return;
      if (!pointer.ghost) {
        pointer.ghost = chip.cloneNode(true);
        pointer.ghost.removeAttribute("id");
        pointer.ghost.setAttribute("aria-hidden", "true");
        pointer.ghost.classList.add("frq-ghost");
        pointer.ghost.style.width = `${chip.getBoundingClientRect().width}px`;
        page.append(pointer.ghost);
      }
      pointer.ghost.style.left = `${event.clientX - 30}px`;
      pointer.ghost.style.top = `${event.clientY - 20}px`;
      zone.classList.toggle(
        "is-over",
        zone.contains(document.elementFromPoint(event.clientX, event.clientY)),
      );
    });
    function finishPointer(event, cancelled = false) {
      if (!pointer || pointer.id !== event.pointerId) return;
      const moved = Boolean(pointer.ghost);
      pointer.ghost?.remove();
      zone.classList.remove("is-over");
      pointer = null;
      if (chip.hasPointerCapture(event.pointerId))
        chip.releasePointerCapture(event.pointerId);
      if (moved) {
        suppressClick = true;
        const target = document.elementFromPoint(event.clientX, event.clientY);
        if (!cancelled && zone.contains(target)) placeChip(chip, zone);
        else if (
          !cancelled &&
          target &&
          zone.contains(chip) &&
          !card.querySelector(".frq-chart").contains(target)
        )
          returnChip(chip);
      }
    }
    chip.addEventListener("pointerup", (event) => finishPointer(event));
    chip.addEventListener("pointercancel", (event) =>
      finishPointer(event, true),
    );
    chip.addEventListener("lostpointercapture", (event) =>
      finishPointer(event, true),
    );
  }

  CASES.forEach((item, index) => {
    const card = page
      .querySelector("#frqCardTemplate")
      .content.firstElementChild.cloneNode(true);
    card.dataset.index = String(index);
    card.querySelector(".frq-number").textContent = String(index + 1);
    card
      .querySelector(".frq-number")
      .setAttribute("aria-label", `Question ${index + 1}`);
    card.querySelector("caption").textContent = `Question ${index + 1} answers`;
    const img = card.querySelector(".frq-image");
    img.src = `/images/quiz/fundal-reflex/case-${index + 1}.webp`;
    img.alt = `Fundal reflex photograph for question ${index + 1}`;
    for (const [field, labels] of [
      ["normal", ["Yes", "No"]],
      ["sign", SIGNS],
    ]) {
      const bank = card.querySelector(`.frq-bank[data-field="${field}"]`);
      labels.forEach((label, value) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "frq-chip";
        chip.id = `frq-${index}-${field}-${value}`;
        chip.dataset.field = field;
        chip.dataset.order = String(value);
        chip.dataset.value = field === "normal" ? label : String(value);
        chip.textContent = label;
        chip.draggable = true;
        wireChip(chip, card);
        bank.append(chip);
      });
    }
    card.querySelectorAll(".frq-zone").forEach((zone) => {
      zone.addEventListener("dragover", (event) => {
        if (
          !submitted &&
          activeDrag?.closest(".frq-card") === card &&
          activeDrag.dataset.field === zone.dataset.field
        ) {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          zone.classList.add("is-over");
        }
      });
      zone.addEventListener("dragleave", () =>
        zone.classList.remove("is-over"),
      );
      zone.addEventListener("drop", (event) => {
        event.preventDefault();
        zone.classList.remove("is-over");
        if (
          activeDrag?.closest(".frq-card") === card &&
          activeDrag.dataset.field === zone.dataset.field
        ) {
          placeChip(activeDrag, zone);
          activeDrag = null;
        }
      });
    });
    questions.append(card);
  });

  // Include app chrome and blank space outside the page in drag-out targets.
  // Dispose these document listeners when this route's DOM is replaced.
  const dragEvents = new AbortController();
  window.addEventListener(
    "page:loaded",
    () => {
      if (!page.isConnected) dragEvents.abort();
    },
    { signal: dragEvents.signal },
  );
  document.addEventListener(
    "dragover",
    (event) => {
      if (!submitted && activeDrag?.closest(".frq-zone"))
        event.preventDefault();
    },
    { signal: dragEvents.signal },
  );
  document.addEventListener(
    "drop",
    (event) => {
      if (!activeDrag || submitted) return;
      const chart = activeDrag.closest(".frq-chart");
      if (chart && !chart.contains(event.target)) {
        event.preventDefault();
        returnChip(activeDrag);
      }
      activeDrag = null;
    },
    { signal: dragEvents.signal },
  );

  function correctness(index) {
    const expected = CASES[index];
    const selected = answers[index].signs;
    const normal = answers[index].normal === expected.normal;
    const validSigns =
      selected.length > 0 &&
      selected.every((sign) => expected.signs.includes(sign));
    const signScore = validSigns
      ? expected.requireAllSigns
        ? selected.length / expected.signs.length
        : 1
      : 0;
    return { normal, signScore, score: normal ? signScore : 0 };
  }

  submit.addEventListener("click", () => {
    if (submitted || answers.some((a) => a.normal === null || !a.signs.length))
      return;
    submitted = true;
    setLessonProgress("fundalReflexQuizPage", 100);
    submit.disabled = true;
    const scores = CASES.map((_, i) => correctness(i).score);
    const summary = page.querySelector("#frqScore");
    summary.replaceChildren();
    const counts = [
      [scores.filter((score) => score === 1).length, "correct", "is-correct"],
      [
        scores.filter((score) => score === 0.5).length,
        "partly correct",
        "is-partial",
      ],
      [
        scores.filter((score) => score === 0).length,
        "incorrect",
        "is-incorrect",
      ],
    ].filter(([count, , className]) => className !== "is-partial" || count > 0);
    counts.forEach(([count, label, className], i) => {
      if (i) summary.append(document.createTextNode(" · "));
      const countText = document.createElement("span");
      countText.className = className;
      countText.textContent = `${count} ${label}`;
      summary.append(countText);
    });
    summary.append(
      document.createTextNode(` out of ${CASES.length} questions.`),
    );
    page.querySelector("#frqPoints").textContent =
      `Score: ${scores.reduce((sum, score) => sum + score, 0)} / ${CASES.length}`;
    dialog.showModal();
    why.focus();
  });

  function showReview() {
    if (reviewing || !submitted) return;
    reviewing = true;
    questions.querySelectorAll(".frq-card").forEach((card, index) => {
      const result = correctness(index);
      const resultClass =
        result.score === 1
          ? "is-correct"
          : result.score === 0.5
            ? "is-partial"
            : "is-incorrect";
      card.querySelector(".frq-result").classList.add(resultClass);
      card.querySelector(".frq-result").textContent =
        result.score === 1
          ? "✓ Correct"
          : result.score === 0.5
            ? "△ Partly correct (½)"
            : "✕ Incorrect";
      card.querySelectorAll(".frq-chip").forEach((chip) => {
        chip.disabled = true;
        chip.draggable = false;
      });
      card.querySelectorAll(".frq-zone").forEach((zone) => {
        zone.querySelectorAll(".frq-chip").forEach((chip) => {
          const correct =
            zone.dataset.field === "normal"
              ? result.normal
              : CASES[index].signs.includes(Number(chip.dataset.value));
          chip.classList.add(correct ? "is-correct" : "is-incorrect");
          chip.textContent = `${correct ? "✓" : "✕"} ${chip.textContent}`;
        });
      });
      card.querySelector(".frq-banks").hidden = true;
      const img = card.querySelector(".frq-image");
      img.classList.add("is-explanation");
      img.src = `/images/quiz/fundal-reflex/case-${index + 1}-explanation.gif`;
      img.alt = `Animated explanation for question ${index + 1}: ${CASES[index].explanation}`;
      const explanation = card.querySelector(".frq-explanation");
      const answer = document.createElement("p");
      const strong = document.createElement("strong");
      strong.className = resultClass;
      for (const [label, value, valueClass] of [
        [
          "Normal? ",
          `${CASES[index].normal}. `,
          result.normal ? "is-correct" : "is-incorrect",
        ],
        [
          "Clinical Sign: ",
          `${CASES[index].signs.map((id) => SIGNS[id]).join(CASES[index].requireAllSigns ? " + " : " / ")}.`,
          result.signScore === 1
            ? "is-correct"
            : result.signScore === 0.5
              ? "is-partial"
              : "is-incorrect",
        ],
      ]) {
        const name = document.createElement("span");
        name.className = "frq-answer-label";
        name.textContent = label;
        const text = document.createElement("span");
        text.className = `frq-answer-value ${valueClass}`;
        text.textContent = value;
        strong.append(name, text);
      }
      answer.append(strong);
      const detail = document.createElement("p");
      detail.textContent = CASES[index].explanation;
      explanation.replaceChildren(answer, detail);
      explanation.hidden = false;
    });
    submit.hidden = true;
    restart.hidden = false;
    status.textContent = "";
    status.hidden = true;
    const first = questions.querySelector(".frq-card");
    first.tabIndex = -1;
    first.focus({ preventScroll: true });
    first.scrollIntoView({ block: "start" });
  }
  why.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", showReview);
  // Escape also opens the explanation, keeping the learner out of a locked state.
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    dialog.close();
  });
  restart.addEventListener("click", () => {
    answers.forEach((answer) => {
      answer.normal = null;
      answer.signs = [];
    });
    reviewing = false;
    submitted = false;
    questions.querySelectorAll(".frq-card").forEach((card, index) => {
      card.querySelector(".frq-result").textContent = "";
      card
        .querySelector(".frq-result")
        .classList.remove("is-correct", "is-incorrect", "is-partial");
      card.querySelector(".frq-image").classList.remove("is-explanation");
      card.querySelector(".frq-image").src =
        `/images/quiz/fundal-reflex/case-${index + 1}.webp`;
      card.querySelector(".frq-image").alt =
        `Fundal reflex photograph for question ${index + 1}`;
      card.querySelector(".frq-explanation").hidden = true;
      card.querySelector(".frq-banks").hidden = false;
      card.querySelectorAll(".frq-chip").forEach((chip) => {
        chip.disabled = false;
        chip.draggable = true;
        chip.classList.remove("is-correct", "is-incorrect");
        chip.textContent =
          chip.dataset.field === "normal"
            ? chip.dataset.value
            : SIGNS[Number(chip.dataset.value)];
        returnChip(chip);
      });
      card.querySelectorAll(".frq-placeholder").forEach((el) => {
        el.hidden = false;
      });
    });
    submit.hidden = false;
    restart.hidden = true;
    updateProgress();
    const first = questions.querySelector(".frq-chip");
    first.focus({ preventScroll: true });
    questions.scrollIntoView({ block: "start" });
  });
  updateProgress();
}

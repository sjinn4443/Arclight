const {
  MCQ_SET_STORAGE_KEY,
  MCQ_LEVELS,
  MCQ_SET_KEYS,
  MCQ_LEVEL_LABELS,
  MCQ_SET_LABELS,
  PATTERNS,
  SITES,
  TEXT_BANK,
  FIELD_SPECS_PRIMARY,
  FIELD_SPECS_HIGHER,
  FIELD_SPECS_ADVANCED_EXTRA,
  PATHWAY_SPECS_PRIMARY,
  PATHWAY_SPECS_HIGHER,
  PATHWAY_SPECS_ADVANCED_EXTRA,
  TEACHING_CASES,
} = window.MCQ_DATA || {};

if (!window.MCQ_DATA) {
  console.error(
    "MCQ data missing: src/mcq-data.js must load before src/mcq.js",
  );
}
function shuffle(items) {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function getStoredSetKey() {
  try {
    const saved = localStorage.getItem(MCQ_SET_STORAGE_KEY);
    return MCQ_SET_KEYS.includes(saved) ? saved : "textClassic";
  } catch (_error) {
    return "textClassic";
  }
}

function storeSetKey(setKey) {
  try {
    localStorage.setItem(MCQ_SET_STORAGE_KEY, setKey);
  } catch (_error) {
    // Ignore storage failures.
  }
}

function getPatternName(patternKey, level) {
  const entry = PATTERNS[patternKey];
  if (!entry) return patternKey;
  return entry.names[level] || entry.names.advanced || patternKey;
}

function getSiteName(siteKey, level) {
  const entry = SITES[siteKey];
  if (!entry || !entry.names) return siteKey;
  return (
    entry.names[level] ||
    entry.names.advanced ||
    entry.names.intermediate ||
    siteKey
  );
}

function getPatternCenterState(pattern, side) {
  if (!pattern || typeof pattern !== "object") return "normal";
  const center =
    pattern.center && typeof pattern.center === "object"
      ? pattern.center
      : null;
  if (center && typeof center[side] === "string") {
    return center[side];
  }
  return "normal";
}

const MINI_SVG_NS = "http://www.w3.org/2000/svg";

function createMiniSvgElement(tag, attrs = {}) {
  const node = document.createElementNS(MINI_SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => {
    node.setAttribute(key, String(value));
  });
  return node;
}

function getPatternPointState(pattern, side, point) {
  const lossSet = new Set((pattern && pattern[side]) || []);
  const suspectSet = new Set((pattern && pattern[`${side}Suspect`]) || []);
  if (lossSet.has(point)) return "loss";
  if (suspectSet.has(point)) return "suspect";
  return "normal";
}

function getMiniStateClass(state) {
  if (state === "loss") return "loss";
  if (state === "suspect") return "suspect";
  return "normal";
}

function appendMiniCentre(svg, state) {
  svg.appendChild(
    createMiniSvgElement("circle", {
      class: `mcq-mini-centre ${getMiniStateClass(state)}`,
      cx: 50,
      cy: 50,
      r: 13,
    }),
  );
}

function appendMiniSector(svg, position, state) {
  if (state === "normal") return;

  const paths = {
    tl: "M50 50 L50 3 A47 47 0 0 0 3 50 Z",
    tr: "M50 50 L97 50 A47 47 0 0 0 50 3 Z",
    bl: "M50 50 L3 50 A47 47 0 0 0 50 97 Z",
    br: "M50 50 L50 97 A47 47 0 0 0 97 50 Z",
  };
  svg.appendChild(
    createMiniSvgElement("path", {
      class: `mcq-mini-sector ${getMiniStateClass(state)}`,
      d: paths[position],
    }),
  );
}

function createMiniEye(pattern, side) {
  const eyeWrap = document.createElement("div");
  eyeWrap.className = "mcq-mini-eye";

  const eyeLabel = document.createElement("div");
  eyeLabel.className = "mcq-mini-eye-label";
  eyeLabel.textContent = side === "right" ? "R" : "L";
  eyeWrap.appendChild(eyeLabel);

  const circle = createMiniSvgElement("svg", {
    class: "mcq-mini-eye-circle",
    viewBox: "0 0 100 100",
    focusable: "false",
    role: "img",
    "aria-label": `${side === "right" ? "Right" : "Left"} field snapshot`,
  });
  circle.appendChild(
    createMiniSvgElement("circle", {
      class: "mcq-mini-disc",
      cx: 50,
      cy: 50,
      r: 47,
    }),
  );

  const posMap =
    side === "right"
      ? [
          { key: "st", position: "tl" },
          { key: "sn", position: "tr" },
          { key: "it", position: "bl" },
          { key: "in", position: "br" },
        ]
      : [
          { key: "sn", position: "tl" },
          { key: "st", position: "tr" },
          { key: "in", position: "bl" },
          { key: "it", position: "br" },
        ];

  posMap.forEach((pos) => {
    appendMiniSector(
      circle,
      pos.position,
      getPatternPointState(pattern, side, pos.key),
    );
  });

  circle.appendChild(
    createMiniSvgElement("circle", {
      class: "mcq-mini-outline",
      cx: 50,
      cy: 50,
      r: 47,
    }),
  );
  circle.appendChild(
    createMiniSvgElement("line", {
      class: "mcq-mini-divider-line",
      x1: 6,
      y1: 50,
      x2: 94,
      y2: 50,
    }),
  );
  circle.appendChild(
    createMiniSvgElement("line", {
      class: "mcq-mini-divider-line",
      x1: 50,
      y1: 6,
      x2: 50,
      y2: 94,
    }),
  );

  appendMiniCentre(circle, getPatternCenterState(pattern, side));

  eyeWrap.appendChild(circle);
  return eyeWrap;
}

function createPatternCard(patternKey, captionText) {
  const pattern = PATTERNS[patternKey];
  const card = document.createElement("div");
  card.className = "mcq-pattern-card";

  const eyes = document.createElement("div");
  eyes.className = "mcq-pattern-eyes";
  eyes.appendChild(createMiniEye(pattern, "right"));
  eyes.appendChild(createMiniEye(pattern, "left"));
  card.appendChild(eyes);

  if (captionText) {
    const caption = document.createElement("div");
    caption.className = "mcq-pattern-caption";
    caption.textContent = captionText;
    card.appendChild(caption);
  }
  return card;
}

function createPathwayCard(siteKey, captionText, options = {}) {
  const card = document.createElement("div");
  card.className = "mcq-pathway-card";
  const sourceSvg = document.getElementById("pathway-svg");
  const marks = Array.isArray(options.marks)
    ? options.marks
    : (SITES[siteKey] && SITES[siteKey].marks) || [];

  if (sourceSvg) {
    const clone = sourceSvg.cloneNode(true);
    clone.removeAttribute("id");
    clone.classList.add("mcq-pathway-svg");
    clone.setAttribute("aria-hidden", "true");

    // Ensure no live-diagram highlight state leaks into teaching/MCQ clones.
    clone.querySelectorAll(".pathway-active, .pathway-flash").forEach((el) => {
      el.classList.remove("pathway-active", "pathway-flash");
    });

    clone.querySelectorAll(".pathway-part").forEach((part) => {
      part.classList.remove("pathway-active", "pathway-flash");
    });
    marks.forEach((id) => {
      const part = clone.querySelector(`[id="${id}"]`);
      if (part) {
        part.classList.add("pathway-active");
      }
    });

    // Remove duplicate IDs after highlights are applied.
    clone.querySelectorAll("[id]").forEach((node) => {
      node.removeAttribute("id");
    });

    card.appendChild(clone);
  } else {
    const fallback = document.createElement("div");
    fallback.className = "mcq-pattern-caption";
    fallback.textContent = "Pathway diagram unavailable";
    card.appendChild(fallback);
  }

  if (captionText) {
    const caption = document.createElement("div");
    caption.className = "mcq-pattern-caption";
    caption.textContent = captionText;
    card.appendChild(caption);
  }
  return card;
}

function getTeachingPathwayMarks(siteKey) {
  const baseMarks = (SITES[siteKey] && SITES[siteKey].marks) || [];
  const marks = new Set(baseMarks);

  if (siteKey === "leftMeyer") {
    marks.add("part-occipital-left");
    marks.add("part-v1-left");
    marks.add("part-calcarine-lower-left");
  } else if (siteKey === "rightMeyer") {
    marks.add("part-occipital-right");
    marks.add("part-v1-right");
    marks.add("part-calcarine-lower-right");
  } else if (siteKey === "leftParietal") {
    marks.add("part-occipital-left");
    marks.add("part-v1-left");
    marks.add("part-calcarine-upper-left");
  } else if (siteKey === "rightParietal") {
    marks.add("part-occipital-right");
    marks.add("part-v1-right");
    marks.add("part-calcarine-upper-right");
  }

  return [...marks];
}

function labelAB(index, prefix) {
  return `${prefix} ${String.fromCharCode(65 + index)}`;
}

function buildTextQuestions(level) {
  const bank = TEXT_BANK[level] || TEXT_BANK.primary;
  return shuffle(bank).map((q) => ({
    id: q.id,
    prompt: q.prompt,
    stem: null,
    answerKey: q.answer,
    options: shuffle(q.options).map((opt, i) => ({
      id: `${q.id}-o${i + 1}`,
      kind: "text",
      key: opt.key,
      label: opt.label,
    })),
  }));
}

function buildFieldQuestions(level) {
  const specs =
    level === "primary"
      ? FIELD_SPECS_PRIMARY
      : level === "advanced"
        ? FIELD_SPECS_HIGHER.concat(FIELD_SPECS_ADVANCED_EXTRA)
        : FIELD_SPECS_HIGHER;
  const prompt =
    level === "primary"
      ? "What pattern is shown?"
      : "What is this field-loss pattern?";
  return shuffle(specs).map((spec) => ({
    id: spec.id,
    prompt,
    stem: { kind: "pattern", key: spec.stem, caption: "Pattern" },
    answerKey: spec.answer,
    options: shuffle(spec.opts).map((key, i) => ({
      id: `${spec.id}-o${i + 1}`,
      kind: "text",
      key,
      label: getPatternName(key, level),
    })),
  }));
}

function buildPathwayQuestions(level) {
  const specs =
    level === "primary"
      ? PATHWAY_SPECS_PRIMARY
      : level === "advanced"
        ? PATHWAY_SPECS_HIGHER.concat(PATHWAY_SPECS_ADVANCED_EXTRA)
        : PATHWAY_SPECS_HIGHER;
  return shuffle(specs).map((spec) => ({
    id: spec.id,
    prompt: spec.prompt,
    stem: spec.stem,
    answerKey: spec.answer,
    options: shuffle(spec.opts).map((key, i) => ({
      id: `${spec.id}-o${i + 1}`,
      kind: spec.optionKind,
      key,
      label: labelAB(i, spec.optionKind === "pattern" ? "Pattern" : "Site"),
    })),
  }));
}

function buildQuestions(setKey, level) {
  if (setKey === "textClassic") return buildTextQuestions(level);
  if (setKey === "pathwayVisual") return buildPathwayQuestions(level);
  return buildFieldQuestions(level);
}

function getPassMark(level, total) {
  if (level === "advanced") return Math.ceil(total * 0.75);
  if (level === "intermediate") return Math.ceil(total * 0.67);
  return Math.ceil(total * 0.6);
}

function createMcqController() {
  const state = {
    activeSet: "textClassic",
    activeLevel: "primary",
    questions: [],
    submitted: false,
  };
  const dom = {};

  function cacheDom() {
    dom.menuIcon = document.getElementById("menu-icon");
    dom.menuClose = document.getElementById("menu-close");
    dom.menuBackdrop = document.getElementById("menu-backdrop");
    dom.sideMenu = document.getElementById("side-menu");
    dom.setButtons = Array.from(document.querySelectorAll(".mcq-set-button"));
    dom.levelButtons = Array.from(
      document.querySelectorAll(".mcq-level-button"),
    );
    dom.teachingToggle = document.getElementById("teaching-toggle");
    dom.teachingCases = document.getElementById("teaching-cases");
    dom.modal = document.getElementById("mcq-modal");
    dom.modalContent = dom.modal
      ? dom.modal.querySelector(".mcq-modal-content")
      : null;
    dom.modalTitle = document.getElementById("mcq-title");
    dom.modalClose = document.getElementById("mcq-close");
    dom.meta = document.getElementById("mcq-meta");
    dom.form = document.getElementById("mcq-form");
    dom.submit = document.getElementById("mcq-submit");
    dom.restart = document.getElementById("mcq-restart");
    dom.result = document.getElementById("mcq-result");
  }

  function isReady() {
    return Boolean(
      dom.menuIcon &&
      dom.menuClose &&
      dom.menuBackdrop &&
      dom.sideMenu &&
      dom.modal &&
      dom.modalContent &&
      dom.modalTitle &&
      dom.modalClose &&
      dom.meta &&
      dom.form &&
      dom.submit &&
      dom.restart &&
      dom.result,
    );
  }

  function openMenu() {
    dom.menuBackdrop.hidden = false;
    dom.sideMenu.hidden = false;
  }

  function closeMenu() {
    dom.sideMenu.hidden = true;
    dom.menuBackdrop.hidden = true;
  }

  function openModal() {
    dom.modal.hidden = false;
  }

  function closeModal() {
    dom.modal.hidden = true;
  }

  function setActiveSet(setKey) {
    state.activeSet = MCQ_SET_KEYS.includes(setKey) ? setKey : "textClassic";
    storeSetKey(state.activeSet);
    dom.setButtons.forEach((btn) => {
      const on = btn.getAttribute("data-set") === state.activeSet;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function renderStem(stem) {
    if (!stem || !stem.kind) return null;
    const wrap = document.createElement("div");
    wrap.className = "mcq-stem-wrap";
    if (stem.kind === "pattern")
      wrap.appendChild(createPatternCard(stem.key, ""));
    if (stem.kind === "pathway")
      wrap.appendChild(createPathwayCard(stem.key, ""));
    return wrap;
  }

  function renderOptionBody(option) {
    const body = document.createElement("div");
    body.className = "mcq-option-body";
    if (option.kind === "pattern") {
      body.appendChild(createPatternCard(option.key, ""));
      return body;
    }
    if (option.kind === "pathway") {
      body.appendChild(createPathwayCard(option.key, ""));
      return body;
    }
    const span = document.createElement("span");
    span.textContent = option.label;
    body.appendChild(span);
    return body;
  }

  function renderQuestions() {
    dom.form.innerHTML = "";
    state.questions.forEach((q, idx) => {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "mcq-question";
      const questionHasVisualOptions = q.options.some(
        (opt) => opt.kind === "pattern" || opt.kind === "pathway",
      );
      if (questionHasVisualOptions) {
        fieldset.classList.add("has-visual-options");
      }

      const legend = document.createElement("legend");
      const promptText = String(q.prompt || "");
      if (promptText === "Pick the best matching field pattern.") {
        legend.appendChild(document.createTextNode(`${idx + 1}. Pick the `));
        const em = document.createElement("em");
        em.textContent = "best";
        legend.appendChild(em);
        legend.appendChild(document.createTextNode(" matching field pattern."));
      } else {
        legend.textContent = `${idx + 1}. ${promptText}`;
      }
      fieldset.appendChild(legend);

      const stem = renderStem(q.stem);
      if (stem) fieldset.appendChild(stem);

      const opts = document.createElement("div");
      opts.className = "mcq-options";

      q.options.forEach((opt) => {
        const label = document.createElement("label");
        const isVisual = opt.kind === "pattern" || opt.kind === "pathway";
        label.className = isVisual
          ? "mcq-option mcq-option-visual"
          : "mcq-option";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = `q-${idx}`;
        input.value = opt.id;
        input.dataset.key = opt.key;
        label.appendChild(input);

        label.appendChild(renderOptionBody(opt));
        opts.appendChild(label);
      });

      fieldset.appendChild(opts);
      dom.form.appendChild(fieldset);
    });
  }

  function renderMeta() {
    const levelLabel =
      MCQ_LEVEL_LABELS[state.activeLevel] || MCQ_LEVEL_LABELS.primary;
    const setLabel =
      MCQ_SET_LABELS[state.activeSet] || MCQ_SET_LABELS.textClassic;
    dom.modalTitle.textContent = `MCQ - ${levelLabel}`;
    dom.meta.textContent = `${setLabel} | ${state.questions.length} questions`;
  }

  function renderTeachingCards() {
    if (!dom.teachingCases || !Array.isArray(TEACHING_CASES)) return;

    dom.teachingCases.innerHTML = "";
    const fragment = document.createDocumentFragment();

    TEACHING_CASES.forEach((item) => {
      const card = document.createElement("article");
      card.className = "teaching-case-card";
      card.setAttribute("role", "listitem");

      const header = document.createElement("div");
      header.className = "teaching-case-header";

      const index = document.createElement("span");
      index.className = "teaching-case-index";
      index.textContent = String(item.number).padStart(2, "0");
      header.appendChild(index);

      const family = document.createElement("span");
      family.className = "teaching-case-family";
      family.textContent = item.family;
      header.appendChild(family);

      card.appendChild(header);

      const visuals = document.createElement("div");
      visuals.className = "teaching-case-visuals";

      const pattern = createPatternCard(item.pattern, "");
      pattern.classList.add("teaching-visual-card");
      visuals.appendChild(pattern);

      const pathway = createPathwayCard(
        item.site,
        getSiteName(item.site, "advanced"),
        { marks: getTeachingPathwayMarks(item.site) },
      );
      pathway.classList.add("teaching-visual-card");
      visuals.appendChild(pathway);

      card.appendChild(visuals);
      fragment.appendChild(card);
    });

    dom.teachingCases.appendChild(fragment);
  }

  function setTeachingExpanded(isExpanded) {
    const expanded = Boolean(isExpanded);
    if (dom.teachingCases) {
      dom.teachingCases.hidden = !expanded;
    }
    if (dom.teachingToggle) {
      dom.teachingToggle.setAttribute(
        "aria-expanded",
        expanded ? "true" : "false",
      );
      dom.teachingToggle.textContent = expanded
        ? "Hide teaching cards"
        : "Teaching cards";
      dom.teachingToggle.classList.toggle("is-active", expanded);
    }
  }

  function resetResult() {
    dom.result.textContent = "";
    dom.result.classList.remove("pass", "fail");
    dom.submit.disabled = false;
    state.submitted = false;
  }

  function buildQuiz(level) {
    state.activeLevel = MCQ_LEVELS.includes(level) ? level : "primary";
    state.questions = buildQuestions(state.activeSet, state.activeLevel);
    renderMeta();
    renderQuestions();
    resetResult();
  }

  function startQuiz(level) {
    buildQuiz(level);
    closeMenu();
    openModal();
  }

  function handleSubmit() {
    if (state.submitted) return;
    let missing = false;
    let score = 0;
    const missed = [];

    state.questions.forEach((q, idx) => {
      const optionInputs = Array.from(
        dom.form.querySelectorAll(`input[name="q-${idx}"]`),
      );
      optionInputs.forEach((input) => {
        const optionEl = input.closest(".mcq-option");
        if (optionEl) {
          optionEl.classList.remove("is-correct", "is-wrong");
        }
      });

      const selected = dom.form.querySelector(`input[name="q-${idx}"]:checked`);
      if (!selected) {
        missing = true;
        return;
      }

      const correctInput = optionInputs.find(
        (input) => (input.dataset.key || "") === q.answerKey,
      );
      if (correctInput) {
        const correctOption = correctInput.closest(".mcq-option");
        if (correctOption) {
          correctOption.classList.add("is-correct");
        }
      }

      const isCorrect = (selected.dataset.key || "") === q.answerKey;
      if (isCorrect) {
        score += 1;
      } else {
        missed.push(idx + 1);
        const selectedOption = selected.closest(".mcq-option");
        if (selectedOption) {
          selectedOption.classList.add("is-wrong");
        }
      }
    });

    if (missing) {
      dom.result.textContent = "Answer all questions first.";
      dom.result.classList.remove("pass");
      dom.result.classList.add("fail");
      return;
    }

    const total = state.questions.length;
    const passMark = getPassMark(state.activeLevel, total);
    const passed = score >= passMark;
    const missedText = missed.length ? ` Missed: ${missed.join(", ")}.` : "";
    dom.result.textContent = `Score ${score}/${total}. ${passed ? "Pass" : "Review and retry"} (Pass ${passMark}/${total}).${missedText}`;
    dom.result.classList.toggle("pass", passed);
    dom.result.classList.toggle("fail", !passed);

    dom.form.querySelectorAll("input[type='radio']").forEach((input) => {
      input.disabled = true;
    });
    dom.submit.disabled = true;
    state.submitted = true;
  }

  function handleRestart() {
    buildQuiz(state.activeLevel);
  }

  function handleEsc(event) {
    if (event.key !== "Escape") return;
    if (!dom.modal.hidden) {
      closeModal();
      return;
    }
    if (!dom.sideMenu.hidden) closeMenu();
  }

  function bindEvents() {
    if (dom.menuIcon.dataset.mcqBound === "true") return;
    dom.menuIcon.addEventListener("click", openMenu);
    dom.menuClose.addEventListener("click", closeMenu);
    dom.menuBackdrop.addEventListener("click", closeMenu);

    dom.setButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        setActiveSet(btn.getAttribute("data-set") || "textClassic");
        btn.closest(".side-menu-details")?.removeAttribute("open");
      });
    });
    dom.levelButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        startQuiz(btn.getAttribute("data-level") || "primary");
      });
    });

    if (dom.teachingToggle) {
      dom.teachingToggle.addEventListener("click", () => {
        const currentlyExpanded =
          dom.teachingToggle.getAttribute("aria-expanded") === "true";
        setTeachingExpanded(!currentlyExpanded);
      });
    }

    dom.modalClose.addEventListener("click", closeModal);
    dom.submit.addEventListener("click", handleSubmit);
    dom.restart.addEventListener("click", handleRestart);

    dom.modal.addEventListener("click", (event) => {
      if (event.target === dom.modal) closeModal();
    });

    document.addEventListener("keydown", handleEsc);
    dom.menuIcon.dataset.mcqBound = "true";
  }

  function init() {
    cacheDom();
    if (!isReady()) return;
    setActiveSet(getStoredSetKey());
    bindEvents();
    renderTeachingCards();
    setTeachingExpanded(false);
  }

  return { init };
}

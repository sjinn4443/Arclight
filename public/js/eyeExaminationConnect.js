import { setLessonProgress } from "./lessonProgress.js";

export const EYE_EXAMINATION_CONNECT_PAGE_ID = "eyeExaminationConnectPage";
export const EYE_EXAMINATION_CONNECT_GRID_SIZE = 7;

const TOTAL_CELLS =
  EYE_EXAMINATION_CONNECT_GRID_SIZE * EYE_EXAMINATION_CONNECT_GRID_SIZE;
const TUTORIAL_STORAGE_KEY = "eyeExaminationConnect:tutorialSeen:v5";

function connectText(source, variables = {}) {
  let translated = window.I18N?.translateLiteral?.(source, source) ?? source;
  Object.entries(variables).forEach(([key, value]) => {
    translated = translated.replaceAll(`{{${key}}}`, String(value));
  });
  return translated;
}

export const EYE_EXAMINATION_CONNECT_STEPS = [
  {
    key: "history",
    label: "History Taking",
    row: 4,
    col: 0,
    image: "/images/quiz/connect/history.png",
  },
  {
    key: "va",
    label: "Visual Acuity",
    row: 0,
    col: 0,
    image: "/images/quiz/connect/va.png",
  },
  {
    key: "frontofeye",
    label: "Front of eye",
    row: 2,
    col: 6,
    image: "/images/quiz/connect/frontofeye.png",
  },
  {
    key: "pupils",
    label: "Pupils",
    row: 6,
    col: 6,
    image: "/images/quiz/connect/pupils.png",
  },
  {
    key: "fundalreflex",
    label: "Fundal reflex",
    row: 5,
    col: 1,
    image: "/images/quiz/connect/fundalreflex.png",
  },
  {
    key: "do",
    label: "Direct Ophthalmoscopy",
    row: 1,
    col: 5,
    image: "/images/quiz/connect/do.png",
  },
];

const toCellIndex = (row, col) => row * EYE_EXAMINATION_CONNECT_GRID_SIZE + col;

const toCellPosition = (index) => ({
  row: Math.floor(index / EYE_EXAMINATION_CONNECT_GRID_SIZE),
  col: index % EYE_EXAMINATION_CONNECT_GRID_SIZE,
});

const CHECKPOINT_INDEX_BY_CELL = new Map(
  EYE_EXAMINATION_CONNECT_STEPS.map((step, index) => [
    toCellIndex(step.row, step.col),
    index,
  ]),
);

/*
 * A verified full-grid route. The player is free to discover any valid route;
 * this path documents that the checkpoint layout is solvable and supports tests.
 */
export const EYE_EXAMINATION_CONNECT_SOLUTION = [
  [4, 0],
  [3, 0],
  [2, 0],
  [2, 1],
  [2, 2],
  [1, 2],
  [1, 1],
  [1, 0],
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [1, 6],
  [2, 6],
  [3, 6],
  [4, 6],
  [5, 6],
  [6, 6],
  [6, 5],
  [6, 4],
  [6, 3],
  [6, 2],
  [6, 1],
  [6, 0],
  [5, 0],
  [5, 1],
  [5, 2],
  [5, 3],
  [5, 4],
  [5, 5],
  [4, 5],
  [4, 4],
  [4, 3],
  [4, 2],
  [4, 1],
  [3, 1],
  [3, 2],
  [3, 3],
  [3, 4],
  [3, 5],
  [2, 5],
  [2, 4],
  [2, 3],
  [1, 3],
  [1, 4],
  [1, 5],
].map(([row, col]) => toCellIndex(row, col));

export function areEyeExaminationConnectCellsAdjacent(first, second) {
  if (!Number.isInteger(first) || !Number.isInteger(second)) return false;
  const a = toCellPosition(first);
  const b = toCellPosition(second);
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
}

export function evaluateEyeExaminationConnectPath(path = []) {
  const normalized = Array.isArray(path)
    ? path.filter((cell) => Number.isInteger(cell))
    : [];
  const encounteredCheckpoints = normalized
    .map((cell) => CHECKPOINT_INDEX_BY_CELL.get(cell))
    .filter((value) => value !== undefined);
  const orderCorrect = encounteredCheckpoints.every(
    (checkpoint, index) => checkpoint === index,
  );
  const adjacent = normalized.every(
    (cell, index) =>
      index === 0 ||
      areEyeExaminationConnectCellsAdjacent(normalized[index - 1], cell),
  );
  const unique = new Set(normalized).size === normalized.length;
  const startsCorrectly =
    normalized[0] ===
    toCellIndex(
      EYE_EXAMINATION_CONNECT_STEPS[0].row,
      EYE_EXAMINATION_CONNECT_STEPS[0].col,
    );
  const endsCorrectly =
    normalized[normalized.length - 1] ===
    toCellIndex(
      EYE_EXAMINATION_CONNECT_STEPS.at(-1).row,
      EYE_EXAMINATION_CONNECT_STEPS.at(-1).col,
    );
  const fillsGrid = normalized.length === TOTAL_CELLS && unique;

  return {
    adjacent,
    complete:
      startsCorrectly &&
      endsCorrectly &&
      adjacent &&
      unique &&
      fillsGrid &&
      orderCorrect &&
      encounteredCheckpoints.length === EYE_EXAMINATION_CONNECT_STEPS.length,
    encounteredCheckpoints,
    endsCorrectly,
    fillsGrid,
    orderCorrect,
    startsCorrectly,
    unique,
  };
}

function readTutorialSeen() {
  try {
    return localStorage.getItem(TUTORIAL_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeTutorialSeen() {
  try {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "1");
  } catch {
    // The tutorial can still close when storage is unavailable.
  }
}

function getExpectedCheckpoint(path) {
  let expected = 0;
  path.forEach((cell) => {
    if (CHECKPOINT_INDEX_BY_CELL.get(cell) === expected) expected += 1;
  });
  return expected;
}

function createCellElements(cellsHost) {
  const cellElements = [];
  cellsHost.replaceChildren();

  for (let index = 0; index < TOTAL_CELLS; index += 1) {
    const cell = document.createElement("div");
    const position = toCellPosition(index);
    const checkpointIndex = CHECKPOINT_INDEX_BY_CELL.get(index);
    cell.className = "exam-connect__cell";
    cell.dataset.cell = String(index);
    cell.dataset.row = String(position.row);
    cell.dataset.col = String(position.col);

    if (checkpointIndex !== undefined) {
      const step = EYE_EXAMINATION_CONNECT_STEPS[checkpointIndex];
      const marker = document.createElement("span");
      const image = document.createElement("img");
      const label = document.createElement("span");

      cell.classList.add("has-checkpoint");
      marker.className = "exam-connect__marker";
      image.src = step.image;
      image.alt = "";
      image.draggable = false;
      label.className = "exam-connect__marker-label";
      label.textContent = connectText(step.label);
      marker.title = connectText(step.longLabel || step.label);
      marker.append(image, label);
      cell.appendChild(marker);
    }

    cellsHost.appendChild(cell);
    cellElements.push(cell);
  }

  return cellElements;
}

function createController(page) {
  const board = page.querySelector("#examConnectBoard");
  const cellsHost = page.querySelector(".exam-connect__cells");
  const status = page.querySelector("#examConnectStatus");
  const filled = page.querySelector("#examConnectFilled");
  const sequence = Array.from(
    page.querySelectorAll("#examConnectSequence [data-connect-step]"),
  );
  const lines = Array.from(page.querySelectorAll("[data-connect-line]"));
  const resetButton = page.querySelector("#examConnectReset");
  const helpButton = page.querySelector("#examConnectHelp");
  const playAgainButton = page.querySelector("#examConnectPlayAgain");
  const completePanel = page.querySelector("#examConnectComplete");
  const tutorial = page.querySelector("#examConnectTutorial");
  const tutorialSlides = Array.from(
    page.querySelectorAll("[data-tutorial-slide]"),
  );
  const tutorialDots = Array.from(page.querySelectorAll("[data-tutorial-dot]"));
  const tutorialBack = page.querySelector("#examConnectTutorialBack");
  const tutorialNext = page.querySelector("#examConnectTutorialNext");

  if (
    !board ||
    !cellsHost ||
    !status ||
    !filled ||
    !resetButton ||
    !helpButton ||
    !playAgainButton ||
    !completePanel ||
    !tutorial ||
    !tutorialBack ||
    !tutorialNext
  ) {
    return null;
  }

  const cellElements = createCellElements(cellsHost);
  const state = {
    complete: false,
    drawing: false,
    errorTimer: 0,
    keyboardCell: 0,
    keyboardMode: false,
    path: [],
    pointerId: null,
    tutorialIndex: 0,
    tutorialOpenedManually: false,
  };

  let previousBodyOverflow = "";

  const setStatus = (message, isError = false) => {
    window.clearTimeout(state.errorTimer);
    status.textContent = message;
    status.classList.toggle("is-error", isError);
    if (isError) {
      state.errorTimer = window.setTimeout(() => {
        status.classList.remove("is-error");
      }, 700);
    }
  };

  const flashInvalidCheckpoint = (checkpointIndex) => {
    if (checkpointIndex === undefined) return;
    const step = EYE_EXAMINATION_CONNECT_STEPS[checkpointIndex];
    const element = cellElements[toCellIndex(step.row, step.col)];
    element?.classList.remove("is-invalid-step");
    window.requestAnimationFrame(() => {
      element?.classList.add("is-invalid-step");
      window.setTimeout(
        () => element?.classList.remove("is-invalid-step"),
        420,
      );
    });
  };

  const updatePathLines = () => {
    const segments = Array.from({ length: lines.length }, () => []);
    let segmentIndex = 0;

    if (state.path.length > 0) segments[0].push(state.path[0]);

    state.path.slice(1).forEach((cell) => {
      segments[segmentIndex]?.push(cell);
      const checkpointIndex = CHECKPOINT_INDEX_BY_CELL.get(cell);
      if (
        checkpointIndex !== undefined &&
        checkpointIndex > 0 &&
        checkpointIndex < EYE_EXAMINATION_CONNECT_STEPS.length - 1
      ) {
        segmentIndex = checkpointIndex;
        segments[segmentIndex]?.push(cell);
      }
    });

    lines.forEach((line, index) => {
      const points = segments[index]
        .map((cell) => {
          const position = toCellPosition(cell);
          return `${position.col * 100 + 50},${position.row * 100 + 50}`;
        })
        .join(" ");
      line.setAttribute("points", points);
    });
  };

  const updateStatusForPath = (expectedCheckpoint) => {
    if (state.complete) {
      setStatus(connectText("Complete · 49/49 squares filled"));
      return;
    }
    if (state.path.length === 0) {
      setStatus(connectText("Choose the first examination skill"));
      return;
    }
    if (expectedCheckpoint === EYE_EXAMINATION_CONNECT_STEPS.length - 1) {
      setStatus(
        connectText(
          "{{count}}/49 · Fill every square, then finish with the last skill",
          { count: state.path.length },
        ),
      );
      return;
    }
    setStatus(
      connectText("{{count}}/49 · Find the next examination skill", {
        count: state.path.length,
      }),
    );
  };

  const render = () => {
    const visited = new Set(state.path);
    const endpoint = state.path[state.path.length - 1];
    const expectedCheckpoint = getExpectedCheckpoint(state.path);

    cellElements.forEach((cell, cellIndex) => {
      const checkpointIndex = CHECKPOINT_INDEX_BY_CELL.get(cellIndex);
      cell.classList.toggle("is-visited", visited.has(cellIndex));
      cell.classList.toggle("is-endpoint", endpoint === cellIndex);
      cell.classList.toggle(
        "is-keyboard-cursor",
        state.keyboardMode &&
          state.path.length === 0 &&
          state.keyboardCell === cellIndex,
      );
      cell.classList.toggle(
        "is-complete-step",
        checkpointIndex !== undefined && checkpointIndex < expectedCheckpoint,
      );
      cell.classList.remove("is-current-step");
    });

    const activeCheckpoint = expectedCheckpoint - 1;
    sequence.forEach((item, index) => {
      item.classList.toggle(
        "is-complete",
        state.complete || index < activeCheckpoint,
      );
      item.classList.toggle(
        "is-current",
        index === activeCheckpoint && !state.complete,
      );
    });

    filled.textContent = String(state.path.length);
    board.classList.toggle("is-complete", state.complete);
    board.setAttribute(
      "aria-label",
      state.complete
        ? connectText(
            "Completed 7 by 7 Connect board. All 49 squares are filled.",
          )
        : connectText("7 by 7 Connect board. {{count}} of 49 squares filled.", {
            count: state.path.length,
          }),
    );
    completePanel.hidden = !state.complete;
    updatePathLines();
    updateStatusForPath(expectedCheckpoint);
  };

  const updateProgress = () => {
    if (state.complete) {
      setLessonProgress(EYE_EXAMINATION_CONNECT_PAGE_ID, 100);
      return;
    }
    if (state.path.length === 0) return;
    const percent = Math.max(
      5,
      Math.min(95, Math.round((state.path.length / TOTAL_CELLS) * 95)),
    );
    setLessonProgress(EYE_EXAMINATION_CONNECT_PAGE_ID, percent);
  };

  const reset = ({ focus = true } = {}) => {
    state.complete = false;
    state.drawing = false;
    state.keyboardCell = 0;
    state.keyboardMode = false;
    state.path = [];
    state.pointerId = null;
    render();
    if (focus) board.focus({ preventScroll: true });
  };

  const finish = () => {
    state.complete = true;
    state.drawing = false;
    render();
    updateProgress();
    completePanel.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
  };

  const tryCell = (cell) => {
    if (state.complete || !Number.isInteger(cell)) return false;

    const start = toCellIndex(
      EYE_EXAMINATION_CONNECT_STEPS[0].row,
      EYE_EXAMINATION_CONNECT_STEPS[0].col,
    );

    if (state.path.length === 0) {
      if (cell !== start) {
        setStatus(
          connectText(
            "That is not the first examination skill. Try another one.",
          ),
          true,
        );
        flashInvalidCheckpoint(CHECKPOINT_INDEX_BY_CELL.get(cell));
        return false;
      }
      state.path.push(cell);
      render();
      updateProgress();
      return true;
    }

    const endpoint = state.path[state.path.length - 1];
    if (cell === endpoint) return true;

    if (!areEyeExaminationConnectCellsAdjacent(endpoint, cell)) return false;

    const previous = state.path[state.path.length - 2];
    if (cell === previous) {
      state.path.pop();
      render();
      return true;
    }

    if (state.path.includes(cell)) {
      setStatus(
        connectText(
          "That square is already filled. Move back one square to undo.",
        ),
        true,
      );
      return false;
    }

    const expectedCheckpoint = getExpectedCheckpoint(state.path);
    const checkpointIndex = CHECKPOINT_INDEX_BY_CELL.get(cell);
    if (
      checkpointIndex !== undefined &&
      checkpointIndex !== expectedCheckpoint
    ) {
      setStatus(
        connectText(
          "That is not the next examination skill. Try another route.",
        ),
        true,
      );
      flashInvalidCheckpoint(checkpointIndex);
      return false;
    }

    const isFinalCheckpoint =
      checkpointIndex === EYE_EXAMINATION_CONNECT_STEPS.length - 1;
    if (isFinalCheckpoint && state.path.length !== TOTAL_CELLS - 1) {
      setStatus(
        connectText(
          "Keep going · Every square must be filled before the final skill",
        ),
        true,
      );
      flashInvalidCheckpoint(checkpointIndex);
      return false;
    }

    state.path.push(cell);
    const result = evaluateEyeExaminationConnectPath(state.path);
    if (result.complete) {
      finish();
    } else {
      render();
      updateProgress();
    }
    return true;
  };

  const extendToward = (targetCell) => {
    if (state.path.length === 0) return tryCell(targetCell);
    const endpoint = state.path[state.path.length - 1];
    if (targetCell === endpoint) return true;
    if (areEyeExaminationConnectCellsAdjacent(endpoint, targetCell)) {
      return tryCell(targetCell);
    }

    const from = toCellPosition(endpoint);
    const target = toCellPosition(targetCell);
    if (from.row !== target.row && from.col !== target.col) return false;

    const rowStep = Math.sign(target.row - from.row);
    const colStep = Math.sign(target.col - from.col);
    let row = from.row;
    let col = from.col;
    while (row !== target.row || col !== target.col) {
      row += rowStep;
      col += colStep;
      if (!tryCell(toCellIndex(row, col))) return false;
    }
    return true;
  };

  const getCellFromEventPosition = (event) => {
    const element = document.elementFromPoint?.(event.clientX, event.clientY);
    const cell = element?.closest?.("[data-cell]");
    if (!cell || !board.contains(cell)) return null;
    return Number(cell.dataset.cell);
  };

  board.addEventListener("pointerdown", (event) => {
    const cell = event.target.closest?.("[data-cell]");
    if (!cell || state.complete) return;
    event.preventDefault();
    board.focus({ preventScroll: true });
    state.keyboardMode = false;
    state.drawing = true;
    state.pointerId = event.pointerId;
    board.setPointerCapture?.(event.pointerId);
    extendToward(Number(cell.dataset.cell));
  });

  board.addEventListener("pointermove", (event) => {
    if (!state.drawing || event.pointerId !== state.pointerId) return;
    event.preventDefault();
    const cell = getCellFromEventPosition(event);
    if (cell !== null) extendToward(cell);
  });

  const stopDrawing = (event) => {
    if (!state.drawing) return;
    state.drawing = false;
    if (state.pointerId !== null) {
      try {
        board.releasePointerCapture?.(state.pointerId);
      } catch {
        // Pointer capture may already have been released by the browser.
      }
    }
    state.pointerId = null;
    event?.preventDefault?.();
  };

  board.addEventListener("pointerup", stopDrawing);
  board.addEventListener("pointercancel", stopDrawing);
  board.addEventListener("lostpointercapture", stopDrawing);

  board.addEventListener("keydown", (event) => {
    if (state.complete) return;
    if (state.path.length === 0) {
      const deltas = {
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
        ArrowUp: [-1, 0],
      };
      const delta = deltas[event.key];
      if (delta) {
        event.preventDefault();
        state.keyboardMode = true;
        const cursor = toCellPosition(state.keyboardCell);
        const row = Math.max(
          0,
          Math.min(
            EYE_EXAMINATION_CONNECT_GRID_SIZE - 1,
            cursor.row + delta[0],
          ),
        );
        const col = Math.max(
          0,
          Math.min(
            EYE_EXAMINATION_CONNECT_GRID_SIZE - 1,
            cursor.col + delta[1],
          ),
        );
        state.keyboardCell = toCellIndex(row, col);
        render();
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        state.keyboardMode = true;
        render();
        tryCell(state.keyboardCell);
      }
      return;
    }

    const deltas = {
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      ArrowUp: [-1, 0],
    };
    const delta = deltas[event.key];
    if (!delta) return;
    event.preventDefault();
    const endpoint = toCellPosition(state.path[state.path.length - 1]);
    const row = endpoint.row + delta[0];
    const col = endpoint.col + delta[1];
    if (
      row < 0 ||
      col < 0 ||
      row >= EYE_EXAMINATION_CONNECT_GRID_SIZE ||
      col >= EYE_EXAMINATION_CONNECT_GRID_SIZE
    ) {
      setStatus(connectText("Stay inside the grid"), true);
      return;
    }
    tryCell(toCellIndex(row, col));
  });

  const updateTutorial = () => {
    tutorialSlides.forEach((slide, index) => {
      slide.hidden = index !== state.tutorialIndex;
    });
    tutorialDots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === state.tutorialIndex);
    });
    tutorialBack.disabled = state.tutorialIndex === 0;
    tutorialNext.textContent = connectText(
      state.tutorialIndex === tutorialSlides.length - 1 ? "Start game" : "Next",
    );
  };

  const closeTutorial = () => {
    tutorial.hidden = true;
    document.body.style.overflow = previousBodyOverflow;
    writeTutorialSeen();
    board.focus({ preventScroll: true });
  };

  const openTutorial = ({ manual = false } = {}) => {
    state.tutorialIndex = 0;
    state.tutorialOpenedManually = manual;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    tutorial.hidden = false;
    updateTutorial();
    window.setTimeout(() => tutorialNext.focus(), 0);
  };

  tutorialBack.addEventListener("click", () => {
    state.tutorialIndex = Math.max(0, state.tutorialIndex - 1);
    updateTutorial();
  });

  tutorialNext.addEventListener("click", () => {
    if (state.tutorialIndex < tutorialSlides.length - 1) {
      state.tutorialIndex += 1;
      updateTutorial();
      return;
    }
    closeTutorial();
  });

  tutorial.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && state.tutorialIndex > 0) {
      event.preventDefault();
      state.tutorialIndex -= 1;
      updateTutorial();
    } else if (
      event.key === "ArrowRight" &&
      state.tutorialIndex < tutorialSlides.length - 1
    ) {
      event.preventDefault();
      state.tutorialIndex += 1;
      updateTutorial();
    } else if (event.key === "Escape" && state.tutorialOpenedManually) {
      event.preventDefault();
      closeTutorial();
    }
  });

  resetButton.addEventListener("click", () => reset());
  playAgainButton.addEventListener("click", () => reset());
  helpButton.addEventListener("click", () => openTutorial({ manual: true }));

  render();

  return {
    openForPage() {
      if (!readTutorialSeen()) {
        window.requestAnimationFrame(() => openTutorial());
      }
    },
    reset,
    state,
  };
}

let activeController = null;
let pageShownListenerBound = false;

export function initializeEyeExaminationConnectGame() {
  const page = document.getElementById(EYE_EXAMINATION_CONNECT_PAGE_ID);
  if (!page) return null;

  if (activeController?.page === page) return activeController;

  const controller = createController(page);
  if (!controller) return null;
  activeController = { ...controller, page };

  if (!pageShownListenerBound) {
    pageShownListenerBound = true;
    document.addEventListener("page:shown", (event) => {
      if (event.detail?.id !== EYE_EXAMINATION_CONNECT_PAGE_ID) return;
      activeController?.openForPage();
    });
  }

  return activeController;
}

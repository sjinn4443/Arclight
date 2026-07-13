/**
 * @jest-environment jsdom
 */

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import fs from "fs";
import path from "path";
import {
  EYE_EXAMINATION_CONNECT_SOLUTION,
  EYE_EXAMINATION_CONNECT_STEPS,
  areEyeExaminationConnectCellsAdjacent,
  evaluateEyeExaminationConnectPath,
  initializeEyeExaminationConnectGame,
} from "../public/js/eyeExaminationConnect.js";

const VIDEOS_HTML = fs.readFileSync(
  path.join(process.cwd(), "public", "html", "videos.html"),
  "utf8",
);

function directionKey(from, to) {
  const fromRow = Math.floor(from / 7);
  const fromCol = from % 7;
  const toRow = Math.floor(to / 7);
  const toCol = to % 7;

  if (toRow === fromRow - 1 && toCol === fromCol) return "ArrowUp";
  if (toRow === fromRow + 1 && toCol === fromCol) return "ArrowDown";
  if (toRow === fromRow && toCol === fromCol - 1) return "ArrowLeft";
  if (toRow === fromRow && toCol === fromCol + 1) return "ArrowRight";
  throw new Error(`Cells ${from} and ${to} are not adjacent`);
}

describe("Eye examination Connect game", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    localStorage.clear();
    window.requestAnimationFrame = (callback) => {
      callback(performance.now());
      return 1;
    };
    window.cancelAnimationFrame = jest.fn();
  });

  it("ships a valid 7 by 7 solution through all checkpoints in order", () => {
    expect(EYE_EXAMINATION_CONNECT_SOLUTION).toHaveLength(49);
    expect(new Set(EYE_EXAMINATION_CONNECT_SOLUTION)).toHaveProperty(
      "size",
      49,
    );
    EYE_EXAMINATION_CONNECT_SOLUTION.slice(1).forEach((cell, index) => {
      expect(
        areEyeExaminationConnectCellsAdjacent(
          EYE_EXAMINATION_CONNECT_SOLUTION[index],
          cell,
        ),
      ).toBe(true);
    });

    const result = evaluateEyeExaminationConnectPath(
      EYE_EXAMINATION_CONNECT_SOLUTION,
    );
    expect(result.complete).toBe(true);
    expect(result.encounteredCheckpoints).toEqual(
      EYE_EXAMINATION_CONNECT_STEPS.map((_, index) => index),
    );
  });

  it("rejects paths that touch the picture checkpoints out of order", () => {
    const result = evaluateEyeExaminationConnectPath([28, 21, 14, 20]);
    expect(result.encounteredCheckpoints).toEqual([0, 2]);
    expect(result.orderCorrect).toBe(false);
    expect(result.complete).toBe(false);
  });

  it("shows the first-play tutorial and completes from keyboard input", () => {
    document.body.innerHTML = VIDEOS_HTML;
    const controller = initializeEyeExaminationConnectGame();
    const board = document.getElementById("examConnectBoard");
    const tutorial = document.getElementById("examConnectTutorial");
    const next = document.getElementById("examConnectTutorialNext");

    expect(controller).not.toBeNull();
    expect(board.querySelectorAll("[data-cell]")).toHaveLength(49);
    expect(board.querySelectorAll(".exam-connect__marker-number")).toHaveLength(
      0,
    );
    expect(
      document.getElementById("examConnectSequence").textContent,
    ).not.toContain("History");
    expect(
      document.querySelectorAll(
        '[data-tutorial-slide="0"] .exam-connect-tutorial__demo-line',
      ),
    ).toHaveLength(0);
    expect(
      document.querySelectorAll(
        '[data-tutorial-slide="1"] .exam-connect-tutorial__demo-line',
      ),
    ).toHaveLength(2);
    expect(
      document.querySelectorAll(
        '[data-tutorial-slide="2"] .exam-connect-tutorial__demo-line',
      ),
    ).toHaveLength(5);
    const tutorialLayouts = Array.from(
      document.querySelectorAll("[data-tutorial-slide]"),
    ).map((slide) =>
      Array.from(slide.querySelectorAll("circle")).map(
        (circle) => `${circle.getAttribute("cx")},${circle.getAttribute("cy")}`,
      ),
    );
    expect(tutorialLayouts[0]).toEqual(tutorialLayouts[1]);
    expect(tutorialLayouts[1]).toEqual(tutorialLayouts[2]);
    expect(board.textContent).toContain("History Taking");
    expect(board.textContent).toContain("Visual Acuity");
    expect(board.textContent).toContain("Direct Ophthalmoscopy");

    document.dispatchEvent(
      new CustomEvent("page:shown", {
        detail: { id: "eyeExaminationConnectPage" },
      }),
    );
    expect(tutorial.hidden).toBe(false);
    expect(next.textContent).toBe("Next");

    next.click();
    next.click();
    expect(next.textContent).toBe("Start game");
    next.click();
    expect(tutorial.hidden).toBe(true);
    expect(localStorage.getItem("eyeExaminationConnect:tutorialSeen:v4")).toBe(
      "1",
    );

    for (let step = 0; step < 4; step += 1) {
      board.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
      );
    }
    board.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    expect(
      document
        .querySelector('[data-connect-step="0"]')
        .classList.contains("is-current"),
    ).toBe(true);
    expect(
      document
        .querySelector('[data-connect-step="1"]')
        .classList.contains("is-current"),
    ).toBe(false);
    EYE_EXAMINATION_CONNECT_SOLUTION.slice(1).forEach((cell, index) => {
      const key = directionKey(EYE_EXAMINATION_CONNECT_SOLUTION[index], cell);
      board.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
      if (cell === 0) {
        expect(
          document
            .querySelector('[data-connect-step="1"]')
            .classList.contains("is-current"),
        ).toBe(true);
        expect(
          document
            .querySelector('[data-connect-step="2"]')
            .classList.contains("is-current"),
        ).toBe(false);
      }
    });

    expect(controller.state.complete).toBe(true);
    expect(document.getElementById("examConnectFilled").textContent).toBe("49");
    expect(document.getElementById("examConnectComplete").hidden).toBe(false);
    expect(
      JSON.parse(
        localStorage.getItem("lessonProgress:eyeExaminationConnectPage"),
      ).percent,
    ).toBe(100);
  });
});

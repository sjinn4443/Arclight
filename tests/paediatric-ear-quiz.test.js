import fs from "node:fs";
import { jest } from "@jest/globals";
import { initializePaediatricEarQuiz } from "../public/js/paediatricEarQuiz.js";

const ids = ["normal", "hole", "csom", "csom-hole", "ome"];
let page;
beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = fs.readFileSync(
    "public/html/paediatricSurgicalEyeEarWorkshop.html",
    "utf8",
  );
  page = document.getElementById("paediatricEarImagePracticePage");
  page.querySelector("dialog").showModal = function () {
    this.open = true;
  };
  page.querySelector("dialog").close = function () {
    this.open = false;
  };
  Element.prototype.scrollIntoView = jest.fn();
  window.I18N = { t: (_key, fallback) => fallback };
});
function choose(id, value = id) {
  const input = page.querySelector(`input[name="ear-${id}"][value="${value}"]`);
  input.checked = true;
  input.dispatchEvent(new Event("change", { bubbles: true }));
}
function submit() {
  page
    .querySelector("form")
    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
}
it("requires an answer to every image before showing a score", () => {
  initializePaediatricEarQuiz(page);
  choose("normal");
  submit();
  expect(page.querySelector("dialog").open).toBe(false);
  expect(page.querySelector("[role=status]").textContent).toContain(
    "Answer all five",
  );
  expect(document.activeElement.name).toBe("ear-hole");
});
it("grades the five source labels and reviews a wrong answer", () => {
  initializePaediatricEarQuiz(page);
  ids.forEach((id) => choose(id, id === "normal" ? "hole" : id));
  submit();
  expect(page.querySelector("[data-ear-quiz-score]").textContent).toBe("4 / 5");
  expect(page.querySelector("[data-ear-quiz-review]").textContent).toBe(
    "See why",
  );
  page.querySelector("[data-ear-quiz-review]").click();
  expect(page.querySelectorAll(".opt.correct")).toHaveLength(5);
  expect(page.querySelectorAll(".opt.wrong")).toHaveLength(1);
  expect(page.querySelectorAll("input:disabled")).toHaveLength(25);
  expect(page.querySelector(".quiz-explanation").textContent).toBe(
    "Source label: Normal",
  );
});
it("restores partial selections and ignores invalid stored answers", () => {
  localStorage.setItem(
    "paediatricSurgicalEyeEarWorkshop:earQuiz:v1",
    JSON.stringify({
      answers: { normal: "hole", ome: "invalid" },
      submitted: true,
    }),
  );
  initializePaediatricEarQuiz(page);
  expect(
    page.querySelector('input[name="ear-normal"][value="hole"]').checked,
  ).toBe(true);
  expect(page.querySelectorAll("input:disabled")).toHaveLength(0);
  expect(page.querySelector("[data-ear-quiz-progress]").textContent).toBe(
    "1 / 5",
  );
});
it("restarts without removing earned completion and closes results when leaving", () => {
  initializePaediatricEarQuiz(page);
  ids.forEach((id) => choose(id));
  submit();
  expect(page.querySelector("[data-ear-quiz-score]").textContent).toBe("5 / 5");
  window.dispatchEvent(new Event("page:loaded"));
  expect(page.querySelector("dialog").open).toBe(false);
  page.querySelector("[data-ear-quiz-restart]").click();
  expect(page.querySelectorAll("input:checked")).toHaveLength(0);
  expect(
    JSON.parse(localStorage.getItem(`lessonProgress:${page.id}`)).percent,
  ).toBe(100);
});

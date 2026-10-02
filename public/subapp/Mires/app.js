import { initSimulator } from "./simulator.js?v=20260726-refactor1";
import { initMcqUi } from "./mcq.js?v=20260509-ui13";
import { MCQ_TIERS, QUESTION_BANK } from "./questions.js?v=20260509-ui13";

initSimulator();
initMcqUi({
  questionBank: QUESTION_BANK,
  tiers: MCQ_TIERS,
});
if (location.protocol === "http:" || location.protocol === "https:") {
  window.addEventListener("load", () =>
    navigator.serviceWorker?.register("./service-worker.js"),
  );
}

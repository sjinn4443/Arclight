const fs = require("node:fs");
class Reporter {
  onTestEnd(test, result) {
    fs.writeFileSync(
      ".codex-artifacts/download-optimization/followup-live-resume.json",
      JSON.stringify(
        {
          title: test.title,
          status: result.status,
          duration: result.duration,
          errors: result.errors,
          steps: result.steps.map((s) => ({ title: s.title, error: s.error })),
        },
        null,
        2,
      ),
    );
  }
}
module.exports = Reporter;

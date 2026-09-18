/** @jest-environment node */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(
  "scripts/check-clinical-equivalence.cjs",
  "utf8",
);
const reviewPath = path.resolve("clinical-review/fundal-es-ko.json");
const reviewTemplate = JSON.parse(fs.readFileSync(reviewPath, "utf8"));

function run(flags, change = () => {}) {
  const review = JSON.parse(JSON.stringify(reviewTemplate));
  change(review);
  const output = {};
  const execute = () =>
    vm.runInNewContext(source, {
      require: (id) =>
        id === "node:fs"
          ? {
              readFileSync: (file, ...args) =>
                file === reviewPath
                  ? JSON.stringify(review)
                  : fs.readFileSync(file, ...args),
              appendFileSync: (file, text) => {
                output[file] = (output[file] || "") + text;
              },
            }
          : require(id),
      process: {
        argv: ["node", "check", ...flags],
        env: {
          GITHUB_OUTPUT: "output",
          GITHUB_STEP_SUMMARY: "summary",
        },
      },
      Buffer,
      console: { log() {} },
    });
  return { execute, output };
}

function approve(review) {
  // Synthetic reviewer metadata is confined to the in-memory test fixture.
  for (const record of Object.values(review.languages)) {
    Object.assign(record, {
      status: "approved",
      reviewer: "Test reviewer",
      qualifications: "Test qualification",
      reviewedAt: "2026-09-18",
      evidence: "Test evidence",
    });
  }
}

test("pending reviews pass CI reporting but block release uploads", () => {
  const check = run(["--report-approval"]);
  check.execute();
  expect(check.output.output).toBe("approved=false\n");
  expect(check.output.summary).toContain("es-419, ko");
});

test("strict approval still rejects pending reviews", () => {
  expect(run(["--require-approval"]).execute).toThrow(
    "bilingual clinical approval required",
  );
});

test("complete matching approvals enable release uploads", () => {
  const check = run(["--report-approval"], approve);
  check.execute();
  expect(check.output.output).toBe("approved=true\n");
});

test.each(["revision", "reviewer", "status"])(
  "invalid approved %s fails CI without enabling uploads",
  (field) => {
    const check = run(["--report-approval"], (review) => {
      approve(review);
      review.languages.ko[field] = "";
    });
    expect(check.execute).toThrow();
    expect(check.output.output).toBeUndefined();
  },
);

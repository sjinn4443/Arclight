/** @jest-environment node */
import { beforeAll, expect, it, jest } from "@jest/globals";

let runLighthouseWithRetries;
beforeAll(async () => {
  ({ runLighthouseWithRetries } =
    await import("../scripts/lighthouse-retry.mjs"));
});

const validReport = { lhr: { categories: { performance: { score: 0.9 } } } };
const traceErrorReport = {
  lhr: {
    runtimeError: { code: "NO_NAVSTART", message: "Missing navigation trace" },
  },
};

it("recovers from a missing trace without counting the failed attempt as a sample", async () => {
  const runAudit = jest
    .fn()
    .mockResolvedValueOnce(traceErrorReport)
    .mockResolvedValue(validReport);
  const onFailure = jest.fn();
  const onRetry = jest.fn();
  await expect(
    runLighthouseWithRetries(runAudit, { onFailure, onRetry }),
  ).resolves.toBe(validReport);
  expect(runAudit).toHaveBeenCalledTimes(2);
  expect(onFailure).toHaveBeenCalledWith({
    attempt: 1,
    error: expect.objectContaining({ code: "NO_NAVSTART" }),
    result: traceErrorReport,
  });
  expect(onRetry).toHaveBeenCalledTimes(1);
});

it("also recovers when Lighthouse throws NO_NAVSTART", async () => {
  const runAudit = jest
    .fn()
    .mockRejectedValueOnce(
      Object.assign(new Error("Missing trace"), { code: "NO_NAVSTART" }),
    )
    .mockResolvedValue(validReport);
  await expect(runLighthouseWithRetries(runAudit)).resolves.toBe(validReport);
  expect(runAudit).toHaveBeenCalledTimes(2);
});

it("waits for browser recovery before starting the next attempt", async () => {
  let releaseRecovery;
  let announceRetry;
  const recovery = new Promise((resolve) => {
    releaseRecovery = resolve;
  });
  const retryStarted = new Promise((resolve) => {
    announceRetry = resolve;
  });
  const runAudit = jest
    .fn()
    .mockResolvedValueOnce(traceErrorReport)
    .mockResolvedValue(validReport);
  const pending = runLighthouseWithRetries(runAudit, {
    onRetry: () => {
      announceRetry();
      return recovery;
    },
  });
  await retryStarted;
  expect(runAudit).toHaveBeenCalledTimes(1);
  releaseRecovery();
  await expect(pending).resolves.toBe(validReport);
  expect(runAudit).toHaveBeenCalledTimes(2);
});

it("fails after three missing traces and retains every failure", async () => {
  const runAudit = jest.fn().mockResolvedValue(traceErrorReport);
  const onFailure = jest.fn();
  await expect(
    runLighthouseWithRetries(runAudit, { onFailure }),
  ).rejects.toMatchObject({
    code: "NO_NAVSTART",
  });
  expect(runAudit).toHaveBeenCalledTimes(3);
  expect(onFailure).toHaveBeenCalledTimes(3);
});

it("does not retry or hide a different Lighthouse runtime error", async () => {
  const runAudit = jest.fn().mockResolvedValue({
    lhr: { runtimeError: { code: "NO_FCP", message: "Page did not paint" } },
  });
  await expect(runLighthouseWithRetries(runAudit)).rejects.toMatchObject({
    code: "NO_FCP",
  });
  expect(runAudit).toHaveBeenCalledTimes(1);
});

it("does not retry a valid low score to seek a passing score", async () => {
  const lowScore = { lhr: { categories: { performance: { score: 0.1 } } } };
  const runAudit = jest.fn().mockResolvedValue(lowScore);
  await expect(runLighthouseWithRetries(runAudit)).resolves.toBe(lowScore);
  expect(runAudit).toHaveBeenCalledTimes(1);
});

it("fails immediately when Lighthouse returns no report", async () => {
  const runAudit = jest.fn().mockResolvedValue(undefined);
  await expect(runLighthouseWithRetries(runAudit)).rejects.toThrow(
    "Missing Lighthouse result",
  );
  expect(runAudit).toHaveBeenCalledTimes(1);
});

it("does not retry browser startup or connection failures", async () => {
  const error = new Error("Connection refused");
  const runAudit = jest.fn().mockRejectedValue(error);
  await expect(runLighthouseWithRetries(runAudit)).rejects.toBe(error);
  expect(runAudit).toHaveBeenCalledTimes(1);
});

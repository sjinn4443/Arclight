// A missing navigation trace is a browser recording failure, not a score.
// Keep retries bounded and never retry valid reports to improve their scores.
export async function runLighthouseWithRetries(
  runAudit,
  { onFailure = async () => {}, onRetry = () => {}, maxAttempts = 3 } = {},
) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let result;
    try {
      result = await runAudit();
      if (!result) throw new Error("Missing Lighthouse result");
      if (result.lhr.runtimeError) {
        const { code, message } = result.lhr.runtimeError;
        throw Object.assign(new Error(message), { code });
      }
      return result;
    } catch (error) {
      await onFailure({ attempt, error, result });
      if (error.code !== "NO_NAVSTART" || attempt === maxAttempts) throw error;
      await onRetry({ attempt, error });
    }
  }
}

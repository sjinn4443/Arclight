export function createFixedStepRafScheduler({
  step,
  intervalMs = 100,
  requestFrame = (callback) => window.requestAnimationFrame(callback),
  cancelFrame = (id) => window.cancelAnimationFrame(id),
  isPaused = () => document.hidden,
}) {
  let frameId = null;
  let lastStepAt = null;
  let running = false;

  function frame(now) {
    if (!running) return;

    if (isPaused()) {
      lastStepAt = null;
    } else if (lastStepAt === null) {
      lastStepAt = now;
    } else if (now - lastStepAt >= intervalMs) {
      step(intervalMs);
      lastStepAt = now - ((now - lastStepAt) % intervalMs);
    }

    frameId = requestFrame(frame);
  }

  return {
    start() {
      if (running) return;
      running = true;
      lastStepAt = null;
      frameId = requestFrame(frame);
    },
    stop() {
      running = false;
      lastStepAt = null;
      if (frameId !== null) cancelFrame(frameId);
      frameId = null;
    },
    resetClock() {
      lastStepAt = null;
    },
    isRunning() {
      return running;
    },
  };
}

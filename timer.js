(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }

  root.createTimer = factory().createTimer;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const DURATIONS_MS = {
    work: 25 * 60 * 1000,
    break: 5 * 60 * 1000,
  };

  const MODE_LABELS = {
    work: "Work",
    break: "Break",
  };

  function getNextMode(mode) {
    return mode === "work" ? "break" : "work";
  }

  function formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function createTimer(options = {}) {
    const workMs = options.workMs ?? DURATIONS_MS.work;
    const breakMs = options.breakMs ?? DURATIONS_MS.break;
    const getNow = options.now ?? Date.now;
    const onComplete = options.onComplete ?? function () {};

    const state = {
      mode: "work",
      status: "idle",
      remainingMs: workMs,
      targetEndAt: null,
    };

    function getDurationForMode(mode) {
      return mode === "work" ? workMs : breakMs;
    }

    function getPrimaryLabel() {
      if (state.status === "running") {
        return "Stop";
      }

      if (state.status === "completed") {
        return state.mode === "work" ? "Start Work" : "Start Break";
      }

      return "Start";
    }

    function updateRemainingMs(nowValue) {
      if (state.status !== "running" || state.targetEndAt === null) {
        return;
      }

      state.remainingMs = Math.max(0, state.targetEndAt - nowValue);
    }

    function completeCurrentSession() {
      const completedMode = state.mode;
      state.status = "completed";
      state.mode = getNextMode(completedMode);
      state.targetEndAt = null;
      state.remainingMs = getDurationForMode(state.mode);
      onComplete(completedMode, state.mode);
    }

    function getSnapshot() {
      return {
        mode: state.mode,
        status: state.status,
        remainingMs: state.remainingMs,
        primaryLabel: getPrimaryLabel(),
        titleText: `${formatTime(state.remainingMs)} - ${MODE_LABELS[state.mode]}`,
      };
    }

    function resetCurrentMode() {
      state.status = "idle";
      state.targetEndAt = null;
      state.remainingMs = getDurationForMode(state.mode);
    }

    function start() {
      state.status = "running";
      state.remainingMs = getDurationForMode(state.mode);
      state.targetEndAt = getNow() + state.remainingMs;
    }

    function stop() {
      resetCurrentMode();
    }

    function reset() {
      resetCurrentMode();
    }

    function tick(nowValue) {
      updateRemainingMs(nowValue);

      if (state.status === "running" && state.remainingMs <= 0) {
        completeCurrentSession();
      }
    }

    return {
      getSnapshot,
      reset,
      stop,
      start,
      tick,
    };
  }

  return { createTimer };
});

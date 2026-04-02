const { createTimer } = require("./timer");

test("initial snapshot starts in work mode with a full 25 minute timer", () => {
  const timer = createTimer();

  expect(timer.getSnapshot()).toEqual({
    mode: "work",
    status: "idle",
    remainingMs: 25 * 60 * 1000,
    primaryLabel: "Start",
    titleText: "25:00 - Work",
  });
});

test("starting a work session and ticking uses elapsed time to update the remaining duration", () => {
  let currentNow = 1_000;
  const timer = createTimer({ now: () => currentNow });

  timer.start();

  expect(timer.getSnapshot()).toEqual({
    mode: "work",
    status: "running",
    remainingMs: 25 * 60 * 1000,
    primaryLabel: "Stop",
    titleText: "25:00 - Work",
  });

  timer.tick(currentNow + 30_000);

  expect(timer.getSnapshot()).toEqual({
    mode: "work",
    status: "running",
    remainingMs: 25 * 60 * 1000 - 30_000,
    primaryLabel: "Stop",
    titleText: "24:30 - Work",
  });
});

test("stopping during a running session resets the current mode to its full duration", () => {
  let currentNow = 2_000;
  const timer = createTimer({ now: () => currentNow });

  timer.start();
  timer.tick(currentNow + 45_000);
  timer.stop();

  expect(timer.getSnapshot()).toEqual({
    mode: "work",
    status: "idle",
    remainingMs: 25 * 60 * 1000,
    primaryLabel: "Start",
    titleText: "25:00 - Work",
  });
});

test("completing a work session switches to break mode and waits with Start Break", () => {
  let currentNow = 5_000;
  const timer = createTimer({
    now: () => currentNow,
    workMs: 1_000,
    breakMs: 500,
  });

  timer.start();
  timer.tick(currentNow + 1_100);

  expect(timer.getSnapshot()).toEqual({
    mode: "break",
    status: "completed",
    remainingMs: 500,
    primaryLabel: "Start Break",
    titleText: "00:01 - Break",
  });
});

test("completing a break session switches back to work mode and waits with Start Work", () => {
  let currentNow = 10_000;
  const timer = createTimer({
    now: () => currentNow,
    workMs: 1_000,
    breakMs: 500,
  });

  timer.start();
  timer.tick(currentNow + 1_100);

  currentNow += 1_100;
  timer.start();
  timer.tick(currentNow + 600);

  expect(timer.getSnapshot()).toEqual({
    mode: "work",
    status: "completed",
    remainingMs: 1_000,
    primaryLabel: "Start Work",
    titleText: "00:01 - Work",
  });
});

test("an overdue session completes once and only invokes completion once", () => {
  let currentNow = 20_000;
  const completions = [];
  const timer = createTimer({
    now: () => currentNow,
    workMs: 1_000,
    breakMs: 500,
    onComplete: (completedMode, nextMode) => {
      completions.push({ completedMode, nextMode });
    },
  });

  timer.start();
  timer.tick(currentNow + 5_000);
  timer.tick(currentNow + 7_000);

  expect(timer.getSnapshot()).toEqual({
    mode: "break",
    status: "completed",
    remainingMs: 500,
    primaryLabel: "Start Break",
    titleText: "00:01 - Break",
  });

  expect(completions).toEqual([{ completedMode: "work", nextMode: "break" }]);
});

test("reset restores the full duration of the currently selected mode", () => {
  let currentNow = 30_000;
  const timer = createTimer({
    now: () => currentNow,
    workMs: 1_000,
    breakMs: 500,
  });

  timer.start();
  timer.tick(currentNow + 1_100);
  timer.reset();

  expect(timer.getSnapshot()).toEqual({
    mode: "break",
    status: "idle",
    remainingMs: 500,
    primaryLabel: "Start",
    titleText: "00:01 - Break",
  });
});

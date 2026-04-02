const TICK_MS = 250;

const elements = {
  modeLabel: document.querySelector("#mode-label"),
  timeDisplay: document.querySelector("#time-display"),
  primaryButton: document.querySelector("#primary-button"),
  resetButton: document.querySelector("#reset-button"),
  statusMessage: document.querySelector("#status-message"),
};

const appState = {
  intervalId: null,
  notificationPermissionRequested: false,
  notificationSupported: "Notification" in window,
  audioContext: null,
  audioReady: false,
  statusMessage: "",
};

const timer = createTimer({
  onComplete: handleSessionComplete,
});

function formatDisplayTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function setStatusMessage(message) {
  appState.statusMessage = message;
  render();
}

function render() {
  const snapshot = timer.getSnapshot();
  const modeLabel = snapshot.mode === "work" ? "Work" : "Break";

  elements.modeLabel.textContent = modeLabel;
  elements.timeDisplay.textContent = formatDisplayTime(snapshot.remainingMs);
  elements.primaryButton.textContent = snapshot.primaryLabel;
  elements.statusMessage.textContent = appState.statusMessage;
  document.title = snapshot.titleText;
}

function stopTicking() {
  if (appState.intervalId !== null) {
    window.clearInterval(appState.intervalId);
    appState.intervalId = null;
  }
}

function tick() {
  if (timer.getSnapshot().status !== "running") {
    stopTicking();
    render();
    return;
  }

  timer.tick(Date.now());
  render();

  if (timer.getSnapshot().status !== "running") {
    stopTicking();
  }
}

function startTicking() {
  stopTicking();
  appState.intervalId = window.setInterval(tick, TICK_MS);
}

async function ensureNotificationPermission() {
  if (!appState.notificationSupported || appState.notificationPermissionRequested) {
    return;
  }

  appState.notificationPermissionRequested = true;

  if (Notification.permission === "granted") {
    return;
  }

  if (Notification.permission === "denied") {
    setStatusMessage("Browser notifications are unavailable because permission was denied.");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setStatusMessage("Browser notifications are unavailable because permission was not granted.");
    }
  } catch (error) {
    setStatusMessage("Browser notifications could not be enabled in this browser.");
  }
}

async function ensureAudioReady() {
  if (appState.audioReady) {
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    setStatusMessage("Sound alerts are unavailable in this browser.");
    return;
  }

  try {
    if (!appState.audioContext) {
      appState.audioContext = new AudioContextClass();
    }

    if (appState.audioContext.state === "suspended") {
      await appState.audioContext.resume();
    }

    appState.audioReady = appState.audioContext.state === "running";
    if (!appState.audioReady) {
      setStatusMessage("Sound alerts are unavailable right now.");
    }
  } catch (error) {
    setStatusMessage("Sound alerts are unavailable right now.");
  }
}

function playCompletionBeep() {
  if (!appState.audioReady || !appState.audioContext) {
    setStatusMessage("The timer finished, but sound alerts are unavailable.");
    return;
  }

  try {
    const oscillator = appState.audioContext.createOscillator();
    const gainNode = appState.audioContext.createGain();
    const startAt = appState.audioContext.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, startAt);
    gainNode.gain.setValueAtTime(0.0001, startAt);
    gainNode.gain.exponentialRampToValueAtTime(0.12, startAt + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.35);

    oscillator.connect(gainNode);
    gainNode.connect(appState.audioContext.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + 0.35);
  } catch (error) {
    setStatusMessage("The timer finished, but sound alerts are unavailable.");
  }
}

function showCompletionNotification(previousMode) {
  if (!appState.notificationSupported) {
    setStatusMessage("The timer finished, but browser notifications are unavailable.");
    return;
  }

  if (Notification.permission !== "granted") {
    setStatusMessage("The timer finished, but browser notifications are unavailable.");
    return;
  }

  try {
    const nextMode = previousMode === "work" ? "break" : "work";
    new Notification(`${previousMode === "work" ? "Work" : "Break"} session complete`, {
      body: `Next up: ${nextMode === "work" ? "Work" : "Break"}.`,
      tag: "focus-timer-session-complete",
    });
  } catch (error) {
    setStatusMessage("The timer finished, but browser notifications are unavailable.");
  }
}

function handleSessionComplete(previousMode) {
  stopTicking();
  render();
  playCompletionBeep();
  showCompletionNotification(previousMode);
}

function resetCurrentMode() {
  timer.reset();
  stopTicking();
  render();
}

async function handlePrimaryAction() {
  if (timer.getSnapshot().status === "running") {
    timer.stop();
    stopTicking();
    render();
    return;
  }

  await Promise.all([ensureNotificationPermission(), ensureAudioReady()]);

  timer.start();
  render();
  startTicking();
}

function init() {
  elements.primaryButton.addEventListener("click", handlePrimaryAction);
  elements.resetButton.addEventListener("click", resetCurrentMode);
  render();
}

init();

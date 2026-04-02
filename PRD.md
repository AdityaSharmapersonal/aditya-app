# Simple Timer App PRD

## Problem Statement

The user wants a very simple personal timer web app that runs in a browser tab and supports a fixed work and break cycle without extra complexity. Existing timer tools often include settings, accounts, history, and other features that are unnecessary for a personal lightweight focus tool. The user needs a deterministic, minimal app that starts in a known state, is easy to operate with a small set of controls, and provides clear completion feedback without requiring a backend or stored data.

## Solution

Build a single-page client-side timer app with two fixed modes: a 25-minute work timer and a 5-minute break timer. The app begins in Work mode at 25:00 and displays the active mode, the countdown, a primary action button, a Reset button, and a small status area for alert-related issues. The timer should use real elapsed time rather than naive interval decrements so that it remains accurate enough for a browser tab. When a session completes, the app should play a short built-in beep, attempt a browser notification if permission is available, immediately switch to the next mode, update labels accordingly, and wait for the user to manually start the next session.

## User Stories

1. As a personal productivity user, I want a timer that opens directly in a browser tab, so that I can use it without installing anything.
2. As a user starting a focus session, I want the app to open in Work mode at 25:00, so that I always begin from a predictable default state.
3. As a user running a work interval, I want to see a clear Work label, so that I know which phase I am currently in.
4. As a user running a break interval, I want to see a clear Break label, so that I know which phase I am currently in.
5. As a user watching the timer, I want the countdown displayed in `MM:SS` format, so that the remaining time is easy to read at a glance.
6. As a user starting the timer, I want a single primary button labeled `Start`, so that the initial action is obvious.
7. As a user with a timer currently running, I want the primary button to change to `Stop`, so that I know how to cancel the current run.
8. As a user after a work session completes, I want the next primary action to read `Start Break`, so that the next available action is explicit.
9. As a user after a break session completes, I want the next primary action to read `Start Work`, so that the next available action is explicit.
10. As a user who stops a timer mid-session, I want the timer to reset to the full duration of the current mode, so that stopping is simple and predictable.
11. As a user who wants a clean restart of the current mode, I want a Reset button available at all times, so that I can restore the timer without changing the mode.
12. As a user pressing Reset while the timer is running, I want the timer to stop and immediately return to the full current duration, so that Reset behaves consistently.
13. As a user pressing Reset while idle, I want the current mode to remain the same, so that Reset does not unexpectedly switch contexts.
14. As a user finishing a work session, I want the app to switch to Break mode automatically, so that I do not have to change modes manually.
15. As a user finishing a break session, I want the app to switch to Work mode automatically, so that I can begin the next work session without extra setup.
16. As a user after a session completes, I want the timer to stop and wait for me, so that the app does not automatically run chained sessions.
17. As a user who leaves the tab running, I want the timer to be based on actual elapsed time, so that short scheduling delays do not accumulate into drift.
18. As a user returning to the tab after it was briefly delayed or throttled, I want an overdue session to complete once and switch to the next mode, so that the state remains coherent.
19. As a user relying on completion feedback, I want a short built-in beep at session end, so that I get an audible cue without uploading any audio files.
20. As a user who wants visual system-level feedback, I want the app to send a browser notification when a session ends, so that I can notice completion even if the tab is not foregrounded.
21. As a user concerned about intrusive permission prompts, I want notification permission to be requested only when I start using the timer, so that the app does not ask too early.
22. As a user in a browser that blocks or denies alerts, I want the timer to still complete normally, so that alert failures do not break the core function.
23. As a user whose notification permission is denied, I want to see a small in-app message, so that alert failure is explained instead of silently ignored.
24. As a user whose browser cannot play the beep, I want to see a small in-app message, so that I understand why the sound did not play.
25. As a user keeping the timer in a browser tab, I want the page title to include the remaining time and mode, so that I can monitor progress from the tab title.
26. As a user who refreshes the page, I want the app to return to the default Work 25:00 state, so that the behavior stays simple and deterministic.
27. As a user who does not want extra product complexity, I want no accounts, persistence, settings, manual mode switching, or history, so that the app stays small and personal.
28. As a user using the app on a small screen, I want the layout to remain readable and operable, so that the timer still works on mobile-sized viewports even though it is browser-tab-first.
29. As a user who only needs one purpose-built tool, I want the app to stay a single-view interface, so that I never need to navigate menus or screens.
30. As a user expecting a reliable simple control flow, I want all visible labels and actions to derive from the same app state, so that the UI does not become contradictory.

## Implementation Decisions

- The product is a single-page, fully client-side web app built with plain HTML, CSS, and JavaScript.
- The app uses two fixed modes only: Work at 25 minutes and Break at 5 minutes.
- The app starts in Work mode with a countdown of 25:00.
- The app uses an explicit state model rather than inferring behavior from DOM text or scattered booleans.
- The primary lifecycle statuses are `idle`, `running`, and `completed`.
- `completed` means the previous session has already ended and the app has already advanced to the next mode.
- While running, remaining time is derived from a recorded target end timestamp and the current time rather than decremented as authoritative mutable state.
- The countdown display is rendered in `MM:SS` format only, with zero padding.
- UI refreshes occur on a short interval and display rounded countdown values, while correctness comes from elapsed-time calculation rather than interval precision.
- The app uses one centralized render path so the mode label, timer text, button labels, page title, and status message stay consistent.
- The app uses one centralized completion path so end-of-session behavior is not duplicated between normal ticking and delayed tab resumption.
- Completion behavior is guarded by state so audio and notification side effects can only fire once per session.
- Pressing the primary action while running behaves as Stop and resets the current mode to its full duration.
- The Reset action is always visible and restores the full duration for the currently selected mode without changing modes.
- Session completion immediately advances the mode to the next mode, updates the UI, and waits for manual restart.
- The page title reflects both remaining time and active mode.
- Browser notification permission is requested only in response to user interaction when the timer is started.
- The alert sound is a short built-in beep generated with browser audio APIs, not a user-supplied file.
- Audio setup is primed from user interaction to reduce browser autoplay restrictions.
- The app exposes a small in-app status area to communicate alert availability issues while keeping the timer functional.
- The product intentionally excludes persistence, backend services, user accounts, analytics, settings, manual mode switching, skipped sessions, and multi-screen flows.
- Logical module boundaries for the implementation are:
- A timer state module responsible for mode, status, durations, and transitions.
- A timing module responsible for elapsed-time calculation, ticking, and overdue completion handling.
- A rendering module responsible for deriving all visible UI from state.
- An alerts module responsible for notification permission flow, audio preparation, and completion signaling.
- A controller module responsible for wiring user actions to state transitions and side effects.
- These modules should remain conceptually separate even if the first implementation keeps them in a small number of files, because the main goal is to keep timing and transition logic testable in isolation.

## Testing Decisions

- Good tests should verify external behavior and state transitions rather than implementation details like exact DOM update order or internal variable names.
- The highest-value tests are deterministic tests around the timer state machine, especially start, stop, reset, completion, and next-mode transitions.
- Timing tests should validate behavior against explicit timestamps rather than waiting in real time.
- The rendering tests, if added, should verify that a given state produces the correct visible outputs such as mode label, button text, countdown text, title text, and status message.
- The alert tests, if added, should focus on fallback behavior and side-effect gating, such as whether completion attempts notifications only when permitted and reports failures without breaking timer completion.
- The best modules to test are the timer state and transition logic, elapsed-time calculation, and centralized completion behavior.
- Tests should also cover the rule that overdue timers complete once and do not fire duplicate completion side effects.
- There is no existing testing prior art in this repository yet, so the test strategy should be introduced with behavior-first unit tests around extracted logic modules before adding any heavier browser-level coverage.

## Out of Scope

- User-configurable work or break durations.
- Pause and resume behavior.
- Auto-starting the next session.
- Manual mode switching controls.
- Skip controls.
- Session history, analytics, streaks, or statistics.
- Persistence across page reloads.
- Authentication, accounts, syncing, or backend services.
- Multi-tab coordination.
- Guaranteed alert delivery when the browser throttles or blocks background activity.
- Native mobile app behavior or offline installation concerns.

## Further Notes

- The app is intentionally positioned as a personal utility rather than a general consumer product.
- Browser behavior around notifications and audio can vary, so the app should promise best-effort alerts only while the tab is open.
- Keeping the control set small is a deliberate product decision, not a missing feature set.
- If the product expands later, the first pressure points will likely be persistence, settings, and clearer separation of timer logic from browser-side effects.

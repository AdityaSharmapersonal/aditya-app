# PRD: Simple Personal Timer Web App

## Problem Statement

I want a very simple personal timer web app that runs in a browser tab and supports a fixed work/break cycle without unnecessary product complexity. I do not want accounts, settings, persistence, history, analytics, or a backend. I need a deterministic, minimal timer that is easy to operate, starts in a known state, and gives clear completion feedback while staying small enough to remain a personal utility.

## Solution

Build a single-page client-side timer app with two fixed modes:

- Work: 25 minutes
- Break: 5 minutes

The app starts in Work mode at `25:00`, shows the active mode and countdown, and provides:

- One primary action button whose label reflects the next valid action
- One always-visible `Reset` button
- One small in-app status area for sound/notification issues

The timer should use real elapsed time from a recorded deadline rather than relying on naive decrement-only intervals. When a session completes, the app should:

- Play a short built-in beep
- Attempt a browser notification if permission is available
- Immediately switch to the next mode
- Update the button label to `Start Break` or `Start Work`
- Wait for the user to manually start the next session

## User Stories

1. As a personal productivity user, I want a timer that opens directly in a browser tab, so that I can use it without installing anything.
2. As a user starting a focus session, I want the app to open in Work mode at `25:00`, so that I always begin from a predictable default state.
3. As a user running a work interval, I want to see a clear Work label, so that I know which phase I am in.
4. As a user running a break interval, I want to see a clear Break label, so that I know which phase I am in.
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
18. As a user returning to the tab after it was delayed or throttled, I want an overdue session to complete once and switch to the next mode, so that the state remains coherent.
19. As a user relying on completion feedback, I want a short built-in beep at session end, so that I get an audible cue without managing audio files.
20. As a user who wants visual system-level feedback, I want the app to send a browser notification when a session ends, so that I can notice completion even if the tab is not foregrounded.
21. As a user concerned about intrusive permission prompts, I want notification permission to be requested only when I start using the timer, so that the app does not ask too early.
22. As a user in a browser that blocks or denies alerts, I want the timer to still complete normally, so that alert failures do not break the core function.
23. As a user whose notification permission is denied, I want to see a small in-app message, so that alert failure is explained instead of being silent.
24. As a user whose browser cannot play the beep, I want to see a small in-app message, so that I understand why the sound did not play.
25. As a user keeping the timer in a browser tab, I want the page title to include the remaining time and mode, so that I can monitor progress from the tab title.
26. As a user who refreshes the page, I want the app to return to the default Work `25:00` state, so that the behavior stays simple and deterministic.
27. As a user who does not want extra product complexity, I want no accounts, persistence, settings, manual mode switching, or history, so that the app stays small and personal.
28. As a user using the app on a small screen, I want the layout to remain readable and operable, so that the timer still works on mobile-sized viewports even though it is browser-tab-first.
29. As a user who only needs one purpose-built tool, I want the app to stay a single-view interface, so that I never need to navigate menus or screens.
30. As a user expecting a reliable simple control flow, I want all visible labels and actions to derive from the same app state, so that the UI does not become contradictory.

## Implementation Decisions

- Build as a single-page app using plain HTML, CSS, and JavaScript.
- Use only two fixed modes: `Work` (25 minutes) and `Break` (5 minutes).
- Start in `Work` mode at `25:00`.
- Model the app with an explicit state machine rather than inferring state from DOM text.
- Use three lifecycle statuses: `idle`, `running`, and `completed`.
- Define `completed` as: the previous session ended, the app has already switched to the next mode, and the next session is waiting for manual start.
- While running, compute remaining time from `targetEndAt - now`.
- Render the countdown in `MM:SS` only.
- Refresh the UI on a short interval while deriving correctness from timestamps, not interval accuracy.
- Centralize rendering so timer text, mode label, primary button text, page title, and status messages always stay in sync.
- Centralize completion logic so regular completion and overdue tab resumption follow the same path.
- Guard completion by state so sound/notification side effects fire only once.
- Make `Stop` reset the current mode to full duration instead of pausing.
- Keep `Reset` visible at all times and make it restore the current mode’s full duration without changing modes.
- Switch immediately to the next mode on completion, but do not auto-start it.
- Update the page title with the remaining time and mode.
- Request notification permission only in response to user interaction.
- Generate the completion beep with browser audio APIs instead of shipping an audio file.
- Prime audio setup from user interaction to reduce autoplay blocking.
- Use one small persistent status area for sound/notification availability issues.
- Keep logical module boundaries clear even if the code stays compact:
- Timer state and transitions
- Time calculation and ticking
- UI rendering
- Alerts and permission handling
- Controller/event wiring

## Testing Decisions

- Favor tests that verify external behavior and state transitions rather than implementation details.
- The highest-value tests cover state transitions for start, stop, reset, completion, and next-mode selection.
- Timing tests should be deterministic and driven by explicit timestamps, not real waiting.
- Rendering tests should verify visible outputs for a given state: mode text, countdown text, primary action text, title text, and status text.
- Alert tests should verify fallback behavior when notifications are denied or audio is unavailable.
- Tests should explicitly cover the rule that overdue timers complete once and do not double-fire side effects.
- There is no existing testing prior art in this repository yet, so behavior-first unit tests around extracted logic should come before heavier browser-level tests.

## Out of Scope

- Configurable work or break durations
- Pause/resume
- Auto-starting the next session
- Manual mode switching
- Skip controls
- Session history, analytics, streaks, or statistics
- Persistence across reloads
- Accounts, sync, or backend services
- Multi-tab coordination
- Guaranteed alert delivery under browser throttling or blocking
- Native mobile app behavior

## Further Notes

- This is intentionally a personal utility, not a broad consumer product.
- Browser notifications and audio are best-effort only while the tab is open.
- The small control surface is a deliberate product decision, not an incomplete feature set.

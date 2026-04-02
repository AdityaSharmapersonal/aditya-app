# Completion alerts with graceful fallback

## Parent PRD

#5

## What to build

Add the completion alert experience end to end. When a session finishes, the app should attempt a short built-in beep and a browser notification when permitted. Notification permission should be requested only from user interaction. If notification delivery or sound playback is unavailable, the timer must still complete normally and show a small in-app status message explaining the degraded alert behavior.

## Acceptance criteria

- [ ] Session completion attempts a short built-in beep without requiring uploaded audio assets.
- [ ] Browser notification permission is requested only from user interaction and notifications are shown only when permission is granted.
- [ ] If sound or notifications are unavailable, the timer still completes normally and the UI shows an explanatory status message.

## Blocked by

- Blocked by #TBD-04

## User stories addressed

- User story 19
- User story 20
- User story 21
- User story 22
- User story 23
- User story 24

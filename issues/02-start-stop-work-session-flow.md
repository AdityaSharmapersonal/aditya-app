# Start and stop work session flow

## Parent PRD

#5

## What to build

Add the first complete interactive timer flow for the current mode. This slice should make the primary button start the current session, drive countdown updates from elapsed-time logic instead of naive decrement-only state, and let the same primary button stop the session and reset the current mode to full duration. The outcome should be a demoable timer that can run and be stopped predictably.

## Acceptance criteria

- [ ] Pressing the primary action from the default state starts the current mode countdown.
- [ ] While running, the countdown is derived from a recorded deadline or equivalent elapsed-time calculation rather than simple decrement-only state.
- [ ] Pressing the primary action while running stops the session and resets the current mode to its full duration.

## Blocked by

- Blocked by #TBD-01

## User stories addressed

- User story 6
- User story 7
- User story 10
- User story 17
- User story 30

# Session completion and next-mode handoff

## Parent PRD

#5

## What to build

Implement the full end-of-session flow. When the current session reaches zero, the app should complete it once, switch immediately to the next mode, update the interface to reflect that next mode, and wait for manual restart rather than auto-starting the following session. This slice should also cover overdue completion when the tab resumes after the intended end time.

## Acceptance criteria

- [ ] When a work session completes, the app switches to Break mode and the primary action becomes `Start Break`.
- [ ] When a break session completes, the app switches to Work mode and the primary action becomes `Start Work`.
- [ ] Completion occurs once per running session, including when the tab resumes after the intended end time.

## Blocked by

- Blocked by #TBD-02

## User stories addressed

- User story 8
- User story 9
- User story 14
- User story 15
- User story 16
- User story 18

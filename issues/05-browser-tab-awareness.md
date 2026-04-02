# Browser tab awareness

## Parent PRD

#5

## What to build

Add the browser-tab-oriented behavior described in the PRD. The page title should reflect the remaining time and active mode while the app is in use, and the application should continue to honor the agreed reset-to-default behavior after a page reload. This slice is complete when tab-level visibility of status is useful without changing the app’s no-persistence stance.

## Acceptance criteria

- [ ] The page title includes the current remaining time and active mode.
- [ ] The title updates as timer state changes.
- [ ] Reloading the page returns the app to the default Work `25:00` state.

## Blocked by

- Blocked by #TBD-04

## User stories addressed

- User story 25
- User story 26

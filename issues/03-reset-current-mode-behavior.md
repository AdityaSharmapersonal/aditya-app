# Reset current mode behavior

## Parent PRD

#5

## What to build

Add the dedicated Reset behavior as a complete user-facing slice. The reset control should always be visible and should restore the full duration for the currently selected mode without changing modes. This behavior should work consistently whether the timer is idle or actively running.

## Acceptance criteria

- [ ] A Reset control is visible in all supported timer states.
- [ ] Pressing Reset while running stops the timer and restores the full duration of the current mode.
- [ ] Pressing Reset while idle leaves the current mode unchanged and restores that mode’s full duration.

## Blocked by

- Blocked by #TBD-02

## User stories addressed

- User story 11
- User story 12
- User story 13

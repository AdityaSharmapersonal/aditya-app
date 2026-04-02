# Behavior-first automated tests

## Parent PRD

#5

## What to build

Add automated tests that validate the timer’s externally visible behavior and state transitions. This slice should focus on deterministic tests for start, stop, reset, completion, next-mode handoff, overdue completion, and alert fallback behavior rather than implementation details. The result should be a stable safety net around the key rules defined in the parent PRD.

## Acceptance criteria

- [ ] Tests cover timer start, stop/reset, and next-mode completion behavior using deterministic time control.
- [ ] Tests cover overdue completion and verify completion side effects do not double-fire for a single session.
- [ ] Tests cover degraded alert behavior without requiring real notification or audio delivery.

## Blocked by

- Blocked by #TBD-02
- Blocked by #TBD-03
- Blocked by #TBD-04
- Blocked by #TBD-05
- Blocked by #TBD-06

## User stories addressed

- User story 17
- User story 18
- User story 22
- User story 30

---
description: 
auto_execution_mode: 1
---

1) No unused code
- No unused imports.
- All imports must be referenced in the file.
- Prefer IDE/ESLint autofix; remove dead imports before PR.
- No unused variables / parameters.
- Remove unused locals, destructured fields, and params.
- If intentionally unused (rare), it must follow the project convention (e.g. _param) and be justified.
- No unused functions / components / helpers.
- If a function/component is not referenced, delete it or move it behind an explicit feature flag with rationale.
- There should not be commented code

2) Comments must add value
- No vague or non-descriptive comments (e.g., “fix later”, “magic”, “this works”).
- Comments should either:
- Comments must be in English
- Explain why (tradeoffs, constraints, edge cases), or
- Document non-obvious behavior / intent, or
- Reference a ticket/spec with context.
- Avoid narrating obvious code (“set state”, “render view”).

3) Component structure & separation of concerns
- Avoid “mega files”: UI should be split into focused components when:
- The file grows beyond a reasonable size/complexity, or
- It contains multiple distinct UI sections with their own logic, or
- There are repeated patterns that can become reusable components.
- Each component should have a single clear responsibility:
- Presentational components: mostly UI + props.
-Container components/hooks: data fetching/state orchestration.

Extract:

- Reusable UI blocks → components/
- Page-specific blocks → components/<PageName>/
- Logic → custom hooks (useX) / utilities.

4) React state updates must be correct (no cascading setState patterns)

- Do not update state as a direct consequence of another state update in the same flow when it creates derived state or race conditions.
- Avoid patterns like: setA(...) then immediately setB(deriveFromA).

Prefer:

- Derived values via memoization (useMemo) instead of storing derived state.
- Functional updates (setX(prev => ...)) when new state depends on previous state.
- useEffect only when you truly need to synchronize with external effects; it must have correct deps and not create loops.

Reviewer should check for:

- Derived state duplication
- useEffect dependency mistakes
- setState loops and “update-after-update” chains

5) Standards:
- Prevent code duplication
- Typescript types should be enforced over any usage
- Use best react practices
- Don't use console logs
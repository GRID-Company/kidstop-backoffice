---
description: Pull the current data structure from the canonical source (e.g. ClickUp doc) into the local project documentation.
---

# Pull Data Structure

Use this workflow to keep the local data-structure document in sync with the canonical source (normally a ClickUp page or a shared design doc).

## When to use it

- The database/data model has changed in production/source-of-truth.
- A new module adds entities that should be reflected in the data-structure doc.
- You want to refresh `docs/Architecture/DataStructure.md` from the external source.

## Steps

1. **Identify the canonical source.** Read the project's `AGENTS.md` or the existing local `DataStructure.md` header for the ClickUp URL / source reference.
2. **Use the ClickUp MCP server** (or other relevant MCP) to fetch the source page.
3. **Transform the content** into the local format expected by the project.
4. **Write/overwrite** the local file, typically `docs/Architecture/DataStructure.md`.
5. **Review the diff** before committing.

## Local target file

```text
docs/Architecture/DataStructure.md
```

If the project uses a different convention, prefer the path documented in its `AGENTS.md`.

## Output

- Updated `docs/Architecture/DataStructure.md`.
- A concise summary of sections that changed.

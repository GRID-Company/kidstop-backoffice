---
name: general_codebase-memory
description: "Use the codebase knowledge graph for structural code queries. Triggers on: explore the codebase, understand the architecture, what functions exist, show me the structure, who calls this function, what does X call, trace the call chain, find callers of, show dependencies, impact analysis, dead code, unused functions, high fan-out, refactor candidates, code quality audit, graph query syntax, Cypher query examples, edge types, how to use search_graph."
---

# Codebase Memory — Knowledge Graph Tools

Graph tools return precise structural results in ~500 tokens vs ~80K for grep.

## Determining the target project

Every call to `search_graph`, `trace_path`, `get_code_snippet`, `get_architecture`, `query_graph`, etc. requires a `project` argument. Before running any graph tool:

1. **If a project/repo was explicitly mentioned**, use its `codebase-memory-mcp` project name (read it from the nearest `AGENTS.md`, or derive it from the canonical repo path).
2. **Otherwise**, run `list_projects` to see all indexed projects and pick the one whose `root_path` matches the current working directory or the repo you are working in.
3. Pass that exact `project` value to every subsequent graph tool call.

The project name is the canonical repo path with hyphens, e.g.:
`Users-alexisdanielvillicanabarrera-Documents-Repos-Grid-projects-active-ligucredit`

## Quick Decision Matrix

| Question | Tool call |
|----------|----------|
| Who calls X? | `trace_path(project="...", function_name="X", direction="inbound")` |
| What does X call? | `trace_path(project="...", function_name="X", direction="outbound")` |
| Full call context | `trace_path(project="...", function_name="X", direction="both")` |
| Find by name pattern | `search_graph(project="...", name_pattern="...")` |
| Dead code | `search_graph(project="...", max_degree=0, exclude_entry_points=true)` |
| Cross-service edges | `query_graph(project="...", query="<Cypher>")` |
| Impact of local changes | `detect_changes(project="...")` |
| Risk-classified trace | `trace_path(project="...", function_name="X", risk_labels=true)` |
| Text search | `search_code(project="...", query="...")` or Grep |

## Exploration Workflow
1. `list_projects` — check if project is indexed.
2. `get_graph_schema(project="...")` — understand node/edge types.
3. `search_graph(project="...", label="Function", name_pattern=".*Pattern.*")` — find code.
4. `get_code_snippet(project="...", qualified_name="project.path.FuncName")` — read source.

## Tracing Workflow
1. `search_graph(project="...", name_pattern=".*FuncName.*")` — discover exact name.
2. `trace_path(project="...", function_name="FuncName", direction="both", depth=3)` — trace.
3. `detect_changes(project="...")` — map git diff to affected symbols.

## Evidence Tiers
- **Scout (Tier 1):** fast positive lookup with few calls and targeted source checks. Treat results as provisional; never make absence, exhaustive, dead-code, or complete-impact claims.
- **Verify (Tier 2, default):** task-directed searches, relevant trace directions, exact snippets for material claims, and all relevant result pages.
- **Auditor (Tier 3):** bounded-scope full verification with current generation, complete relevant pagination, both call directions and broader relationships when material, plus explicit unresolved limitations.
- **Every tier:** after candidate paths are known, call `check_index_coverage(project="...")` once with every evidence path. For negative or exhaustive claims also include the relevant scopes. A clean result means no recorded gap, not proof of completeness. For partial, skipped, excluded, stale, pending, or unknown coverage, read/grep the reported ranges or scope before relying on graph results.

## Sessions and Subagents
- At session start or after compaction, confirm the nearest graph project and generation with `list_projects`/`index_status`, then choose Scout, Verify, or Auditor.
- Before delegating, query the graph and coverage in the parent. Pass the tier, exact project, generation/freshness, bounded scope, queries and pagination state, qualified symbols, paths, call-chain findings, coverage ranges/reasons, source fallback already performed, and unresolved questions to the child.
- Runtimes such as Hermes isolate child context: put those graph findings in the `context` argument to `delegate_task`; do not assume the child inherits MCP access or the parent's conversation.
- A child without MCP tools must not call or claim MCP access. It should work from the supplied evidence and use read/grep on exact source, especially every reported missed-coverage range.

## Quality Analysis
- Dead code: `search_graph(project="...", max_degree=0, exclude_entry_points=true)`
- High fan-out: `search_graph(project="...", min_degree=10, relationship="CALLS", direction="outbound")`
- High fan-in: `search_graph(project="...", min_degree=10, relationship="CALLS", direction="inbound")`

## 15 MCP Tools
`index_repository`, `index_status`, `list_projects`, `delete_project`,
`search_graph`, `search_code`, `trace_path`, `detect_changes`,
`query_graph`, `get_graph_schema`, `get_code_snippet`, `get_architecture`,
`check_index_coverage`, `manage_adr`, `ingest_traces`

## Edge Types
CALLS, HTTP_CALLS, ASYNC_CALLS, DATA_FLOWS, IMPORTS, DEFINES, DEFINES_METHOD,
HANDLES, IMPLEMENTS, OVERRIDE, USAGE, CALL_REFERENCE, CONFIGURES, FILE_CHANGES_WITH,
SIMILAR_TO, SEMANTICALLY_RELATED, CONTAINS_FILE, CONTAINS_FOLDER,
CONTAINS_PACKAGE

## Cypher Examples (for query_graph)
```
MATCH (a)-[r:HTTP_CALLS]->(b) RETURN a.name, b.name, r.url_path, r.confidence LIMIT 20
MATCH (f:Function) WHERE f.name =~ '.*Handler.*' RETURN f.name, f.file_path
MATCH (a)-[r:CALLS]->(b) WHERE a.name = 'main' RETURN b.name
```

## Gotchas
1. `search_graph(relationship="HTTP_CALLS")` filters nodes by degree — use `query_graph` with Cypher to see actual edges.
2. `query_graph` has a 100k row ceiling — add a Cypher `LIMIT` for broad queries or use `search_graph` pagination.
3. `trace_path` needs exact names — use `search_graph(project="...", name_pattern=...)` first.
4. `direction="outbound"` misses cross-service callers — use `direction="both"`.
5. `search_graph` results default to 50 per page — check `has_more` and use `offset`.

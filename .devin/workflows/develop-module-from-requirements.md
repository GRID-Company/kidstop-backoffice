---
description: Develop a full new module from a requirements.md document — worktree, module implementation, API collection, integration guide, and PR
---

# Develop Module from Requirements

This workflow takes a requirements document (`*-requirements.md`) describing a new API/module and drives the full development lifecycle: isolated worktree → implementation → API collection → integration guide → pull request.

**Input**: the path to a requirements document, e.g. `docs/Requirements/ServiceOrders-requirements.md`.

**Prerequisites**: `gh` CLI authenticated (`gh auth status`) and `git` available.

---

## 1. Create an isolated worktree for the feature

Always start by creating a dedicated git worktree so the feature is developed in isolation without touching the main working directory.

Derive a short kebab-case feature name from the module (e.g. `service-orders`).

// turbo
```bash
git fetch origin
FEATURE="<module-kebab-name>"                     # e.g. service-orders
BRANCH="feature/${FEATURE}"
REPO_DIR=$(basename "$(pwd)")
WORKTREE="../${REPO_DIR}-${FEATURE}"

git worktree add -b "$BRANCH" "$WORKTREE" origin/develop
echo "Worktree created at $WORKTREE on branch $BRANCH"
```

> **⚠️ Ruta del worktree — sibling, no hijo:**
> El path `../${REPO_DIR}-${FEATURE}` es **relativo al directorio del repo principal** (`${REPO_DIR}`).
> Esto coloca el worktree como un **directorio hermano** (sibling) en el mismo nivel que el repo principal, NO dentro de él.
>
> Ejemplo concreto:
> - Repo principal: `/ruta/al/proyecto/<repo>/`
> - Worktree creado: `/ruta/al/proyecto/<repo>-${FEATURE}/` ← mismo nivel, hermano
>
> **SIEMPRE verificar la ruta real con `git worktree list` inmediatamente después de crearlo** antes de empezar a escribir archivos. No inferir la ruta manualmente.
>
> Esta convención sibling es intencional: evita que el repo principal detecte el worktree como contenido untracked en `git status`.

**All subsequent steps run inside `$WORKTREE`.** Open that directory and continue the work there.

---

## 2. Understand the requirements document

Read the provided `*-requirements.md` end to end and extract:

- **Entity data model** — fields, types, required/nullable, FK relations, enums, JSONB types
- **Business rules** — auto-generated IDs, defaults, status lifecycle, conditional validations, FK existence checks
- **GraphQL API** — every query and mutation with parameters, return types, and per-operation rules
- **Modifications to existing entities** — any changes needed to other modules

Produce a short mental (or written) implementation plan before writing code. Do not proceed until every business rule and operation is understood.

---

## 3. Implement the new module

Follow the **`backend_new-module`** skill (`.devin/skills/backend_new-module/SKILL.md`).

Create, in order:

1. The status/enum types under `shared/data/types/{module}/`
2. The entity under `shared/data/entities/{module}/` (inherits `BaseEntity`)
3. The DTOs (`create`, `update`, `find args`, `paginated output`) under `modules/{module}/view/dto/`
4. The service under `modules/{module}/domain/`
5. The resolver under `modules/{module}/view/`
6. The module file and register it in `AppModule`
7. Add exports to the shared `types/index.ts` and `entities/index.ts`

Verify the app compiles before continuing.

---

## 4. Add the API Collection

Follow the **`backend_add-api-collection`** skill (`.devin/skills/backend_add-api-collection/SKILL.md`).

Create a folder `api-collection/{module}/` with one `.yml` file per operation (list, filters, search, detail, create, update, lifecycle mutations, delete), using the correct `seq` ordering and the Bruno file format.

---

## 5. Update / add the Integration Guide

Follow the **`backend_add-api-guide`** skill (`.devin/skills/backend_add-api-guide/SKILL.md`).

Create `api-guides/{Module}API.md` documenting all queries, mutations, TypeScript interfaces, response examples, business rules, search & filtering, status lifecycle, and error handling.

---

## 6. Stage and commit all changes

// turbo
```bash
git add -A
git commit -m "feat(${FEATURE}): implement module, API collection and integration guide"
```

## 7. Push the feature branch

```bash
git push -u origin "$BRANCH"
```

## 8. Write the PR description to a temp file

**IMPORTANT**: Always write the PR body to a temporary file. Passing the description inline (`--body "..."`) with long text or special characters causes the `gh` command to hang / get stuck in a pager hunk.

```bash
cat > /tmp/pr-body-${FEATURE}.md << 'EOF'
## Summary

Implements the <Module> module based on `docs/Requirements/<Module>-requirements.md`.

## Changes

### Module implementation (`nestjs-api/src/modules/<module>/`)
- Entity, DTOs, service, resolver and module registration.

### API Collection (`api-collection/<module>/`)
- Bruno requests for all queries and mutations.

### Integration Guide (`api-guides/<Module>API.md`)
- Full frontend integration documentation.

## Notes
- <any relevant business rule, edge case, or follow-up>
EOF
```

## 9. Create the pull request with GH CLI

Always use `--body-file` (never inline `--body`). Base branch is `develop`.

```bash
gh pr create \
  --base develop \
  --head "$BRANCH" \
  --title "feat: <Module> module" \
  --body-file /tmp/pr-body-${FEATURE}.md
```

The command prints the PR URL on success:

```
Creating pull request for feature/<module> into develop in <owner>/<repo>
https://github.com/<owner>/<repo>/pull/<number>
```

---

## 10. Clean up the worktree

Once el PR está creado, eliminar el worktree local. La rama sigue viva en origin para el PR.

// turbo
```bash
git worktree remove "$WORKTREE" --force
echo "Worktree $WORKTREE removed"
```

> La rama `feature/${FEATURE}` **no se elimina localmente** hasta que el PR sea mergeado.
> Cuando sea mergeado, ejecutar desde el repo principal:
> ```bash
> git branch -d "$BRANCH"
> ```

---

## 11. Report back

Share the PR URL with the user and a concise summary of what was implemented (module, collection, guide).

---
name: backend_deploy-to-develop
description: Create or reuse a feature branch, commit and push the intended changes, open and merge a pull request into develop, update local develop, and clean up the feature branch.
argument-hint: "[feature-branch]"
triggers:
  - user
allowed-tools:
  - read
  - grep
  - glob
  - exec
---

# Deploy Changes to `develop`

Publish the current intended changes through a pull request into `develop`. Complete the whole workflow unless a validation, authentication, permission, conflict, failed check, or required confirmation blocks it.

## Safety Rules

- Never commit directly on `develop`.
- Never include unrelated changes. Inspect the full diff and ask the user when ownership or scope is unclear.
- Never discard, overwrite, reset, stash, or force-move uncommitted changes.
- Never use force push, history rewriting, `--no-verify`, or bypass branch protection/checks.
- Never merge when required checks fail, the PR is not mergeable, or GitHub reports conflicts.
- Branch deletion is destructive. Immediately before deleting the remote or local feature branch, identify the exact branch and ask for explicit confirmation unless the user explicitly requested deletion of that exact branch in the current message.
- Do not delete `develop`, `main`, the repository default branch, or a branch unrelated to the PR.
- Use the `origin` remote and target `develop` unless the user explicitly specifies otherwise.

## Step 1 — Inspect Repository State

Run these checks, in parallel when possible:

```bash
git status --short --branch
git diff --check
git diff
git diff --staged
git branch --show-current
git remote -v
git log -5 --oneline
```

Confirm:

1. The repository has intended changes or commits to publish.
2. `origin` points to the expected repository.
3. No unrelated changes would be included.
4. The current branch is either `develop` or an appropriate feature/fix branch.

If there are no changes or unpublished commits, stop without creating an empty commit or PR.

## Step 2 — Create or Reuse the Feature Branch

### When currently on `develop`

Create a branch. Uncommitted changes remain in the working tree and move with the checkout:

```bash
git switch -c <feature-branch>
```

Use the branch argument when supplied. Otherwise infer a concise kebab-case name from the changes, prefixed with `feature/`, `fix/`, `refactor/`, or `docs/`. Ask the user only if a reliable name cannot be inferred.

### When already on a feature branch

Reuse it if it contains only the intended work and is based on `develop`.

### When on `main` or an unrelated branch

Do not move changes automatically. Explain the state and ask the user how to proceed.

Record the exact feature branch name; every later push, PR, and deletion must use that same name.

## Step 3 — Verify the Changes

Follow repository verification instructions from `AGENTS.md` and related rules. Run the smallest relevant tests, lint, typecheck, or build for the changed scope. Fix failures caused by the intended changes before continuing.

Review again:

```bash
git diff --check
git diff
git status --short
```

Stop if verification fails for unresolved reasons.

## Step 4 — Commit

Stage only the intended files. Prefer explicit paths instead of `git add .`:

```bash
git add <intended-paths>
```

Review the staged diff for correctness and secrets:

```bash
git diff --staged --check
git diff --staged
git status --short
```

Create a concise conventional commit focused on why:

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <reason for the change>

Generated with [Devin](https://devin.ai)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>
EOF
)"
```

If hooks modify files and the commit fails, review the modifications, stage the intended hook changes, and retry. Never bypass hooks.

If the feature branch already has the intended commits and the working tree is clean, do not create an additional empty commit.

## Step 5 — Push

Push the recorded feature branch to `origin`:

```bash
git push -u origin <feature-branch>
```

Do not force push. Ask the user for help if authentication or repository permissions fail.

## Step 6 — Review and Create the Pull Request

Before creating the PR, fetch and review all feature commits and the complete diff:

```bash
git fetch origin develop
git status --short --branch
git log origin/develop..HEAD --oneline
git diff origin/develop...HEAD
```

If the branch is behind `origin/develop` and GitHub cannot merge it cleanly, stop and ask before rebasing or merging `develop` into the feature branch.

Create the PR with `gh`, targeting `develop`:

```bash
gh pr create --base develop --head <feature-branch> --title "<concise title>" --body "$(cat <<'EOF'
## Summary
- <change and reason>
- <change and reason>

#### Test plan
- [x] <verification performed>

Generated with [Devin](https://devin.ai)
EOF
)"
```

If a PR already exists for the branch, reuse it instead of creating a duplicate:

```bash
gh pr view <feature-branch> --json number,state,url,baseRefName,headRefName
```

## Step 7 — Validate and Merge the Pull Request

Inspect the PR:

```bash
gh pr view <pr-number> --json number,state,isDraft,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup,url,baseRefName,headRefName
gh pr checks <pr-number>
```

Merge only when:

- Base is `develop` and head is the recorded feature branch.
- The PR is open and not a draft.
- GitHub reports it as mergeable without conflicts.
- Required reviews and checks are satisfied.

Use a merge commit to match this repository's history:

```bash
gh pr merge <pr-number> --merge --delete-branch
```

The `--delete-branch` flag requests deletion of the remote feature branch after merge. Apply the branch-deletion confirmation rule before running this command.

If branch deletion was not confirmed, merge without deletion:

```bash
gh pr merge <pr-number> --merge
```

Verify the result rather than assuming success:

```bash
gh pr view <pr-number> --json number,state,mergedAt,mergeCommit,url,baseRefName,headRefName
```

The state must be `MERGED` before continuing.

## Step 8 — Update Local `develop`

After the PR is confirmed merged:

```bash
git switch develop
git pull --ff-only origin develop
git status --short --branch
```

Require a clean working tree and confirm local `develop` matches `origin/develop`. Never use reset to force synchronization.

## Step 9 — Delete the Local Feature Branch

Check whether the recorded branch still exists locally:

```bash
git branch --list <feature-branch>
```

Apply the branch-deletion confirmation rule, then delete only with the safe merged-branch form:

```bash
git branch -d <feature-branch>
```

Never use `git branch -D`. If `-d` refuses, stop and investigate rather than forcing deletion.

If `--delete-branch` did not remove the remote branch, verify the PR is merged and apply the confirmation rule before deleting exactly that remote branch:

```bash
git ls-remote --heads origin <feature-branch>
git push origin --delete <feature-branch>
```

## Step 10 — Final Verification

Run:

```bash
git status --short --branch
git branch --show-current
git log -3 --oneline
git ls-remote --heads origin <feature-branch>
```

Confirm all of the following:

- Current local branch is `develop`.
- Local `develop` is synchronized with `origin/develop`.
- The PR is merged.
- The merge commit is present on `develop`.
- The feature branch no longer exists locally or remotely when deletion was confirmed.

Report the PR URL, merged state, merge commit, current local branch, synchronization state, and branch cleanup result.
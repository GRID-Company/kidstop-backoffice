---
description: Work on a ClickUp task from URL - fetch context, plan, implement, commit, push and create PR
---

# Work on ClickUp Task

## Prerequisites
- ClickUp credentials configured in `.env` (`CLICKUP_API_KEY`)
- GH CLI authenticated (`gh auth status`)

## Workflow

### Step 1 - Get task context
- Extract the `TASK_ID` from the ClickUp URL (the code at the end, e.g. `86dznjqnp` from `https://app.clickup.com/t/86dznjqnp`)
- Fetch task details:
```bash
source .env && CLICKUP_API_KEY=$CLICKUP_API_KEY node -e "
const ClickUpAPI = (await import('./scripts/clickup/clickup-api.js')).default;
const api = new ClickUpAPI(process.env.CLICKUP_API_KEY);
const task = await api.getTask('TASK_ID');
console.log(JSON.stringify({
  name: task.name,
  description: task.text_content,
  status: task.status?.status,
  priority: task.priority?.priority,
  tags: task.tags?.map(t => t.name),
  list: task.list?.name,
  folder: task.folder?.name
}, null, 2));
"
```

### Step 2 - Review architecture and existing code
- Read `docs/ARCHITECTURE.md` for code guidelines
- Read `docs/IMPLEMENTATION_PLAN.md` for module context
- Inspect existing patterns in the codebase relevant to the task
- Check `docs/PROJECT_CONTEXT.md` if business context is needed

### Step 3 - Create plan
- Present a concise plan based on the task description and codebase analysis
- Wait for user approval before proceeding

### Step 4 - Create branch and move task to in progress
- Create branch from `dev` following convention: `feature/<task-id>-<short-description>`
- Move task to "in progress" in ClickUp:
```bash
source .env && CLICKUP_API_KEY=$CLICKUP_API_KEY node -e "
const ClickUpAPI = (await import('./scripts/clickup/clickup-api.js')).default;
const api = new ClickUpAPI(process.env.CLICKUP_API_KEY);
const result = await api.updateTask('TASK_ID', { status: 'in progress' });
console.log('Status:', result.status?.status);
"
```

### Step 5 - Implement
- Ask if the user is ready to implement plan
- Follow the plan step by step
- Global types go in `src/lib/types/`
- Follow existing patterns and conventions from `ARCHITECTURE.md`
- Verify TypeScript compiles with `npx tsc --noEmit`

### Step 6 - Commit, push and create PR
- Ask if the user is ready to commit changes
- Stage and commit with conventional commit message (e.g. `feat:`, `fix:`, `refactor:`)
- Push branch to origin
- Ask if the user is ready to create PR
- Create PR towards `dev` using GH CLI with:
  - Title matching the commit message
  - Description with: summary, ClickUp task link, list of changes, and testing notes

### Notes
- No testing framework is configured yet - omit unit tests unless explicitly requested
- Commits must be in English
- Do not commit without user confirmation
- All code changes must follow `docs/ARCHITECTURE.md` guidelines

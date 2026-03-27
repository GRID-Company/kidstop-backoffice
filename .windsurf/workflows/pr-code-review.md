---
description: Perform comprehensive code review of a pull request
auto_execution_mode: 3
---

This workflow is for performing thorough code review of pull requests using GH CLI and automated analysis

# Instructions
- Use GH CLI
- The target repo is https://github.com/GRID-Company/template-front-end
- Follow the code review standards defined in the project

## Workflow
Step 1
- Ask the user for the pull request number or URL

Step 2
- Fetch the pull request details and changed files
- Get the diff and statistics

Step 2.5 - Check for Code Duplication
- Search for similar patterns, constants, or functions in the codebase
- Use grep/ripgrep to find existing implementations
- Verify if new code reuses existing utilities from lib/, shared/, or other features
- Check for duplicate types, constants, or business logic

Step 3 - Analyze the code changes in really strict mode:
  - **Code Duplication**: Search codebase for similar implementations
  - **Architecture Compliance**: Verify Feature-First pattern adherence
  - **Import Analysis**: Check for unused imports and circular dependencies
  - **Component Structure**: Review separation of concerns
  - **React Patterns**: Verify state patterns and useEffect dependencies
  - **TypeScript Safety**: Check type safety and proper typing
  - **Error Handling**: Review error handling and edge cases
  - **Project Standards**: Validate naming conventions and file organization
  - **Comments**: Ensure no unnecessary comments (especially non-English)
  - **Constants/Types**: Verify reuse of existing shared constants and types

Step 4 - Generate a comprehensive review with:
  - **Duplication Analysis**: Specific findings of duplicate code
  - **Architecture Assessment**: Compliance with project patterns
  - **Summary of Changes**: What was added/modified
  - **Critical Issues**: Blocking issues that must be fixed
  - **Suggestions**: Non-blocking improvements
  - **Approval Status**: APPROVED / REQUEST CHANGES / COMMENT
  - **Action Items**: Specific tasks for the author

Step 5
- Post the review as a comment on the pull request
- Optionally add labels or status checks

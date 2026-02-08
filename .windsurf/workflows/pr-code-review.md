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

Step 3
- Analyze the code changes:
  - Check for unused code (imports, variables, functions)
  - Review component structure and separation of concerns
  - Verify React state patterns and useEffect dependencies
  - Check TypeScript type safety
  - Review error handling and edge cases
  - Validate against project standards

Step 4
- Generate a comprehensive review with:
  - Summary of changes
  - Specific feedback on issues found
  - Suggestions for improvements
  - Approval status or requested changes

Step 5
- Post the review as a comment on the pull request
- Optionally add labels or status checks

# Git Hooks Configuration

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks and ensure code quality before commits.

## Installed Hooks

### Pre-commit Hook

Runs before every commit and validates:

1. **ESLint** - Lints all TypeScript/JavaScript files
2. **Prettier** - Checks code formatting
3. **TypeScript** - Type checking with `tsc --noEmit`
4. **Console.log Detection** - Warns about `console.log` in staged files (doesn't block)
5. **Branch Protection** - Prevents direct commits to `main` branch

**The commit will be blocked if:**

- ESLint has errors
- Code is not properly formatted
- TypeScript has type errors
- You're trying to commit directly to `main`

**Warnings (don't block):**

- `console.log` statements found
- React Hooks dependency warnings

### Commit-msg Hook

Validates commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) format.

**Required format:**

```
<type>: <description>

Examples:
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
refactor: improve inventory mapper
chore: update dependencies
```

**Allowed types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `revert` - Reverting changes
- `ci` - CI/CD changes
- `build` - Build system changes

## Manual Validation

Run all validations manually:

```bash
npm run validate
```

This runs the same checks as the pre-commit hook without committing.

## Bypassing Hooks (Not Recommended)

In emergency situations only:

```bash
git commit --no-verify -m "emergency fix"
```

⚠️ **Warning:** Bypassing hooks should be avoided as it can introduce code quality issues.

## Configuration Files

- `.husky/pre-commit` - Pre-commit hook script
- `.husky/commit-msg` - Commit message validation
- `commitlint.config.cjs` - Commitlint configuration
- `eslint.config.mjs` - ESLint rules
- `tsconfig.json` - TypeScript configuration

## Troubleshooting

### Hooks not running

If hooks aren't running after pulling changes:

```bash
npm install
```

This will reinstall Husky hooks via the `prepare` script.

### Type errors in test files

Test files are excluded from TypeScript checking. If you see errors, ensure your test files match:

- `**/*.test.ts`
- `**/*.test.tsx`
- `**/__tests__/**`

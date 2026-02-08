# ClickUp Scripts

This directory contains utility scripts for ClickUp integration and management.

## Official Scripts (Core)

### API & Connection
- `clickup-api.js` - Core ClickUp API client wrapper
- `test-connection.js` - Test ClickUp API connection (read-only)

### Task Management
- `create-task.js` - Create individual tasks
- `update-task.js` - Update existing tasks
- `get-statuses.js` - Get available statuses from lists

### Project Structure
- `create-project-structure.js` - Set up initial project structure
- `setup-clickup.sh` - Shell script for initial setup

## Legacy Scripts (Experimental/Deprecated)

Scripts in the `legacy/` directory are experimental, deprecated, or created for specific one-time operations:

- `create-all-phase-tasks.js` - Bulk task creation (experimental)
- `create-foundation-tasks.js` - Foundation tasks setup (one-time use)
- `create-dashboard.js` - Dashboard generation (replaced by web interface)
- `emergency-dashboard.js` - Emergency dashboard (crisis-specific)
- `dashboard-improved.js` - Improved dashboard (experimental)
- `generate-html-dashboard.js` - HTML dashboard generation (deprecated)
- `recreate-tasks-complete.js` - Complete task recreation (one-time)
- `update-tasks-with-details.js` - Bulk task updates (experimental)
- `create-additional-lists.js` - Additional list creation (specific use)
- `create-simple-tasks.js` - Simple task creation (experimental)
- `create-visual-dashboards.js` - Visual dashboard creation (deprecated)
- `update-dashboard.js` - Dashboard updates (experimental)
- `setup-custom-fields.js` - Custom field setup (one-time)
- `archive-list.js` - List archiving (maintenance)
- `clean-foundation-tasks.js` - Foundation task cleanup (maintenance)
- `get-folder-id.js` - Get folder ID (utility)
- `manual-task-guide.md` - Documentation for manual task creation

## Usage

1. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your ClickUp API credentials
   ```

2. Run official scripts:
   ```bash
   # Test connection
   node test-connection.js
   
   # Create project structure
   node create-project-structure.js
   ```

3. Legacy scripts should be used with caution and only for specific maintenance tasks.

## CLI Scripts

The `cli/` directory contains command-line interface tools for common operations.

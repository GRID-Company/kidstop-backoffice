# ClickUp Integration Feature

Modern, secure, and maintainable ClickUp API integration following Feature-First architecture.

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Add to your .env file
CLICKUP_API_KEY=pk_your_api_key_here
CLICKUP_WORKSPACE_ID=your_workspace_id
CLICKUP_FOLDER_ID=your_folder_id  # Optional
```

### 2. Install & Setup
```bash
# Test connection
npm run clickup:test

# Setup workspace structure
npm run clickup:setup

# Create a task
npm run clickup:create-task --name "My First Task"
```

### 3. Use in Your App
```typescript
import { getClickUpService } from './domain/services/clickup.service';

const clickUpService = getClickUpService();
const task = await clickUpService.tasks.createTaskWithValidation(listId, {
  name: 'New Task',
  description: 'Task description',
});
```

## 📁 Structure

```
src/features/clickup/
├── adapters/           # External integrations
│   ├── api/            # HTTP client and endpoints
│   └── config/         # Configuration management
├── domain/            # Business logic
│   ├── managers/      # Domain managers
│   └── services/      # Service orchestration
└── ui/               # React components
    ├── components/
    └── views/
```

## 🔧 Available Scripts

### CLI Commands
```bash
npm run clickup:test          # Test connection and configuration
npm run clickup:setup         # Setup workspace structure
npm run clickup:create-task   # Create a new task
```

### Task Creation Examples
```bash
# Basic task
npm run clickup:create-task --name "Task Name"

# With details
npm run clickup:create-task \
  --name "Bug Fix" \
  --description "Fix critical bug" \
  --status "in progress" \
  --priority 1 \
  --assignees "dev@example.com"

# Help
npm run clickup:create-task --help
```

## 🎨 React Components

### Dashboard Component
```typescript
import ProjectDashboard from './ui/components/dashboard/project-dashboard';

<ProjectDashboard 
  listId="your-list-id"
  refreshInterval={30000}
/>
```

### Features
- Real-time metrics and charts
- Automatic data refresh
- Responsive design
- Error handling and loading states

## 🔌 API Usage

### Service Initialization
```typescript
import { getClickUpService } from './domain/services/clickup.service';

const clickUpService = getClickUpService();
```

### Task Operations
```typescript
// Create task with validation
const task = await clickUpService.tasks.createTaskWithValidation(listId, data);

// Bulk create tasks
const result = await clickUpService.tasks.bulkCreateTasks(listId, tasks);

// Get tasks with metrics
const { tasks, metrics } = await clickUpService.tasks.getTasksWithBusinessLogic(listId, {
  includeMetrics: true,
});
```

### Workspace Operations
```typescript
// Get workspace information
const info = await clickUpService.getWorkspaceInfo();

// Setup workspace structure
const structure = await clickUpService.setupWorkspaceStructure({
  folderName: 'My Project',
  listName: 'Main Tasks',
});

// Health check
const health = await clickUpService.getHealthStatus();
```

## 🛡️ Security Features

- Environment variable validation with Zod
- No hardcoded API keys
- Type-safe configuration
- Secure error handling
- Rate limiting awareness

## 🔄 Error Handling & Retry

- Automatic retry with exponential backoff
- Error classification and recovery suggestions
- Structured logging with multiple levels
- Health checks and auto-fix capabilities

## 📊 Features

### Task Management
- ✅ Create, update, delete tasks
- ✅ Bulk operations
- ✅ Validation and business rules
- ✅ Metrics and analytics
- ✅ Status and priority management

### Workspace Management
- ✅ Workspace and space operations
- ✅ Folder and list management
- ✅ Custom fields setup
- ✅ Member management

### Dashboard
- ✅ Real-time metrics
- ✅ Interactive charts (ApexCharts)
- ✅ Task analytics
- ✅ Progress tracking
- ✅ Responsive design

## 🔧 Configuration

### Environment Variables
```bash
# Required
CLICKUP_API_KEY=your_api_key
CLICKUP_WORKSPACE_ID=your_workspace_id

# Optional
CLICKUP_FOLDER_ID=your_folder_id
CLICKUP_RETRY_ATTEMPTS=3
CLICKUP_RETRY_DELAY=1000
CLICKUP_TIMEOUT=30000
CLICKUP_LOG_LEVEL=info
```

### Priority Levels
- `1` = Urgent (Red)
- `2` = High (Orange)
- `3` = Normal (Blue)
- `4` = Low (Green)

### Status Options
- `todo` - To Do
- `in progress` - In Progress
- `complete` - Complete
- Custom statuses per list

## 🐛 Troubleshooting

### Connection Issues
```bash
# Test connection
npm run clickup:test

# Enable debug logging
CLICKUP_LOG_LEVEL=debug npm run clickup:test
```

### Common Errors
- **API Key Error**: Check CLICKUP_API_KEY in .env
- **Workspace Error**: Verify CLICKUP_WORKSPACE_ID
- **Module Error**: Ensure TypeScript paths are configured

## 📚 Documentation

- [Migration Guide](../../../docs/CLICKUP_MIGRATION_GUIDE.md)
- [Architecture Documentation](../../../docs/ARCHITECTURE.md)
- [API Reference](./domain/services/clickup.service.ts)

## 🎯 Best Practices

1. **Always validate environment variables** before using the service
2. **Use bulk operations** for multiple tasks
3. **Handle errors gracefully** with try/catch blocks
4. **Use structured logging** for debugging
5. **Monitor API rate limits** in production

## 🔄 Migration from Old System

See [Migration Guide](../../../docs/CLICKUP_MIGRATION_GUIDE.md) for detailed migration instructions from the old script-based system.

---

*Built with ❤️ using Feature-First architecture*

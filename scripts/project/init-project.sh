#!/bin/bash

# Script to initialize a new project from the template
# Usage: ./scripts/project/init-project.sh <project-name>

set -e

# Load helper functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils/helpers.sh"

# Configuration
TEMPLATE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TEMPLATE_CONFIG="$TEMPLATE_DIR/template-config.json"

print_header "Project Initialization"

# Validate arguments
if [ $# -eq 0 ]; then
  print_error "Project name is required"
  echo ""
  echo "Usage: ./scripts/project/init-project.sh <project-name>"
  echo ""
  echo "Example:"
  echo "  ./scripts/project/init-project.sh my-new-project"
  echo ""
  exit 1
fi

PROJECT_NAME=$1
TARGET_DIR="../$PROJECT_NAME"

# Validate project name
if ! validate_project_name "$PROJECT_NAME"; then
  exit 1
fi

# Check if target directory already exists
if check_directory "$TARGET_DIR"; then
  print_error "Directory already exists: $TARGET_DIR"
  exit 1
fi

print_info "Project name: $PROJECT_NAME"
print_info "Target directory: $TARGET_DIR"
echo ""

# Confirm with user
if ! confirm "Create new project '$PROJECT_NAME'?"; then
  print_info "Cancelled"
  exit 0
fi

echo ""
print_info "Creating project structure..."

# Create target directory
mkdir -p "$TARGET_DIR"
print_success "Created directory: $TARGET_DIR"

# Copy template files
print_info "Copying template files..."

# Copy main directories
cp -r "$TEMPLATE_DIR/src" "$TARGET_DIR/"
cp -r "$TEMPLATE_DIR/public" "$TARGET_DIR/"
cp -r "$TEMPLATE_DIR/docs" "$TARGET_DIR/"
cp -r "$TEMPLATE_DIR/scripts" "$TARGET_DIR/"

# Copy configuration files
cp "$TEMPLATE_DIR/package.json" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/tsconfig.json" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/next.config.ts" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/postcss.config.mjs" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/eslint.config.mjs" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/.prettierrc" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/.prettierignore" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/.gitignore" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/codegen.ts" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/hero.ts" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/template-config.json" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/README.md" "$TARGET_DIR/"

# Copy environment templates
cp "$TEMPLATE_DIR/.env.template" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/.env.example" "$TARGET_DIR/"

print_success "Files copied"

# Update package.json with project name
print_info "Updating package.json..."
cd "$TARGET_DIR"
replace_placeholder "package.json" "template-front-end" "$PROJECT_NAME"
print_success "Updated package.json"

# Update template-config.json
print_info "Updating template-config.json..."
replace_placeholder "template-config.json" "{{PROJECT_NAME}}" "$PROJECT_NAME"
print_success "Updated template-config.json"

# Create .env from template
print_info "Creating .env file..."
cp .env.template .env
replace_placeholder ".env" "PROJECT_NAME=" "PROJECT_NAME=$PROJECT_NAME"
print_success "Created .env file"

# Initialize git repository
print_info "Initializing git repository..."
git init
print_success "Git repository initialized"

# Create initial commit
print_info "Creating initial commit..."
git add .
git commit -m "Initial commit from GRID Frontend Template

Project: $PROJECT_NAME
Template version: 1.0.0
Based on: template-front-end"
print_success "Initial commit created"

# Create branches
print_info "Creating branches..."
git branch -M main
git checkout -b dev
print_success "Created branches: main, dev"

# Install dependencies
print_info "Installing dependencies..."
echo ""

if command_exists npm; then
  npm install
  print_success "Dependencies installed"
else
  print_warning "npm not found, skipping dependency installation"
fi

echo ""
print_header "Project Created Successfully!"

print_success "Project '$PROJECT_NAME' has been created at: $TARGET_DIR"
echo ""

print_info "Next steps:"
echo "1. cd $PROJECT_NAME"
echo "2. Configure .env file with your settings"
echo "3. Run validation: ./scripts/setup/validate-env.sh"
echo "4. Start development server: npm run dev"
echo ""

print_info "Optional setup:"
echo "- Configure ClickUp: npm run clickup:setup"
echo "- Configure GitHub Secrets: ./scripts/setup/setup-github-secrets.sh"
echo "- Read documentation: docs/ENVIRONMENT_SETUP.md"
echo ""

print_info "Project structure:"
echo "- src/features/     → Feature modules (auth, inventory, windows)"
echo "- src/lib/          → Utilities, API, types"
echo "- src/shared/       → Shared components"
echo "- docs/             → Documentation"
echo "- scripts/          → Automation scripts"
echo ""

print_success "Happy coding! 🚀"

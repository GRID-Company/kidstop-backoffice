#!/bin/bash

# Setup ClickUp integration
# Creates project structure in ClickUp

set -e

# Load helper functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils/helpers.sh"

print_header "ClickUp Integration Setup"

# Check if .env exists
if [ ! -f .env ]; then
  print_error ".env file not found"
  echo ""
  echo "Run: cp .env.template .env"
  echo "Then configure CLICKUP_API_KEY and CLICKUP_WORKSPACE_ID"
  echo ""
  exit 1
fi

# Load environment variables
load_env

# Validate required variables
if [ -z "$CLICKUP_API_KEY" ]; then
  print_error "CLICKUP_API_KEY is not set in .env"
  echo ""
  echo "Get your API key from:"
  echo "https://app.clickup.com → Settings → Apps → API Token"
  echo ""
  exit 1
fi

if [ -z "$CLICKUP_WORKSPACE_ID" ]; then
  print_error "CLICKUP_WORKSPACE_ID is not set in .env"
  echo ""
  echo "Find your workspace ID in the ClickUp URL:"
  echo "https://app.clickup.com/{WORKSPACE_ID}/..."
  echo ""
  exit 1
fi

print_success "Environment variables loaded"
echo ""

# Check if Node.js is installed
if ! command_exists node; then
  print_error "Node.js is not installed"
  echo ""
  echo "Install Node.js from: https://nodejs.org/"
  echo ""
  exit 1
fi

print_success "Node.js found: $(node --version)"
echo ""

# Install dotenv if not present
print_info "Checking dependencies..."
if ! npm list dotenv > /dev/null 2>&1; then
  print_info "Installing dotenv..."
  npm install dotenv
  print_success "dotenv installed"
else
  print_success "Dependencies OK"
fi
echo ""

# Run project structure creation
print_info "Creating ClickUp project structure..."
echo ""

node "$SCRIPT_DIR/create-project-structure.js"

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo ""
  print_success "ClickUp setup complete!"
  echo ""
  print_info "Next steps:"
  echo "1. Create tasks: npm run clickup:create-task"
  echo "2. Update tasks: npm run clickup:update-task"
  echo "3. View dashboard: npm run clickup:sync"
  echo ""
else
  print_error "Setup failed with exit code $EXIT_CODE"
  exit $EXIT_CODE
fi

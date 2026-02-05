#!/bin/bash

# Helper functions for scripts

# Colors
export RED='\033[0;31m'
export GREEN='\033[0;32m'
export YELLOW='\033[1;33m'
export BLUE='\033[0;34m'
export NC='\033[0m' # No Color

# Print colored message
print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ $1${NC}"
}

print_header() {
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}  $1${NC}"
  echo -e "${BLUE}========================================${NC}"
  echo ""
}

# Check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Validate project name
validate_project_name() {
  local name=$1
  
  if [ -z "$name" ]; then
    print_error "Project name is required"
    return 1
  fi
  
  if [[ ! $name =~ ^[a-z0-9-]+$ ]]; then
    print_error "Project name must contain only lowercase letters, numbers, and hyphens"
    return 1
  fi
  
  return 0
}

# Check if directory exists
check_directory() {
  local dir=$1
  
  if [ -d "$dir" ]; then
    return 0
  else
    return 1
  fi
}

# Create directory if it doesn't exist
ensure_directory() {
  local dir=$1
  
  if [ ! -d "$dir" ]; then
    mkdir -p "$dir"
    print_success "Created directory: $dir"
  fi
}

# Check if file exists
check_file() {
  local file=$1
  
  if [ -f "$file" ]; then
    return 0
  else
    return 1
  fi
}

# Replace placeholder in file
replace_placeholder() {
  local file=$1
  local placeholder=$2
  local value=$3
  
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|$placeholder|$value|g" "$file"
  else
    # Linux
    sed -i "s|$placeholder|$value|g" "$file"
  fi
}

# Load environment variables from .env file
load_env() {
  local env_file=${1:-.env}
  
  if [ -f "$env_file" ]; then
    export $(cat "$env_file" | grep -v '^#' | xargs)
    print_success "Loaded environment from $env_file"
    return 0
  else
    print_warning "Environment file not found: $env_file"
    return 1
  fi
}

# Confirm action with user
confirm() {
  local message=$1
  
  read -p "$message (y/N): " -n 1 -r
  echo ""
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    return 0
  else
    return 1
  fi
}

# Check required commands
check_required_commands() {
  local commands=("$@")
  local missing=()
  
  for cmd in "${commands[@]}"; do
    if ! command_exists "$cmd"; then
      missing+=("$cmd")
    fi
  done
  
  if [ ${#missing[@]} -gt 0 ]; then
    print_error "Missing required commands: ${missing[*]}"
    return 1
  fi
  
  return 0
}

# Get git branch name
get_git_branch() {
  git rev-parse --abbrev-ref HEAD 2>/dev/null
}

# Check if git repo is clean
is_git_clean() {
  if [ -z "$(git status --porcelain)" ]; then
    return 0
  else
    return 1
  fi
}

# Sanitize string for use in filenames/branches
sanitize_string() {
  local str=$1
  echo "$str" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//'
}

# Get timestamp
get_timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}

# Log message to file
log_message() {
  local message=$1
  local log_file=${2:-"script.log"}
  
  echo "[$(get_timestamp)] $message" >> "$log_file"
}

#!/bin/bash

# Script para configurar GitHub Secrets automáticamente
# Requiere GitHub CLI (gh) instalado y autenticado

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  GitHub Secrets Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Verificar que gh esté instalado
if ! command -v gh &> /dev/null; then
  echo -e "${RED}✗ GitHub CLI (gh) not found${NC}"
  echo ""
  echo "Install with:"
  echo "  macOS: brew install gh"
  echo "  Linux: https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
  echo ""
  exit 1
fi

# Verificar autenticación
if ! gh auth status &> /dev/null; then
  echo -e "${RED}✗ Not authenticated with GitHub${NC}"
  echo ""
  echo "Run: gh auth login"
  echo ""
  exit 1
fi

# Cargar variables de entorno
if [ ! -f .env ]; then
  echo -e "${RED}✗ .env file not found${NC}"
  echo ""
  echo "Run: cp .env.template .env"
  echo "Then configure your variables"
  echo ""
  exit 1
fi

export $(cat .env | grep -v '^#' | xargs)

# Verificar variables requeridas
if [ -z "$GITHUB_REPO_OWNER" ] || [ -z "$GITHUB_REPO_NAME" ]; then
  echo -e "${RED}✗ GITHUB_REPO_OWNER and GITHUB_REPO_NAME must be set in .env${NC}"
  exit 1
fi

REPO="$GITHUB_REPO_OWNER/$GITHUB_REPO_NAME"

echo -e "${BLUE}Repository:${NC} $REPO"
echo ""

# Función para crear secret
create_secret() {
  local name=$1
  local value=$2
  
  if [ -z "$value" ]; then
    echo -e "${YELLOW}⚠ Skipping $name${NC} - Not configured in .env"
    return 0
  fi
  
  echo -n "Creating secret: $name... "
  if gh secret set "$name" --body "$value" --repo "$REPO" 2>/dev/null; then
    echo -e "${GREEN}✓${NC}"
  else
    echo -e "${RED}✗${NC}"
    return 1
  fi
}

# Confirmar con el usuario
echo -e "${YELLOW}This will create/update the following secrets in $REPO:${NC}"
echo "  - CLICKUP_API_KEY"
echo "  - CLICKUP_WORKSPACE_ID"
echo "  - SENDGRID_API_KEY"
echo "  - AWS_ACCESS_KEY_ID"
echo "  - AWS_SECRET_ACCESS_KEY"
echo "  - AWS_REGION"
echo "  - AMPLIFY_APP_ID"
echo "  - AMPLIFY_DOMAIN"
echo "  - DEV_EMAILS"
echo "  - CLIENT_EMAILS"
echo "  - GITHUB_TOKEN"
echo ""
read -p "Continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

echo ""
echo -e "${BLUE}Creating secrets...${NC}"
echo ""

# Crear todos los secrets
create_secret "CLICKUP_API_KEY" "$CLICKUP_API_KEY"
create_secret "CLICKUP_WORKSPACE_ID" "$CLICKUP_WORKSPACE_ID"
create_secret "SENDGRID_API_KEY" "$SENDGRID_API_KEY"
create_secret "AWS_ACCESS_KEY_ID" "$AWS_ACCESS_KEY_ID"
create_secret "AWS_SECRET_ACCESS_KEY" "$AWS_SECRET_ACCESS_KEY"
create_secret "AWS_REGION" "$AWS_REGION"
create_secret "AMPLIFY_APP_ID" "$AMPLIFY_APP_ID"
create_secret "AMPLIFY_DOMAIN" "$AMPLIFY_DOMAIN"
create_secret "DEV_EMAILS" "$DEV_EMAILS"
create_secret "CLIENT_EMAILS" "$CLIENT_EMAILS"
create_secret "GITHUB_TOKEN" "$GITHUB_TOKEN"

echo ""
echo -e "${GREEN}✓ Secrets configuration complete!${NC}"
echo ""

# Listar secrets configurados
echo -e "${BLUE}Configured secrets:${NC}"
gh secret list --repo "$REPO"

echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Verify secrets in GitHub: https://github.com/$REPO/settings/secrets/actions"
echo "2. Configure GitHub Actions workflows"
echo "3. Test automation by creating an issue"
echo ""

#!/bin/bash

# Script para validar variables de entorno
# Verifica que todas las variables necesarias estén configuradas

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
ERRORS=0
WARNINGS=0
SUCCESS=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Environment Variables Validation${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Función para verificar variable requerida
check_required() {
  local var_name=$1
  local var_value=${!var_name}
  
  if [ -z "$var_value" ]; then
    echo -e "${RED}✗ $var_name${NC} - Missing (required)"
    ((ERRORS++))
    return 1
  else
    echo -e "${GREEN}✓ $var_name${NC} - Configured"
    ((SUCCESS++))
    return 0
  fi
}

# Función para verificar variable opcional
check_optional() {
  local var_name=$1
  local var_value=${!var_name}
  
  if [ -z "$var_value" ]; then
    echo -e "${YELLOW}⚠ $var_name${NC} - Not configured (optional)"
    ((WARNINGS++))
    return 1
  else
    echo -e "${GREEN}✓ $var_name${NC} - Configured"
    ((SUCCESS++))
    return 0
  fi
}

# Cargar variables de entorno
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
  echo -e "${GREEN}✓ .env file found${NC}"
  echo ""
else
  echo -e "${RED}✗ .env file not found${NC}"
  echo -e "${YELLOW}Run: cp .env.template .env${NC}"
  exit 1
fi

# ============================================
# PROJECT CONFIGURATION (Críticas)
# ============================================
echo -e "${BLUE}Project Configuration:${NC}"
check_required "PROJECT_NAME"
check_required "NEXT_PUBLIC_GRAPHQL_ENDPOINT"
echo ""

# ============================================
# CLICKUP INTEGRATION (Parte 2)
# ============================================
echo -e "${BLUE}ClickUp Integration:${NC}"
if [ "$CLICKUP_ENABLED" = "true" ]; then
  check_required "CLICKUP_API_KEY"
  check_required "CLICKUP_WORKSPACE_ID"
  check_optional "CLICKUP_LIST_ID"
else
  echo -e "${YELLOW}⚠ ClickUp integration disabled${NC}"
  ((WARNINGS++))
fi
echo ""

# ============================================
# AWS AMPLIFY (Parte 3)
# ============================================
echo -e "${BLUE}AWS Amplify:${NC}"
if [ "$AMPLIFY_ENABLED" = "true" ]; then
  check_required "AWS_ACCESS_KEY_ID"
  check_required "AWS_SECRET_ACCESS_KEY"
  check_required "AWS_REGION"
  check_optional "AMPLIFY_APP_ID"
  check_optional "AMPLIFY_DOMAIN"
else
  echo -e "${YELLOW}⚠ Amplify integration disabled${NC}"
  ((WARNINGS++))
fi
echo ""

# ============================================
# SENDGRID EMAIL (Parte 4)
# ============================================
echo -e "${BLUE}SendGrid Email:${NC}"
check_optional "SENDGRID_API_KEY"
check_optional "SENDGRID_FROM_EMAIL"
check_optional "DEV_EMAILS"
check_optional "CLIENT_EMAILS"
echo ""

# ============================================
# GITHUB CONFIGURATION (Parte 3)
# ============================================
echo -e "${BLUE}GitHub Configuration:${NC}"
check_optional "GITHUB_TOKEN"
check_required "GITHUB_REPO_OWNER"
check_optional "GITHUB_REPO_NAME"
echo ""

# ============================================
# VALIDACIONES ADICIONALES
# ============================================
echo -e "${BLUE}Additional Validations:${NC}"

# Validar formato de CLICKUP_API_KEY
if [ ! -z "$CLICKUP_API_KEY" ]; then
  if [[ $CLICKUP_API_KEY == pk_* ]]; then
    echo -e "${GREEN}✓ CLICKUP_API_KEY format${NC} - Valid"
    ((SUCCESS++))
  else
    echo -e "${RED}✗ CLICKUP_API_KEY format${NC} - Should start with 'pk_'"
    ((ERRORS++))
  fi
fi

# Validar formato de SENDGRID_API_KEY
if [ ! -z "$SENDGRID_API_KEY" ]; then
  if [[ $SENDGRID_API_KEY == SG.* ]]; then
    echo -e "${GREEN}✓ SENDGRID_API_KEY format${NC} - Valid"
    ((SUCCESS++))
  else
    echo -e "${RED}✗ SENDGRID_API_KEY format${NC} - Should start with 'SG.'"
    ((ERRORS++))
  fi
fi

# Validar formato de AWS_ACCESS_KEY_ID
if [ ! -z "$AWS_ACCESS_KEY_ID" ]; then
  if [[ $AWS_ACCESS_KEY_ID == AKIA* ]]; then
    echo -e "${GREEN}✓ AWS_ACCESS_KEY_ID format${NC} - Valid"
    ((SUCCESS++))
  else
    echo -e "${YELLOW}⚠ AWS_ACCESS_KEY_ID format${NC} - Should start with 'AKIA'"
    ((WARNINGS++))
  fi
fi

# Validar formato de GITHUB_TOKEN
if [ ! -z "$GITHUB_TOKEN" ]; then
  if [[ $GITHUB_TOKEN == ghp_* ]]; then
    echo -e "${GREEN}✓ GITHUB_TOKEN format${NC} - Valid"
    ((SUCCESS++))
  else
    echo -e "${RED}✗ GITHUB_TOKEN format${NC} - Should start with 'ghp_'"
    ((ERRORS++))
  fi
fi

# Validar formato de emails
if [ ! -z "$DEV_EMAILS" ]; then
  if [[ $DEV_EMAILS =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(,[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$ ]]; then
    echo -e "${GREEN}✓ DEV_EMAILS format${NC} - Valid"
    ((SUCCESS++))
  else
    echo -e "${RED}✗ DEV_EMAILS format${NC} - Invalid email format"
    ((ERRORS++))
  fi
fi

echo ""

# ============================================
# RESUMEN
# ============================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Validation Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Success: $SUCCESS${NC}"
echo -e "${YELLOW}⚠ Warnings: $WARNINGS${NC}"
echo -e "${RED}✗ Errors: $ERRORS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ All required variables are configured!${NC}"
  echo ""
  echo -e "${BLUE}Next steps:${NC}"
  echo "1. Start development server: npm run dev"
  echo "2. Configure ClickUp (if enabled): npm run clickup:setup"
  echo "3. Configure GitHub Secrets for CI/CD"
  echo ""
  exit 0
else
  echo -e "${RED}✗ Please fix the errors above${NC}"
  echo ""
  echo -e "${BLUE}Resources:${NC}"
  echo "- Environment Setup Guide: docs/ENVIRONMENT_SETUP.md"
  echo "- GitHub Secrets Guide: docs/GITHUB_SECRETS_SETUP.md"
  echo "- Example file: .env.example"
  echo ""
  exit 1
fi

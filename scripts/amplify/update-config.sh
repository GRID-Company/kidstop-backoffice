#!/bin/bash

# Script para actualizar la configuración local desde AWS Amplify
# Uso: ./update-config.sh

set -e

echo "🔄 Actualizando configuración desde AWS Amplify..."

# Verificar que existe configuración local
if [ ! -f ".amplify/config.json" ]; then
    echo "❌ No existe configuración local. Ejecuta 'npm run amplify:create' primero"
    exit 1
fi

# Obtener app ID desde configuración local
APP_ID=$(jq -r '.project.appId' .amplify/config.json)
if [ "$APP_ID" = "null" ] || [ -z "$APP_ID" ]; then
    echo "❌ No se pudo obtener el App ID de la configuración"
    exit 1
fi

echo "📋 App ID: $APP_ID"

# Verificar que la aplicación existe en AWS
echo "🔍 Verificando aplicación en AWS..."
if ! aws amplify get-app --app-id "$APP_ID" >/dev/null 2>&1; then
    echo "❌ La aplicación no existe en AWS o no tienes permisos"
    exit 1
fi

# Obtener información actual de la aplicación
echo "📥 Obteniendo información actual de la aplicación..."
APP_INFO=$(aws amplify get-app --app-id "$APP_ID")

# Extraer información relevante
APP_NAME=$(echo "$APP_INFO" | jq -r '.app.name')
DEFAULT_DOMAIN=$(echo "$APP_INFO" | jq -r '.app.defaultDomain')
PLATFORM=$(echo "$APP_INFO" | jq -r '.app.platform')
REPO_URL=$(echo "$APP_INFO" | jq -r '.app.repository // ""')

# Obtener branches
echo "🌿 Obteniendo branches..."
BRANCHES_INFO=$(aws amplify list-branches --app-id "$APP_ID")

# Construir objeto de branches
BRANCHES_JSON="{"
FIRST=true
while IFS= read -r branch_name; do
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        BRANCHES_JSON+=","
    fi
    
    # Obtener información del branch
    BRANCH_INFO=$(aws amplify get-branch --app-id "$APP_ID" --branch-name "$branch_name")
    BACKEND_URL=$(echo "$BRANCH_INFO" | jq -r '.branch.environmentVariables.NEXT_PUBLIC_API_URL // ""')
    STAGE="development"
    
    if [ "$branch_name" = "main" ] || [ "$branch_name" = "master" ]; then
        STAGE="production"
    fi
    
    BRANCHES_JSON+="\"$branch_name\": {
        \"name\": \"$branch_name\",
        \"stage\": \"$STAGE\""
    
    if [ "$BACKEND_URL" != "" ] && [ "$BACKEND_URL" != "null" ]; then
        BRANCHES_JSON+=",\"backend\": \"$BACKEND_URL\""
    fi
    
    BRANCHES_JSON+="}"
done <<< "$(echo "$BRANCHES_INFO" | jq -r '.branches[].branchName')"
BRANCHES_JSON+="}"

# Obtener variables de entorno del branch principal
MAIN_BRANCH=$(echo "$BRANCHES_INFO" | jq -r '.branches[0].branchName')
BRANCH_DETAILS=$(aws amplify get-branch --app-id "$APP_ID" --branch-name "$MAIN_BRANCH")
ENV_VARS=$(echo "$BRANCH_DETAILS" | jq '.branch.environmentVariables')

# Obtener build spec y custom rules
BUILD_SPEC=$(echo "$BRANCH_DETAILS" | jq -r '.branch.buildSpec // ""')
CUSTOM_RULES=$(echo "$BRANCH_DETAILS" | jq '.branch.customRules // []')

# Crear backup de configuración actual
cp .amplify/config.json .amplify/config.json.backup

# Actualizar configuración
echo "💾 Actualizando configuración local..."
jq --arg name "$APP_NAME" \
   --arg appId "$APP_ID" \
   --arg defaultDomain "$DEFAULT_DOMAIN" \
   --arg platform "$PLATFORM" \
   --arg repository "$REPO_URL" \
   --argjson branches "$BRANCHES_JSON" \
   --argjson environment "$ENV_VARS" \
   --arg buildSpec "$BUILD_SPEC" \
   --argjson customRules "$CUSTOM_RULES" \
   '.project.name = $name |
    .project.appId = $appId |
    .project.defaultDomain = $defaultDomain |
    .project.platform = $platform |
    .project.repository = $repository |
    .branches = $branches |
    .environment = $environment |
    .buildSpec = $buildSpec |
    .customRules = $customRules' \
   .amplify/config.json > .amplify/config.tmp && mv .amplify/config.tmp .amplify/config.json

echo "✅ Configuración actualizada exitosamente"
echo "📋 Backup guardado en .amplify/config.json.backup"

# Mostrar resumen
echo ""
echo "📊 Resumen de la actualización:"
echo "   • Aplicación: $APP_NAME"
echo "   • App ID: $APP_ID"
echo "   • Dominio: $DEFAULT_DOMAIN"
echo "   • Branches encontrados: $(echo "$BRANCHES_INFO" | jq '.branches | length')"
echo "   • Variables de entorno: $(echo "$ENV_VARS" | jq 'keys | length')"

# Listar branches
echo ""
echo "🌿 Branches configurados:"
echo "$BRANCHES_INFO" | jq -r '.branches[] | "   • \(.branchName) - \(.stage // "unknown")"'

echo ""
echo "🎉 ¡Configuración sincronizada con AWS!"

#!/bin/bash

# Script para verificar el status de la aplicación en AWS Amplify
# Uso: ./status.sh [branch-name]

set -e

# Obtener nombre del branch (opcional)
BRANCH_NAME=${1:-}

echo "📊 Verificando status de AWS Amplify..."

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

# Obtener información de la aplicación
echo "🔍 Obteniendo información de la aplicación..."
APP_INFO=$(aws amplify get-app --app-id "$APP_ID")

# Mostrar información básica
APP_NAME=$(echo "$APP_INFO" | jq -r '.app.name')
DEFAULT_DOMAIN=$(echo "$APP_INFO" | jq -r '.app.defaultDomain')
PLATFORM=$(echo "$APP_INFO" | jq -r '.app.platform')
REPO_URL=$(echo "$APP_INFO" | jq -r '.app.repository // "No configurado"')

echo ""
echo "📊 Información de la Aplicación:"
echo "   • Nombre: $APP_NAME"
echo "   • App ID: $APP_ID"
echo "   • Dominio: $DEFAULT_DOMAIN"
echo "   • Platform: $PLATFORM"
echo "   • Repository: $REPO_URL"

# Obtener branches
echo ""
echo "🌿 Obteniendo branches..."
BRANCHES_INFO=$(aws amplify list-branches --app-id "$APP_ID")

# Mostrar información de branches
echo ""
echo "🌿 Branches Configurados:"
echo "$BRANCHES_INFO" | jq -r '.branches[] | "   • \(.branchName) - Stage: \(.stage // "N/A") - Status: \(.status // "N/A")"'

# Si se especificó un branch, mostrar información detallada
if [ -n "$BRANCH_NAME" ]; then
    echo ""
    echo "🔍 Detalles del branch: $BRANCH_NAME"
    
    # Verificar que el branch existe
    if ! aws amplify get-branch --app-id "$APP_ID" --branch-name "$BRANCH_NAME" >/dev/null 2>&1; then
        echo "❌ El branch '$BRANCH_NAME' no existe en Amplify"
        exit 1
    fi
    
    # Obtener información detallada del branch
    BRANCH_INFO=$(aws amplify get-branch --app-id "$APP_ID" --branch-name "$BRANCH_NAME")
    
    BRANCH_STATUS=$(echo "$BRANCH_INFO" | jq -r '.branch.status // "N/A"')
    LAST_DEPLOY_TIME=$(echo "$BRANCH_INFO" | jq -r '.branch.lastDeployTime // "Nunca"')
    ENABLE_AUTO_BUILD=$(echo "$BRANCH_INFO" | jq -r '.branch.enableBranchAutoBuild // false')
    ENABLE_BASIC_AUTH=$(echo "$BRANCH_INFO" | jq -r '.branch.enableBasicAuth // false')
    
    echo "   • Status: $BRANCH_STATUS"
    echo "   • Último deploy: $LAST_DEPLOY_TIME"
    echo "   • Auto Build: $ENABLE_AUTO_BUILD"
    echo "   • Basic Auth: $ENABLE_BASIC_AUTH"
    
    # Mostrar variables de entorno
    ENV_VARS=$(echo "$BRANCH_INFO" | jq -r '.branch.environmentVariables // {}')
    if [ "$ENV_VARS" != "{}" ] && [ "$ENV_VARS" != "null" ]; then
        echo "   • Variables de entorno:"
        echo "$ENV_VARS" | jq -r 'to_entries[] | "     - \(.key): \(.value)"'
    fi
    
    # Mostrar deployments recientes
    echo ""
    echo "📦 Deployments Recientes:"
    JOBS_INFO=$(aws amplify list-jobs --app-id "$APP_ID" --branch-name "$BRANCH_NAME" --max-results 5)
    
    echo "$JOBS_INFO" | jq -r '.jobSummaries[] | "   • \(.id) - \(.status) - \(.createTime // "N/A")"' || echo "   • No hay deployments recientes"
    
    # Mostrar el deployment más reciente en detalle
    LATEST_JOB=$(echo "$JOBS_INFO" | jq -r '.jobSummaries[0] // empty')
    if [ -n "$LATEST_JOB" ] && [ "$LATEST_JOB" != "null" ]; then
        LATEST_JOB_ID=$(echo "$LATEST_JOB" | jq -r '.id')
        LATEST_JOB_STATUS=$(echo "$LATEST_JOB" | jq -r '.status')
        
        echo ""
        echo "🔍 Detalles del último deployment ($LATEST_JOB_ID):"
        
        if [ "$LATEST_JOB_STATUS" = "IN_PROGRESS" ] || [ "$LATEST_JOB_STATUS" = "PENDING" ]; then
            JOB_DETAILS=$(aws amplify get-job --app-id "$APP_ID" --branch-name "$BRANCH_NAME" --job-id "$LATEST_JOB_ID")
            
            START_TIME=$(echo "$JOB_DETAILS" | jq -r '.job.summary.startTime // "N/A"')
            PERCENTAGE=$(echo "$JOB_DETAILS" | jq -r '.job.summary.percentage // "N/A"')
            
            echo "   • Status: $LATEST_JOB_STATUS"
            echo "   • Start Time: $START_TIME"
            echo "   • Progress: $PERCENTAGE"
        else
            echo "   • Status: $LATEST_JOB_STATUS"
            echo "   • Create Time: $(echo "$LATEST_JOB" | jq -r '.createTime // "N/A"')"
        fi
    fi
fi

# Mostrar dominios personalizados si hay
echo ""
echo "🌐 Dominios:"
DOMAINS_INFO=$(aws amplify list-domain-associations --app-id "$APP_ID")

if [ "$(echo "$DOMAINS_INFO" | jq '.domains | length')" -gt 0 ]; then
    echo "$DOMAINS_INFO" | jq -r '.domains[] | "   • \(.domainName) - Status: \(.status // "N/A")"'
else
    echo "   • No hay dominios personalizados configurados"
fi

# Mostrar URLs útiles
echo ""
echo "🔗 URLs Útiles:"
echo "   • App URL: https://$DEFAULT_DOMAIN"
echo "   • AWS Console: https://console.aws.amazon.com/amplify/home?region=us-east-2#$APP_ID"

echo ""
echo "✅ Status verificado exitosamente!"

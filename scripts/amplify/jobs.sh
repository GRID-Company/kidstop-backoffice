#!/bin/bash

# Script para listar jobs de deployment en AWS Amplify
# Uso: ./jobs.sh [branch-name] [max-results]

set -e

# Obtener parámetros
BRANCH_NAME=${1:-}
MAX_RESULTS=${2:-10}

echo "📋 Listando jobs de deployment en AWS Amplify..."

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

# Si no se especificó branch, mostrar todos los branches disponibles
if [ -z "$BRANCH_NAME" ]; then
    echo "🌿 Obteniendo branches disponibles..."
    BRANCHES_INFO=$(aws amplify list-branches --app-id "$APP_ID")
    
    echo ""
    echo "🌿 Branches Disponibles:"
    echo "$BRANCHES_INFO" | jq -r '.branches[] | "   • \(.branchName)"'
    
    echo ""
    echo "💡 Para ver jobs de un branch específico:"
    echo "   npm run amplify:jobs <branch-name>"
    echo "   npm run amplify:jobs <branch-name> <max-results>"
    
    exit 0
fi

# Verificar que el branch existe
if ! aws amplify get-branch --app-id "$APP_ID" --branch-name "$BRANCH_NAME" >/dev/null 2>&1; then
    echo "❌ El branch '$BRANCH_NAME' no existe en Amplify"
    echo "💡 Branches disponibles:"
    aws amplify list-branches --app-id "$APP_ID" | jq -r '.branches[] | "   • \(.branchName)"'
    exit 1
fi

echo "🌿 Branch: $BRANCH_NAME"
echo "📊 Máximo de resultados: $MAX_RESULTS"

# Obtener jobs del branch
echo "📥 Obteniendo jobs de deployment..."
JOBS_INFO=$(aws amplify list-jobs --app-id "$APP_ID" --branch-name "$BRANCH_NAME" --max-results "$MAX_RESULTS")

# Mostrar resumen
TOTAL_JOBS=$(echo "$JOBS_INFO" | jq '.jobSummaries | length')
echo ""
echo "📊 Jobs Encontrados: $TOTAL_JOBS"

if [ "$TOTAL_JOBS" -eq 0 ]; then
    echo "   • No hay jobs para este branch"
    exit 0
fi

# Mostrar tabla de jobs
echo ""
echo "📋 Lista de Jobs:"
echo "$JOBS_INFO" | jq -r '.jobSummaries[] | "   • \(.id) - \(.status) - \(.createTime // "N/A")"'

# Mostrar detalles del job más reciente
LATEST_JOB=$(echo "$JOBS_INFO" | jq -r '.jobSummaries[0]')
LATEST_JOB_ID=$(echo "$LATEST_JOB" | jq -r '.id')
LATEST_JOB_STATUS=$(echo "$LATEST_JOB" | jq -r '.status')

echo ""
echo "🔍 Detalles del Job Más Reciente ($LATEST_JOB_ID):"

# Obtener detalles completos del job
JOB_DETAILS=$(aws amplify get-job --app-id "$APP_ID" --branch-name "$BRANCH_NAME" --job-id "$LATEST_JOB_ID")

# Extraer información relevante
JOB_STATUS=$(echo "$JOB_DETAILS" | jq -r '.job.summary.status // "N/A"')
START_TIME=$(echo "$JOB_DETAILS" | jq -r '.job.summary.startTime // "N/A"')
END_TIME=$(echo "$JOB_DETAILS" | jq -r '.job.summary.endTime // "N/A"')
CREATE_TIME=$(echo "$JOB_DETAILS" | jq -r '.job.summary.createTime // "N/A"')
PERCENTAGE=$(echo "$JOB_DETAILS" | jq -r '.job.summary.percentage // "N/A"')
COMMIT_ID=$(echo "$JOB_DETAILS" | jq -r '.job.summary.commitId // "N/A"')
COMMIT_MESSAGE=$(echo "$JOB_DETAILS" | jq -r '.job.summary.commitMessage // "N/A"')
COMMIT_AUTHOR=$(echo "$JOB_DETAILS" | jq -r '.job.summary.commitAuthor // "N/A"')

echo "   • Status: $JOB_STATUS"
echo "   • Create Time: $CREATE_TIME"
echo "   • Start Time: $START_TIME"

if [ "$END_TIME" != "null" ] && [ -n "$END_TIME" ]; then
    echo "   • End Time: $END_TIME"
fi

if [ "$PERCENTAGE" != "null" ] && [ -n "$PERCENTAGE" ]; then
    echo "   • Progress: $PERCENTAGE%"
fi

if [ "$COMMIT_ID" != "null" ] && [ -n "$COMMIT_ID" ] && [ "$COMMIT_ID" != "N/A" ]; then
    echo "   • Commit ID: $COMMIT_ID"
    
    if [ "$COMMIT_AUTHOR" != "null" ] && [ -n "$COMMIT_AUTHOR" ] && [ "$COMMIT_AUTHOR" != "N/A" ]; then
        echo "   • Author: $COMMIT_AUTHOR"
    fi
    
    if [ "$COMMIT_MESSAGE" != "null" ] && [ -n "$COMMIT_MESSAGE" ] && [ "$COMMIT_MESSAGE" != "N/A" ]; then
        echo "   • Message: $COMMIT_MESSAGE"
    fi
fi

# Mostrar errores si hay
ERROR_MESSAGE=$(echo "$JOB_DETAILS" | jq -r '.job.summary.errorMessage // ""')
if [ "$ERROR_MESSAGE" != "" ] && [ "$ERROR_MESSAGE" != "null" ]; then
    echo ""
    echo "🚨 Error Message:"
    echo "   $ERROR_MESSAGE"
fi

# Mostrar logs si está en progreso
if [ "$JOB_STATUS" = "IN_PROGRESS" ] || [ "$JOB_STATUS" = "PENDING" ]; then
    echo ""
    echo "📝 Logs (últimas líneas):"
    LOGS=$(echo "$JOB_DETAILS" | jq -r '.job.logs // []')
    
    if [ "$LOGS" != "null" ] && [ "$LOGS" != "[]" ]; then
        echo "$LOGS" | jq -r '.[]' | tail -10 | sed 's/^/   /'
    else
        echo "   • No hay logs disponibles aún"
    fi
fi

# Mostrar comandos útiles
echo ""
echo "💡 Comandos útiles:"
echo "   • Ver detalles completos: aws amplify get-job --app-id $APP_ID --branch-name $BRANCH_NAME --job-id $LATEST_JOB_ID"
echo "   • Ver status general: npm run amplify:status $BRANCH_NAME"
echo "   • Cancelar job: aws amplify stop-deployment --app-id $APP_ID --branch-name $BRANCH_NAME --job-id $LATEST_JOB_ID"

echo ""
echo "✅ Jobs listados exitosamente!"

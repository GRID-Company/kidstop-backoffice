#!/bin/bash

# Script para deploy a AWS Amplify usando configuración local
# Uso: ./deploy.sh <branch-name>
# Ejemplos: ./deploy.sh dev, ./deploy.sh main

set -e

# Obtener nombre del branch
BRANCH_NAME=${1:-dev}

echo "🚀 Iniciando deployment a AWS Amplify..."
echo "🌿 Branch: $BRANCH_NAME"

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

# Verificar que el branch local existe
if ! git rev-parse --verify "$BRANCH_NAME" >/dev/null 2>&1; then
    echo "❌ El branch '$BRANCH_NAME' no existe localmente"
    echo "💡 Branches disponibles:"
    git branch --list
    exit 1
fi

# Verificar que estamos en el branch correcto o hacer checkout
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "$BRANCH_NAME" ]; then
    echo "🔄 Cambiando al branch '$BRANCH_NAME'..."
    git checkout "$BRANCH_NAME"
fi

# Verificar si hay cambios sin commitear
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "⚠️  Hay cambios sin commitear:"
    git status --porcelain
    echo ""
    echo "💡 ¿Deseas hacer commit de estos cambios antes del deploy? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "📝 Haciendo commit de cambios..."
        git add .
        echo "💬 Escribe un mensaje para el commit:"
        read -r commit_message
        git commit -m "$commit_message"
    fi
fi

# Verificar que el branch existe en Amplify
echo "🔍 Verificando branch en Amplify..."
if ! aws amplify get-branch --app-id "$APP_ID" --branch-name "$BRANCH_NAME" >/dev/null 2>&1; then
    echo "🌿 El branch '$BRANCH_NAME' no existe en Amplify. Creándolo..."
    
    # Obtener configuración del branch desde config local
    BRANCH_CONFIG=$(jq -r ".branches.\"$BRANCH_NAME\"" .amplify/config.json)
    if [ "$BRANCH_CONFIG" = "null" ]; then
        echo "⚠️  No hay configuración para el branch '$BRANCH_NAME'. Usando configuración por defecto."
        
        # Crear branch con configuración básica
        aws amplify create-branch \
            --app-id "$APP_ID" \
            --branch-name "$BRANCH_NAME" \
            --stage "development" \
            --enable-auto-build true \
            --enable-basic-auth false
    else
        # Crear branch con configuración específica
        STAGE=$(echo "$BRANCH_CONFIG" | jq -r '.stage // "development"')
        BACKEND_URL=$(echo "$BRANCH_CONFIG" | jq -r '.backend // ""')
        
        CREATE_BRANCH_CMD="aws amplify create-branch --app-id $APP_ID --branch-name $BRANCH_NAME --stage $STAGE --enable-auto-build true --enable-basic-auth false"
        
        if [ "$BACKEND_URL" != "" ] && [ "$BACKEND_URL" != "null" ]; then
            CREATE_BRANCH_CMD+=" --environment-variables NEXT_PUBLIC_API_URL=$BACKEND_URL"
        fi
        
        eval "$CREATE_BRANCH_CMD"
    fi
    
    echo "✅ Branch '$BRANCH_NAME' creado en Amplify"
fi

# Push a GitHub si es necesario
echo "📤 Verificando si es necesario hacer push..."
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/$BRANCH_NAME 2>/dev/null || echo 'nonexistent')" ]; then
    echo "📤 Haciendo push a GitHub..."
    git push origin "$BRANCH_NAME"
else
    echo "✅ El branch está actualizado en GitHub"
fi

# Iniciar deployment
echo "🚀 Iniciando deployment..."
JOB_INFO=$(aws amplify start-deployment \
    --app-id "$APP_ID" \
    --branch-name "$BRANCH_NAME" \
    --query 'jobSummary' \
    --output json)

JOB_ID=$(echo "$JOB_INFO" | jq -r '.id')
JOB_STATUS=$(echo "$JOB_INFO" | jq -r '.status')

echo "✅ Deployment iniciado"
echo "📋 Job ID: $JOB_ID"
echo "📊 Status inicial: $JOB_STATUS"

# Mostrar información del job
echo ""
echo "📊 Información del deployment:"
echo "   • Job ID: $JOB_ID"
echo "   • Branch: $BRANCH_NAME"
echo "   • App ID: $APP_ID"
echo "   • Status: $JOB_STATUS"

# Opción de esperar a que termine
echo ""
echo "🕐 ¿Deseas esperar a que termine el deployment? (y/N)"
read -r wait_response

if [[ "$wait_response" =~ ^[Yy]$ ]]; then
    echo "⏳ Esperando a que termine el deployment..."
    
    while true; do
        sleep 10
        
        CURRENT_JOB=$(aws amplify get-job --app-id "$APP_ID" --branch-name "$BRANCH_NAME" --job-id "$JOB_ID" --query 'job.summary' --output json)
        CURRENT_STATUS=$(echo "$CURRENT_JOB" | jq -r '.status')
        
        echo "📊 Status actual: $CURRENT_STATUS"
        
        if [ "$CURRENT_STATUS" = "SUCCEED" ]; then
            echo "✅ Deployment completado exitosamente!"
            
            # Obtener URL del deployment
            DEFAULT_DOMAIN=$(jq -r '.project.defaultDomain' .amplify/config.json)
            echo "🌐 URL: https://$DEFAULT_DOMAIN"
            
            break
        elif [ "$CURRENT_STATUS" = "FAILED" ] || [ "$CURRENT_STATUS" = "CANCELLED" ] || [ "$CURRENT_STATUS" = "TIMED_OUT" ]; then
            echo "❌ Deployment falló con status: $CURRENT_STATUS"
            
            # Mostrar error details si hay
            ERROR_MSG=$(echo "$CURRENT_JOB" | jq -r '.errorMessage // "No hay mensaje de error"')
            echo "🚨 Error: $ERROR_MSG"
            
            break
        fi
    done
else
    echo "💡 Puedes verificar el status con:"
    echo "   npm run amplify:status"
    echo "   aws amplify get-job --app-id $APP_ID --branch-name $BRANCH_NAME --job-id $JOB_ID"
fi

echo ""
echo "🎉 Proceso de deployment iniciado!"
echo ""
echo "📚 Comandos útiles:"
echo "   • Ver status: npm run amplify:status"
echo "   • Ver logs: aws amplify get-job --app-id $APP_ID --branch-name $BRANCH_NAME --job-id $JOB_ID"
echo "   • Ver todos los jobs: npm run amplify:jobs $BRANCH_NAME"

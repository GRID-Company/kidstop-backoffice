#!/bin/bash

# Script para crear una nueva aplicación en AWS Amplify
# Uso: ./create-app.sh

set -e

echo "🚀 Creando aplicación en AWS Amplify..."

# Obtener información del proyecto
PROJECT_NAME=$(jq -r '.name' package.json)
REPO_URL=$(git remote get-url origin 2>/dev/null || echo "")
REGION="us-east-2"
PLATFORM="WEB_COMPUTE"

# Verificar si ya existe configuración
if [ -f ".amplify/config.json" ]; then
    echo "⚠️  La configuración ya existe en .amplify/config.json"
    echo "¿Deseas continuar y crear una nueva app? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Operación cancelada"
        exit 0
    fi
fi

# Verificar que AWS CLI esté configurado
if ! aws sts get-caller-identity >/dev/null 2>&1; then
    echo "❌ AWS CLI no está configurado. Ejecuta 'aws configure' primero"
    exit 1
fi

# Crear la aplicación en Amplify
echo "📦 Creando aplicación '$PROJECT_NAME' en Amplify..."
APP_ID=$(aws amplify create-app \
    --name "$PROJECT_NAME" \
    --repository "$REPO_URL" \
    --platform "$PLATFORM" \
    --region "$REGION" \
    --query 'app.appId' \
    --output text)

if [ -z "$APP_ID" ]; then
    echo "❌ Error al crear la aplicación"
    exit 1
fi

echo "✅ Aplicación creada con éxito"
echo "📋 App ID: $APP_ID"

# Obtener dominio por defecto
DEFAULT_DOMAIN="${APP_ID}.amplifyapp.com"

# Crear directorio de configuración si no existe
mkdir -p .amplify

# Generar archivo de configuración
echo "📝 Generando configuración local..."
cat > .amplify/config.json << EOF
{
  "project": {
    "name": "$PROJECT_NAME",
    "appId": "$APP_ID",
    "defaultDomain": "$DEFAULT_DOMAIN",
    "region": "$REGION",
    "platform": "$PLATFORM",
    "repository": "$REPO_URL"
  },
  "branches": {
    "dev": {
      "name": "dev",
      "stage": "development",
      "backend": "https://dev.topdev.mx/iguanas-ranas/graphql"
    },
    "main": {
      "name": "main",
      "stage": "production", 
      "backend": "https://api.iguanas-ranas.com/graphql"
    }
  },
  "environment": {
    "NEXT_PUBLIC_API_URL": "https://dev.topdev.mx/iguanas-ranas/graphql",
    "NEXT_PUBLIC_BUCKET_URL": "iguanas-ranas-dev.s3.us-east-2.amazonaws.com",
    "NEXT_PUBLIC_APP_NAME": "$PROJECT_NAME"
  },
  "buildSpec": "version: 1\\nfrontend:\\n  phases:\\n    preBuild:\\n      commands:\\n        - npm ci --cache .npm --prefer-offline\\n    build:\\n      commands:\\n        - npm run build\\n  artifacts:\\n    baseDirectory: .next\\n    files:\\n      - '**/*'\\n  cache:\\n    paths:\\n      - .next/cache/**/*\\n      - .npm/**/*",
  "customRules": [
    {
      "source": "/<*>",
      "target": "/index.html",
      "status": "404-200"
    }
  ]
}
EOF

echo "✅ Configuración guardada en .amplify/config.json"

# Agregar a .gitignore si no está
if ! grep -q "^\.amplify/" .gitignore 2>/dev/null; then
    echo "" >> .gitignore
    echo "# Amplify configuration" >> .gitignore
    echo ".amplify/" >> .gitignore
    echo "✅ Agregado .amplify/ a .gitignore"
fi

# Mostrar información útil
echo ""
echo "🎉 ¡Aplicación creada exitosamente!"
echo ""
echo "📊 Información de la aplicación:"
echo "   • Nombre: $PROJECT_NAME"
echo "   • App ID: $APP_ID"
echo "   • Dominio: $DEFAULT_DOMAIN"
echo "   • Región: $REGION"
echo ""
echo "🔗 Próximos pasos:"
echo "   1. Configura tus branches: npm run amplify:config"
echo "   2. Deploy a desarrollo: npm run amplify:deploy dev"
echo "   3. Visita tu app: https://$DEFAULT_DOMAIN"
echo ""
echo "📚 Comandos útiles:"
echo "   • Ver status: npm run amplify:status"
echo "   • Actualizar config: npm run amplify:config"
echo "   • Deploy: npm run amplify:deploy <branch>"

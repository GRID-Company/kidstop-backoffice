#!/bin/bash

echo "🚀 Kidstop Backoffice - ngrok Tunnel Setup"
echo "=========================================="
echo ""
echo "Este script expone tu servidor local a través de ngrok."
echo ""
echo "📋 Pasos:"
echo "1. Asegúrate de que el servidor Next.js esté corriendo en puerto 3000"
echo "   Ejecuta en otra terminal: npm run dev"
echo ""
echo "2. Este script creará un túnel público HTTPS"
echo ""
echo "⚠️  IMPORTANTE para Card Scanner:"
echo "   - El navegador pedirá permisos de cámara"
echo "   - ngrok proporciona HTTPS automáticamente (requerido para getUserMedia)"
echo "   - Comparte la URL HTTPS con tu colega"
echo ""
echo "🔍 Inspector de ngrok disponible en: http://127.0.0.1:4040"
echo "   (Ver todas las requests, headers, replay, etc.)"
echo ""
echo "Presiona Ctrl+C para detener el túnel"
echo ""
echo "=========================================="
echo ""

if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok no está instalado"
    echo "Instalar con: brew install ngrok"
    exit 1
fi

if ! ngrok config check &> /dev/null; then
    echo "⚠️  ngrok no está autenticado"
    echo ""
    echo "Pasos para autenticar:"
    echo "1. Crear cuenta en: https://dashboard.ngrok.com/signup"
    echo "2. Obtener authtoken: https://dashboard.ngrok.com/get-started/your-authtoken"
    echo "3. Ejecutar: ngrok config add-authtoken TU_AUTHTOKEN"
    echo ""
    exit 1
fi

if ! lsof -i:3000 &> /dev/null; then
    echo "⚠️  ADVERTENCIA: No se detectó servidor en puerto 3000"
    echo "   Asegúrate de ejecutar 'npm run dev' en otra terminal"
    echo ""
    read -p "¿Continuar de todas formas? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🌐 Iniciando túnel ngrok..."
echo ""

ngrok http 3000 --log=stdout

#!/usr/bin/env node

/**
 * Script para verificar variables de entorno de ClickUp
 */

// Cargar variables de entorno desde .env
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

console.log('🔍 Verificando variables de entorno de ClickUp...\n');

const requiredVars = [
  'CLICKUP_API_KEY',
  'CLICKUP_WORKSPACE_ID'
];

const optionalVars = [
  'CLICKUP_FOLDER_ID',
  'CLICKUP_LIST_ID',
  'CLICKUP_RETRY_ATTEMPTS',
  'CLICKUP_RETRY_DELAY',
  'CLICKUP_TIMEOUT',
  'CLICKUP_LOG_LEVEL',
  'CLICKUP_ENABLED'
];

console.log('Variables requeridas:');
let allRequiredPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('KEY') ? value.substring(0, 8) + '***' : value}`);
  } else {
    console.log(`❌ ${varName}: No configurada`);
    allRequiredPresent = false;
  }
});

console.log('\nVariables opcionales:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚪ ${varName}: No configurada (opcional)`);
  }
});

console.log('\nResumen:');
if (allRequiredPresent) {
  console.log('✅ Todas las variables requeridas están configuradas');
} else {
  console.log('❌ Faltan variables requeridas. Por favor, configura tu archivo .env');
}

console.log('\nPara configurar las variables, copia .env.example a .env y actualiza los valores.');

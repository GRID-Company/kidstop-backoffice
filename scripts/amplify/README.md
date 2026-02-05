# AWS Amplify Workflow Scripts

Este conjunto de scripts automatiza la gestión de aplicaciones AWS Amplify desde el proyecto local.

## 🚀 Scripts Disponibles

### `create-app.sh`
Crea una nueva aplicación en AWS Amplify y genera configuración local.

```bash
npm run amplify:create
# o directamente
./scripts/amplify/create-app.sh
```

**Funciones:**
- Verifica configuración AWS CLI
- Crea aplicación en Amplify
- Genera archivo `.amplify/config.json`
- Configura estructura básica de branches
- Agrega `.amplify/` a `.gitignore`

### `update-config.sh`
Sincroniza la configuración local con AWS Amplify.

```bash
npm run amplify:config
# o directamente
./scripts/amplify/update-config.sh
```

**Funciones:**
- Lee configuración actual desde AWS
- Actualiza branches disponibles
- Sincroniza variables de entorno
- Crea backup de configuración anterior

### `deploy.sh`
Realiza deployment a un branch específico.

```bash
npm run amplify:deploy dev
npm run amplify:deploy main
# o directamente
./scripts/amplify/deploy.sh <branch-name>
```

**Funciones:**
- Verifica cambios sin commitear
- Hace checkout del branch correcto
- Crea branch en Amplify si no existe
- Inicia deployment y muestra status
- Opción de esperar a que termine

### `status.sh`
Muestra el status completo de la aplicación.

```bash
npm run amplify:status
npm run amplify:status dev
# o directamente
./scripts/amplify/status.sh [branch-name]
```

**Funciones:**
- Información general de la aplicación
- Lista de branches configurados
- Detalles de un branch específico
- Deployments recientes
- Dominios configurados

### `jobs.sh`
Lista jobs de deployment.

```bash
npm run amplify:jobs
npm run amplify:jobs dev
npm run amplify:jobs dev 5
# o directamente
./scripts/amplify/jobs.sh [branch-name] [max-results]
```

**Funciones:**
- Lista branches disponibles
- Muestra jobs de un branch específico
- Detalles del job más reciente
- Logs y mensajes de error

## 📁 Estructura de Archivos

```
/
├── .amplify/
│   └── config.json          # Configuración local
├── scripts/
│   └── amplify/
│       ├── create-app.sh    # Crear nueva app
│       ├── update-config.sh # Actualizar config
│       ├── deploy.sh        # Deploy por branch
│       ├── status.sh        # Ver status
│       ├── jobs.sh          # Listar jobs
│       └── README.md         # Este archivo
└── package.json             # Scripts npm
```

## 🔧 Configuración Local

El archivo `.amplify/config.json` contiene:

```json
{
  "project": {
    "name": "nombre-proyecto",
    "appId": "id-de-app",
    "defaultDomain": "dominio.amplifyapp.com",
    "region": "us-east-2",
    "platform": "WEB_COMPUTE",
    "repository": "https://github.com/user/repo"
  },
  "branches": {
    "dev": {
      "name": "dev",
      "stage": "development",
      "backend": "https://api-dev.example.com/graphql"
    },
    "main": {
      "name": "main",
      "stage": "production",
      "backend": "https://api.example.com/graphql"
    }
  },
  "environment": {
    "NEXT_PUBLIC_API_URL": "https://api.example.com/graphql",
    "NEXT_PUBLIC_BUCKET_URL": "bucket.s3.region.amazonaws.com",
    "NEXT_PUBLIC_APP_NAME": "nombre-app"
  },
  "buildSpec": "...",
  "customRules": [...]
}
```

## 🔄 Flujo de Trabajo Típico

### 1. Configuración Inicial
```bash
# Crear nueva aplicación (solo una vez)
npm run amplify:create

# Actualizar configuración desde AWS
npm run amplify:config
```

### 2. Desarrollo
```bash
# Deploy a desarrollo
npm run amplify:deploy dev

# Ver status
npm run amplify:status dev

# Ver jobs recientes
npm run amplify:jobs dev
```

### 3. Producción
```bash
# Deploy a producción
npm run amplify:deploy main

# Ver status general
npm run amplify:status
```

## 🛠️ Requisitos Previos

1. **AWS CLI configurado**
   ```bash
   aws configure
   ```

2. **Permisos de Amplify**
   - `amplify:CreateApp`
   - `amplify:GetApp`
   - `amplify:CreateBranch`
   - `amplify:StartDeployment`
   - `amplify:GetBranch`
   - `amplify:ListBranches`

3. **Git configurado**
   ```bash
   git remote add origin https://github.com/user/repo.git
   ```

## 🚨 Consideraciones

- Los scripts requieren `jq` para procesar JSON
- La configuración local se agrega automáticamente a `.gitignore`
- Se crean backups automáticos de la configuración
- Los scripts verifican precondiciones antes de ejecutarse

## 📚 Comandos AWS CLI Útiles

```bash
# Ver todas las apps
aws amplify list-apps

# Ver branches de una app
aws amplify list-branches --app-id <app-id>

# Ver jobs de un branch
aws amplify list-jobs --app-id <app-id> --branch-name <branch>

# Ver detalles de un job
aws amplify get-job --app-id <app-id> --branch-name <branch> --job-id <job-id>

# Cancelar deployment
aws amplify stop-deployment --app-id <app-id> --branch-name <branch> --job-id <job-id>
```

## 🔍 Troubleshooting

### Error: "AWS CLI no está configurado"
```bash
aws configure
# Ingresa tus credenciales de AWS
```

### Error: "La aplicación no existe"
```bash
# Verifica el app ID en .amplify/config.json
# O ejecuta npm run amplify:create
```

### Error: "El branch no existe en Amplify"
```bash
# El script lo creará automáticamente al hacer deploy
# O créalo manualmente:
aws amplify create-branch --app-id <app-id> --branch-name <branch>
```

### Error: "Hay cambios sin commitear"
```bash
# Haz commit de los cambios o ignora el warning
git add .
git commit -m "mensaje del commit"
```

## 📝 Notas

- Los scripts están diseñados para ser idempotentes
- Se puede ejecutar múltiples veces sin problemas
- La configuración local es la fuente de verdad para los scripts
- Siempre se verifica la consistencia entre AWS y la configuración local

# Environment Setup Guide

Guía completa para configurar todas las variables de entorno necesarias para el sistema de automatización.

## Tabla de Contenidos

- [Configuración Inicial](#configuración-inicial)
- [ClickUp Integration](#clickup-integration)
- [AWS Amplify](#aws-amplify)
- [SendGrid Email](#sendgrid-email)
- [GitHub Token](#github-token)
- [Variables por Parte](#variables-por-parte)
- [Troubleshooting](#troubleshooting)

## Configuración Inicial

### 1. Copiar Template

```bash
cp .env.template .env
```

### 2. Configurar Variables Básicas

```bash
PROJECT_NAME=my-frontend-project
PROJECT_ENV=development
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-api.com/graphql
```

## ClickUp Integration

### Obtener API Key

1. Ir a [ClickUp](https://app.clickup.com)
2. Click en tu avatar (esquina superior derecha)
3. **Settings** → **Apps**
4. Sección **API Token**
5. Click en **Generate** o **Regenerate**
6. Copiar el token (formato: `pk_...`)

```bash
CLICKUP_API_KEY=pk_123456_ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

### Obtener Workspace ID

1. Ir a tu workspace en ClickUp
2. La URL tendrá el formato: `https://app.clickup.com/{WORKSPACE_ID}/...`
3. Copiar el número del workspace

```bash
CLICKUP_WORKSPACE_ID=12345678
```

### Configurar ClickUp

```bash
# Después de configurar las variables
npm run clickup:setup
```

Este comando creará:
- Lista de tareas en ClickUp
- Custom fields necesarios
- Guardará el `CLICKUP_LIST_ID` en tu configuración

## AWS Amplify

### Crear Usuario IAM

1. Ir a [AWS Console](https://console.aws.amazon.com)
2. Navegar a **IAM** → **Users**
3. Click en **Add users**
4. Nombre: `amplify-deploy-user`
5. Seleccionar **Programmatic access**
6. Permisos: Adjuntar política `AdministratorAccess-Amplify`
7. Crear usuario y **guardar las credenciales**

```bash
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-2
```

⚠️ **IMPORTANTE**: Estas credenciales solo se muestran una vez. Guárdalas de forma segura.

### Crear App en Amplify

1. Ir a [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click en **New app** → **Host web app**
3. Conectar con GitHub
4. Seleccionar repositorio
5. Configurar build settings
6. Copiar el **App ID** de la URL o configuración

```bash
AMPLIFY_APP_ID=d1234567890abc
AMPLIFY_DOMAIN=my-app-dev.amplifyapp.com
```

## SendGrid Email

### Crear Cuenta y API Key

1. Crear cuenta en [SendGrid](https://sendgrid.com)
2. Ir a **Settings** → **API Keys**
3. Click en **Create API Key**
4. Nombre: `automation-emails`
5. Permisos: **Full Access** o **Mail Send**
6. Copiar la key (formato: `SG.`)

```bash
SENDGRID_API_KEY=SG.1234567890abcdefghijklmnopqrstuvwxyz
```

⚠️ **IMPORTANTE**: La API key solo se muestra una vez.

### Verificar Email del Remitente

1. Ir a **Settings** → **Sender Authentication**
2. **Verify a Single Sender**
3. Completar formulario con tu email
4. Verificar email recibido

```bash
SENDGRID_FROM_EMAIL=noreply@your-domain.com
SENDGRID_FROM_NAME=My Project Team
```

### Configurar Listas de Emails

```bash
# Developers - notificaciones técnicas
DEV_EMAILS=dev1@example.com,dev2@example.com

# Clientes - notificaciones user-friendly
CLIENT_EMAILS=client1@example.com,client2@example.com
```

## GitHub Token

### Crear Personal Access Token

1. Ir a [GitHub Settings](https://github.com/settings/tokens)
2. **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. Click en **Generate new token (classic)**
4. Nombre: `automation-workflows`
5. Expiration: **No expiration** o **1 year**
6. Seleccionar scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
7. Click en **Generate token**
8. Copiar token (formato: `ghp_`)

```bash
GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz
```

⚠️ **IMPORTANTE**: El token solo se muestra una vez.

### Configurar Repositorio

```bash
GITHUB_REPO_OWNER=GRID-Company
GITHUB_REPO_NAME=my-frontend-project
```

## Variables por Parte

### Parte 1: Template Base
```bash
PROJECT_NAME=my-project
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.example.com/graphql
```

### Parte 2: ClickUp
```bash
CLICKUP_API_KEY=pk_...
CLICKUP_WORKSPACE_ID=12345678
CLICKUP_ENABLED=true
```

### Parte 3: GitHub Actions
```bash
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AMPLIFY_APP_ID=d123...
GITHUB_TOKEN=ghp_...
```

### Parte 4: Comunicación
```bash
SENDGRID_API_KEY=SG....
DEV_EMAILS=dev@example.com
CLIENT_EMAILS=client@example.com
```

## GitHub Secrets

Para configurar secrets en GitHub:

1. Ir a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click en **New repository secret**
4. Agregar cada uno de estos secrets:

### Secrets Requeridos

| Secret Name | Descripción | Ejemplo |
|-------------|-------------|---------|
| `CLICKUP_API_KEY` | API Key de ClickUp | `pk_123...` |
| `CLICKUP_WORKSPACE_ID` | ID del workspace | `12345678` |
| `SENDGRID_API_KEY` | API Key de SendGrid | `SG.123...` |
| `AWS_ACCESS_KEY_ID` | AWS Access Key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key | `wJalr...` |
| `AWS_REGION` | Región de AWS | `us-east-2` |
| `AMPLIFY_APP_ID` | ID de app Amplify | `d123...` |
| `AMPLIFY_DOMAIN` | Dominio de Amplify | `app.amplifyapp.com` |
| `DEV_EMAILS` | Emails developers | `dev@example.com` |
| `CLIENT_EMAILS` | Emails clientes | `client@example.com` |
| `GITHUB_TOKEN` | Token de GitHub | `ghp_...` |

## Validar Configuración

Ejecutar script de validación:

```bash
./scripts/setup/validate-env.sh
```

Este script verificará:
- ✅ Variables requeridas presentes
- ✅ Formato correcto
- ✅ Conexión a APIs
- ⚠️ Variables opcionales faltantes

## Troubleshooting

### Error: "CLICKUP_API_KEY is invalid"

**Solución**:
1. Verificar que el token no tenga espacios
2. Regenerar token en ClickUp
3. Verificar que el token tenga permisos correctos

### Error: "AWS credentials are invalid"

**Solución**:
1. Verificar Access Key ID y Secret Access Key
2. Verificar que el usuario IAM tenga permisos de Amplify
3. Verificar que las credenciales no hayan expirado

### Error: "SendGrid authentication failed"

**Solución**:
1. Verificar que la API key sea válida
2. Verificar que el email del remitente esté verificado
3. Verificar que la API key tenga permisos de Mail Send

### Error: "GitHub token unauthorized"

**Solución**:
1. Verificar que el token tenga scopes `repo` y `workflow`
2. Verificar que el token no haya expirado
3. Regenerar token si es necesario

### Variables de Entorno no se Cargan

**Solución**:
1. Verificar que el archivo `.env` exista en la raíz
2. Reiniciar el servidor de desarrollo
3. Verificar que las variables empiecen con `NEXT_PUBLIC_` para uso en cliente

## Seguridad

### Buenas Prácticas

- ✅ Nunca commitear archivos `.env` con valores reales
- ✅ Usar diferentes keys para dev/staging/prod
- ✅ Rotar keys periódicamente (cada 3-6 meses)
- ✅ Usar GitHub Secrets para CI/CD
- ✅ Limitar permisos de tokens al mínimo necesario
- ❌ No compartir keys por email o chat
- ❌ No hardcodear keys en el código

### Rotar Keys

Si una key se compromete:

1. **Inmediatamente** revocar/eliminar la key comprometida
2. Generar nueva key
3. Actualizar en todos los ambientes
4. Actualizar GitHub Secrets
5. Notificar al equipo

## Ambientes

### Development
```bash
PROJECT_ENV=development
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://dev.api.com/graphql
```

### Staging
```bash
PROJECT_ENV=staging
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://staging.api.com/graphql
```

### Production
```bash
PROJECT_ENV=production
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.com/graphql
```

## Recursos Adicionales

- [ClickUp API Documentation](https://clickup.com/api)
- [AWS Amplify Documentation](https://docs.amplify.aws)
- [SendGrid API Documentation](https://docs.sendgrid.com)
- [GitHub Actions Documentation](https://docs.github.com/actions)

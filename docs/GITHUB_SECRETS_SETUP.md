# GitHub Secrets Setup Guide

Guía paso a paso para configurar todos los secrets necesarios en GitHub para los workflows de automatización.

## Acceder a GitHub Secrets

1. Ir a tu repositorio en GitHub
2. Click en **Settings** (tab superior)
3. En el menú lateral: **Secrets and variables** → **Actions**
4. Click en **New repository secret**

## Secrets Requeridos

### 1. CLICKUP_API_KEY

**Descripción**: API Key para integración con ClickUp

**Cómo obtenerlo**:
1. Ir a [ClickUp Settings](https://app.clickup.com)
2. Click en tu avatar → **Settings** → **Apps**
3. Sección **API Token** → **Generate**
4. Copiar el token

**Formato**: `pk_123456_ABCDEFGHIJKLMNOPQRSTUVWXYZ`

**Usado en**:
- `.github/workflows/ticket-to-branch.yml`
- `.github/workflows/pr-automation.yml`
- `.github/workflows/release-notes.yml`

---

### 2. CLICKUP_WORKSPACE_ID

**Descripción**: ID del workspace de ClickUp

**Cómo obtenerlo**:
1. Ir a tu workspace en ClickUp
2. La URL tendrá: `https://app.clickup.com/{WORKSPACE_ID}/...`
3. Copiar el número

**Formato**: `12345678`

**Usado en**:
- `.github/workflows/ticket-to-branch.yml`
- `.github/workflows/pr-automation.yml`

---

### 3. SENDGRID_API_KEY

**Descripción**: API Key para envío de emails

**Cómo obtenerlo**:
1. Ir a [SendGrid](https://app.sendgrid.com)
2. **Settings** → **API Keys** → **Create API Key**
3. Nombre: `automation-emails`
4. Permisos: **Full Access** o **Mail Send**
5. Copiar la key

**Formato**: `SG.1234567890abcdefghijklmnopqrstuvwxyz`

**Usado en**:
- `.github/workflows/release-notes.yml`

---

### 4. AWS_ACCESS_KEY_ID

**Descripción**: AWS Access Key ID para Amplify

**Cómo obtenerlo**:
1. Ir a [AWS IAM Console](https://console.aws.amazon.com/iam)
2. **Users** → **Add users**
3. Nombre: `amplify-deploy-user`
4. Access type: **Programmatic access**
5. Permisos: `AdministratorAccess-Amplify`
6. Copiar Access Key ID

**Formato**: `AKIAIOSFODNN7EXAMPLE`

**Usado en**:
- `.github/workflows/amplify-deploy.yml`

---

### 5. AWS_SECRET_ACCESS_KEY

**Descripción**: AWS Secret Access Key para Amplify

**Cómo obtenerlo**:
- Se obtiene junto con el Access Key ID
- Solo se muestra una vez al crear el usuario

**Formato**: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

**Usado en**:
- `.github/workflows/amplify-deploy.yml`

⚠️ **CRÍTICO**: Guardar de forma segura, no se puede recuperar

---

### 6. AWS_REGION

**Descripción**: Región de AWS donde está Amplify

**Valor**: `us-east-2`

**Usado en**:
- `.github/workflows/amplify-deploy.yml`

---

### 7. AMPLIFY_APP_ID

**Descripción**: ID de la aplicación en AWS Amplify

**Cómo obtenerlo**:
1. Ir a [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Seleccionar tu app
3. El ID está en la URL: `https://console.aws.amazon.com/amplify/home?region=us-east-2#/{APP_ID}`
4. O en **App settings** → **General**

**Formato**: `d1234567890abc`

**Usado en**:
- `.github/workflows/amplify-deploy.yml`

---

### 8. AMPLIFY_DOMAIN

**Descripción**: Dominio de la aplicación en Amplify

**Cómo obtenerlo**:
1. En Amplify Console, seleccionar tu app
2. Ver el dominio en la sección **Domain management**

**Formato**: `my-app-dev.amplifyapp.com`

**Usado en**:
- `.github/workflows/release-notes.yml`

---

### 9. DEV_EMAILS

**Descripción**: Lista de emails de developers para notificaciones técnicas

**Formato**: `dev1@example.com,dev2@example.com,dev3@example.com`

**Usado en**:
- `.github/workflows/release-notes.yml`

---

### 10. CLIENT_EMAILS

**Descripción**: Lista de emails de clientes para notificaciones user-friendly

**Formato**: `client1@example.com,client2@example.com`

**Usado en**:
- `.github/workflows/release-notes.yml`

---

### 11. GITHUB_TOKEN

**Descripción**: Token para crear branches y comentar en issues

**Cómo obtenerlo**:
1. Ir a [GitHub Settings](https://github.com/settings/tokens)
2. **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)**
4. Scopes necesarios:
   - ✅ `repo` (Full control)
   - ✅ `workflow` (Update workflows)
5. Copiar token

**Formato**: `ghp_1234567890abcdefghijklmnopqrstuvwxyz`

**Usado en**:
- `.github/workflows/ticket-to-branch.yml`

⚠️ **NOTA**: GitHub Actions ya tiene un `GITHUB_TOKEN` automático, pero este tiene permisos limitados. Este token personalizado permite crear branches automáticamente.

---

## Script de Configuración Rápida

Puedes usar este script para configurar todos los secrets de una vez:

```bash
#!/bin/bash
# setup-github-secrets.sh

REPO_OWNER="GRID-Company"
REPO_NAME="your-repo-name"

# Cargar variables desde .env
source .env

# Función para crear secret
create_secret() {
  local name=$1
  local value=$2
  
  echo "Creating secret: $name"
  gh secret set "$name" --body "$value" --repo "$REPO_OWNER/$REPO_NAME"
}

# Crear todos los secrets
create_secret "CLICKUP_API_KEY" "$CLICKUP_API_KEY"
create_secret "CLICKUP_WORKSPACE_ID" "$CLICKUP_WORKSPACE_ID"
create_secret "SENDGRID_API_KEY" "$SENDGRID_API_KEY"
create_secret "AWS_ACCESS_KEY_ID" "$AWS_ACCESS_KEY_ID"
create_secret "AWS_SECRET_ACCESS_KEY" "$AWS_SECRET_ACCESS_KEY"
create_secret "AWS_REGION" "$AWS_REGION"
create_secret "AMPLIFY_APP_ID" "$AMPLIFY_APP_ID"
create_secret "AMPLIFY_DOMAIN" "$AMPLIFY_DOMAIN"
create_secret "DEV_EMAILS" "$DEV_EMAILS"
create_secret "CLIENT_EMAILS" "$CLIENT_EMAILS"
create_secret "GITHUB_TOKEN" "$GITHUB_TOKEN"

echo "✅ All secrets configured!"
```

### Uso del Script

```bash
# Instalar GitHub CLI si no lo tienes
brew install gh

# Autenticar
gh auth login

# Dar permisos de ejecución
chmod +x scripts/setup/setup-github-secrets.sh

# Ejecutar
./scripts/setup/setup-github-secrets.sh
```

## Verificar Secrets

Para verificar que los secrets están configurados:

```bash
gh secret list --repo GRID-Company/your-repo-name
```

Deberías ver:

```
AMPLIFY_APP_ID          Updated 2024-01-01
AMPLIFY_DOMAIN          Updated 2024-01-01
AWS_ACCESS_KEY_ID       Updated 2024-01-01
AWS_REGION              Updated 2024-01-01
AWS_SECRET_ACCESS_KEY   Updated 2024-01-01
CLIENT_EMAILS           Updated 2024-01-01
CLICKUP_API_KEY         Updated 2024-01-01
CLICKUP_WORKSPACE_ID    Updated 2024-01-01
DEV_EMAILS              Updated 2024-01-01
GITHUB_TOKEN            Updated 2024-01-01
SENDGRID_API_KEY        Updated 2024-01-01
```

## Actualizar Secrets

Para actualizar un secret:

```bash
gh secret set SECRET_NAME --body "new_value" --repo GRID-Company/your-repo-name
```

O manualmente:
1. Ir a **Settings** → **Secrets and variables** → **Actions**
2. Click en el secret a actualizar
3. Click en **Update secret**
4. Ingresar nuevo valor

## Eliminar Secrets

Para eliminar un secret:

```bash
gh secret delete SECRET_NAME --repo GRID-Company/your-repo-name
```

## Seguridad

### Buenas Prácticas

- ✅ Usar secrets para toda información sensible
- ✅ Nunca imprimir secrets en logs de workflows
- ✅ Limitar acceso al repositorio
- ✅ Rotar secrets periódicamente
- ✅ Usar diferentes secrets para dev/staging/prod
- ❌ No compartir secrets por email o chat
- ❌ No commitear secrets en código

### Secrets en Logs

GitHub automáticamente oculta los secrets en los logs de workflows. Si un secret aparece en un log, se mostrará como `***`.

Sin embargo, evita:

```yaml
# ❌ MAL - Puede exponer el secret
- name: Debug
  run: echo "API Key is ${{ secrets.CLICKUP_API_KEY }}"

# ✅ BIEN - No expone el secret
- name: Use API
  run: |
    curl -H "Authorization: ${{ secrets.CLICKUP_API_KEY }}" \
      https://api.clickup.com/api/v2/team
```

## Troubleshooting

### Error: "Secret not found"

**Solución**:
1. Verificar que el secret esté creado en GitHub
2. Verificar el nombre exacto (case-sensitive)
3. Verificar que estés en el repositorio correcto

### Error: "Bad credentials"

**Solución**:
1. Verificar que el valor del secret sea correcto
2. Regenerar la key/token si es necesario
3. Actualizar el secret en GitHub

### Workflow no Puede Acceder a Secret

**Solución**:
1. Verificar que el workflow esté en la branch correcta
2. Verificar permisos del workflow
3. Verificar que el secret esté en el repositorio correcto (no en fork)

## Recursos

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Best Practices for Secrets](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

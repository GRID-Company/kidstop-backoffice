# Project Setup Guide

Guía completa para configurar un nuevo proyecto desde el template.

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Crear Nuevo Proyecto](#crear-nuevo-proyecto)
- [Configuración Inicial](#configuración-inicial)
- [Desarrollo Local](#desarrollo-local)
- [Configuración de Servicios](#configuración-de-servicios)
- [Troubleshooting](#troubleshooting)

## Requisitos Previos

### Software Requerido

- **Node.js 20+** - [Descargar](https://nodejs.org/)
- **npm 10+** - Incluido con Node.js
- **Git** - [Descargar](https://git-scm.com/)

### Software Opcional

- **GitHub CLI** - Para configuración automática de secrets
- **Visual Studio Code** - Editor recomendado

### Verificar Instalación

```bash
node --version  # v20.x.x o superior
npm --version   # 10.x.x o superior
git --version   # 2.x.x o superior
```

## Crear Nuevo Proyecto

### Opción 1: Usar Script de Inicialización (Recomendado)

```bash
# Desde el directorio del template
cd template-front-end

# Ejecutar script de inicialización
./scripts/project/init-project.sh my-new-project

# El script creará:
# - Copia completa del template
# - Repositorio git inicializado
# - Branches main y dev
# - Dependencias instaladas
# - Archivo .env configurado
```

### Opción 2: Clonar Manualmente

```bash
# Clonar template
git clone https://github.com/GRID-Company/template-front-end.git my-new-project

# Entrar al directorio
cd my-new-project

# Remover git history
rm -rf .git

# Inicializar nuevo repositorio
git init
git add .
git commit -m "Initial commit from template"

# Crear branches
git branch -M main
git checkout -b dev

# Instalar dependencias
npm install
```

## Configuración Inicial

### 1. Configurar Variables de Entorno

```bash
# Copiar template
cp .env.template .env

# Editar .env
nano .env  # o usar tu editor preferido
```

**Variables mínimas requeridas:**

```bash
# Proyecto
PROJECT_NAME=my-project
PROJECT_ENV=development

# API
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-api.com/graphql
```

### 2. Actualizar package.json

```bash
# Actualizar nombre del proyecto
nano package.json

# Cambiar:
{
  "name": "my-project",
  "version": "0.1.0",
  ...
}
```

### 3. Actualizar template-config.json

```bash
nano template-config.json

# Actualizar PROJECT_NAME
{
  "project": {
    "name": "my-project",
    ...
  }
}
```

### 4. Validar Configuración

```bash
./scripts/setup/validate-env.sh
```

Este script verificará:
- ✅ Variables requeridas presentes
- ✅ Formato correcto de keys
- ⚠️ Variables opcionales faltantes

## Desarrollo Local

### Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run start            # Servidor de producción

# Calidad de código
npm run lint             # Ejecutar linter
npm run format           # Formatear código
npm run format:check     # Verificar formato

# GraphQL
npm run codegen          # Generar tipos de GraphQL
```

### Estructura de Desarrollo

```
my-project/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (authenticated)/   # Rutas protegidas
│   │   │   └── dashboard/
│   │   ├── (not-authenticated)/ # Rutas públicas
│   │   │   └── login/
│   │   └── api/               # API routes
│   ├── features/              # Features del negocio
│   │   ├── auth/
│   │   ├── inventory/
│   │   └── windows/
│   ├── lib/                   # Utilidades
│   └── shared/                # Componentes compartidos
├── public/                    # Assets estáticos
├── docs/                      # Documentación
└── scripts/                   # Scripts de automatización
```

## Configuración de Servicios

### ClickUp Integration (Opcional)

Si deseas integrar con ClickUp:

1. **Obtener API Key**
   - Ir a ClickUp Settings → Apps → API Token
   - Copiar token

2. **Configurar en .env**
   ```bash
   CLICKUP_API_KEY=pk_your_api_key
   CLICKUP_WORKSPACE_ID=your_workspace_id
   CLICKUP_ENABLED=true
   ```

3. **Ejecutar Setup**
   ```bash
   npm run clickup:setup
   ```

Ver guía completa: [Environment Setup](ENVIRONMENT_SETUP.md#clickup-integration)

### AWS Amplify (Opcional)

Para deploy automático:

1. **Crear Usuario IAM**
   - AWS Console → IAM → Users
   - Permisos: AdministratorAccess-Amplify

2. **Configurar en .env**
   ```bash
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-2
   AMPLIFY_ENABLED=true
   ```

3. **Crear App en Amplify**
   - Amplify Console → New app
   - Conectar con GitHub
   - Copiar App ID

Ver guía completa: [Environment Setup](ENVIRONMENT_SETUP.md#aws-amplify)

### GitHub Secrets

Para CI/CD con GitHub Actions:

1. **Configurar Secrets Manualmente**
   - GitHub → Settings → Secrets and variables → Actions
   - Agregar cada secret

2. **O Usar Script Automático**
   ```bash
   # Instalar GitHub CLI
   brew install gh
   
   # Autenticar
   gh auth login
   
   # Configurar secrets
   ./scripts/setup/setup-github-secrets.sh
   ```

Ver guía completa: [GitHub Secrets Setup](GITHUB_SECRETS_SETUP.md)

## Crear Nueva Feature

### 1. Crear Estructura

```bash
mkdir -p src/features/my-feature/{adapters/{api,forms,mappers},domain,ui/{components,views,hooks}}
```

### 2. Crear Archivos Base

```bash
# Types
touch src/features/my-feature/domain/types.ts
touch src/features/my-feature/domain/constants.ts
touch src/features/my-feature/domain/my-feature.domain.ts

# GraphQL
touch src/features/my-feature/adapters/api/my-feature.gql

# Forms
touch src/features/my-feature/adapters/forms/my-feature-form.schema.ts
touch src/features/my-feature/adapters/forms/use-my-feature-form.ts

# UI
touch src/features/my-feature/ui/views/my-feature.tsx
touch src/features/my-feature/ui/components/my-feature-card.tsx
```

### 3. Implementar Feature

Ver [Architecture Documentation](ARCHITECTURE.md) para patrones y convenciones.

## GraphQL Setup

### 1. Crear Queries/Mutations

```graphql
# src/features/my-feature/adapters/api/my-feature.gql
query GetMyFeatures($args: FindMyFeaturesArgs!) {
  myFeatures(args: $args) {
    items {
      id
      name
    }
    total
  }
}

mutation CreateMyFeature($input: CreateMyFeatureInput!) {
  createMyFeature(input: $input) {
    id
    name
  }
}
```

### 2. Generar Tipos

```bash
npm run codegen
```

Esto generará:
- `src/lib/api/generated/my-feature.generated.ts`

### 3. Usar en Componentes

```typescript
import { useGetMyFeaturesQuery } from '@/lib/api/generated/my-feature.generated';

export const MyFeatureView = () => {
  const { data, loading } = useGetMyFeaturesQuery({
    variables: { args: {} },
  });
  
  return (
    <div>
      {loading ? <Loading /> : data?.myFeatures.items.map(...)}
    </div>
  );
};
```

## Git Workflow

### Branches

- **main** - Producción
- **dev** - Desarrollo
- **feature/{name}** - Features
- **fix/{name}** - Bug fixes

### Commits

Usar conventional commits:

```bash
# Features
git commit -m "feat: add user profile page"

# Fixes
git commit -m "fix: resolve login redirect issue"

# Refactor
git commit -m "refactor: improve inventory mapper"

# Docs
git commit -m "docs: update setup guide"
```

### Workflow

```bash
# Crear feature branch desde dev
git checkout dev
git pull origin dev
git checkout -b feature/my-feature

# Hacer cambios y commits
git add .
git commit -m "feat: add my feature"

# Push y crear PR
git push origin feature/my-feature
# Crear PR en GitHub: feature/my-feature → dev

# Después de merge, actualizar dev
git checkout dev
git pull origin dev
```

## Testing

### Unit Tests (Futuro)

```bash
npm run test
npm run test:watch
npm run test:coverage
```

### E2E Tests (Futuro)

```bash
npm run test:e2e
```

## Build y Deploy

### Build Local

```bash
npm run build
npm run start
```

### Deploy a Amplify (Manual)

```bash
# Configurar Amplify CLI
npm install -g @aws-amplify/cli
amplify configure

# Deploy
amplify publish
```

### Deploy Automático

Con GitHub Actions configurado, el deploy es automático:
- Push a `dev` → Deploy a staging
- Push a `main` → Deploy a producción

## Troubleshooting

### Error: "Module not found"

```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "GraphQL types not found"

```bash
# Regenerar tipos
npm run codegen
```

### Error: "Port 3000 already in use"

```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# O usar otro puerto
PORT=3001 npm run dev
```

### Error: "Environment variables not loading"

```bash
# Verificar que .env existe
ls -la .env

# Validar configuración
./scripts/setup/validate-env.sh

# Reiniciar servidor
npm run dev
```

### Error: "Permission denied" en scripts

```bash
# Dar permisos de ejecución
chmod +x scripts/**/*.sh
```

### Error: "Git conflicts"

```bash
# Ver conflictos
git status

# Resolver manualmente o abortar
git merge --abort
```

## Recursos Adicionales

### Documentación

- [Architecture Documentation](ARCHITECTURE.md)
- [Environment Setup Guide](ENVIRONMENT_SETUP.md)
- [GitHub Secrets Setup](GITHUB_SECRETS_SETUP.md)

### Links Externos

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [HeroUI Documentation](https://heroui.com)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react)

## Checklist de Setup

- [ ] Node.js 20+ instalado
- [ ] Proyecto creado desde template
- [ ] Variables de entorno configuradas (.env)
- [ ] Validación ejecutada (validate-env.sh)
- [ ] Dependencias instaladas (npm install)
- [ ] Servidor de desarrollo funcionando (npm run dev)
- [ ] GraphQL endpoint configurado
- [ ] Git repository inicializado
- [ ] Branches creados (main, dev)
- [ ] README actualizado con info del proyecto
- [ ] GitHub repository creado (opcional)
- [ ] GitHub Secrets configurados (opcional)
- [ ] ClickUp configurado (opcional)
- [ ] AWS Amplify configurado (opcional)

## Soporte

Para preguntas o problemas:
1. Revisar documentación en `docs/`
2. Verificar issues en GitHub
3. Contactar al equipo de desarrollo

---

**¡Listo para desarrollar! 🚀**

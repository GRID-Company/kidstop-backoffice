#!/bin/bash
set -e

BACKOFFICE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECTS_DIR="$(dirname "$BACKOFFICE_DIR")"
TARGET_DIR="$PROJECTS_DIR/kidstop-digital-binder"
REPO_URL="git@github.com:GRID-Company/kidstop-digital-binder.git"

echo "========================================="
echo "  Kidstop Carpeta Digital - Setup"
echo "========================================="
echo ""

if [ -d "$TARGET_DIR" ]; then
  echo "⚠️  $TARGET_DIR ya existe, saltando clone"
else
  echo "📦 Clonando $REPO_URL..."
  git clone "$REPO_URL" "$TARGET_DIR"
fi

cd "$TARGET_DIR"

echo "📋 Copiando archivos de infraestructura..."
for f in tsconfig.json hero.ts postcss.config.mjs eslint.config.mjs .prettierrc .prettierignore codegen.ts; do
  cp "$BACKOFFICE_DIR/$f" "$TARGET_DIR/$f"
done

echo "📄 Copiando documentación..."
mkdir -p "$TARGET_DIR/docs"
cp "$BACKOFFICE_DIR/docs/digital-binder/README.md" "$TARGET_DIR/README.md"
cp "$BACKOFFICE_DIR/docs/digital-binder/ARCHITECTURE.md" "$TARGET_DIR/docs/ARCHITECTURE.md"
cp "$BACKOFFICE_DIR/docs/digital-binder/IMPLEMENTATION_PLAN.md" "$TARGET_DIR/docs/IMPLEMENTATION_PLAN.md"
cp "$BACKOFFICE_DIR/docs/digital-binder/CLICKUP_STRUCTURE.md" "$TARGET_DIR/docs/CLICKUP_STRUCTURE.md"

echo "🔄 Copiando workflows..."
mkdir -p "$TARGET_DIR/.windsurf/workflows"
cp "$BACKOFFICE_DIR/.windsurf/workflows/work-on-task.md" "$TARGET_DIR/.windsurf/workflows/work-on-task.md"

echo "📁 Copiando src/lib/..."
mkdir -p "$TARGET_DIR/src/lib"
for dir in api types consts; do
  cp -r "$BACKOFFICE_DIR/src/lib/$dir" "$TARGET_DIR/src/lib/$dir"
done

mkdir -p "$TARGET_DIR/src/lib/utils"
cp "$BACKOFFICE_DIR/src/lib/utils/format-currency.ts" "$TARGET_DIR/src/lib/utils/format-currency.ts"
cp "$BACKOFFICE_DIR/src/lib/utils/format-date.ts" "$TARGET_DIR/src/lib/utils/format-date.ts"
cp "$BACKOFFICE_DIR/src/lib/utils/create-storage.util.ts" "$TARGET_DIR/src/lib/utils/create-storage.util.ts"
cp "$BACKOFFICE_DIR/src/lib/utils/use-responsive-client.ts" "$TARGET_DIR/src/lib/utils/use-responsive-client.ts"

cp -r "$BACKOFFICE_DIR/src/lib/auth" "$TARGET_DIR/src/lib/auth"

mkdir -p "$TARGET_DIR/src/lib/store"
cp "$BACKOFFICE_DIR/src/lib/store/auth.ts" "$TARGET_DIR/src/lib/store/auth.ts"

if [ -d "$BACKOFFICE_DIR/src/lib/hooks" ]; then
  cp -r "$BACKOFFICE_DIR/src/lib/hooks" "$TARGET_DIR/src/lib/hooks"
fi

echo "📁 Copiando src/shared/providers/..."
mkdir -p "$TARGET_DIR/src/shared/providers"
cp "$BACKOFFICE_DIR/src/shared/providers/apollo-provider.tsx" "$TARGET_DIR/src/shared/providers/apollo-provider.tsx"
cp "$BACKOFFICE_DIR/src/shared/providers/providers.tsx" "$TARGET_DIR/src/shared/providers/providers.tsx"

echo "📁 Creando estructura de features..."
for feature in auth catalog cart wishlist orders profile most-wanted; do
  for layer in adapters/api adapters/forms adapters/mappers domain ui/components ui/hooks ui/views; do
    mkdir -p "$TARGET_DIR/src/features/$feature/$layer"
  done
done

echo "📁 Creando estructura de rutas..."
mkdir -p "$TARGET_DIR/src/app/(public)/carta/[id]"
mkdir -p "$TARGET_DIR/src/app/(public)/most-wanted"
mkdir -p "$TARGET_DIR/src/app/(authenticated)/carrito"
mkdir -p "$TARGET_DIR/src/app/(authenticated)/checkout"
mkdir -p "$TARGET_DIR/src/app/(authenticated)/perfil"
mkdir -p "$TARGET_DIR/src/app/(authenticated)/pedidos/[id]"
mkdir -p "$TARGET_DIR/src/app/(authenticated)/wishlist"
mkdir -p "$TARGET_DIR/src/app/(not-authenticated)/login"
mkdir -p "$TARGET_DIR/src/app/(not-authenticated)/registro"
mkdir -p "$TARGET_DIR/src/app/(not-authenticated)/recuperar-contrasena"
mkdir -p "$TARGET_DIR/src/app/api/login"
mkdir -p "$TARGET_DIR/src/app/api/logout"
mkdir -p "$TARGET_DIR/src/shared/base"
mkdir -p "$TARGET_DIR/src/shared/layouts"

echo "🧹 Limpiando archivos del template base..."
rm -f "$TARGET_DIR/src/lib/consts/navigation-routes.ts" 2>/dev/null || true
rm -rf "$TARGET_DIR/src/lib/clickup" 2>/dev/null || true
rm -f "$TARGET_DIR/src/lib/api/graphql/windows.gql" 2>/dev/null || true
rm -f "$TARGET_DIR/src/lib/api/graphql/branches.gql" 2>/dev/null || true
rm -f "$TARGET_DIR/src/lib/api/graphql/files.gql" 2>/dev/null || true
rm -f "$TARGET_DIR/src/lib/api/graphql/inventory.gql" 2>/dev/null || true
rm -f "$TARGET_DIR/src/lib/api/graphql/selectors.gql" 2>/dev/null || true
rm -f "$TARGET_DIR/src/lib/api/generated/windows.generated.ts" 2>/dev/null || true
rm -f "$TARGET_DIR/src/lib/api/generated/branches.generated.ts" 2>/dev/null || true
rm -f "$TARGET_DIR/src/lib/api/generated/files.generated.ts" 2>/dev/null || true
rm -f "$TARGET_DIR/src/lib/api/generated/inventory.generated.ts" 2>/dev/null || true
rm -f "$TARGET_DIR/src/lib/api/generated/selectors.generated.ts" 2>/dev/null || true

echo ""
echo "✅ Setup completo en: $TARGET_DIR"
echo ""
echo "Próximos pasos:"
echo "  1. Adaptar package.json"
echo "  2. Adaptar next.config.ts"
echo "  3. Adaptar src/lib/auth/user-roles.ts"
echo "  4. Adaptar src/lib/auth/use-process-login.ts"
echo "  5. Crear src/lib/store/tcg-context.ts y cart.ts"
echo "  6. Crear src/lib/utils/get-tcg-from-domain.ts"
echo "  7. Crear src/proxy.ts"
echo "  8. Crear src/app/layout.tsx y globals.css"
echo "  9. Crear .env.example"
echo "  10. npm install && npm run dev"

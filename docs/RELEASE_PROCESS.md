# Release Process — Cómo subir una versión nueva

Proceso estándar para promover `dev` → `main` como release versionado.

## Convenciones

- Las releases se hacen mediante **PR `dev → main`** con **squash merge** ("Squash and merge" en GitHub). No usar merge commit ni rebase.
- Título del PR: `Release vX.Y.Z - Production Deployment` (ej. #144, #160).
- Tag **anotado** `vX.Y.Z` sobre el squash commit resultante en `main` — es el punto exacto desplegado; sirve para cherry-picks y ramas de hotfix.
- El **sync-back `main → dev` es obligatorio** después de cada release (ver "Por qué importa el sync-back").

## Pre-flight

```bash
git checkout dev && git pull origin dev
git status                       # working tree limpio
npm run validate                 # lint + format + typecheck
npm run build                    # build de producción verde
```

## Paso 0 — Safety tag (restore point)

Marca el estado de `main` antes del merge, por si hay que hacer rollback:

```bash
git fetch origin --tags
git tag -a backup/pre-vX.Y.Z origin/main -m "main state before vX.Y.Z release"
git push origin backup/pre-vX.Y.Z
```

## Paso 1 — Bump de versión en `dev`

```bash
npm version minor --no-git-tag-version   # 1.1.0 → 1.2.0 (o patch/major)
git add package.json                     # package-lock.json está gitignored en este repo
git commit -m "chore: bump version to X.Y.Z"
git push origin dev
```

> `--no-git-tag-version` evita que npm cree commit/tag propio; el tag oficial se crea sobre `main`.

## Paso 2 — PR `dev → main`

```bash
gh pr create --base main --head dev \
  --title "Release vX.Y.Z - Production Deployment" \
  --body "Resumen de la release + notas"
```

## Paso 3 — Merge con SQUASH

Botón **"Squash and merge"** en GitHub, o:

```bash
gh pr merge <PR_NUMBER> --squash
```

## Paso 4 — Tag `vX.Y.Z` en `main`

```bash
git checkout main && git pull origin main
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z
```

## Paso 5 — Sync-back a `dev` (OBLIGATORIO)

```bash
git checkout dev && git pull origin dev
git merge origin/main
git push origin dev
```

### Por qué importa el sync-back

El squash merge crea un commit nuevo en `main` que `dev` no contiene. Sin el sync-back, el merge-base de las ramas queda congelado antes del release, y el **siguiente** release mostrará conflictos masivos falsos (git compara el squash viejo contra todo el trabajo nuevo de dev). Con el sync-back, el merge-base avanza al squash commit y cada release solo compara trabajo realmente nuevo.

> Esto ya pasó: los releases v1.2.0 de backoffice y digital-binder marcaron 25–30 archivos en conflicto por no haber sincronizado v1.1.0.

## Paso 6 — GitHub Release (opcional)

```bash
gh release create vX.Y.Z --title "vX.Y.Z" --generate-notes --latest
```

## Si el PR marca conflictos

Escenario conocido: el release anterior fue squash sin sync-back, entonces `main` tiene un squash commit que dev no contiene y el merge-base está muy atrás.

1. **Verificar si `main` tiene contenido único** que dev no tenga (hotfixes, ediciones manuales en el squash). El squash de un release debería ser tree-idéntico a algún commit de dev:

```bash
SQUASH_TREE=$(git rev-parse '<release-squash-sha>^{tree}')
for c in $(git rev-list <merge-base>..origin/dev); do
  [ "$(git rev-parse $c^{tree})" = "$SQUASH_TREE" ] && echo "MATCH: $c"
done
```

2. **Si main NO tiene contenido único** (squash verificado + hotfixes ya duplicados en dev): resolver con estrategia `ours` en dev — registra la historia de main sin tocar el tree de dev:

```bash
git checkout dev && git pull origin dev
git merge -s ours origin/main --no-edit
git diff HEAD@{1} HEAD          # debe salir vacío: tree idéntico a dev
git push origin dev             # el PR queda mergeable
```

> Usar `-s ours` (estrategia completa), **no** `-X ours` (opción del recursive): con `-X` los hunks no conflictivos de main sí entran y pueden resucitar código viejo que dev ya refactorizó.

3. **Si main SÍ tiene contenido único**: hacer merge normal (`git merge origin/main`) y resolver a mano preservando los hotfixes de main, o primero cherry-pick/backport de esos hotfixes a dev.

## Verificación post-release

```bash
git fetch origin --tags
git rev-list -n1 vX.Y.Z                                  # == HEAD de main
git show origin/main:package.json | grep '"version"'     # versión nueva
git merge-base origin/main origin/dev                    # == squash commit del release
```

## Rollback

```bash
git checkout main
git reset --hard backup/pre-vX.Y.Z
git push --force-with-lease origin main
git tag -d vX.Y.Z && git push origin :refs/tags/vX.Y.Z
```

Coordinar con el equipo antes de forzar `main`.

## Cherry-picks y hotfixes desde el tag

```bash
git checkout -b hotfix/mi-fix vX.Y.Z     # rama desde el punto exacto de producción
# ...fix, commit, PR → main...
```

# Bulk Card Lookup Module - Implementation Summary

## Overview

Se ha implementado un módulo completo de búsqueda avanzada de cartas con capacidad de bulk lookup, análisis de precios y carga al inventario.

**Branch:** `feat/bulk-card-lookup`

## Características Implementadas

### 1. Dos Flujos de Trabajo

#### Flujo Completo (Step-by-Step)
- Interfaz guiada con stepper visual
- Pasos secuenciales: Búsqueda → Análisis → Confirmación → Completado
- Navegación hacia atrás permitida
- Ideal para usuarios que prefieren un flujo estructurado

**Ubicación:** `src/features/catalog/ui/views/bulk-lookup-complete.tsx`

#### Flujo Modular (Accordion)
- Tres secciones independientes: Búsqueda, Análisis, Confirmación
- Secciones expandibles/colapsables
- Permite trabajar en cualquier sección sin orden específico
- Ideal para usuarios avanzados que necesitan flexibilidad

**Ubicación:** `src/features/catalog/ui/views/bulk-lookup-modular.tsx`

### 2. Componentes UI

#### `bulk-search-form.tsx`
- Selector de TCG (Pokémon/Magic) usando store global
- Textarea para pegar listas en formato Limitless/Moxfield
- Botones de búsqueda y limpieza
- Validación básica

#### `price-analysis-panel.tsx`
- Análisis de precios por variante/condición
- Tabs para filtrar: Todas, Rentables, Pérdida, Neutral
- Visualización de:
  - Precio actual en inventario
  - Precio de mercado
  - Margen de ganancia ($ y %)
- Edición inline de precios
- Indicadores visuales de rentabilidad

#### `bulk-load-confirmation.tsx`
- Resumen de cartas a cargar
- Estadísticas: Total, Nuevas, Actualizadas
- Desglose de valor total
- Validación antes de confirmar
- Manejo de errores

### 3. Lógica de Negocio

#### `bulk-lookup.service.ts`
- `enrichWithMetrics()` — Enriquecer resultados con métricas
- `calculateMarginPercentage()` — Calcular margen de ganancia
- `validateBulkLoadItems()` — Validar items antes de cargar

#### `bulk-lookup.store.ts` (Zustand)
- Estado centralizado para toda la operación
- Actions para:
  - Cambiar TCG type
  - Actualizar texto raw
  - Gestionar resultados de búsqueda
  - Seleccionar/deseleccionar cartas
  - Actualizar precios
  - Controlar estados de carga

### 4. Integración GraphQL

#### Queries Implementados
- `BulkSearchMagicCards` — Búsqueda batch de cartas Magic
- `BulkSearchPokemonCards` — Búsqueda batch de cartas Pokémon
- `BulkMagicCardMetrics` — Métricas de cartas Magic
- `BulkPokemonCardMetrics` — Métricas de cartas Pokémon

**Ubicación:** `src/lib/api/graphql/bulk-lookup.gql`

#### Tipos Generados
- Codegen ejecutado exitosamente
- Tipos disponibles en `src/lib/api/generated/bulk-lookup.generated.ts`

#### Hooks API
- `useMagicBatchSearch()` — Hook para búsqueda Magic
- `usePokemonBatchSearch()` — Hook para búsqueda Pokémon
- `useMagicCardMetrics()` — Hook para métricas Magic
- `usePokemonCardMetrics()` — Hook para métricas Pokémon
- `useBulkLoadInventory()` — Hook para carga (comentado, esperando backend)

**Ubicación:** `src/features/catalog/adapters/api/use-bulk-lookup.ts`

### 5. Integración en Deck Builder

La vista principal `deck-builder.tsx` ahora incluye:
- Tabs para elegir entre Flujo Completo y Flujo Modular
- Ambos flujos completamente funcionales en UI
- Placeholder para cuando el backend esté listo

## Estado Actual

### ✅ Completado
- Estructura de tipos y dominio
- Componentes UI (búsqueda, análisis, confirmación)
- Dos vistas de flujo (completo y modular)
- Store de estado (Zustand)
- Servicio de lógica de negocio
- Queries GraphQL
- Codegen y tipos generados
- Integración en deck-builder

### ⏳ Pendiente (Backend)

#### 1. Implementación de Queries
Los hooks actualmente retornan datos vacíos. Cuando el backend esté listo:
```typescript
// En use-bulk-lookup.ts
const [search, { data, loading, error }] = useLazyQuery<BulkSearchMagicCardsQuery>(
  BULK_SEARCH_MAGIC_CARDS
);
```

#### 2. Mutation de Carga
Actualmente comentada en `bulk-lookup.gql`:
```graphql
mutation BulkLoadInventory($input: BulkLoadInventoryInput!) {
  bulkLoadInventory(input: $input) {
    success
    createdCount
    updatedCount
    errors
  }
}
```

**Requerimientos:**
- Crear nuevas cartas en inventario
- Actualizar stock de cartas existentes
- Actualizar precios de compra/venta
- Retornar conteos y errores

## Estructura de Archivos

```
src/features/catalog/
├── adapters/
│   ├── api/
│   │   └── use-bulk-lookup.ts          # Hooks para queries/mutations
│   └── store/
│       └── bulk-lookup.store.ts        # Zustand store
├── domain/
│   ├── bulk-lookup.types.ts            # Tipos del módulo
│   ├── bulk-lookup.service.ts          # Lógica de negocio
│   └── ...
└── ui/
    ├── components/
    │   ├── bulk-search-form.tsx        # Formulario de búsqueda
    │   ├── price-analysis-panel.tsx    # Panel de análisis
    │   └── bulk-load-confirmation.tsx  # Confirmación de carga
    └── views/
        ├── bulk-lookup-complete.tsx    # Flujo step-by-step
        ├── bulk-lookup-modular.tsx     # Flujo accordion
        └── deck-builder.tsx            # Vista principal

src/lib/api/
├── graphql/
│   └── bulk-lookup.gql                 # Queries GraphQL
└── generated/
    └── bulk-lookup.generated.ts        # Tipos generados por codegen
```

## Próximos Pasos

1. **Backend:** Implementar queries batch search y mutation de carga
2. **Integración:** Conectar hooks con Apollo queries/mutations
3. **Testing:** Crear tests para flujos y validaciones
4. **Refinamiento:** Ajustar UX basado en feedback
5. **Performance:** Implementar debounce y cacheo si es necesario

## Notas Técnicas

- **Store:** Zustand para estado centralizado y simple
- **UI:** HeroUI + Tailwind CSS para consistencia
- **Validación:** Servicio de dominio para lógica de negocio
- **GraphQL:** Schema-first con codegen automático
- **Tipos:** Totalmente tipado con TypeScript

## Testing

Para probar el módulo en desarrollo:
1. Navegar a `/buscador-avanzado`
2. Elegir entre "Flujo Completo" o "Flujo Modular"
3. Seleccionar TCG (Pokémon o Magic)
4. Pegar lista de cartas
5. Hacer clic en "Buscar cartas"
6. (Cuando backend esté listo) Continuar con análisis y carga

## Commit

```
feat: implement bulk card lookup module with complete and modular flows
```

Todos los cambios están en la rama `feat/bulk-card-lookup` y listos para PR.

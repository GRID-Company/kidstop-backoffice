# Bulk Lookup - Próximos Pasos

## Estado Actual
✅ Módulo UI completamente implementado con flujos completo y modular
✅ Tipos y dominio listos
✅ GraphQL queries definidas y codegen ejecutado
⏳ Hooks API listos pero sin integración con Apollo (retornan datos vacíos)
⏳ Mutation de carga comentada, esperando backend

## Tareas Pendientes

### 1. Integración con Apollo (Cuando Backend esté listo)

**Archivo:** `src/features/catalog/adapters/api/use-bulk-lookup.ts`

```typescript
// Reemplazar placeholders con:
import { useLazyQuery } from '@apollo/client';
import { BULK_SEARCH_MAGIC_CARDS, BULK_SEARCH_POKEMON_CARDS, ... } from '@/lib/api/graphql/bulk-lookup.gql';

export function useMagicBatchSearch() {
  const [search, { data, loading, error }] = useLazyQuery<BulkSearchMagicCardsQuery>(
    BULK_SEARCH_MAGIC_CARDS
  );
  
  const execute = useCallback(
    async (input: BatchSearchInput) => {
      const { data: result } = await search({ variables: { input } });
      return result?.magicBatchCardSearch?.results ?? [];
    },
    [search]
  );
  
  return { search: execute, loading, error };
}
```

### 2. Implementar Mutation de Carga

**Archivo:** `src/lib/api/graphql/bulk-lookup.gql`

Descomentar y ajustar:
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

Luego en `use-bulk-lookup.ts`:
```typescript
export function useBulkLoadInventory() {
  const [bulkLoad, { loading, error }] = useMutation<BulkLoadInventoryMutation>(
    BULK_LOAD_INVENTORY
  );
  
  const execute = useCallback(
    async (payload: IBulkLoadPayload) => {
      const { data } = await bulkLoad({ variables: { input: payload } });
      return data?.bulkLoadInventory ?? { success: false, errors: [...] };
    },
    [bulkLoad]
  );
  
  return { bulkLoad: execute, loading, error };
}
```

### 3. Integración en Vistas

**Archivos:** `bulk-lookup-complete.tsx` y `bulk-lookup-modular.tsx`

Reemplazar llamadas a funciones mock con hooks reales:
```typescript
const { search: searchMagic, loading: searchLoading } = useMagicBatchSearch();
const { search: searchPokemon, loading: searchLoading } = usePokemonBatchSearch();

// En handleSearch:
const results = selectedTCG === 'POKEMON' 
  ? await searchPokemon({ lines: parsedLines })
  : await searchMagic({ lines: parsedLines });
```

### 4. Enriquecimiento con Métricas

Implementar llamadas a `useMagicCardMetrics()` y `usePokemonCardMetrics()` en `handleAnalyze`:
```typescript
const metricsMap = {};
for (const result of searchResults) {
  if (result.bestMatch) {
    const metrics = selectedTCG === 'POKEMON'
      ? await getPokemonMetrics(result.bestMatch.guid)
      : await getMagicMetrics(result.bestMatch.guid);
    metricsMap[result.bestMatch.guid] = metrics;
  }
}

const analysis = BulkLookupService.enrichWithMetrics(searchResults, metricsMap);
setPriceAnalysis(analysis);
```

### 5. Testing

Crear tests para:
- Búsqueda batch (mock de datos)
- Cálculo de margen
- Validación de items
- Flujos completo y modular
- Manejo de errores

## Checklist de Integración

- [ ] Importar queries GraphQL en hooks
- [ ] Implementar useMagicBatchSearch
- [ ] Implementar usePokemonBatchSearch
- [ ] Implementar useMagicCardMetrics
- [ ] Implementar usePokemonCardMetrics
- [ ] Descomentar y ajustar mutation BulkLoadInventory
- [ ] Implementar useBulkLoadInventory
- [ ] Conectar hooks en bulk-lookup-complete.tsx
- [ ] Conectar hooks en bulk-lookup-modular.tsx
- [ ] Agregar enriquecimiento con métricas
- [ ] Crear tests unitarios
- [ ] Crear tests de integración
- [ ] Validar flujos end-to-end

## Estimación

- Integración Apollo: 2-3 horas
- Testing: 2-3 horas
- Refinamiento: 1-2 horas

**Total:** 5-8 horas

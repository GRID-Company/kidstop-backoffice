# Bulk Lookup - Próximos Pasos

## Estado Actual
✅ Módulo UI completamente implementado con flujos completo y modular
✅ Tipos y dominio listos
✅ GraphQL queries definidas y codegen ejecutado
✅ Hooks API implementados con Apollo useLazyQuery (queries batch search y metrics)
✅ Tipos específicos para respuesta del batch search
✅ Integración en vistas (hooks conectados con lógica de búsqueda)
✅ Búsqueda batch search funcional (parsea lista y ejecuta query)
✅ Enriquecimiento con métricas funcional
⏳ Mutation de carga comentada, esperando backend
⏳ Testing y refinamiento

## Tareas Pendientes

### 1. Implementar Mutation de Carga (Backend)

**Archivo:** `src/lib/api/graphql/bulk-lookup.gql`

Descomentar cuando el backend implemente la mutation:
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
import { useMutation } from '@apollo/client/react';
import { BulkLoadInventoryDocument } from '@/lib/api/generated/bulk-lookup.generated';

export function useBulkLoadInventory() {
  const [bulkLoad, { loading, error }] = useMutation(BulkLoadInventoryDocument);
  
  const execute = useCallback(
    async (payload: any) => {
      const { data } = await bulkLoad({ variables: { input: payload } });
      return data?.bulkLoadInventory ?? { success: false, errors: [...] };
    },
    [bulkLoad]
  );
  
  return { bulkLoad: execute, loading, error };
}
```

### 2. Testing

Crear tests para:
- Búsqueda batch (mock de datos)
- Cálculo de margen
- Validación de items
- Flujos completo y modular
- Manejo de errores

### 3. Refinamiento UI

- [ ] Mejorar visualización de resultados de búsqueda
- [ ] Agregar indicadores de carga
- [ ] Mejorar manejo de errores
- [ ] Agregar confirmación antes de cargar

## Checklist Completado

- ✅ Importar queries GraphQL en hooks
- ✅ Implementar useMagicBatchSearch
- ✅ Implementar usePokemonBatchSearch
- ✅ Implementar useMagicCardMetrics
- ✅ Implementar usePokemonCardMetrics
- ✅ Conectar hooks en bulk-lookup-complete.tsx
- ✅ Conectar hooks en bulk-lookup-modular.tsx
- ✅ Agregar enriquecimiento con métricas
- ⏳ Implementar useBulkLoadInventory (esperando backend)
- ⏳ Crear tests unitarios
- ⏳ Crear tests de integración

## Estimación Restante

- Mutation de carga: 1 hora (cuando backend esté listo)
- Testing: 2-3 horas
- Refinamiento: 1-2 horas

**Total:** 4-6 horas

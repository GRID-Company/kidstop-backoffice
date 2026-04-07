## Descripción

Migración completa del feature `settings` de datos mock a Apollo Client, integrando los APIs de `GlobalConfig` y `BuyerBudgets`.

---

## Cambios principales

### GlobalConfig API
- Añadido `settings.gql` con query `GlobalConfig` y mutation `UpdateGlobalConfig`
- Creado `settings.mapper.ts` con conversiones:
  - Geofence: `radius` (metros API) ↔ `radiusKm` (km UI)
  - Horarios: `{hour, minute, period}` (12h API) ↔ `"HH:MM"` (24h UI)
  - Thresholds: mapeo de nombres de campos (`inventoryLimit` → `inventoryLimitPerCard`, etc.)

### BuyerBudgets API
- Añadido `buyer-budgets.gql` con query `BuyerBudgets` y mutation `UpdateBuyerBudget`
- Creado `buyer-budget.mapper.ts`
- `BudgetSection` rediseñado: tabla con utilización por comprador/TCG + modal upsert con selector de buyers (filtrado por `role=BUYER` desde `UsersDocument`)

### Tipos de dominio actualizados
- `IGeofenceConfig`: eliminado `enabled` y `polygon`
- `IThresholdConfig`: añadido `purchasePercentage`
- `IBudgetConfig`: reescrito completamente (nuevo modelo: `guid`, `tcg`, `assignedAmount`, `usedAmount`, `utilization`, `buyer`)
- `ISettings`: `id` → `guid`, `updatedAt` → `updatedDate`, eliminado `budgets`

### Formularios
- `geofence-settings.schema.ts`: eliminado campo `enabled`
- `threshold-settings.schema.ts`: añadido `purchasePercentage`
- `budget-settings.schema.ts`: reescrito (buyerGuid + tcg + assignedAmount)
- Añadido `use-budget-form.ts`

### UI
- `geofence-section.tsx`: eliminado Switch de habilitado/deshabilitado
- `threshold-section.tsx`: añadido campo `purchasePercentage`
- `budget-section.tsx`: rediseño completo con lista de utilización y modal de edición
- `settings.tsx`: adaptado a nuevo contrato del hook

### Limpieza
- Eliminado `settings.mock.ts`

---

## Archivos generados (codegen)
- `src/lib/api/generated/settings.generated.ts`
- `src/lib/api/generated/buyer-budgets.generated.ts`

---

## Testing
- `npx tsc --noEmit` → ✅ 0 errores
- `npx eslint src/features/settings` → ✅ 0 warnings

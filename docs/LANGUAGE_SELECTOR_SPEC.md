# Especificación: Selector de Idioma para Cartas

## Contexto

El backend ahora requiere el campo `language: CardLanguage` en todas las operaciones de inventario y compras. Actualmente está hardcodeado a `CardLanguage.English` en todo el código.

## Requisito

Implementar un selector de idioma (English/Spanish) en la UI para permitir a los usuarios especificar el idioma de las cartas.

## Arquitectura: Idioma como Dimensión Adicional

El idioma funciona como una **capa adicional** junto con la condición de la carta:

### Estructura de Datos
```
Carta Base (cardGuid)
  └─ Idioma (language)
      └─ Condición (condition)
          └─ InventoryItem (inventoryItemGuid)
              ├─ Stock
              ├─ Precio de compra
              ├─ Precio de venta
              ├─ Historial de movimientos
              └─ Historial de precios
```

### Ejemplo Práctico
Para una carta "Charizard":
- **English + Near Mint** → inventoryItemGuid: `abc-123` (stock: 5, precio: $100)
- **English + Lightly Played** → inventoryItemGuid: `abc-456` (stock: 2, precio: $80)
- **Spanish + Near Mint** → inventoryItemGuid: `def-789` (stock: 3, precio: $90)
- **Spanish + Lightly Played** → inventoryItemGuid: `def-012` (stock: 1, precio: $70)

### Flujo en Modal de Detalle de Carta

1. **Usuario selecciona idioma** (English/Spanish)
   - Se actualiza el selector de condiciones disponibles para ese idioma
   
2. **Usuario selecciona condición** (Near Mint, Lightly Played, etc.)
   - Se obtiene el `inventoryItemGuid` específico para esa combinación idioma+condición
   
3. **Se actualiza toda la data del modal:**
   - Stock actual
   - Precio de compra
   - Precio de venta
   - Historial de movimientos (filtrado por `inventoryItemGuid`)
   - Historial de precios (filtrado por `inventoryItemGuid`)

### Implicaciones Técnicas

Cada combinación **idioma + condición** es un `InventoryItem` único con su propio:
- GUID único
- Stock independiente
- Precios independientes
- Historial independiente

### Diagrama de Flujo en Modal

```
┌─────────────────────────────────────────────────────────┐
│          Modal de Detalle de Carta                      │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ 1. Selector de Idioma                          │    │
│  │    ○ English  ○ Spanish  ⊗ Korean (disabled)  │    │
│  └────────────────────────────────────────────────┘    │
│                        ↓                                 │
│  ┌────────────────────────────────────────────────┐    │
│  │ 2. Selector de Condición                       │    │
│  │    (Filtrado por idioma seleccionado)          │    │
│  │    ○ Near Mint  ○ Lightly Played  ○ Damaged   │    │
│  └────────────────────────────────────────────────┘    │
│                        ↓                                 │
│  ┌────────────────────────────────────────────────┐    │
│  │ 3. Datos de la Variante Seleccionada           │    │
│  │    inventoryItemGuid: abc-123                  │    │
│  │    Stock: 5 unidades                           │    │
│  │    Precio Compra: $80                          │    │
│  │    Precio Venta: $100                          │    │
│  └────────────────────────────────────────────────┘    │
│                        ↓                                 │
│  ┌────────────────────────────────────────────────┐    │
│  │ 4. Historial de Movimientos                    │    │
│  │    (Filtrado por inventoryItemGuid: abc-123)   │    │
│  │    - 2024-01-15: Entrada +3 unidades           │    │
│  │    - 2024-01-10: Venta -2 unidades             │    │
│  └────────────────────────────────────────────────┘    │
│                        ↓                                 │
│  ┌────────────────────────────────────────────────┐    │
│  │ 5. Historial de Precios                        │    │
│  │    (Filtrado por inventoryItemGuid: abc-123)   │    │
│  │    - 2024-01-12: $90 → $100                    │    │
│  │    - 2024-01-05: $85 → $90                     │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Ejemplo de Cambio de Idioma

**Estado Inicial:**
- Idioma: English
- Condición: Near Mint
- inventoryItemGuid: `abc-123`
- Stock: 5, Precio: $100

**Usuario cambia a Spanish:**
- Idioma: Spanish ← cambió
- Condición: Near Mint ← se mantiene
- inventoryItemGuid: `def-789` ← cambió (nuevo InventoryItem)
- Stock: 3, Precio: $90 ← datos diferentes
- Historial de movimientos: ← datos diferentes
- Historial de precios: ← datos diferentes

## Reglas de Negocio

### 1. Idiomas Soportados para Selector
- **English** → **Spanish**: Selector habilitado
- Usuario puede cambiar entre estos dos idiomas

### 2. Idiomas No Modificables
Los siguientes idiomas **NO** pueden ser modificados y el selector debe estar **deshabilitado**:
- Korean (Coreano)
- Chinese (Chino)
- Japanese (Japonés)
- Cualquier otro idioma que no sea English

### 3. Comportamiento del Selector

#### Carta Nueva (sin idioma previo)
- Selector habilitado
- Valor por defecto: **English**
- Usuario puede seleccionar: English o Spanish

#### Carta Existente con English
- Selector habilitado
- Valor actual: English
- Usuario puede cambiar a: Spanish

#### Carta Existente con Spanish
- Selector habilitado
- Valor actual: Spanish
- Usuario puede cambiar a: English

#### Carta Existente con Korean/Chinese/Japanese
- Selector **deshabilitado** (disabled)
- Valor actual: Korean/Chinese/Japanese (readonly)
- Mostrar mensaje: "Este idioma no puede ser modificado"

## Ubicaciones a Implementar

### 1. 🎯 **PRIORIDAD ALTA**: Modal de Detalle de Carta (Catálogo)
**Archivos**: 
- `src/features/catalog/ui/components/pokemon-card-detail-modal.tsx`
- `src/features/catalog/ui/components/magic-card-detail-modal.tsx`
- `src/features/catalog/ui/hooks/use-card-detail-modal.ts`

**Implementación:**

#### Estado del Modal
```typescript
const [selectedLanguage, setSelectedLanguage] = useState<CardLanguage>(CardLanguage.English);
const [selectedCondition, setSelectedCondition] = useState<string>(CARD_CONDITIONS.NEAR_MINT);
```

#### Flujo de Selección
1. **Selector de Idioma** (nuevo)
   - Posición: Arriba del selector de condición
   - Opciones: English, Spanish (si aplica)
   - Deshabilitado para Korean/Chinese/Japanese
   
2. **Selector de Condición** (existente)
   - Filtra variantes por idioma seleccionado
   - Muestra solo condiciones disponibles para ese idioma

3. **Variante Seleccionada**
   - Se determina por: `cardGuid + language + condition`
   - Obtiene el `inventoryItemGuid` correspondiente

#### Actualización de Queries
```typescript
// Filtrar inventoryCards por idioma
const availableVariants = detail?.inventoryCards?.filter(
  (card) => card.language === selectedLanguage
) ?? [];

// Seleccionar variante por condición
const selectedVariant = availableVariants.find(
  (v) => v.condition === selectedCondition
) ?? availableVariants[0];
```

#### Componentes Afectados
- **InventoryMovementsTable**: Recibe `inventoryItemGuid` de la variante seleccionada
- **SellPriceHistoryTable**: Recibe `inventoryItemGuid` de la variante seleccionada
- **Formulario de Ajuste de Stock**: Usa `language` de la variante seleccionada
- **Formulario de Precios**: Usa `language` de la variante seleccionada

### 2. Catálogo - Ajuste de Stock
**Archivo**: `src/features/catalog/ui/hooks/use-adjust-inventory-stock.ts`
- Recibe `language` desde la variante seleccionada en el modal
- Ya no necesita selector propio (usa el del modal)
- Validar idioma de la carta actual

### 3. Catálogo - Actualización de Precios
**Archivo**: `src/features/catalog/ui/hooks/use-update-inventory-price.ts`
- Recibe `language` desde la variante seleccionada en el modal
- Ya no necesita selector propio (usa el del modal)
- Validar idioma de la carta actual

### 3. Inventario - Búsqueda Masiva
**Archivo**: `src/features/inventory-cards/adapters/mappers/bulk-search-to-inventory.mapper.ts`
- Agregar campo `language` al formulario de búsqueda masiva
- Permitir selección de idioma por carta
- Validar idioma de cada carta

### 4. Inventario - Ajuste Manual
**Archivo**: `src/features/inventory-cards/adapters/mappers/inventory.mapper.ts`
- Agregar campo `language` al formulario de ajuste
- Validar idioma de la carta actual
- Habilitar/deshabilitar selector según idioma

### 5. Compras - Nueva Compra
**Archivo**: `src/features/purchases/adapters/mappers/purchase.mapper.ts`
- Agregar campo `language` al formulario de items de compra
- Permitir selección de idioma por item
- Valor por defecto: English

### 6. Compras - Detalle de Compra (2 ubicaciones)
**Archivo**: `src/features/purchases/ui/hooks/use-purchase-detail.ts`
- Agregar campo `language` al agregar items
- Agregar campo `language` al agregar pending items
- Validar idioma de cada carta

## Componente UI Sugerido

```tsx
interface LanguageSelectorProps {
  value: CardLanguage;
  onChange: (language: CardLanguage) => void;
  disabled?: boolean;
  currentLanguage?: CardLanguage;
}

export function LanguageSelector({ 
  value, 
  onChange, 
  disabled = false,
  currentLanguage 
}: LanguageSelectorProps) {
  const isModifiable = currentLanguage === CardLanguage.English || 
                       currentLanguage === CardLanguage.Spanish ||
                       !currentLanguage;
  
  const isDisabled = disabled || !isModifiable;
  
  return (
    <Select
      label="Idioma"
      value={value}
      onChange={(e) => onChange(e.target.value as CardLanguage)}
      disabled={isDisabled}
      helperText={
        !isModifiable 
          ? "Este idioma no puede ser modificado" 
          : undefined
      }
    >
      <SelectItem value={CardLanguage.English}>English</SelectItem>
      <SelectItem value={CardLanguage.Spanish}>Spanish</SelectItem>
    </Select>
  );
}
```

## Validaciones

### Frontend
1. Verificar que el idioma seleccionado sea English o Spanish
2. Si la carta tiene idioma Korean/Chinese/Japanese, no permitir cambio
3. Mostrar mensaje claro cuando selector esté deshabilitado

### Backend (ya implementado)
- El backend valida que el campo `language` sea un valor válido de `CardLanguage` enum
- Valores posibles: ENGLISH, SPANISH, KOREAN, CHINESE, JAPANESE

## Tipos TypeScript

```typescript
// Ya existe en schema-types.ts
export enum CardLanguage {
  English = 'ENGLISH',
  Spanish = 'SPANISH',
  Korean = 'KOREAN',
  Chinese = 'CHINESE',
  Japanese = 'JAPANESE'
}

// Agregar a domain types
export const MODIFIABLE_LANGUAGES = [
  CardLanguage.English,
  CardLanguage.Spanish,
] as const;

export const NON_MODIFIABLE_LANGUAGES = [
  CardLanguage.Korean,
  CardLanguage.Chinese,
  CardLanguage.Japanese,
] as const;

export function isLanguageModifiable(language: CardLanguage): boolean {
  return MODIFIABLE_LANGUAGES.includes(language as any);
}
```

## Prioridad de Implementación

### Fase 1: Modal de Detalle (CRÍTICO)
**Objetivo**: Implementar selector de idioma como capa adicional en el modal de detalle de carta

1. **Agregar selector de idioma al modal**
   - Componente UI del selector
   - Estado `selectedLanguage`
   - Lógica de habilitación/deshabilitación según idiomas disponibles

2. **Filtrar variantes por idioma**
   - Modificar lógica de `availableVariants`
   - Filtrar por `language` antes de filtrar por `condition`

3. **Actualizar componentes dependientes**
   - `InventoryMovementsTable`: Ya recibe `inventoryItemGuid` correcto
   - `SellPriceHistoryTable`: Ya recibe `inventoryItemGuid` correcto
   - Formularios de ajuste: Reciben `language` de variante seleccionada

### Fase 2: Otros Flujos (SECUNDARIO)
Después de implementar el modal, agregar selectores en:

1. **Media Prioridad**: Compras (nueva compra y detalle)
2. **Baja Prioridad**: Inventario (búsqueda masiva y ajuste manual)

### Notas de Implementación
- El modal de detalle es el **punto de entrada principal** para gestionar inventario
- Los hooks de ajuste y precios **heredan** el idioma del modal
- No necesitan selectores propios, solo reciben el valor

## Testing

### Casos de Prueba - Modal de Detalle

#### Selección de Idioma
1. ✅ Abrir modal con carta que tiene English + Near Mint
   - Selector de idioma debe mostrar English seleccionado
   - Selector de condición debe mostrar Near Mint seleccionado
   - Datos deben corresponder a English + Near Mint

2. ✅ Cambiar de English a Spanish (manteniendo Near Mint)
   - Selector de idioma cambia a Spanish
   - Selector de condición mantiene Near Mint
   - `inventoryItemGuid` debe cambiar
   - Stock, precios e historiales deben actualizarse

3. ✅ Cambiar de Spanish a English (manteniendo Near Mint)
   - Selector de idioma cambia a English
   - Selector de condición mantiene Near Mint
   - `inventoryItemGuid` debe cambiar
   - Stock, precios e historiales deben actualizarse

4. ✅ Cambiar idioma y luego cambiar condición
   - Seleccionar Spanish
   - Cambiar de Near Mint a Lightly Played
   - Debe mostrar datos de Spanish + Lightly Played

#### Idiomas No Modificables
5. ✅ Abrir modal con carta Korean + Near Mint
   - Selector de idioma debe estar deshabilitado
   - Debe mostrar "Korean" como readonly
   - Selector de condición debe funcionar normalmente
   - Solo muestra condiciones disponibles en Korean

6. ✅ Intentar cambiar carta Chinese (debe estar deshabilitado)
7. ✅ Intentar cambiar carta Japanese (debe estar deshabilitado)

#### Historial de Movimientos
8. ✅ Verificar que historial de movimientos se filtra por `inventoryItemGuid`
   - Cambiar de English a Spanish
   - Historial debe mostrar solo movimientos de Spanish + condición seleccionada

#### Historial de Precios
9. ✅ Verificar que historial de precios se filtra por `inventoryItemGuid`
   - Cambiar de English a Spanish
   - Historial debe mostrar solo cambios de precio de Spanish + condición seleccionada

#### Ajuste de Stock
10. ✅ Ajustar stock con English seleccionado
    - Debe crear movimiento con `language: ENGLISH`
    - Debe actualizar stock de English + condición seleccionada

11. ✅ Ajustar stock con Spanish seleccionado
    - Debe crear movimiento con `language: SPANISH`
    - Debe actualizar stock de Spanish + condición seleccionada

#### Actualización de Precios
12. ✅ Actualizar precio con English seleccionado
    - Debe actualizar precio de English + condición seleccionada
    - Debe crear registro en historial de precios

13. ✅ Actualizar precio con Spanish seleccionado
    - Debe actualizar precio de Spanish + condición seleccionada
    - Debe crear registro en historial de precios

### Casos de Prueba - Otros Flujos
14. ✅ Crear carta nueva con English en compras
15. ✅ Crear carta nueva con Spanish en compras
16. ✅ Verificar que el idioma se guarde correctamente en backend

## Notas Adicionales

- El idioma de una carta se determina por la versión física de la carta
- Una vez que una carta tiene idioma Korean/Chinese/Japanese, no puede cambiarse porque son versiones específicas
- English y Spanish son intercambiables porque representan el mismo contenido en diferentes idiomas
- El selector debe ser consistente en toda la aplicación

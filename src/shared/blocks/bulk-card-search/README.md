# Bulk Card Search Component

Componente compartido para búsqueda masiva de cartas con soporte para formatos Moxfield (Magic) y Limitless (Pokémon).

## Características

- ✅ Búsqueda masiva con parsing automático de listas
- ✅ Soporte para Magic (Moxfield) y Pokémon (Limitless)
- ✅ Cards expandibles con best match + related cards
- ✅ Selección de cartas alternativas mediante radio group
- ✅ Configuración por carta: condición, cantidad, precio
- ✅ Validación completa con Zod y react-hook-form
- ✅ Variantes: purchases (oferta) e inventory (precio público)
- ✅ Compound components pattern para flexibilidad

## Uso

### Variante Purchases

```tsx
import BulkCardSearch from '@/shared/blocks/bulk-card-search';
import { BulkSearchFormDataPurchases } from '@/shared/blocks/bulk-card-search/schemas';

function PurchaseComponent() {
  const handleConfirm = (data: BulkSearchFormDataPurchases) => {
    // Procesar cartas agregadas
    console.log(data.cards);
  };

  return (
    <BulkCardSearch
      variant="purchases"
      onConfirm={handleConfirm}
      onCancel={() => console.log('Cancelled')}
      isOpen={true}
    />
  );
}
```

### Variante Inventory

```tsx
import BulkCardSearch from '@/shared/blocks/bulk-card-search';
import { BulkSearchFormDataInventory } from '@/shared/blocks/bulk-card-search/schemas';

function InventoryComponent() {
  const handleConfirm = (data: BulkSearchFormDataInventory) => {
    // Procesar cartas agregadas
    console.log(data.cards);
  };

  return (
    <BulkCardSearch
      variant="inventory"
      onConfirm={handleConfirm}
      onCancel={() => console.log('Cancelled')}
      isOpen={true}
    />
  );
}
```

## Estructura de Datos

### Input (Purchases)

```typescript
{
  searchText: string;
  cards: Array<{
    selectedCardGuid: string;
    condition: CardCondition;
    quantity: number;
    offerPrice: number;
  }>;
}
```

### Input (Inventory)

```typescript
{
  searchText: string;
  cards: Array<{
    selectedCardGuid: string;
    condition: CardCondition;
    quantity: number;
    publicPrice: number;
  }>;
}
```

## Formato de Entrada

### Pokémon (Limitless)

```
3 Mega Charizard Y ex ASC 22
2 Iono PAL 185
4 Rare Candy SVI 191
```

### Magic (Moxfield)

```
1 Lightning Bolt (4ED) 208
3 Counterspell (MH2) 267
4 Island (UNF) 236
```

## Arquitectura

```
bulk-card-search/
├── index.tsx                      # Componente raíz (compound)
├── types.ts                       # Tipos TypeScript
├── schemas.ts                     # Schemas Zod
├── bulk-card-search-input.tsx     # Input de texto
├── bulk-card-search-results.tsx   # Lista de resultados
├── bulk-card-result-card.tsx      # Card individual
├── bulk-card-related-selector.tsx # Selector de alternativas
├── bulk-card-form-controls.tsx    # Inputs de configuración
├── hooks/
│   ├── use-bulk-card-search.ts    # Hook para API
│   └── use-bulk-search-form.ts    # Hook para formulario
└── api/
    └── bulk-search.gql            # Queries GraphQL
```

## Integraciones

### Purchases (`/compras/nueva`)

- Toggle "Búsqueda avanzada" en sección "Agregar cartas"
- Variante: `purchases`
- Campos: condición, cantidad, oferta

### Inventory (`/inventario`)

- Botón "Agregar bulk" en toolbar
- Drawer con componente
- Variante: `inventory`
- Campos: condición, cantidad, precio público

## Validaciones

- Texto de búsqueda requerido
- Al menos una carta configurada
- Cantidad mínima: 1
- Precio mínimo: 0
- Condición requerida

## Estados Visuales

- **Sin configurar**: border default
- **Configurado**: border accent + badge "Configurado"
- **Error**: border danger con mensaje
- **Sin coincidencia**: border warning
- **Expandido**: background subtle

## Notas Técnicas

- Usa `useFieldArray` de react-hook-form para manejo de lista
- Persistencia de datos si se cierra sin confirmar
- Backend maneja parsing de formatos
- Cierre automático al confirmar
- Soporte para cards sin related cards

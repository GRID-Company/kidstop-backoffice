# Backend Proposal: Dedicated Stock Validation Endpoint

## Current Status

⚠️ **Stock validation is currently DISABLED in the frontend** due to performance issues.

The frontend was validating sale item stock by fetching up to 1,000 inventory items and filtering client-side, which caused significant performance degradation. This feature has been temporarily disabled until a dedicated backend endpoint is implemented.

**Current behavior:**

- Users can edit sale items (quantity only - condition is read-only, shown as badge)
- Changes in quantity are detected and "unsaved changes" warning is shown
- Backend validates stock when saving
- If stock is insufficient, backend returns an error that is displayed to the user
- **UX simplified following KISS principle**: condition cannot be changed, only quantity

## Problem Statement

The previous implementation had several issues:

1. **Performance**: Fetches 1,000 items when typically only 5-20 are needed
2. **Network overhead**: Large payload (~500KB-1MB) for simple validation
3. **Scalability**: As inventory grows, the limit may need to increase
4. **Client-side complexity**: Matching logic duplicated in frontend
5. **User Experience**: Slow validation creates lag in the UI

## Current Implementation

### Frontend Query

```typescript
query InventoryItems($findInventoryItemsArgs: FindInventoryItemsArgs!) {
  inventoryItems(findInventoryItemsArgs: $findInventoryItemsArgs) {
    data {
      guid
      tcg
      condition
      stock
      language
      pokemonCardSummary { guid, name, ... }
      magicCardSummary { guid, name, ... }
    }
    count
  }
}

// Variables
{
  findInventoryItemsArgs: {
    filters: { tcg: "POKEMON" },
    limit: 1000,
    skip: 0,
    sort: { column: "createdDate", order: "ASC" }
  }
}
```

### Client-side Matching

```typescript
items.forEach((saleItem) => {
  const cardGuid =
    saleItem.pokemonCardSummary?.guid || saleItem.magicCardSummary?.guid;

  const matchingInventoryItem = inventoryItems.find((invItem) => {
    const invCardGuid =
      invItem.pokemonCardSummary?.guid || invItem.magicCardSummary?.guid;
    return (
      invCardGuid === cardGuid &&
      invItem.condition === saleItem.condition &&
      invItem.language === saleItem.language
    );
  });

  const availableStock = matchingInventoryItem?.stock || 0;
  // ... validation logic
});
```

## UI Simplification (KISS Principle)

Before implementing the backend endpoint, the UI was simplified following the **KISS (Keep It Simple, Stupid)** principle:

### Changes Made

- **Condition is now READ-ONLY**: Shown as a badge (like language), not editable
- **Only quantity is editable**: Single input field for users to modify
- **Reduced complexity**: No condition selector, no validation of condition changes
- **Aligned with backend**: `UpdateSaleItemInput` only supports updating `quantity` anyway

### Visual Comparison

**Before (Complex):**

```
┌─────────────────────────────────┐
│ Condición: [Dropdown ▼]        │ ← Editable (confusing)
│ Cantidad:  [Input]              │ ← Editable
│ Precio:    $10.00               │ ← Read-only
└─────────────────────────────────┘
```

**After (KISS):**

```
┌─────────────────────────────────┐
│ [EN] [NM] [Rare] [Foil]         │ ← Badges (includes condition)
│                                  │
│ Condición: NM                   │ ← Read-only (text)
│ Cantidad:  [Input]              │ ← Editable (only field)
│ Precio:    $10.00               │ ← Read-only
└─────────────────────────────────┘
```

### Benefits of Simplification

- ✅ **Clearer UX**: Users see condition but can't accidentally change it
- ✅ **Fewer errors**: No invalid condition combinations
- ✅ **Faster edits**: Only one field to modify
- ✅ **Backend aligned**: Matches mutation capabilities
- ✅ **Less validation needed**: Only quantity changes require stock check

## Proposed Solution

### New GraphQL Query

```graphql
"""
Validates stock availability for multiple sale items.
Returns stock validation results without fetching full inventory data.
"""
query ValidateSaleItemsStock($items: [SaleItemStockInput!]!) {
  validateSaleItemsStock(items: $items) {
    saleItemGuid
    cardGuid
    cardName
    condition
    language
    requestedQuantity
    availableStock
    hasStock
    deficit
  }
}
```

### Input Type

```graphql
"""
Input for validating stock of a single sale item.
Note: Condition is read-only in the UI (shown as badge), but included here
for accurate stock validation since inventory items are stored by card+condition+language.
"""
input SaleItemStockInput {
  """
  GUID of the sale item (for mapping results back)
  """
  saleItemGuid: String!

  """
  GUID of the Pokemon or Magic card
  """
  cardGuid: String!

  """
  TCG type (POKEMON or MAGIC)
  """
  tcg: String!

  """
  Card condition (NM, LP, MP, HP, DMG).
  Read-only in UI but required for stock lookup.
  """
  condition: String!

  """
  Card language
  """
  language: CardLanguage!

  """
  Requested quantity to validate (only editable field in UI)
  """
  quantity: Int!
}
```

### Output Type

```graphql
"""
Stock validation result for a single sale item
"""
type SaleItemStockValidation {
  """
  Original sale item GUID (for mapping)
  """
  saleItemGuid: String!

  """
  Card GUID that was validated
  """
  cardGuid: String!

  """
  Card name (for debugging/logging)
  """
  cardName: String!

  """
  Condition validated
  """
  condition: String!

  """
  Language validated
  """
  language: CardLanguage!

  """
  Quantity requested
  """
  requestedQuantity: Int!

  """
  Available stock in inventory
  """
  availableStock: Int!

  """
  Whether there is sufficient stock
  """
  hasStock: Boolean!

  """
  Deficit if stock is insufficient (0 if hasStock is true)
  """
  deficit: Int!
}
```

## Backend Implementation (NestJS)

### Resolver

```typescript
// src/features/inventory/resolvers/inventory.resolver.ts

@Resolver()
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Query(() => [SaleItemStockValidation])
  async validateSaleItemsStock(
    @Args('items', { type: () => [SaleItemStockInput] })
    items: SaleItemStockInput[]
  ): Promise<SaleItemStockValidation[]> {
    return this.inventoryService.validateSaleItemsStock(items);
  }
}
```

### Service

```typescript
// src/features/inventory/services/inventory.service.ts

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
    @InjectRepository(PokemonCard)
    private pokemonCardRepository: Repository<PokemonCard>,
    @InjectRepository(MagicCard)
    private magicCardRepository: Repository<MagicCard>
  ) {}

  async validateSaleItemsStock(
    items: SaleItemStockInput[]
  ): Promise<SaleItemStockValidation[]> {
    // Extract unique card GUIDs to fetch in bulk
    const cardGuids = [...new Set(items.map((item) => item.cardGuid))];

    // Fetch all inventory items in a single query
    const inventoryItems = await this.inventoryItemRepository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.pokemonCardSummary', 'pokemon')
      .leftJoinAndSelect('inv.magicCardSummary', 'magic')
      .where(
        '(pokemon.guid IN (:...cardGuids) OR magic.guid IN (:...cardGuids))',
        { cardGuids }
      )
      .getMany();

    // Create a map for O(1) lookups
    const inventoryMap = new Map<string, InventoryItem>();
    inventoryItems.forEach((item) => {
      const cardGuid =
        item.pokemonCardSummary?.guid || item.magicCardSummary?.guid;
      const key = `${cardGuid}:${item.condition}:${item.language}`;
      inventoryMap.set(key, item);
    });

    // Validate each sale item
    return items.map((saleItem) => {
      const key = `${saleItem.cardGuid}:${saleItem.condition}:${saleItem.language}`;
      const inventoryItem = inventoryMap.get(key);

      const availableStock = inventoryItem?.stock || 0;
      const hasStock = availableStock >= saleItem.quantity;
      const deficit = hasStock ? 0 : saleItem.quantity - availableStock;

      // Get card name for debugging
      const cardName =
        inventoryItem?.pokemonCardSummary?.name ||
        inventoryItem?.magicCardSummary?.name ||
        'Unknown';

      return {
        saleItemGuid: saleItem.saleItemGuid,
        cardGuid: saleItem.cardGuid,
        cardName,
        condition: saleItem.condition,
        language: saleItem.language,
        requestedQuantity: saleItem.quantity,
        availableStock,
        hasStock,
        deficit,
      };
    });
  }
}
```

## Frontend Usage

### GraphQL Query File

```graphql
# src/lib/api/graphql/inventory.gql

query ValidateSaleItemsStock($items: [SaleItemStockInput!]!) {
  validateSaleItemsStock(items: $items) {
    saleItemGuid
    cardGuid
    cardName
    condition
    language
    requestedQuantity
    availableStock
    hasStock
    deficit
  }
}
```

### Updated Hook

```typescript
// src/features/sales/ui/hooks/use-sale-items-stock-validation.ts

import { useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import toast from 'react-hot-toast';
import { ValidateSaleItemsStockDocument } from '@/lib/api/generated/inventory.generated';
import { ISaleItem } from '../../domain/types';
import { StockValidation } from '@/shared/types/stock.types';

export interface UseSaleItemsStockValidationReturn {
  stockValidationMap: Map<string, StockValidation>;
  hasAnyStockIssue: boolean;
  loading: boolean;
  error: Error | undefined;
}

export function useSaleItemsStockValidation(
  items: ISaleItem[]
): UseSaleItemsStockValidationReturn {
  // Prepare input for the new endpoint
  const stockInputs = useMemo(
    () =>
      items.map((item) => ({
        saleItemGuid: item.guid,
        cardGuid:
          item.pokemonCardSummary?.guid || item.magicCardSummary?.guid || '',
        tcg: item.tcg,
        condition: item.condition,
        language: item.language,
        quantity: item.quantity,
      })),
    [items]
  );

  const { data, loading, error } = useQuery(ValidateSaleItemsStockDocument, {
    variables: { items: stockInputs },
    skip: items.length === 0,
  });

  useEffect(() => {
    if (error) {
      console.error('Stock validation error:', error);
      toast.error('Error al validar stock disponible');
    }
  }, [error]);

  const stockValidationMap = useMemo(() => {
    const map = new Map<string, StockValidation>();

    if (loading || !data?.validateSaleItemsStock) {
      return map;
    }

    data.validateSaleItemsStock.forEach((validation) => {
      map.set(validation.saleItemGuid, {
        available: validation.availableStock,
        requested: validation.requestedQuantity,
        hasStock: validation.hasStock,
      });
    });

    return map;
  }, [data, loading]);

  const hasAnyStockIssue = useMemo(() => {
    return Array.from(stockValidationMap.values()).some(
      (validation) => !validation.hasStock
    );
  }, [stockValidationMap]);

  return {
    stockValidationMap,
    hasAnyStockIssue,
    loading,
    error: error as Error | undefined,
  };
}
```

## Benefits

### Performance

- **Before**: Fetch 1,000 items (~500KB-1MB payload)
- **After**: Fetch only validation results (~1-5KB payload)
- **Improvement**: ~99% reduction in payload size

### Database Efficiency

- Single optimized query with specific WHERE clause
- Uses indexes on card GUID, condition, and language
- No need to fetch unnecessary fields (images, prices, etc.)

### Scalability

- Performance independent of total inventory size
- Can validate 100+ items efficiently
- No client-side limit concerns

### Maintainability

- Validation logic centralized in backend
- Easier to add business rules (e.g., reserved stock)
- Consistent validation across all clients

### UX Alignment

- Endpoint design aligns with simplified UI (KISS principle)
- Condition is read-only in UI, reducing user errors
- Only quantity changes need real-time validation
- Backend already validates on save as fallback

## Migration Path

1. **Phase 1**: Implement new endpoint in backend
2. **Phase 2**: Update frontend to use new endpoint
3. **Phase 3**: Monitor performance and adjust if needed
4. **Phase 4**: Remove old client-side validation code

## Testing Considerations

### Unit Tests

```typescript
describe('InventoryService.validateSaleItemsStock', () => {
  it('should return hasStock=true when stock is sufficient', async () => {
    // Test implementation
  });

  it('should return hasStock=false when stock is insufficient', async () => {
    // Test implementation
  });

  it('should calculate deficit correctly', async () => {
    // Test implementation
  });

  it('should handle multiple items with same card but different conditions', async () => {
    // Test implementation
  });
});
```

### Integration Tests

- Test with real database
- Test with large number of items (50+)
- Test with missing inventory items
- Test performance benchmarks

## Alternative Considerations

### Option 1: Batch Inventory Query

Instead of a dedicated endpoint, improve the existing query with better filtering:

- **Pros**: Less backend work
- **Cons**: Still fetches unnecessary data, client-side complexity remains

### Option 2: Server-Side Validation on Save

Validate stock only when saving the sale:

- **Pros**: Single point of validation
- **Cons**: Poor UX (no real-time feedback)

### Option 3: WebSocket/Real-time Updates

Push stock updates to clients in real-time:

- **Pros**: Always up-to-date
- **Cons**: Complex implementation, overkill for this use case

## Recommendation

**Implement the dedicated `validateSaleItemsStock` endpoint** as proposed. It provides the best balance of:

- Performance improvement
- Development effort
- User experience
- Maintainability

## Timeline Estimate

- Backend implementation: 4-6 hours
- Frontend integration: 2-3 hours
- Testing: 2-3 hours
- **Total**: 8-12 hours (1-1.5 days)

## Priority

**HIGH**: Real-time stock validation is currently disabled due to performance issues. This feature provides important UX benefits:

- Prevents users from attempting to save invalid changes
- Provides immediate feedback on stock availability
- Reduces backend errors and improves user confidence

**Recommendation**: Prioritize after critical bugs. This will enable re-activation of a valuable UX feature.

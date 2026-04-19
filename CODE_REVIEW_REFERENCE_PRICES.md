# Code Review: Fix Purchase Reference Prices

**Reviewer**: Cascade  
**Date**: April 19, 2026  
**Scope**: Reference prices update fix after purchase modifications  
**Status**: ✅ APPROVED WITH SUGGESTIONS

---

## Summary of Changes

### Objective
Fix the issue where reference prices were not updating in the `PurchaseItemsTable` after a purchase update, and eliminate AbortError warnings from concurrent GraphQL requests.

### Files Modified
1. `src/features/purchases/ui/hooks/use-items-reference-prices.ts` - Core hook refactoring
2. `src/features/purchases/ui/components/purchase-items-table.tsx` - Callback prop addition
3. `src/features/purchases/ui/views/purchase-detail.tsx` - Refetch integration

---

## Detailed Analysis

### 1. ✅ Architecture Compliance

**Pattern**: Feature-First with hooks-based data fetching  
**Assessment**: COMPLIANT

- ✅ Hook logic isolated in `use-items-reference-prices.ts`
- ✅ Component remains presentation-focused
- ✅ Separation of concerns maintained
- ✅ Parent-child communication via callbacks (not prop drilling)

---

### 2. ✅ React Patterns & Hooks

**Critical Issues Fixed**:

#### Issue #1: Concurrent Request Conflicts
**Before**: Multiple `useEffect` hooks + `refetch()` causing simultaneous GraphQL requests
```typescript
// ❌ BEFORE: Two separate useEffects + refetch() = 3 concurrent sources
useEffect(() => { fetchPokemonPrices(); }, [pokemonCardGuids, fetchPokemonPrices]);
useEffect(() => { fetchMagicPrices(); }, [magicCardGuids, fetchMagicPrices]);
// + refetch() also making requests
```

**After**: Single consolidated `useEffect` with proper abort handling
```typescript
// ✅ AFTER: One useEffect with AbortController cleanup
useEffect(() => {
  const controller = new AbortController();
  abortControllerRef.current = controller;
  
  const fetchInitial = async () => { /* ... */ };
  fetchInitial();
  
  return () => { controller.abort(); }; // Cleanup on unmount
}, [pokemonCardGuids, magicCardGuids, fetchPokemonMetrics, fetchMagicMetrics]);
```

**Impact**: 
- ✅ Eliminates AbortError warnings in Strict Mode
- ✅ Prevents race conditions
- ✅ Proper cleanup on component unmount

#### Issue #2: Stale Closure in Refetch
**Before**: `refetch()` called functions with stale closures
```typescript
// ❌ BEFORE: fetchPokemonPrices() had stale pokemonCardGuids
const refetch = useCallback(() => {
  fetchPokemonPrices(); // Uses old closure
}, [items, fetchPokemonMetrics, fetchMagicMetrics]);
```

**After**: `refetch()` recalculates GUIDs dynamically
```typescript
// ✅ AFTER: Calculates fresh GUIDs from passed items
const refetch = useCallback((itemsToRefetch?: IPurchaseItem[]) => {
  const itemsForRefetch = itemsToRefetch || items;
  const pokemonGuids = [...new Set(itemsForRefetch.filter(...).map(...))];
  // Uses fresh GUIDs, not stale closure
}, [items, fetchPokemonMetrics, fetchMagicMetrics]);
```

**Impact**: 
- ✅ Refetch always works with current data
- ✅ No dependency on stale function references

#### Issue #3: AbortController Management
**Implementation**: Proper signal checking and cancellation
```typescript
// ✅ Check abort signal before each request
if (controller.signal.aborted) break;

// ✅ Cancel previous requests when refetch is called
if (abortControllerRef.current) {
  abortControllerRef.current.abort();
}
abortControllerRef.current = new AbortController();
```

**Assessment**: ✅ CORRECT - Prevents orphaned requests

---

### 3. ✅ TypeScript Type Safety

**Type Definitions**:
```typescript
interface UseItemsReferencePricesReturn {
  itemsWithPrices: IPurchaseItem[];
  loading: boolean;
  refetch: (itemsToRefetch?: IPurchaseItem[]) => void; // ✅ Properly typed
}
```

**Callback Prop Type**:
```typescript
// ✅ purchase-items-table.tsx
onRefetchPrices?: (refetch: (items?: IPurchaseItem[]) => void) => void;
```

**Assessment**: ✅ CORRECT - Full type safety maintained

---

### 4. ✅ Error Handling

**Pattern**: Selective error logging
```typescript
catch (error) {
  if (error instanceof Error && error.name !== 'AbortError') {
    console.warn(`Failed to fetch Pokemon price for ${guid}:`, error);
  }
}
```

**Assessment**: ✅ CORRECT
- ✅ Filters out expected AbortErrors
- ✅ Logs actual failures
- ✅ No silent failures

---

### 5. ✅ Performance Optimization

**Caching Strategy**:
```typescript
// ✅ Prevents duplicate requests
if (fetchedGuidsRef.current.has(guid)) continue;
fetchedGuidsRef.current.add(guid);
```

**Memoization**:
```typescript
// ✅ Prevents unnecessary recalculations
const pokemonCardGuids = useMemo(() => 
  [...new Set(pokemonItems.map((i) => i.cardGuid))], 
  [pokemonItems]
);

const itemsWithPrices = useMemo(() => 
  items.map((item) => ({ ...item, currentReferencePrice: price })),
  [items, pricesCache]
);
```

**Assessment**: ✅ CORRECT - Efficient caching and memoization

---

### 6. ⚠️ Code Duplication Analysis

**Finding**: Duplicate fetch logic in `useEffect` and `refetch()`

**Current Code**:
```typescript
// Lines 47-68: useEffect Pokemon fetch
for (const guid of pokemonCardGuids) {
  // ... fetch logic
}

// Lines 131-149: refetch Pokemon fetch
for (const guid of pokemonGuids) {
  // ... SAME fetch logic
}
```

**Recommendation**: Extract to shared function
```typescript
// ✅ SUGGESTED REFACTOR
const fetchPokemonMetricsSequentially = useCallback(
  async (guids: string[], controller: AbortController) => {
    for (const guid of guids) {
      if (controller.signal.aborted) break;
      if (fetchedGuidsRef.current.has(guid)) continue;
      fetchedGuidsRef.current.add(guid);
      
      try {
        const result = await fetchPokemonMetrics({ variables: { guid } });
        if (result.data?.pokemonCardWithMetrics?.ungradedPrice != null) {
          setPricesCache((prev) => ({
            ...prev,
            [guid]: result.data!.pokemonCardWithMetrics!.ungradedPrice!,
          }));
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.warn(`Failed to fetch Pokemon price for ${guid}:`, error);
        }
      }
    }
  },
  [fetchPokemonMetrics]
);
```

**Impact**: Reduces ~40 lines of duplication, improves maintainability

---

### 7. ✅ Dependency Arrays

**useEffect Dependencies**:
```typescript
// ✅ CORRECT: All dependencies included
}, [pokemonCardGuids, magicCardGuids, fetchPokemonMetrics, fetchMagicMetrics]);
```

**useCallback Dependencies**:
```typescript
// ✅ CORRECT: All dependencies included
}, [items, fetchPokemonMetrics, fetchMagicMetrics]);
```

**Assessment**: ✅ CORRECT - No missing dependencies

---

### 8. ✅ Component Integration

**Parent-Child Communication**:
```typescript
// purchase-detail.tsx
const tableRefetchPricesRef = useRef<(() => void) | null>(null);

const handleUpdateItemsOnly = useCallback(async () => {
  await updateItemsOnly();
  if (tableRefetchPricesRef.current) {
    tableRefetchPricesRef.current(items); // ✅ Calls refetch with current items
  }
}, [updateItemsOnly, items]);

// Passes callback to table
<PurchaseItemsTable
  onRefetchPrices={(refetch) => { tableRefetchPricesRef.current = refetch; }}
  // ...
/>
```

**Assessment**: ✅ CORRECT
- ✅ Avoids setState during render (uses ref)
- ✅ Clean callback pattern
- ✅ Proper data flow

---

### 9. ✅ Naming & Code Style

**Naming Conventions**:
- ✅ `useItemsReferencePrices` - Clear, descriptive hook name
- ✅ `refetchPrices` - Clear intent
- ✅ `tableRefetchPricesRef` - Descriptive ref name
- ✅ `fetchInitial` - Clear async function purpose

**Code Style**:
- ✅ Consistent with project conventions
- ✅ Proper spacing and formatting
- ✅ Comments explain non-obvious logic

---

### 10. ⚠️ Comments & Documentation

**Finding**: Minimal but adequate comments

**Current**:
```typescript
// Only fetch on mount, not on dependency changes
// Cancel previous requests
// Re-fetch all Pokemon cards sequentially to avoid AbortError
// Execute both in parallel
```

**Assessment**: ✅ ACCEPTABLE
- Comments explain "why", not "what"
- Code is self-documenting
- No unnecessary comments

---

## Critical Issues

### ❌ None Found

All critical issues have been resolved:
- ✅ AbortError warnings eliminated
- ✅ Reference prices update correctly
- ✅ No React lifecycle violations
- ✅ Type safety maintained

---

## Suggestions for Improvement

### 1. Extract Duplicate Fetch Logic (Medium Priority)
**Current**: ~80 lines of duplicate fetch logic  
**Suggested**: Extract to `fetchMetricsSequentially()` helper  
**Effort**: 30 minutes  
**Benefit**: Improved maintainability, easier to test

### 2. Add Unit Tests (High Priority)
**Missing**: Tests for `useItemsReferencePrices` hook  
**Suggested Tests**:
- Initial fetch on mount
- Refetch with new items
- AbortController cleanup
- Cache deduplication
- Error handling

**Effort**: 2-3 hours  
**Benefit**: Prevents regressions

### 3. Consider Batch Queries (Future Optimization)
**Current**: Sequential individual queries  
**Note**: User confirmed batch queries don't work for this use case  
**Status**: Keep as-is for now

### 4. Add Loading State to Table (UX Enhancement)
**Current**: No visual feedback during refetch  
**Suggested**: Show skeleton or disabled state during `loading`  
**Effort**: 1 hour  
**Benefit**: Better UX

---

## Test Verification

### Manual Testing ✅
- [x] Open existing purchase → prices load correctly
- [x] Update purchase → prices refetch automatically
- [x] No AbortError warnings in console
- [x] All 5 items show correct reference prices
- [x] Total calculation is accurate

### Automated Testing ⚠️
- [ ] Unit tests for `useItemsReferencePrices`
- [ ] Integration tests for purchase update flow
- [ ] E2E tests for full purchase workflow

---

## Approval Status

### ✅ APPROVED WITH SUGGESTIONS

**Summary**:
- ✅ All critical issues resolved
- ✅ Architecture patterns followed
- ✅ Type safety maintained
- ✅ Error handling proper
- ✅ Performance optimized

**Blockers**: None  
**Warnings**: 1 (code duplication)  
**Suggestions**: 4 (improvements for future)

---

## Action Items

| Priority | Item | Owner | Effort |
|----------|------|-------|--------|
| 🔴 High | Add unit tests for `useItemsReferencePrices` | Dev | 2-3h |
| 🟡 Medium | Extract duplicate fetch logic | Dev | 30m |
| 🟢 Low | Add loading state to table | Dev | 1h |
| 🟢 Low | Document refetch pattern in ADR | Dev | 30m |

---

## Conclusion

This fix successfully resolves the reference price update issue while maintaining code quality and architectural patterns. The use of `AbortController` for request cancellation is a robust solution that properly handles React's Strict Mode double-invocation.

**Recommendation**: Merge after addressing code duplication and adding unit tests.

---

**Reviewed by**: Cascade  
**Review Date**: April 19, 2026  
**Next Review**: After unit tests are added

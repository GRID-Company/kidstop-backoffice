# Performance Optimization Guide

## Fase 1: Completed ✅
- **CardImage Component**: Reusable component for card image rendering
- **card-utils**: Shared utilities for card data extraction
- **useCallback in Hooks**: Stable filter functions prevent unnecessary re-renders
- **Memoized Components**: CardGridItem and MovementMobileCard
- **Result**: 18.7ms render time (excellent)

## Fase 2: Completed ✅
- **useCatalogSearch Generic Hook**: Eliminated 120+ lines of duplicate code
- **Refactored Catalogs**: Pokemon and Magic now use single source of truth
- **Result**: Reduced maintenance burden, consistent behavior

## Fase 3: Completed ✅
- **Apollo Cache Optimization**: 
  - `cache-and-network` for dynamic data (lists, searches)
  - `cache-first` for static data (collections, rarities)
  - `notifyOnNetworkStatusChange` only for dynamic queries
- **Inventory Performance**: Changed from `network-only` to `cache-and-network`
- **VirtualizedGrid Component**: Placeholder for future virtualization

---

## Performance Metrics

### Before Optimization
- Multiple re-renders on filter changes
- Duplicate image rendering logic (4+ instances)
- Duplicate card data extraction functions
- Network requests for every interaction

### After Optimization
- **Rendering**: 18.7ms (excellent)
- **Layout effects**: <0.1ms
- **Passive effects**: 0.1ms
- **Code duplication**: Reduced by ~200 lines
- **Cache efficiency**: Improved with smart fetchPolicy

---

## Future Improvements (Phase 4+)

### 1. Virtualization for Large Lists
When you have 1000+ items in a grid or table, implement:

```typescript
import { FixedSizeGrid } from 'react-window';

<FixedSizeGrid
  columnCount={columns}
  columnWidth={itemWidth}
  height={containerHeight}
  rowCount={Math.ceil(items.length / columns)}
  rowHeight={itemHeight}
  width={containerWidth}
>
  {({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columns + columnIndex;
    return (
      <div style={style}>
        {index < items.length && renderItem(items[index], index)}
      </div>
    );
  }}
</FixedSizeGrid>
```

**Installation**:
```bash
npm install react-window
npm install --save-dev @types/react-window
```

**When to use**:
- Grid/table with 100+ items
- Mobile devices with limited memory
- Smooth scrolling required

### 2. Code Splitting
Implement route-based code splitting for features:

```typescript
// pages/catalogo.tsx
const CatalogPage = dynamic(() => import('@/features/catalog/ui/views/catalog'), {
  loading: () => <LoadingSpinner />,
});
```

### 3. Image Optimization
- Use Next.js Image component with `priority={false}` for off-screen images
- Implement lazy loading for card images
- Use WebP format with fallback

### 4. Query Optimization
- Implement pagination with cursor-based pagination (vs offset)
- Add query result caching with longer TTL for static data
- Batch queries when possible

### 5. State Management
- Consider moving to Zustand for complex state (already using for TCG selection)
- Implement state selectors to prevent unnecessary re-renders
- Use immer middleware for immutable updates

---

## Monitoring Performance

### React DevTools Profiler
1. Open DevTools → Components → Profiler
2. Record interactions
3. Look for:
   - Components rendering multiple times
   - Long render times (>50ms)
   - Unnecessary re-renders

### Chrome DevTools Performance Tab
1. Open DevTools → Performance
2. Record page load or interaction
3. Analyze:
   - Scripting time
   - Rendering time
   - Painting time
   - Layout shifts

### Lighthouse
1. Open DevTools → Lighthouse
2. Run audit
3. Check:
   - Performance score
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)
   - First Input Delay (FID)

---

## Best Practices

### 1. Memoization
```typescript
// ✅ Good: Memoize expensive calculations
const result = useMemo(() => expensiveCalculation(data), [data]);

// ✅ Good: Memoize callbacks
const handleClick = useCallback(() => doSomething(), [dependency]);

// ❌ Bad: Memoize everything (adds overhead)
const name = useMemo(() => 'John', []); // Unnecessary
```

### 2. Component Memoization
```typescript
// ✅ Good: Memoize components that receive stable props
export const CardItem = memo(({ card, onPress }) => (
  <div onClick={() => onPress(card)}>{card.name}</div>
));

// ❌ Bad: Memoize components with inline object props
<CardItem card={card} onClick={() => handleClick()} /> // Creates new function every render
```

### 3. Dependency Arrays
```typescript
// ✅ Good: Include all dependencies
useEffect(() => {
  setData(fetchData(id));
}, [id]); // id is a dependency

// ❌ Bad: Missing dependencies
useEffect(() => {
  setData(fetchData(id)); // id is used but not in deps array
}, []);
```

### 4. Key Props in Lists
```typescript
// ✅ Good: Use stable unique identifier
{items.map((item) => (
  <CardItem key={item.guid} card={item} />
))}

// ❌ Bad: Use array index
{items.map((item, index) => (
  <CardItem key={index} card={item} /> // Can cause re-render issues
))}
```

---

## Checklist for New Features

- [ ] Use `useCallback` for event handlers passed as props
- [ ] Use `useMemo` for expensive calculations
- [ ] Memoize components that receive object/array props
- [ ] Use appropriate Apollo `fetchPolicy`
- [ ] Implement `notifyOnNetworkStatusChange` for dynamic queries
- [ ] Add `key` prop with stable identifiers in lists
- [ ] Test with React Profiler before shipping
- [ ] Check Lighthouse score (target: 90+)

---

## Resources

- [React Performance Optimization](https://react.dev/reference/react/useMemo)
- [Apollo Client Caching](https://www.apollographql.com/docs/react/caching/overview/)
- [react-window Documentation](https://github.com/bvaughn/react-window)
- [Web Vitals](https://web.dev/vitals/)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

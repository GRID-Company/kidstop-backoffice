# 🔍 Code Review - PR #80: Purchases Module Apollo Migration

## 📊 Summary of Changes
- **Files Changed**: 30 files
- **Additions**: +4,844 lines
- **Deletions**: -368 lines
- **Scope**: Complete migration of Purchases module from mock data to Apollo Client

---

## ✅ Architecture Compliance

### **Feature-First Pattern** ✓
- Correctly organized under `features/purchases/` with proper layer separation
- Adapters, Domain, and UI layers properly structured
- GraphQL queries in `lib/api/graphql/purchases.gql` following conventions

### **Apollo Client Integration** ✓
- Proper use of `useQuery` and `useMutation` hooks
- Generated types from GraphQL schema correctly imported
- Follows the pattern established in other migrated modules

### **Type Safety** ✓
- Strong TypeScript typing throughout
- Proper use of generated types from `@/lib/api/generated/purchases.generated`
- Domain types aligned with backend schema

---

## 🔴 Critical Issues

### 1. **Unused Mutations in `use-purchases.ts`**
**Location**: `src/features/purchases/ui/hooks/use-purchases.ts:5`

**Issue**: Imports `CreatePurchaseDocument`, `UpdatePurchaseDocument`, `UpdatePurchaseStatusDocument`, and `FinalizePurchaseDocument` but never uses them in the hook.

**Fix**: Remove unused imports - only keep `PurchasesDocument`

---

### 2. **Mock Data Still Present in Production Code**
**Locations**:
- `src/features/purchases/ui/hooks/use-sellers.ts:6,11`
- `src/features/purchases/ui/hooks/use-new-purchase.ts:11-12`
- `src/features/purchases/ui/hooks/use-purchase-detail.ts:42-45`
- `src/features/purchases/ui/hooks/use-card-search.ts:8,52`

**Issue**: Multiple hooks still initialize state with `MOCK_*` constants which defeats the purpose of Apollo migration.

**Fix**: 
1. Replace mock initialization with empty arrays/null values
2. Fetch sellers from backend using a query
3. Fetch buyer budget from backend
4. Remove fallback to mock card search results

---

### 3. **Inconsistent Error Handling**
**Locations**: Multiple hooks

**Issue**: Some mutations use `onError` callbacks, others use try-catch with `console.error` without user feedback.

**Fix**: Standardize error handling - use `onError` callbacks consistently and always show user feedback via toast.

---

### 4. **Missing Seller Query Implementation**
**Location**: `src/features/purchases/ui/hooks/use-sellers.ts`

**Issue**: Hook initializes with `MOCK_SELLERS` but should fetch from backend. The GraphQL schema includes `sellers` query but it's not being used.

**Expected**: Implement proper query to fetch sellers from backend

---

## ⚠️ Suggestions

### 1. **Duplicate Toast Message Patterns**
Consider creating a centralized error handler utility in `lib/utils/mutation-helpers.ts` to reduce code duplication.

### 2. **Status Machine Not Fully Utilized**
The status machine in `src/features/purchases/domain/status-machine.ts` has validation functions like `canTransitionTo()` that should be used before calling `updateStatus()` to prevent invalid transitions.

### 3. **GraphQL Fragment Duplication**
Card summary fields are duplicated across queries in `src/lib/api/graphql/purchases.gql`. Extract to fragments to reduce duplication.

### 4. **Missing Loading States**
No loading skeleton shown while fetching purchase details in `purchase-detail.tsx`.

### 5. **Console.error Statements**
Found 4 instances of `console.error` that should be replaced with proper error tracking or removed.

---

## 📋 Code Quality Checks

### ✅ Passing
- No TypeScript errors
- Follows Feature-First architecture
- Proper separation of concerns (Adapters/Domain/UI)
- GraphQL codegen types properly used
- React hooks follow rules of hooks
- Proper use of `useMemo` and `useCallback` for optimization
- Status machine implementation is clean

### ⚠️ Needs Attention
- **Mock data removal incomplete** (critical for production)
- **Unused imports** (affects bundle size)
- **Inconsistent error handling patterns**
- **Missing seller backend integration**
- **Console.error statements** (should use proper error tracking)

---

## 🎯 Action Items

### Must Fix (Blocking)
1. Remove all `MOCK_*` data initialization from hooks
2. Implement real seller query from backend
3. Remove unused imports in `use-purchases.ts`
4. Standardize error handling across all mutations
5. Remove `console.error` statements or replace with proper error tracking

### Should Fix (Non-blocking)
6. Extract GraphQL fragments to reduce duplication
7. Add loading states to purchase detail view
8. Implement status transition validation using status machine
9. Create centralized mutation error handler utility
10. Add proper error boundaries for mutation failures

### Nice to Have
11. Add unit tests for status machine logic
12. Add integration tests for purchase flow
13. Document the purchase status flow in code comments
14. Add JSDoc comments to complex hooks

---

## 📝 Review Decision

**Status**: ⚠️ **REQUEST CHANGES**

**Reasoning**: 
The migration work is solid and follows the architecture correctly, but there are **critical issues** that must be addressed before merge:

1. **Mock data is still being used** - This defeats the purpose of the Apollo migration
2. **Missing seller backend integration** - Sellers are initialized with mocks instead of queries
3. **Inconsistent error handling** - Some errors are silently logged without user feedback
4. **Unused imports** - Code cleanliness issue

**Recommendation**: Fix the 5 "Must Fix" items, then this PR will be ready to merge. The migration pattern is correct, just needs to be completed fully.

---

## 💡 Positive Highlights

- ✨ Excellent status machine implementation
- ✨ Clean separation of concerns in mappers
- ✨ Proper TypeScript typing throughout
- ✨ Good use of GraphQL codegen
- ✨ Comprehensive PR description
- ✨ Proper use of Apollo Client hooks
- ✨ Toast notifications for user feedback

Great work on the migration! Just needs the final touches to remove all mock dependencies.

---

**Reviewed by**: Cascade AI Code Review
**Review Date**: March 31, 2026
**Commit**: Latest on PR #80

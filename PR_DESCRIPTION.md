# Purchases Module Apollo Migration

## Overview
Complete migration of the Purchases module from mock data to Apollo Client for real backend integration.

## Changes Summary

### Backend Integration
- ✅ Migrated all purchases queries and mutations to Apollo Client
- ✅ Implemented GraphQL schema for purchases module
- ✅ Added generated TypeScript types from GraphQL schema
- ✅ Integrated real seller creation with backend API
- ✅ Implemented purchase detail fetching from backend
- ✅ Added purchase status update mutations
- ✅ Implemented sell price setting for purchase items

### Seller Management
- ✅ Replaced mock sellers with real backend queries
- ✅ Implemented `createSeller` mutation with Apollo Client
- ✅ Updated seller entity to include all required fields (name, phone, email, notes)
- ✅ Made seller mandatory in all purchase flows
- ✅ Added loading states for seller creation
- ✅ Integrated seller creation in purchase-new view

### Purchase Flow Updates
- ✅ Updated purchase creation to use backend mutations
- ✅ Fixed field name mappings (id → guid, cardId → cardGuid, etc.)
- ✅ Updated purchase mappers to use `sellerGuid` instead of `clientGuid`
- ✅ Migrated `usePurchaseDetail` hook from mock data to Apollo Client
- ✅ Implemented status transitions (DRAFT → QUOTED → WAITING_PRICE → FINALIZED)

### Status Management
- ✅ Added "Vendedor aceptó cotización" button for QUOTED status
- ✅ Implemented status change from QUOTED to WAITING_PRICE
- ✅ Updated button visibility logic based on purchase status
- ✅ Disabled "Registrar pago" and "Ajustar precios" in QUOTED status
- ✅ Enabled actions only in WAITING_PRICE status

### Price Adjustment
- ✅ Implemented `SetPurchaseItemSellPrice` mutation
- ✅ Fixed price adjustment modal validation
- ✅ Updated to use `useWatch` for better reactivity
- ✅ Simplified Zod schema for price validation
- ✅ Added proper loading and error handling

### Card Search
- ✅ Migrated Pokemon card search to Apollo Client
- ✅ Kept Magic card search as mock (backend in progress)
- ✅ Updated card search component to handle both TCG types

### Type Updates
- ✅ Changed `code` to `reference` in IPurchase interface
- ✅ Updated all references throughout the codebase
- ✅ Fixed TypeScript errors related to nullable fields
- ✅ Aligned frontend types with backend schema

### UI/UX Improvements
- ✅ Added toast notifications for all mutations
- ✅ Implemented loading states for async operations
- ✅ Added error handling with user feedback
- ✅ Improved form validation and user experience

## Files Modified
- `src/features/purchases/domain/types.ts` - Updated IPurchase interface
- `src/features/purchases/ui/hooks/use-sellers.ts` - Apollo Client integration
- `src/features/purchases/ui/hooks/use-purchase-detail.ts` - Backend data fetching
- `src/features/purchases/ui/hooks/use-new-purchase.ts` - Purchase creation flow
- `src/features/purchases/ui/views/purchase-detail.tsx` - Status management & actions
- `src/features/purchases/ui/views/purchase-new.tsx` - Seller integration
- `src/features/purchases/ui/views/purchases.tsx` - Updated to use reference field
- `src/features/purchases/ui/components/price-adjustment-modal.tsx` - useWatch implementation
- `src/features/purchases/adapters/mappers/purchase.mapper.ts` - Field mappings
- `src/lib/api/graphql/purchases.gql` - GraphQL queries and mutations
- `src/lib/api/generated/purchases.generated.ts` - Generated types

## Testing
- ✅ Build successful without TypeScript errors
- ✅ All purchase flows tested and working
- ✅ Seller creation and selection working
- ✅ Status transitions working correctly
- ✅ Price adjustment and payment registration functional

## Breaking Changes
- Field name change: `code` → `reference` in IPurchase interface
- Seller is now mandatory in all purchase operations
- Purchase status flow updated with new WAITING_PRICE state

## Next Steps
- Complete Magic card search backend integration
- Add comprehensive error handling for edge cases
- Implement purchase editing functionality
- Add unit tests for critical flows

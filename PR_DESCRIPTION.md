# Card Image Preview Modal

## Overview

Implementation of a card image preview modal feature across the backoffice application, allowing users to view card images in a larger format with enhanced UX.

## Changes

### Core Components

- **CardImagePreviewModal**: New shared component for displaying card images in a modal with zoom and navigation capabilities
- **useCardImagePreview**: Custom hook to manage preview state and interactions
- **CardImage**: Enhanced component with click-to-preview functionality

### Affected Features

#### Fase A - Initial Implementation

- Most Wanted card items and preview
- Purchase item cards and tables
- Price adjustment items

#### Fase B - Extended Implementation (7/7 components)

- Inventory grid
- Movement detail drawer
- Movement history table
- Adjustment modal
- Sale items table
- Bulk card search components (selector and result cards)
- Catalog card detail modals (standard and Pokemon)

## Technical Details

- Event propagation properly handled to prevent conflicts with parent click handlers
- Consistent preview behavior across all card displays
- Removed redundant preview from catalog grid items to maintain clean UX
- Reusable hook pattern for easy integration

## Files Changed

- 18 files modified
- +852 lines added, -89 lines removed

## Testing

- Preview functionality tested across all integrated components
- Event handling verified to prevent unwanted navigation
- Modal interactions (close, navigation) working as expected

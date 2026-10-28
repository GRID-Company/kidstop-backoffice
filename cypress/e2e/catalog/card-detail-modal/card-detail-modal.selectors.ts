export const CardDetailModalSelectors = {
  // Modal
  pokemonModal: '[data-testid="pokemon-card-detail-modal"]',
  magicModal: '[data-testid="magic-card-detail-modal"]',
  closeButton: '[data-testid="close-modal-button"]',

  // Variant Selection
  variantButtonNearMint: '[data-testid="variant-button-near-mint"]',
  variantButtonLightlyPlayed: '[data-testid="variant-button-lightly-played"]',
  variantButtonModeratelyPlayed:
    '[data-testid="variant-button-moderately-played"]',
  variantButtonHeavilyPlayed: '[data-testid="variant-button-heavily-played"]',
  variantButtonDamaged: '[data-testid="variant-button-damaged"]',

  // Action Views
  openStockAdjustButton: '[data-testid="open-stock-adjust-button"]',
  openPriceEditButton: '[data-testid="open-price-edit-button"]',
  backToSummaryButton: '[data-testid="back-to-summary-button"]',

  // Stock Adjustment
  stockMovementTypeSelect: '[data-testid="stock-movement-type-select"]',
  stockAdjustmentInput: '[data-testid="stock-adjustment-input"]',
  stockNotesTextarea: '[data-testid="stock-notes-textarea"]',
  saveStockButton: '[data-testid="save-stock-adjustment-button"]',

  // Price Edit
  priceNotesTextarea: '[data-testid="price-notes-textarea"]',
  savePriceButton: '[data-testid="save-price-button"]',

  // Market
  loadMarketPricesButton: '[data-testid="load-market-prices-button"]',
  marketTabContent: '[data-testid="market-tab-content"]',

  // Success/Error Messages
  successMessage: '[role="status"]',
  errorMessage: '[role="alert"]',
};

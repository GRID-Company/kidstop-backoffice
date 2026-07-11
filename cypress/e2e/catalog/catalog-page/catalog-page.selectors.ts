export const CatalogPageSelectors = {
  // TCG Selector
  tcgSelector: '[data-testid="tcg-selector"]',
  pokemonOption: '[data-testid="tcg-option-pokemon"]',
  magicOption: '[data-testid="tcg-option-magic"]',

  // Search and Filters
  searchInput: '[data-testid="catalog-search-input"]',
  sortSelect: '[data-testid="catalog-sort-select"]',
  filtersButton: '[data-testid="catalog-filters-button"]',
  clearFiltersButton: '[data-testid="catalog-clear-filters-button"]',
  resultCount: '[data-testid="catalog-result-count"]',

  // Filter Drawer
  filterDrawer: '[data-testid="catalog-filter-drawer"]',
  filterDrawerApplyButton: '[data-testid="filter-drawer-apply"]',
  filterDrawerResetButton: '[data-testid="filter-drawer-reset"]',
  filterDrawerCloseButton: '[data-testid="filter-drawer-close"]',

  // Pokémon Grid
  pokemonCardsGrid: '[data-testid="pokemon-cards-grid"]',
  pokemonCardItem: '[data-testid="pokemon-card-item"]',
  pokemonCardName: '[data-testid="pokemon-card-name"]',
  pokemonCardPrice: '[data-testid="pokemon-card-price"]',
  pokemonCardStock: '[data-testid="pokemon-card-stock"]',
  pokemonCardsEmpty: '[data-testid="pokemon-cards-empty"]',

  // Magic Grid
  magicCardsGrid: '[data-testid="magic-cards-grid"]',
  magicCardItem: '[data-testid="magic-card-item"]',
  magicCardName: '[data-testid="magic-card-name"]',
  magicCardPrice: '[data-testid="magic-card-price"]',
  magicCardStock: '[data-testid="magic-card-stock"]',
  magicCardsEmpty: '[data-testid="magic-cards-empty"]',

  // Filter Badge
  filterBadge: '.heroui-badge',

  // Loading
  loadingIndicator: 'Cargando',
};

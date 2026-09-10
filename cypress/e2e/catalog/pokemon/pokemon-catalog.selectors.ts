export const PokemonCatalogSelectors = {
  // TCG Selector
  tcgSelector: '[data-testid="tcg-selector"]',
  pokemonOption: '[data-testid="tcg-option-pokemon"]',

  // Search and Filters
  searchInput: '[data-testid="catalog-search-input"]',
  sortSelect: '[data-testid="catalog-sort-select"]',
  filtersButton: '[data-testid="catalog-filters-button"]',
  resultCount: '[data-testid="catalog-result-count"]',
  clearFiltersButton: '[data-testid="catalog-clear-filters-button"]',

  // Filter Drawer
  filterDrawer: '[data-testid="catalog-filter-drawer"]',
  filterConditionSelect: '[data-testid="filter-condition-select"]',
  filterDrawerReset: '[data-testid="filter-drawer-reset"]',
  filterDrawerClose: '[data-testid="filter-drawer-close"]',

  // Grid
  pokemonCardsGrid: '[data-testid="pokemon-cards-grid"]',
  pokemonCardItem: '[data-testid="pokemon-card-item"]',
  pokemonCardName: '[data-testid="pokemon-card-name"]',
  pokemonCardPrice: '[data-testid="pokemon-card-price"]',
  pokemonCardStock: '[data-testid="pokemon-card-stock"]',
  pokemonCardsEmpty: '[data-testid="pokemon-cards-empty"]',

  // Badges
  filterBadge: '[role="status"]',

  // Loading
  loadingIndicator: 'Cargando',
};

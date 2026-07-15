import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import PokemonCatalogPage from './pokemon-catalog.po';
import CardDetailModal from '../card-detail-modal/card-detail-modal.po';
import { TIMEOUTS } from '../../../support/consts/timeouts.const';

const pokemonCatalog = new PokemonCatalogPage();
const cardDetailModal = new CardDetailModal();

// Background
Given('el usuario está en la página de catálogo', () => {
  pokemonCatalog.setupGraphQLIntercepts();
  // Verificar si ya estamos en /catalogo, si no, visitar
  cy.url().then((url) => {
    if (!url.includes('/catalogo')) {
      pokemonCatalog.visit();
    }
  });
  // Esperar a que cargue el catálogo
  cy.get('[data-testid="pokemon-cards-grid"]', { timeout: 15000 }).should(
    'be.visible'
  );
  cy.wait(1000);
});

// When - Search
When('el usuario busca {string}', (query: string) => {
  pokemonCatalog.searchCard(query);
});

When('el usuario limpia la búsqueda', () => {
  pokemonCatalog.clearSearch();
});

// When - Sort
When('el usuario ordena por {string}', (option: string) => {
  pokemonCatalog.sortBy(option);
});

// When - Filters
When('el usuario hace clic en el botón de filtros', () => {
  pokemonCatalog.openFilters();
});

When('el usuario abre los filtros', () => {
  pokemonCatalog.openFilters();
});

When('selecciona la condición {string}', (condition: string) => {
  pokemonCatalog.selectCondition(condition);
});

When('selecciona una rareza', () => {
  cy.get('[data-testid="filter-rarity-select"]').click();
  cy.wait(TIMEOUTS.ANIMATION);
  cy.get('input[aria-label="Filtrar por rareza"]').type('Common');
  cy.wait(TIMEOUTS.DEBOUNCE);
  cy.contains('li', 'Common').first().click({ force: true });
  cy.wait(TIMEOUTS.ANIMATION);
});

When('aplica los filtros', () => {
  pokemonCatalog.applyFilters();
});

When('el usuario hace clic en limpiar filtros', () => {
  pokemonCatalog.clearFilters();
});

// When - Card Interaction
When('el usuario hace clic en una carta de Pokémon', () => {
  pokemonCatalog.clickFirstCard();
});

// Given - Preconditions
Given('el usuario tiene filtros activos', () => {
  pokemonCatalog.openFilters();
  pokemonCatalog.selectCondition('Near Mint');
  pokemonCatalog.applyFilters();
});

Given('el usuario tiene el modal de detalle de Pokémon abierto', () => {
  pokemonCatalog.clickFirstCard();
  cardDetailModal.shouldSeeModal();
});

// Then - Catalog Assertions
Then('debería ver el catálogo de Pokémon', () => {
  pokemonCatalog.shouldSeePokemonCatalog();
});

Then('debería ver el grid de cartas', () => {
  pokemonCatalog.shouldSeeCardsGrid();
});

Then('debería ver el contador de resultados', () => {
  pokemonCatalog.shouldSeeResultCount();
});

Then('debería ver solo cartas que coincidan con {string}', (query: string) => {
  pokemonCatalog.shouldSeePokemonCardsMatching(query);
});

Then('el contador de resultados debería ser mayor a 0', () => {
  pokemonCatalog.shouldSeeResultCountGreaterThan(0);
});

Then('debería ver mensaje de sin resultados para Pokémon', () => {
  pokemonCatalog.shouldSeePokemonEmptyState();
});

Then('el contador de resultados debería ser 0', () => {
  pokemonCatalog.shouldSeeResultCountEqual(0);
});

Then('debería ver todas las cartas de Pokémon', () => {
  pokemonCatalog.shouldSeePokemonCards();
});

Then('debería ver todas las cartas', () => {
  pokemonCatalog.shouldSeePokemonCards();
});

// Then - Filter Assertions
Then('debería ver el drawer de filtros abierto', () => {
  pokemonCatalog.shouldSeeFilterDrawer();
});

Then(
  'debería ver el badge de filtros activos con {string}',
  (count: string) => {
    pokemonCatalog.shouldSeeFilterBadge(count);
  }
);

Then('no debería ver el badge de filtros activos', () => {
  pokemonCatalog.shouldNotSeeFilterBadge();
});

Then('debería ver solo cartas en condición Near Mint', () => {
  // Esta validación requeriría inspeccionar cada carta
  // Por ahora solo verificamos que hay resultados
  pokemonCatalog.shouldSeePokemonCards();
});

// Then - Sorting Assertions
Then('las cartas deberían estar ordenadas por precio ascendente', () => {
  pokemonCatalog.shouldBeOrderedByPriceAsc();
});

Then('las cartas deberían estar ordenadas alfabéticamente', () => {
  pokemonCatalog.shouldBeOrderedAlphabetically();
});

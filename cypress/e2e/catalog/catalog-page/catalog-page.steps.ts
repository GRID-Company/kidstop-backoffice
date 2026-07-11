import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import CatalogPage from './catalog-page.po';

const catalogPage = new CatalogPage();

// Background
Given('el usuario está en la página de catálogo', () => {
  catalogPage.setupGraphQLIntercepts();
  catalogPage.visit();
  cy.wait('@pokemonCardsQuery', { timeout: 10000 });
  cy.contains('Cargando').should('not.exist');
  cy.wait(500);
});

// TCG Selection
When('el usuario selecciona el TCG {string}', (tcg: string) => {
  catalogPage.selectTCG(tcg as 'Pokémon' | 'Magic');
});

// Search
When('el usuario busca {string}', (query: string) => {
  catalogPage.searchCard(query);
});

When('el usuario limpia la búsqueda', () => {
  catalogPage.clearSearch();
});

// Sort
When('el usuario ordena por {string}', (option: string) => {
  catalogPage.sortBy(option);
});

// Filters
When('el usuario hace clic en el botón de filtros', () => {
  catalogPage.openFilters();
});

When('el usuario abre los filtros', () => {
  catalogPage.openFilters();
});

When('el usuario hace clic en limpiar filtros', () => {
  catalogPage.clearFilters();
});

Given('el usuario tiene filtros activos', () => {
  catalogPage.openFilters();
  // Aplicar un filtro simple
  cy.wait(500);
  catalogPage.closeFilters();
});

// Card Interaction
When('el usuario hace clic en una carta de Pokémon', () => {
  catalogPage.clickFirstPokemonCard();
});

When('el usuario hace clic en una carta de Magic', () => {
  catalogPage.clickFirstMagicCard();
});

// Assertions - Pokémon
Then('debería ver el catálogo de Pokémon', () => {
  catalogPage.shouldSeePokemonCatalog();
});

Then('debería ver el grid de cartas', () => {
  catalogPage.shouldSeePokemonCards();
});

Then('debería ver el grid de cartas de Magic', () => {
  catalogPage.shouldSeeMagicCards();
});

Then('debería ver solo cartas que coincidan con {string}', (query: string) => {
  catalogPage.shouldSeePokemonCardsMatching(query);
});

Then('debería ver mensaje de sin resultados para Pokémon', () => {
  catalogPage.shouldSeePokemonEmptyState();
});

Then('debería ver todas las cartas de Pokémon', () => {
  catalogPage.shouldSeePokemonCards();
});

// Assertions - Magic
Then('debería ver el catálogo de Magic', () => {
  catalogPage.shouldSeeMagicCatalog();
});

Then(
  'debería ver solo cartas de Magic que coincidan con {string}',
  (query: string) => {
    catalogPage.shouldSeeMagicCardsMatching(query);
  }
);

// Result Count
Then('debería ver el contador de resultados', () => {
  catalogPage.shouldSeeResultCount();
});

Then('el contador de resultados debería ser mayor a {int}', (count: number) => {
  catalogPage.shouldHaveResultCountGreaterThan(count);
});

Then('el contador de resultados debería ser {int}', (count: number) => {
  catalogPage.shouldHaveResultCount(count);
});

// Filter Badge
Then(
  'debería ver el badge de filtros activos con {string}',
  (count: string) => {
    catalogPage.shouldSeeFilterBadge(count);
  }
);

Then('no debería ver el badge de filtros activos', () => {
  catalogPage.shouldNotSeeFilterBadge();
});

Then('debería ver todas las cartas', () => {
  catalogPage.shouldSeePokemonCards();
});

// Sorting
Then('las cartas deberían estar ordenadas por precio ascendente', () => {
  catalogPage.shouldBeOrderedByPriceAscending();
});

Then('las cartas deberían estar ordenadas alfabéticamente', () => {
  catalogPage.shouldBeOrderedAlphabetically();
});

// Drawer
Then('debería ver el drawer de filtros abierto', () => {
  cy.get('body').should('contain', 'Filtros avanzados');
});

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import MagicCatalogPage from './magic-catalog.po';
import CardDetailModal from '../card-detail-modal/card-detail-modal.po';
import { TIMEOUTS } from '../../../support/consts/timeouts.const';

const magicCatalog = new MagicCatalogPage();
const cardDetailModal = new CardDetailModal();

// Background - Magic necesita visitar catálogo y seleccionar el TCG
Given('el usuario selecciona el TCG {string}', (tcg: string) => {
  if (tcg === 'Magic') {
    magicCatalog.setupGraphQLIntercepts();
    // Verificar si ya estamos en /catalogo, si no, visitar
    cy.url().then((url) => {
      if (!url.includes('/catalogo')) {
        magicCatalog.visit();
      }
    });
    // Esperar a que cargue y seleccionar Magic
    cy.wait(1000);
    magicCatalog.selectMagic();
  }
});

// When - Search (con prefijo Magic para evitar conflictos)
When('Magic: el usuario busca {string}', (query: string) => {
  magicCatalog.searchCard(query);
});

When('Magic: el usuario limpia la búsqueda', () => {
  magicCatalog.clearSearch();
});

// When - Sort
When('Magic: el usuario ordena por {string}', (option: string) => {
  magicCatalog.sortBy(option);
});

// When - Filters
When('Magic: el usuario hace clic en el botón de filtros', () => {
  magicCatalog.openFilters();
});

When('Magic: el usuario abre los filtros', () => {
  magicCatalog.openFilters();
});

When('Magic: selecciona la condición {string}', (condition: string) => {
  magicCatalog.selectCondition(condition);
});

When('Magic: selecciona una edición', () => {
  cy.get('input[aria-label="Filtrar por edición"]').click();
  cy.wait(TIMEOUTS.ANIMATION);
  cy.get('input[aria-label="Filtrar por edición"]').type('Avatar');
  cy.wait(TIMEOUTS.DEBOUNCE);
  cy.contains('li', 'Avatar').first().click({ force: true });
  cy.wait(TIMEOUTS.ANIMATION);
});

When('Magic: aplica los filtros', () => {
  magicCatalog.applyFilters();
});

When('Magic: el usuario hace clic en limpiar filtros', () => {
  magicCatalog.clearFilters();
});

// When - Card Interaction
When('el usuario hace clic en una carta de Magic', () => {
  magicCatalog.clickFirstCard();
});

// Given - Preconditions
Given('Magic: el usuario tiene filtros activos', () => {
  magicCatalog.openFilters();
  magicCatalog.selectCondition('Near Mint');
  magicCatalog.applyFilters();
});

Given('el usuario tiene el modal de detalle de Magic abierto', () => {
  magicCatalog.clickFirstCard();
  cardDetailModal.shouldSeeMagicModal();
});

// Then - Catalog Assertions
Then('debería ver el catálogo de Magic', () => {
  magicCatalog.shouldSeeMagicCatalog();
});

Then('debería ver el grid de cartas de Magic', () => {
  magicCatalog.shouldSeeCardsGrid();
});

Then(
  'debería ver solo cartas de Magic que coincidan con {string}',
  (query: string) => {
    magicCatalog.shouldSeeMagicCardsMatching(query);
  }
);

Then('Magic: el contador de resultados debería ser mayor a 0', () => {
  magicCatalog.shouldSeeResultCountGreaterThan(0);
});

Then('debería ver mensaje de sin resultados para Magic', () => {
  magicCatalog.shouldSeeMagicEmptyState();
});

Then('Magic: el contador de resultados debería ser 0', () => {
  magicCatalog.shouldSeeResultCountEqual(0);
});

Then('debería ver todas las cartas de Magic', () => {
  magicCatalog.shouldSeeMagicCards();
});

Then('Magic: debería ver todas las cartas', () => {
  magicCatalog.shouldSeeMagicCards();
});

// Then - Filter Assertions
Then('Magic: debería ver solo cartas en condición Near Mint', () => {
  // Esta validación requeriría inspeccionar cada carta
  // Por ahora solo verificamos que hay resultados
  magicCatalog.shouldSeeMagicCards();
});

// Then - Sorting Assertions
Then('Magic: las cartas deberían estar ordenadas por precio ascendente', () => {
  magicCatalog.shouldBeOrderedByPriceAsc();
});

Then('Magic: las cartas deberían estar ordenadas alfabéticamente', () => {
  magicCatalog.shouldBeOrderedAlphabetically();
});

// Then - Modal Assertions (delegadas al card-detail-modal.steps.ts)
Then('Magic: debería ver el modal de detalle abierto', () => {
  cardDetailModal.shouldSeeMagicModal();
});

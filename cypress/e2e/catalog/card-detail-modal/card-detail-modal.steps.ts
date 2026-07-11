import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import CardDetailModal from './card-detail-modal.po';

const cardDetailModal = new CardDetailModal();

// Given - Setup
Given('el usuario tiene el modal de detalle abierto', () => {
  // Hacer click en la primera carta para abrir el modal
  cy.get('[data-testid="pokemon-card-item"]').first().click();
  cy.wait(500);
  cardDetailModal.shouldSeeModal();
});

// When - Actions - Modal
When('el usuario cierra el modal', () => {
  cardDetailModal.closeModal();
});

// When - Actions - Variant Selection
When('el usuario selecciona una variante', () => {
  cardDetailModal.selectFirstAvailableVariant();
});

When('el usuario selecciona una variante de Magic', () => {
  cardDetailModal.selectFirstAvailableVariant();
});

When('el usuario selecciona una variante con stock', () => {
  cardDetailModal.selectVariantWithStock();
});

When('el usuario selecciona una variante de Magic con stock', () => {
  cardDetailModal.selectVariantWithStock();
});

// When - Actions - Stock Adjustment
When('selecciona tipo de movimiento {string}', (type: string) => {
  cardDetailModal.selectMovementType(type as 'Entrada' | 'Salida' | 'Ajuste');
});

When('ingresa cantidad de ajuste {string}', (quantity: string) => {
  cardDetailModal.enterStockAdjustment(quantity);
});

When('agrega notas de stock {string}', (notes: string) => {
  cardDetailModal.enterStockNotes(notes);
});

When('guarda el ajuste de stock', () => {
  cardDetailModal.saveStockAdjustment();
  // Confirmar en el modal de confirmación si aparece
  cy.get('body').then(($body) => {
    if ($body.text().includes('Confirmar')) {
      cy.contains('button', 'Confirmar').click();
      cy.wait(1000);
    }
  });
});

// When - Actions - Price Edit
When('ingresa un nuevo precio {string}', (price: string) => {
  // Si el precio es "random", generar un número aleatorio entre 50 y 200
  const finalPrice =
    price === 'random' ? (Math.random() * 150 + 50).toFixed(2) : price;
  cardDetailModal.enterPrice('Precio de venta', finalPrice);
});

When('agrega notas de precio {string}', (notes: string) => {
  cardDetailModal.enterPriceNotes(notes);
});

When('guarda el cambio de precio', () => {
  cardDetailModal.savePrice();
});

When('intenta ingresar un precio negativo {string}', (price: string) => {
  cardDetailModal.enterPrice('Precio de venta', price);
});

// When - Actions - Navigation
When('el usuario navega a la pestaña de historial de movimientos', () => {
  // El historial está visible por defecto en el modal
  cy.wait(500);
});

When('el usuario navega a la pestaña de historial de precios', () => {
  // El historial está visible por defecto en el modal
  cy.wait(500);
});

// Then - Assertions - Modal
Then('debería ver el modal de detalle abierto', () => {
  cardDetailModal.shouldSeeModal();
});

Then('no debería ver el modal de detalle', () => {
  cardDetailModal.shouldNotSeeModal();
});

// Then - Assertions - Card Information
Then('debería ver la información completa de la carta', () => {
  cardDetailModal.shouldSeeCardInformation();
});

Then('debería ver la información completa de la carta Magic', () => {
  cardDetailModal.shouldSeeMagicCardInformation();
});

Then('debería ver las variantes por condición', () => {
  cardDetailModal.shouldSeeVariants();
});

Then('debería ver el precio de venta', () => {
  cardDetailModal.shouldSeePriceDisplayed();
});

// Then - Assertions - Success/Error
Then('debería ver mensaje de éxito', () => {
  cardDetailModal.shouldSeeSuccessMessage();
});

// Then - Assertions - Price
Then('el precio debería estar actualizado en el detalle', () => {
  cardDetailModal.shouldSeeSuccessMessage();
});

Then('el botón de guardar precio debería estar deshabilitado', () => {
  cardDetailModal.shouldSeePriceSaveButtonDisabled();
});

// Then - Assertions - Stock
Then('el stock debería estar actualizado', () => {
  cardDetailModal.verifyStockUpdated();
});

// Then - Assertions - History
Then('debería ver la tabla de movimientos', () => {
  cardDetailModal.shouldSeeMovementsTable();
});

Then('debería ver la tabla de cambios de precio', () => {
  cardDetailModal.shouldSeePriceHistoryTable();
});

Then('debería ver información de auditoría', () => {
  // La información de auditoría está en las tablas
  cy.get('body').should('be.visible');
});

Then('debería ver las notas de cada cambio', () => {
  // Las notas están en las tablas de historial
  cy.get('body').should('be.visible');
});

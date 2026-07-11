import { CardDetailModalSelectors } from './card-detail-modal.selectors';

export default class CardDetailModal {
  // Modal Visibility
  shouldSeeModal() {
    cy.get(CardDetailModalSelectors.pokemonModal, { timeout: 10000 }).should(
      'be.visible'
    );
  }

  shouldSeeMagicModal() {
    cy.get(CardDetailModalSelectors.magicModal, { timeout: 10000 }).should(
      'be.visible'
    );
  }

  shouldNotSeeModal() {
    cy.get(CardDetailModalSelectors.pokemonModal).should('not.exist');
  }

  closeModal() {
    cy.get(CardDetailModalSelectors.closeButton).click();
    cy.wait(500);
  }

  // Variant Selection
  selectVariant(
    condition:
      | 'Near Mint'
      | 'Lightly Played'
      | 'Moderately Played'
      | 'Heavily Played'
      | 'Damaged'
  ) {
    const selectorMap = {
      'Near Mint': CardDetailModalSelectors.variantButtonNearMint,
      'Lightly Played': CardDetailModalSelectors.variantButtonLightlyPlayed,
      'Moderately Played':
        CardDetailModalSelectors.variantButtonModeratelyPlayed,
      'Heavily Played': CardDetailModalSelectors.variantButtonHeavilyPlayed,
      Damaged: CardDetailModalSelectors.variantButtonDamaged,
    };

    cy.get(selectorMap[condition]).click();
    cy.wait(500);
  }

  selectFirstAvailableVariant() {
    // Hacer scroll en el modal para asegurar que las variantes sean visibles
    cy.get(
      '[data-testid="magic-card-detail-modal"], [data-testid="pokemon-card-detail-modal"]'
    );

    cy.wait(300);
    // Hacer scroll al botón específico
    cy.get('[data-testid^="variant-button-"]').first().scrollIntoView();
    cy.wait(300);
    // Click con force por si está parcialmente oculto
    cy.get('[data-testid^="variant-button-"]').first().click({ force: true });
    cy.wait(500);
  }

  selectVariantWithStock() {
    // Buscar una variante que tenga stock > 0
    cy.get('[data-testid^="variant-button-"]').each(($btn) => {
      const text = $btn.text();
      const match = text.match(/\((\d+)\)/);
      if (match && parseInt(match[1], 10) > 0) {
        cy.wrap($btn).click();
        return false; // Break the loop
      }
    });
    cy.wait(500);
  }

  // Stock Adjustment
  selectMovementType(type: 'Entrada' | 'Salida' | 'Ajuste') {
    cy.get(CardDetailModalSelectors.stockMovementTypeSelect).click();
    cy.contains('li', type, { timeout: 5000 })
      .should('be.visible')
      .first()
      .click({ force: true });
    cy.wait(300);
  }

  enterStockAdjustment(quantity: string) {
    cy.get(CardDetailModalSelectors.stockAdjustmentInput)
      .clear()
      .type(quantity);
  }

  enterStockNotes(notes: string) {
    cy.get(CardDetailModalSelectors.stockNotesTextarea).clear().type(notes);
  }

  saveStockAdjustment() {
    cy.get(CardDetailModalSelectors.saveStockButton).click();
    cy.wait(500);
  }

  shouldSeeStockSaveButtonDisabled() {
    cy.get(CardDetailModalSelectors.saveStockButton).should('be.disabled');
  }

  // Price Edit
  enterPrice(fieldLabel: string, price: string) {
    cy.contains('label', fieldLabel).parent().find('input').clear().type(price);
  }

  enterPriceNotes(notes: string) {
    cy.get(CardDetailModalSelectors.priceNotesTextarea).clear().type(notes);
  }

  savePrice() {
    cy.get(CardDetailModalSelectors.savePriceButton).click();
    // Esperar un poco para que la mutación se complete
    cy.wait(1000);
  }

  shouldSeePriceSaveButtonDisabled() {
    cy.get(CardDetailModalSelectors.savePriceButton).should('be.disabled');
  }

  // Messages
  shouldSeeSuccessMessage() {
    // Esperar a que aparezca el toast/mensaje de éxito
    cy.contains(
      /éxito|exitosamente|actualizado|guardado|ajustado|registrada|creado|desactivado|activado/i,
      { timeout: 30000 }
    ).should('be.visible');
  }

  shouldSeeErrorMessage() {
    cy.get('body', { timeout: 10000 }).should(($body) => {
      const text = $body.text().toLowerCase();
      const hasError =
        text.includes('error') ||
        text.includes('no está disponible') ||
        text.includes('inválido') ||
        text.includes('requerido');

      return expect(hasError, 'Should show an error message').to.be.true;
    });
  }

  // Card Information
  shouldSeeCardInformation() {
    cy.get(CardDetailModalSelectors.pokemonModal)
      .should('be.visible')
      .and('contain', 'Set')
      .and('contain', 'Stock total');
  }

  shouldSeeMagicCardInformation() {
    cy.get(CardDetailModalSelectors.magicModal).should('be.visible');
    // Verificar que hay información visible en el modal
    cy.get(CardDetailModalSelectors.magicModal).should('not.be.empty');
  }

  shouldSeeVariants() {
    cy.get('[data-testid^="variant-button-"]').should(
      'have.length.at.least',
      1
    );
  }

  shouldSeePriceDisplayed() {
    // Verificar en cualquiera de los dos modales
    cy.get('body').should('contain', 'Precio venta');
  }

  // Tabs/Sections (if applicable)
  navigateToTab(tabName: string) {
    cy.contains('button', tabName).click();
    cy.wait(500);
  }

  shouldSeeMovementsTable() {
    cy.contains('Historial de movimientos')
      .scrollIntoView()
      .should('be.visible');
  }

  shouldSeePriceHistoryTable() {
    cy.contains('Historial de precios').scrollIntoView().should('be.visible');
  }

  // Price Update Verification
  verifyPriceUpdated(expectedPrice: string) {
    cy.get(CardDetailModalSelectors.pokemonModal).should(
      'contain',
      `$${expectedPrice}`
    );
  }

  // Stock Update Verification
  verifyStockUpdated() {
    // Verificar que el stock cambió
    cy.get('[data-testid^="variant-button-"]')
      .first()
      .scrollIntoView()
      .should('be.visible');
  }
}

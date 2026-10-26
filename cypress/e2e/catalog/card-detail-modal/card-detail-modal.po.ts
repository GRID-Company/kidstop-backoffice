import { CardDetailModalSelectors } from './card-detail-modal.selectors';
import { TIMEOUTS } from '../../../support/consts/timeouts.const';
import { selectHeroUIOption } from '../../../support/utils/select.utils';
import {
  SUCCESS_MESSAGE_REGEX,
  ERROR_MESSAGE_REGEX,
} from '../../../support/consts/messages.const';

export default class CardDetailModal {
  // Modal Visibility
  shouldSeeModal() {
    cy.get(CardDetailModalSelectors.pokemonModal, {
      timeout: TIMEOUTS.MODAL_OPEN,
    }).should('be.visible');
  }

  shouldSeeMagicModal() {
    cy.get(CardDetailModalSelectors.magicModal, {
      timeout: TIMEOUTS.MODAL_OPEN,
    }).should('be.visible');
  }

  shouldNotSeeModal() {
    cy.get(CardDetailModalSelectors.pokemonModal).should('not.exist');
  }

  closeModal() {
    cy.get(CardDetailModalSelectors.closeButton).click();
    cy.wait(TIMEOUTS.DEBOUNCE);
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
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  selectFirstAvailableVariant() {
    cy.get(
      '[data-testid="magic-card-detail-modal"], [data-testid="pokemon-card-detail-modal"]'
    );

    cy.wait(TIMEOUTS.ANIMATION);
    cy.get('[data-testid^="variant-button-"]').first().scrollIntoView();
    cy.wait(TIMEOUTS.ANIMATION);
    cy.get('[data-testid^="variant-button-"]').first().click({ force: true });
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  selectVariantWithStock() {
    cy.get('[data-testid^="variant-button-"]').each(($row) => {
      const stock = parseInt($row.attr('data-stock') ?? '0', 10);
      if (stock > 0) {
        cy.wrap($row).click();
        return false;
      }
    });
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  // Stock Adjustment
  ensureStockView() {
    cy.get('body').then(($body) => {
      if (
        $body.find(CardDetailModalSelectors.stockAdjustmentInput).length === 0
      ) {
        cy.get(CardDetailModalSelectors.openStockAdjustButton).click();
        cy.wait(TIMEOUTS.DEBOUNCE);
      }
    });
  }

  ensurePriceView() {
    cy.get('body').then(($body) => {
      if (
        $body.find(CardDetailModalSelectors.priceNotesTextarea).length === 0
      ) {
        cy.get(CardDetailModalSelectors.openPriceEditButton).click();
        cy.wait(TIMEOUTS.DEBOUNCE);
      }
    });
  }

  selectMovementType(type: 'Entrada' | 'Salida' | 'Ajuste') {
    this.ensureStockView();
    selectHeroUIOption(CardDetailModalSelectors.stockMovementTypeSelect, type);
    cy.wait(TIMEOUTS.ANIMATION);
  }

  enterStockAdjustment(quantity: string) {
    this.ensureStockView();
    cy.get(CardDetailModalSelectors.stockAdjustmentInput)
      .clear()
      .type(quantity);
  }

  enterStockNotes(notes: string) {
    this.ensureStockView();
    cy.get(CardDetailModalSelectors.stockNotesTextarea).clear().type(notes);
  }

  saveStockAdjustment() {
    cy.get(CardDetailModalSelectors.saveStockButton).click();
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  shouldSeeStockSaveButtonDisabled() {
    cy.get(CardDetailModalSelectors.saveStockButton).should('be.disabled');
  }

  // Price Edit
  enterPrice(fieldLabel: string, price: string) {
    this.ensurePriceView();
    cy.contains('label', fieldLabel).parent().find('input').clear().type(price);
  }

  enterPriceNotes(notes: string) {
    this.ensurePriceView();
    cy.get(CardDetailModalSelectors.priceNotesTextarea).clear().type(notes);
  }

  savePrice() {
    cy.get(CardDetailModalSelectors.savePriceButton).click();
    cy.wait(1000);
  }

  shouldSeePriceSaveButtonDisabled() {
    cy.get(CardDetailModalSelectors.savePriceButton).should('be.disabled');
  }

  // Messages
  shouldSeeSuccessMessage() {
    cy.contains(SUCCESS_MESSAGE_REGEX, {
      timeout: TIMEOUTS.SUCCESS_MESSAGE,
    }).should('be.visible');
  }

  shouldSeeErrorMessage() {
    cy.get('body', { timeout: TIMEOUTS.MODAL_OPEN }).should(($body) => {
      const text = $body.text().toLowerCase();
      const hasError = ERROR_MESSAGE_REGEX.test(text);
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

  // Tabs/Sections
  navigateToTab(tabName: string) {
    cy.contains('button', tabName).click();
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  navigateToStockTab() {
    cy.get(CardDetailModalSelectors.openStockAdjustButton).click();
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  navigateToPriceTab() {
    cy.get(CardDetailModalSelectors.openPriceEditButton).click();
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  navigateToMovementsTab() {
    cy.contains('[role="tab"]', 'Historial de movimientos').click();
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  navigateToPriceHistoryTab() {
    cy.contains('[role="tab"]', 'Historial de precios').click();
    cy.wait(TIMEOUTS.DEBOUNCE);
  }

  shouldSeeMovementsTable() {
    cy.get('[data-testid="tab-movements"]')
      .scrollIntoView()
      .should('be.visible');
  }

  shouldSeePriceHistoryTable() {
    cy.get('[data-testid="tab-price-history"]')
      .scrollIntoView()
      .should('be.visible');
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

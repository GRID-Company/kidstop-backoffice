import { PurchaseWhatsappQuoteSelectors } from './purchase-whatsapp-quote.selectors';
import { getGraphQLOperationName } from '../../support/utils/graphql.utils';
import { TIMEOUTS } from '../../support/consts/timeouts.const';

export const STUBBED_PDF_URL =
  'https://e2e.kidstop.test/quotations/cotizacion-e2e.pdf';

interface FakeWindow {
  location: { href: string };
  close: () => void;
}

export default class PurchaseWhatsappQuotePage {
  fakeWindow: FakeWindow = {
    location: { href: '' },
    close: () => {},
  };

  stubQuotationPdf() {
    cy.intercept('POST', '**/graphql', (req) => {
      const operationName = getGraphQLOperationName(req);
      if (operationName === 'GenerateQuotationPDF') {
        req.alias = 'quotationPdf';
        req.reply({
          statusCode: 200,
          body: { data: { generateQuotationPDF: STUBBED_PDF_URL } },
        });
      }
      if (operationName === 'UpdatePurchaseItems') {
        req.alias = 'updatePurchaseItems';
      }
    });
  }

  visitPurchase(guid: string) {
    cy.visit(`/compras/${guid}`);
    cy.window().then((win) => {
      cy.stub(win, 'open')
        .as('windowOpen')
        .callsFake(() => this.fakeWindow as unknown as Window);
    });
  }

  sendQuote() {
    cy.get(PurchaseWhatsappQuoteSelectors.whatsappQuoteButton, {
      timeout: TIMEOUTS.GRAPHQL_QUERY,
    })
      .should('be.enabled')
      .click();
  }

  changeFirstItemQuantity(quantity = '2') {
    cy.get(PurchaseWhatsappQuoteSelectors.purchaseItemQuantityInput, {
      timeout: TIMEOUTS.GRAPHQL_QUERY,
    })
      .first()
      .clear()
      .type(quantity);
  }

  shouldShowUnsavedChangesModal() {
    cy.contains(PurchaseWhatsappQuoteSelectors.unsavedChangesModalTitle, {
      timeout: TIMEOUTS.MODAL_OPEN,
    }).should('be.visible');
  }

  confirmSaveAndSend() {
    cy.contains(
      'button',
      PurchaseWhatsappQuoteSelectors.confirmSaveAndSendButton
    )
      .should('be.enabled')
      .click();
    cy.wait('@updatePurchaseItems', { timeout: TIMEOUTS.GRAPHQL_QUERY });
  }

  shouldOpenWhatsAppWithPdfLink() {
    cy.wait('@quotationPdf', { timeout: TIMEOUTS.GRAPHQL_QUERY });
    cy.wrap(this.fakeWindow.location)
      .its('href', { timeout: TIMEOUTS.GRAPHQL_QUERY })
      .should('include', 'api.whatsapp.com/send')
      .then((href) => {
        const url = new URL(href);
        const text = url.searchParams.get('text') ?? '';
        expect(
          text,
          'el mensaje de WhatsApp contiene el link del PDF'
        ).to.include(STUBBED_PDF_URL);
      });
  }
}

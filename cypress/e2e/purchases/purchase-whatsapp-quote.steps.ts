import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import PurchaseWhatsappQuotePage from './purchase-whatsapp-quote.po';

const page = new PurchaseWhatsappQuotePage();

Given('el usuario abre la compra de prueba con PDF stub', () => {
  page.stubQuotationPdf();
  cy.get<string>('@testPurchaseGuid').then((guid) => {
    page.visitPurchase(guid);
  });
});

Given('el usuario modifica la cantidad del primer item', () => {
  page.changeFirstItemQuantity();
});

When('el usuario envía la cotización por WhatsApp', () => {
  page.sendQuote();
});

When('el usuario confirma guardar y enviar la cotización', () => {
  page.confirmSaveAndSend();
});

Then('se muestra la confirmación de cambios sin guardar', () => {
  page.shouldShowUnsavedChangesModal();
});

Then('se abre WhatsApp con el link de descarga del PDF', () => {
  page.shouldOpenWhatsAppWithPdfLink();
});

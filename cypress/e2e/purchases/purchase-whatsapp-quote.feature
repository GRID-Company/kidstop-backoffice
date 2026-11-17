Feature: Compartir cotización por WhatsApp con link del PDF
  Como comprador de Kidstop
  Quiero enviar la cotización con el link de descarga del PDF
  Para que el vendedor pueda consultar el documento completo

  Background:
    Given el usuario está autenticado

  @seedPurchase
  Scenario: Enviar cotización abre WhatsApp con el link de descarga del PDF
    Given el usuario abre la compra de prueba con PDF stub
    When el usuario envía la cotización por WhatsApp
    Then se abre WhatsApp con el link de descarga del PDF

  @seedPurchase
  Scenario: Enviar cotización con cambios sin guardar solicita confirmación
    Given el usuario abre la compra de prueba con PDF stub
    And el usuario modifica la cantidad del primer item
    When el usuario envía la cotización por WhatsApp
    Then se muestra la confirmación de cambios sin guardar
    When el usuario confirma guardar y enviar la cotización
    Then se abre WhatsApp con el link de descarga del PDF

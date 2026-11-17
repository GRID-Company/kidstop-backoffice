Feature: Ajuste de precios de venta y finalización de compra
  Como comprador de Kidstop
  Quiero ajustar los precios de venta y registrar el pago
  Para finalizar la compra y registrar las cartas en inventario

  Background:
    Given el usuario está autenticado

  Scenario: Aceptar la cotización mueve la compra a espera de precio
    Given la compra cotizada responde con estado QUOTED
    When el usuario acepta la cotización
    Then la mutación de estado solicitó "WAITING_PRICE"
    And la compra queda en estado "Esperando precio"

  Scenario: Finalizar requiere precios de venta en todos los items y pago registrado
    Given la compra en espera de precio responde sin precios ni pagos
    When el usuario cambia a la vista de tabla
    Then el botón de finalizar compra está deshabilitado
    When el usuario define el precio de venta "1500" del item "purchase-item-foil"
    Then el precio de venta "1500" se persiste para el item "purchase-item-foil"
    And el botón de finalizar compra está deshabilitado
    When el usuario define el precio de venta "800" del item "purchase-item-nonfoil"
    Then el precio de venta "800" se persiste para el item "purchase-item-nonfoil"
    And el botón de finalizar compra está deshabilitado
    When el usuario abre el registro de pago
    And el usuario agrega un método de pago
    And el usuario confirma el pago
    Then el botón de finalizar compra está habilitado
    When el usuario inicia la finalización de la compra
    And el usuario confirma la finalización de la compra
    Then la mutación de estado solicitó "FINALIZED"
    And la compra queda en estado "Finalizado"

  Scenario: La división de pago debe coincidir con el total de la compra
    Given la compra en espera de precio responde con precios definidos
    When el usuario abre el registro de pago
    And el usuario agrega un método de pago
    And el usuario asigna el monto "100" al pago
    Then se muestra el error de pago "Faltan $1,950.00 por asignar"
    And el botón de confirmar pago está deshabilitado
    When el usuario asigna el monto "3000" al pago
    Then se muestra el error de pago "Se excede por $950.00"
    And el botón de confirmar pago está deshabilitado
    When el usuario asigna el monto "2050" al pago
    Then el botón de confirmar pago está habilitado
    When el usuario confirma el pago
    Then el botón de finalizar compra está habilitado

  Scenario: Un error al guardar el precio de venta muestra mensaje y revierte el valor
    Given la mutación de precio de venta responde con error
    When el usuario cambia a la vista de tabla
    And el usuario define el precio de venta "1500" del item "purchase-item-foil"
    Then se muestra el mensaje de error "Error al actualizar precio"

  @seedPurchase
  Scenario: La compra en borrador puede cotizarse, rechazarse y volver a borrador
    When el usuario abre la compra de prueba
    Then la página debería terminar de cargar
    And la compra queda en estado "Borrador"
    When el usuario cotiza la compra
    Then la compra queda en estado "Cotizado"
    When el usuario rechaza la compra
    Then la compra queda en estado "Rechazado"
    When el usuario vuelve la compra a borrador
    Then la compra queda en estado "Borrador"

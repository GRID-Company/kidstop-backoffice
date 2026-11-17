Feature: Visualización de items de compra en cartas y tabla
  Como comprador de Kidstop
  Quiero alternar entre la vista de cartas y la vista de tabla
  Para revisar y editar los items de la compra de la forma más cómoda

  Background:
    Given el usuario está autenticado

  @seedPurchase
  Scenario: Alternar entre vista de cartas y tabla conserva los items
    When el usuario abre la compra de prueba en la vista de items
    Then la página debería terminar de cargar
    And la vista de cartas muestra 1 items
    When el usuario cambia a la vista de tabla
    Then la vista de tabla muestra 1 filas
    When el usuario cambia a la vista de cartas
    Then la vista de cartas muestra 1 items

  @seedMultiItemPurchase
  Scenario: Buscar items por nombre en la tabla
    When el usuario abre la compra de prueba en la vista de items
    Then la página debería terminar de cargar
    When el usuario cambia a la vista de tabla
    Then la vista de tabla muestra 10 filas
    When el usuario busca el nombre del primer item en la tabla
    Then todas las filas visibles coinciden con la búsqueda
    When el usuario busca "zzzz-sin-resultados" en la tabla de items
    Then la tabla muestra el estado vacío de filtros
    When el usuario limpia los filtros de la tabla
    Then la vista de tabla muestra 10 filas

  @seedMultiItemPurchase
  Scenario: Filtrar items por condición e idioma en la tabla
    When el usuario abre la compra de prueba en la vista de items
    Then la página debería terminar de cargar
    When el usuario cambia a la vista de tabla
    And el usuario filtra por condición "Near Mint"
    Then la vista de tabla muestra 4 filas
    When el usuario filtra por idioma "Español"
    Then la vista de tabla muestra 2 filas
    When el usuario limpia los filtros de la tabla
    Then la vista de tabla muestra 10 filas

  @seedMultiItemPurchase
  Scenario: La tabla pagina los items de a 10
    When el usuario abre la compra de prueba en la vista de items
    Then la página debería terminar de cargar
    When el usuario cambia a la vista de tabla
    Then la vista de tabla muestra 10 filas
    When el usuario va a la página 2 de la tabla
    Then la vista de tabla muestra 2 filas

  @seedPurchase
  Scenario: Editar cantidad en la tabla se refleja en las cartas y persiste
    When el usuario abre la compra de prueba en la vista de items
    Then la página debería terminar de cargar
    When el usuario cambia a la vista de tabla
    And el usuario edita la cantidad del primer item a "3"
    Then el total de compra de la tabla es "$30.00"
    When el usuario cambia a la vista de cartas
    Then el primer item tiene cantidad "3"
    When el usuario cambia a la vista de tabla
    And el usuario guarda los cambios de la compra
    And el usuario recarga la página
    Then la página debería terminar de cargar
    Then la vista de tabla muestra 1 filas
    And el primer item de la tabla tiene cantidad "3"

  @seedPurchase
  Scenario: Eliminar un item desde la tabla
    When el usuario abre la compra de prueba en la vista de items
    Then la página debería terminar de cargar
    When el usuario cambia a la vista de tabla
    And el usuario elimina el primer item de la tabla
    Then la tabla muestra el estado vacío de items
    And la compra muestra 0 items en el contador

  Scenario: El precio de venta es de solo lectura al crear una compra
    Given la búsqueda de compras responde con cartas Pokémon con variantes
    And el usuario confirma el vendedor stub
    When el usuario busca "Charizard" en la compra
    And el usuario agrega el primer resultado a la compra
    And el usuario cambia a la vista de tabla
    Then el precio de venta del primer item es de solo lectura

Feature: Atributos diferenciales en resultados del escáner
  Como usuario del backoffice de Kidstop
  Quiero ver los atributos que diferencian cada resultado del escáner
  Para identificar correctamente cada carta (ej. foil vs no foil)

  Background:
    Given el usuario está autenticado

  Scenario: Mostrar chips Foil y Non-Foil en resultados Magic del escáner
    Given el escáner responde con cartas Magic foil y no foil
    When el usuario abre el escáner desde el FAB con TCG "magic"
    And captura una carta con el modo IA
    Then el resultado del escáner 1 debería mostrar el chip "Non-Foil"
    And el resultado del escáner 2 debería mostrar el chip "✧ Foil"

  Scenario: Mostrar chips de variante en resultados Pokémon del escáner
    Given el escáner responde con cartas Pokémon con variantes
    When el usuario abre el escáner desde el FAB con TCG "pokemon"
    And captura una carta con el modo IA
    Then el resultado del escáner 2 debería mostrar el chip "Reverse Holo"
    And el resultado del escáner 2 debería mostrar chips de tipo, HP y etapa

  Scenario: Los chips diferenciales persisten al agregar la carta escaneada a la compra
    Given el usuario inicia una nueva compra con un vendedor stub
    And el escáner responde con cartas Magic foil y no foil
    When el usuario abre el escáner desde la compra
    And captura una carta con el modo IA
    Then el resultado de compra del escáner 1 debería mostrar el chip "Non-Foil"
    And el resultado de compra del escáner 2 debería mostrar el chip "✧ Foil"
    When agrega el resultado del escáner 1 a la compra
    Then el item agregado debería mostrar el chip "Non-Foil"
    And el item agregado debería mostrar el chip de idioma

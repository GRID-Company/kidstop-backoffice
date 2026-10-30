Feature: Atributos diferenciales en búsquedas de cartas para compras
  Como comprador de Kidstop
  Quiero ver los atributos que diferencian cada carta en las búsquedas
  Para agregar el item correcto a la compra

  Background:
    Given el usuario está autenticado

  Scenario: Mostrar chips Foil y Non-Foil en búsqueda simple de Magic
    Given la búsqueda de compras responde con cartas Magic foil y no foil
    And el usuario confirma el vendedor stub
    When el usuario busca "Toxrill" en la compra
    Then el resultado de búsqueda 1 debería mostrar el chip "Non-Foil"
    And el resultado de búsqueda 2 debería mostrar el chip "✧ Foil"
    And el resultado de búsqueda 1 debería mostrar el chip de idioma

  Scenario: Mostrar chips de variante en búsqueda simple de Pokémon
    Given la búsqueda de compras responde con cartas Pokémon con variantes
    And el usuario confirma el vendedor stub
    When el usuario busca "Charizard" en la compra
    Then el resultado de búsqueda 1 debería mostrar el chip "Reverse Holo"
    And el resultado de búsqueda 1 debería mostrar chips de tipo, HP y etapa

  Scenario: Mostrar chips en búsqueda masiva con cartas relacionadas
    Given la búsqueda masiva responde con cartas Magic foil y no foil
    And el usuario confirma el vendedor stub
    When el usuario activa la búsqueda avanzada
    And busca la lista "1 Toxrill, the Corrosive" en búsqueda masiva
    Then el mejor resultado masivo debería mostrar el chip "✧ Foil"
    And la carta relacionada 1 debería mostrar el chip "Non-Foil"

  Scenario: Los chips diferenciales persisten en una compra guardada
    Given la compra guardada responde con items Magic foil y no foil
    When el usuario visita la compra guardada
    Then el item guardado 1 debería mostrar el chip "✧ Foil"
    And el item guardado 2 debería mostrar el chip "Non-Foil"
    And el item guardado 1 debería mostrar el chip de idioma

Feature: Validación de cartas duplicadas en compras
  Como comprador de Kidstop
  Quiero que la compra detecte cartas repetidas por carta, condición e idioma
  Para no agregar el mismo item dos veces por error

  Background:
    Given el usuario está autenticado

  Scenario: La misma carta con la misma condición no se puede agregar dos veces
    Given la búsqueda de compras responde con cartas Pokémon con variantes
    And el usuario confirma el vendedor stub
    When el usuario busca "Charizard" en la compra
    And el usuario agrega el resultado 1 a la compra
    Then la compra muestra 1 items en el contador
    When el usuario busca "Charizard ex" en la compra
    Then el resultado 1 está marcado como ya agregada
    And el resultado 2 permite agregarse

  Scenario: La misma carta con condición distinta se agrega como item diferente
    Given la búsqueda de compras responde con cartas Pokémon con variantes
    And el usuario confirma el vendedor stub
    When el usuario busca "Charizard" en la compra
    And el usuario agrega el resultado 1 a la compra
    And el usuario busca "Charizard ex" en la compra
    And el usuario cambia la condición del resultado 1 a "Lightly Played"
    And el usuario agrega el resultado 1 a la compra
    Then la compra muestra 2 items en el contador

  Scenario: La búsqueda masiva omite los duplicados y agrega solo las únicas
    Given la compra nueva de Magic tiene búsqueda simple y masiva
    And el usuario confirma el vendedor stub
    When el usuario busca "Toxrill" en la compra
    And el usuario agrega el resultado 1 a la compra
    When el usuario activa la búsqueda avanzada
    And busca la lista "1 Toxrill, the Corrosive{enter}1 Rhystic Study" en búsqueda masiva
    And el usuario confirma la búsqueda masiva
    Then se muestra el modal de cartas duplicadas con "Se agregarán (1 carta)" y "Se omitirán (1 carta duplicada)"
    When el usuario confirma agregar "Agregar 1 carta" del modal de duplicados
    Then la compra muestra 2 items en el contador

  Scenario: La búsqueda masiva muestra el modal cuando todas son duplicadas
    Given la compra nueva de Magic tiene búsqueda masiva
    And el usuario confirma el vendedor stub
    When el usuario activa la búsqueda avanzada
    And busca la lista "1 Toxrill, the Corrosive" en búsqueda masiva
    And el usuario confirma la búsqueda masiva
    Then la compra muestra 1 items en el contador
    When el usuario activa la búsqueda avanzada
    And busca la lista "1 Toxrill, the Corrosive" en búsqueda masiva
    And el usuario confirma la búsqueda masiva
    Then se muestra el modal de cartas duplicadas con "Se omitirán (1 carta duplicada)"
    When el usuario cancela el modal de duplicados
    Then la compra muestra 1 items en el contador

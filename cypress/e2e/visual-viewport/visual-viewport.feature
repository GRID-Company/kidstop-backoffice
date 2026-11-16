Feature: Compensación del visual viewport en overlays
  Como usuario del backoffice en iPad
  Quiero que los overlays sigan la banda visible cuando el teclado desplaza el viewport
  Para no perder el footer ni los botones de acción ni ver la página debajo del backdrop

  Background:
    Given el usuario está autenticado
    And el usuario está en la página de catálogo
    And el usuario tiene el modal de detalle de Pokémon abierto

  Scenario: El drawer compensa un desplazamiento del visual viewport
    When el visual viewport se desplaza "160" píxeles
    Then la variable CSS del offset del viewport es "160px"
    And el wrapper del overlay tiene un translate de "160" píxeles
    And el backdrop del overlay tiene un translate de "160" píxeles

  Scenario: Un scroll del documento no desplaza los overlays fijos
    When el documento se desplaza "160" píxeles
    Then la variable CSS del offset del viewport es "0px"
    And el wrapper del overlay tiene un translate de "0" píxeles

  Scenario: Un scroll del documento se revierte mientras el drawer está abierto
    When el documento intenta desplazarse "160" píxeles
    Then el scroll del documento vuelve a "0" píxeles

  Scenario: El drawer vuelve a su posición cuando el viewport regresa a cero
    When el visual viewport se desplaza "160" píxeles
    Then la variable CSS del offset del viewport es "160px"
    When el visual viewport se desplaza "0" píxeles
    Then la variable CSS del offset del viewport es "0px"
    And el wrapper del overlay tiene un translate de "0" píxeles

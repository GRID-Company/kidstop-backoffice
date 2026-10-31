Feature: Visualización homologada de cartas (KSP-376)
  Como usuario del backoffice de Kidstop
  Quiero que las superficies migradas a CardImage muestren el thumbnail
  con su tamaño real, el número en formato #N y el preview sin disparar
  la acción del contenedor

  Background:
    Given el usuario está autenticado

  # Compras — PurchaseCardResultItem + ItemCard
  Scenario: El thumbnail no colapsa la fila en resultados de búsqueda de compra
    Given el usuario está en la página de nueva compra
    When el usuario busca una carta para comprar
    Then el thumbnail del resultado debería tener el ancho de una carta
    And el contenido del resultado debería ser visible

  Scenario: Click en la imagen del resultado abre solo el preview
    Given el usuario está en la página de nueva compra
    And el usuario buscó una carta para comprar
    When el usuario hace clic en la imagen del resultado
    Then debería ver el modal de preview de imagen
    And no debería agregarse ninguna carta a la compra
    When el usuario cierra el preview de imagen
    Then no debería ver el modal de preview de imagen

  Scenario: El item agregado a la compra muestra thumbnail y número #N
    Given el usuario está en la página de nueva compra
    And el usuario agregó una carta a la compra
    Then el thumbnail del item de compra debería tener el ancho de una carta
    And el número del item debería mostrarse en formato #N

  # Inventario — grid name cell + movement detail drawer
  Scenario: El grid de inventario muestra thumbnails sin colapsar la fila
    Given el usuario está en la página de inventario
    Then el thumbnail de la primera fila debería tener el ancho de una carta

  Scenario: El detalle de movimiento muestra imagen con preview
    Given el usuario está en la página de inventario
    And el usuario abre la pestaña de movimientos
    When el usuario abre el detalle del primer movimiento
    Then el thumbnail del movimiento debería tener el ancho de una carta
    When el usuario hace clic en la imagen del movimiento
    Then debería ver el modal de preview de imagen

  # Most Wanted — fila sortable con preview hoisted a la lista
  Scenario: Most Wanted muestra thumbnails y un único preview modal
    Given el usuario está en la página de most wanted
    Then el thumbnail del item de most wanted debería tener el ancho de una carta
    When el usuario hace clic en la imagen del item de most wanted
    Then debería existir un único modal de preview de imagen

  # Ventas — sale items table thumbnails
  Scenario: El detalle de venta muestra thumbnails sin colapsar la fila
    Given el usuario está en la página de ventas
    When el usuario abre el primer pedido
    Then el thumbnail del item de venta debería tener el ancho de una carta

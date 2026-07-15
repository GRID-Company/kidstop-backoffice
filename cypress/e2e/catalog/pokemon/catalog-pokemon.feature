Feature: Gestión de Catálogo Pokémon
  Como usuario del backoffice de Kidstop
  Quiero gestionar el catálogo de cartas Pokémon
  Para consultar, buscar y actualizar información de cartas Pokémon

  Background:
    Given el usuario está autenticado
    And el usuario está en la página de catálogo

  # Navegación y Visualización Básica
  Scenario: Ver catálogo de Pokémon por defecto
    Then debería ver el catálogo de Pokémon
    And debería ver el grid de cartas
    And debería ver el contador de resultados

  # Búsqueda
  Scenario: Buscar carta de Pokémon por nombre
    When el usuario busca "Pikachu"
    Then debería ver solo cartas que coincidan con "Pikachu"
    And el contador de resultados debería ser mayor a 0

  Scenario: Buscar carta de Pokémon sin resultados
    When el usuario busca "CartaQueNoExiste12345"
    Then debería ver mensaje de sin resultados para Pokémon
    And el contador de resultados debería ser 0

  Scenario: Limpiar búsqueda de Pokémon
    When el usuario busca "Charizard"
    And el usuario limpia la búsqueda
    Then debería ver todas las cartas de Pokémon

  # Ordenamiento
  Scenario: Ordenar cartas de Pokémon por precio menor a mayor
    When el usuario ordena por "Precio menor"
    Then las cartas deberían estar ordenadas por precio ascendente

  Scenario: Ordenar cartas de Pokémon por nombre
    When el usuario ordena por "Nombre A → Z"
    Then las cartas deberían estar ordenadas alfabéticamente

  # Filtros
  Scenario: Abrir drawer de filtros
    When el usuario hace clic en el botón de filtros
    Then debería ver el drawer de filtros abierto

  Scenario: Filtrar cartas de Pokémon por condición
    When el usuario abre los filtros
    And selecciona la condición "Near Mint"
    And aplica los filtros
    Then debería ver el badge de filtros activos con "1"
    And debería ver solo cartas en condición Near Mint

  Scenario: Aplicar múltiples filtros en Pokémon
    When el usuario abre los filtros
    And selecciona la condición "Near Mint"
    And selecciona una rareza
    And aplica los filtros
    Then debería ver el badge de filtros activos con "2"

  Scenario: Limpiar todos los filtros
    Given el usuario tiene filtros activos
    When el usuario hace clic en limpiar filtros
    Then no debería ver el badge de filtros activos
    And debería ver todas las cartas

  # Visualización de Detalles
  Scenario: Abrir modal de detalle de carta Pokémon
    When el usuario hace clic en una carta de Pokémon
    Then debería ver el modal de detalle abierto
    And debería ver la información completa de la carta
    And debería ver las variantes por condición
    And debería ver el precio de venta

  Scenario: Cerrar modal de detalle
    Given el usuario tiene el modal de detalle abierto
    When el usuario cierra el modal
    Then no debería ver el modal de detalle

  # Edición de Precios
  Scenario: Actualizar precio de venta de carta Pokémon
    Given el usuario tiene el modal de detalle de Pokémon abierto
    When el usuario selecciona una variante
    And ingresa un nuevo precio "random"
    And agrega notas de precio "Ajuste por demanda"
    And guarda el cambio de precio
    Then debería ver mensaje de éxito
    And el precio debería estar actualizado en el detalle

  Scenario: Validar precio mínimo en Pokémon
    Given el usuario tiene el modal de detalle de Pokémon abierto
    When el usuario selecciona una variante
    And intenta ingresar un precio negativo "-10"
    Then el botón de guardar precio debería estar deshabilitado

  # Ajuste de Stock
  Scenario: Ajustar stock de carta Pokémon (entrada)
    Given el usuario tiene el modal de detalle de Pokémon abierto
    When el usuario selecciona una variante
    And selecciona tipo de movimiento "Entrada"
    And ingresa cantidad de ajuste "5"
    And agrega notas de stock "Compra nueva"
    And guarda el ajuste de stock
    Then debería ver mensaje de éxito
    And el stock debería estar actualizado

  Scenario: Ajustar stock de carta Pokémon (salida)
    Given el usuario tiene el modal de detalle de Pokémon abierto
    When el usuario selecciona una variante con stock
    And selecciona tipo de movimiento "Salida"
    And ingresa cantidad de ajuste "2"
    And agrega notas de stock "Venta directa"
    And guarda el ajuste de stock
    Then debería ver mensaje de éxito

  # Historial
  Scenario: Ver historial de movimientos de inventario
    Given el usuario tiene el modal de detalle de Pokémon abierto
    When el usuario navega a la pestaña de historial de movimientos
    Then debería ver la tabla de movimientos
    And debería ver información de auditoría

  Scenario: Ver historial de cambios de precio
    Given el usuario tiene el modal de detalle de Pokémon abierto
    When el usuario navega a la pestaña de historial de precios
    Then debería ver la tabla de cambios de precio
    And debería ver las notas de cada cambio

Feature: Gestión de Catálogo Magic
  Como usuario del backoffice de Kidstop
  Quiero gestionar el catálogo de cartas Magic
  Para consultar, buscar y actualizar información de cartas Magic

  Background:
    Given el usuario está autenticado
    And el usuario selecciona el TCG "Magic"

  # Navegación y Visualización Básica
  Scenario: Ver catálogo de Magic
    Then debería ver el catálogo de Magic
    And debería ver el grid de cartas de Magic
    And debería ver el contador de resultados

  # Búsqueda
  Scenario: Buscar carta de Magic por nombre
    When Magic: el usuario busca "Light"
    Then debería ver solo cartas de Magic que coincidan con "Light"
    And Magic: el contador de resultados debería ser mayor a 0

  Scenario: Buscar carta de Magic sin resultados
    When Magic: el usuario busca "CartaQueNoExiste12345"
    Then debería ver mensaje de sin resultados para Magic
    And Magic: el contador de resultados debería ser 0

  Scenario: Limpiar búsqueda de Magic
    When Magic: el usuario busca "Lightning"
    And Magic: el usuario limpia la búsqueda
    Then debería ver todas las cartas de Magic

  # Ordenamiento
  Scenario: Ordenar cartas de Magic por precio menor a mayor
    When Magic: el usuario ordena por "Precio menor"
    Then Magic: las cartas deberían estar ordenadas por precio ascendente

  Scenario: Ordenar cartas de Magic por nombre
    When Magic: el usuario ordena por "Nombre A → Z"
    Then Magic: las cartas deberían estar ordenadas alfabéticamente

  # Filtros
  Scenario: Abrir drawer de filtros
    When Magic: el usuario hace clic en el botón de filtros
    Then debería ver el drawer de filtros abierto

  Scenario: Filtrar cartas de Magic por condición
    When Magic: el usuario abre los filtros
    And Magic: selecciona la condición "Near Mint"
    And Magic: aplica los filtros
    Then debería ver el badge de filtros activos con "1"
    And Magic: debería ver solo cartas en condición Near Mint

  Scenario: Aplicar múltiples filtros en Magic
    When Magic: el usuario abre los filtros
    And Magic: selecciona la condición "Near Mint"
    And Magic: selecciona una edición
    And Magic: aplica los filtros
    Then debería ver el badge de filtros activos con "2"

  Scenario: Limpiar todos los filtros
    Given Magic: el usuario tiene filtros activos
    When Magic: el usuario hace clic en limpiar filtros
    Then no debería ver el badge de filtros activos
    And Magic: debería ver todas las cartas

  # Visualización de Detalles
  Scenario: Abrir modal de detalle de carta Magic
    When el usuario hace clic en una carta de Magic
    Then Magic: debería ver el modal de detalle abierto
    And debería ver la información completa de la carta Magic
    And debería ver las variantes por condición
    And debería ver el precio de venta

  Scenario: Cerrar modal de detalle
    Given el usuario tiene el modal de detalle de Magic abierto
    When el usuario cierra el modal
    Then no debería ver el modal de detalle

  # Edición de Precios
  Scenario: Actualizar precio de venta de carta Magic
    Given el usuario tiene el modal de detalle de Magic abierto
    When el usuario selecciona una variante de Magic
    And ingresa un nuevo precio "random"
    And agrega notas de precio "Ajuste de mercado"
    And guarda el cambio de precio
    Then debería ver mensaje de éxito
    And el precio debería estar actualizado en el detalle

  Scenario: Validar precio mínimo en Magic
    Given el usuario tiene el modal de detalle de Magic abierto
    When el usuario selecciona una variante de Magic
    And intenta ingresar un precio negativo "-10"
    Then el botón de guardar precio debería estar deshabilitado

  # Ajuste de Stock
  Scenario: Ajustar stock de carta Magic (entrada)
    Given el usuario tiene el modal de detalle de Magic abierto
    When el usuario selecciona una variante de Magic
    And selecciona tipo de movimiento "Entrada"
    And ingresa cantidad de ajuste "5"
    And agrega notas de stock "Compra nueva"
    And guarda el ajuste de stock
    Then debería ver mensaje de éxito
    And el stock debería estar actualizado

  Scenario: Ajustar stock de carta Magic (salida)
    Given el usuario tiene el modal de detalle de Magic abierto
    When el usuario selecciona una variante de Magic con stock
    And selecciona tipo de movimiento "Salida"
    And ingresa cantidad de ajuste "2"
    And agrega notas de stock "Venta directa"
    And guarda el ajuste de stock
    Then debería ver mensaje de éxito

  # Historial
  Scenario: Ver historial de movimientos de inventario
    Given el usuario tiene el modal de detalle de Magic abierto
    When el usuario navega a la pestaña de historial de movimientos
    Then debería ver la tabla de movimientos
    And debería ver información de auditoría

  Scenario: Ver historial de cambios de precio
    Given el usuario tiene el modal de detalle de Magic abierto
    When el usuario navega a la pestaña de historial de precios
    Then debería ver la tabla de cambios de precio
    And debería ver las notas de cada cambio

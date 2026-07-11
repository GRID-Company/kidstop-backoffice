Feature: Gestión de Usuarios
  Como administrador del backoffice de Kidstop
  Quiero gestionar usuarios del sistema
  Para controlar el acceso y roles de los empleados

  Background:
    Given el administrador está autenticado
    And el administrador está en la página de usuarios

  Scenario: Ver listado de usuarios
    Then el administrador debería ver la lista de usuarios
    And debería ver columnas de nombre, email, rol y estado

  Scenario: Buscar usuario por nombre
    When el administrador busca "Juan"
    Then debería ver solo usuarios que coincidan con "Juan"

  Scenario: Filtrar usuarios por rol
    When el administrador filtra por rol "BUYER"
    Then debería ver solo usuarios con rol "Comprador"

  Scenario: Filtrar usuarios activos
    When el administrador filtra por estado "activo"
    Then debería ver solo usuarios activados

  Scenario: Crear nuevo usuario Comprador
    When el administrador hace clic en crear usuario
    And ingresa nombre "Carlos Pérez"
    And ingresa email "carlos.perez@test.com"
    And selecciona rol "BUYER"
    And hace clic en guardar
    Then debería ver mensaje de éxito
    And el nuevo usuario debería aparecer en la lista

  Scenario: Crear nuevo usuario Recepción
    When el administrador hace clic en crear usuario
    And ingresa nombre "María García"
    And ingresa email "maria.garcia@test.com"
    And selecciona rol "RECEPTION"
    And hace clic en guardar
    Then debería ver mensaje de éxito
    And el nuevo usuario debería aparecer en la lista

  Scenario: Editar usuario existente
    Given existe un usuario "Test User"
    When el administrador hace clic en editar usuario
    And cambia el nombre a "Test User Updated"
    And hace clic en guardar
    Then debería ver mensaje de éxito
    And el usuario debería mostrar el nuevo nombre

  Scenario: Desactivar usuario
    Given existe un usuario activo "User To Deactivate"
    When el administrador hace clic en desactivar usuario
    And confirma la desactivación
    Then debería ver mensaje de éxito
    And el usuario debería aparecer como inactivo

  Scenario: Activar usuario desactivado
    Given existe un usuario inactivo "Inactive User"
    When el administrador hace clic en activar usuario
    Then debería ver mensaje de éxito
    And el usuario debería aparecer como activo

  Scenario: Validación de email duplicado
    Given existe un usuario con email "existing@test.com"
    When el administrador intenta crear usuario con email "existing@test.com"
    Then debería ver mensaje de error de email duplicado

  Scenario: Validación de campos obligatorios
    When el administrador hace clic en crear usuario
    And intenta guardar sin llenar campos
    Then el botón de guardar debería estar deshabilitado

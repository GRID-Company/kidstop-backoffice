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
    When el administrador busca "Carlos"
    Then debería ver solo usuarios que coincidan con "Carlos"

  Scenario: Filtrar usuarios por rol
    When el administrador filtra por rol "Comprador"
    Then debería ver solo usuarios con rol "Comprador"

  Scenario: Filtrar usuarios activos
    When el administrador filtra por estado "Activo"
    Then debería ver solo usuarios activados

  Scenario: Crear nuevo usuario Comprador
    When el administrador hace clic en crear usuario
    And ingresa nombre "Carlos Pérez"
    And ingresa email dinámico con prefijo "carlos.perez"
    And selecciona rol "Comprador"
    And hace clic en guardar
    Then debería ver mensaje de éxito
    And el nuevo usuario debería aparecer en la lista

  Scenario: Crear nuevo usuario Recepción
    When el administrador hace clic en crear usuario
    And ingresa nombre "María García"
    And ingresa email dinámico con prefijo "maria.garcia"
    And selecciona rol "Recepción"
    And hace clic en guardar
    Then debería ver mensaje de éxito
    And el nuevo usuario debería aparecer en la lista

  Scenario: Editar usuario existente
    Given el administrador crea un usuario de prueba "Usuario Para Editar"
    When el administrador hace clic en editar ese usuario
    And cambia el nombre a "Usuario Editado"
    And hace clic en guardar
    Then debería ver mensaje de éxito

  Scenario: Desactivar usuario
    Given el administrador crea un usuario de prueba "Usuario Para Desactivar"
    When el administrador hace clic en desactivar ese usuario
    And confirma la desactivación
    Then debería ver mensaje de éxito

  Scenario: Activar usuario desactivado
    Given el administrador crea un usuario de prueba "Usuario Para Activar"
    And el administrador desactiva ese usuario
    When el administrador hace clic en activar ese usuario
    Then debería ver mensaje de éxito

  Scenario: Validación de email duplicado
    Given el administrador crea un usuario temporal
    When el administrador intenta crear otro usuario con el mismo email
    Then debería ver mensaje de error de email duplicado

  Scenario: Validación de campos obligatorios
    When el administrador hace clic en crear usuario
    And intenta guardar sin llenar campos
    Then el botón de guardar debería estar deshabilitado

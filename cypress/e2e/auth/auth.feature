Feature: Autenticación
  Como usuario del backoffice de Kidstop
  Quiero poder iniciar sesión y gestionar mi sesión
  Para acceder de forma segura a las funcionalidades del sistema

  Background:
    Given el usuario está en la página de login

  Scenario: Login exitoso con credenciales de Administrador
    When el usuario ingresa el email de administrador
    And el usuario ingresa la contraseña de administrador
    And el usuario hace clic en el botón de iniciar sesión
    Then el usuario debería ser redirigido a "/catalogo"
    And el usuario debería ver la página del catálogo

  Scenario: Login fallido con email inválido
    When el usuario ingresa el email "usuario-invalido@test.com"
    And el usuario ingresa la contraseña "password123"
    And el usuario hace clic en el botón de iniciar sesión
    Then el usuario debería ver un mensaje de error
    And el usuario debería permanecer en la página de login

  Scenario: Login fallido con contraseña incorrecta
    When el usuario ingresa el email de administrador
    And el usuario ingresa la contraseña "contraseña-incorrecta"
    And el usuario hace clic en el botón de iniciar sesión
    Then el usuario debería ver un mensaje de error
    And el usuario debería permanecer en la página de login

  Scenario: Validación de campos vacíos
    Then el botón de iniciar sesión debería estar deshabilitado

  Scenario: Logout exitoso
    Given el usuario está autenticado como administrador
    When el usuario hace clic en el menú de usuario
    And el usuario hace clic en cerrar sesión
    Then el usuario debería ser redirigido a "/login"
    And el usuario debería ver la página de login

  Scenario: Persistencia de sesión después de recargar página
    Given el usuario está autenticado como administrador
    When el usuario recarga la página
    Then el usuario debería permanecer autenticado
    And el usuario debería ver la página del catálogo

  Scenario: Redirección a login cuando la sesión expira
    Given el usuario está autenticado como administrador
    When la sesión del usuario expira
    And el usuario intenta navegar a "/catalogo"
    Then el usuario debería ser redirigido a "/login"

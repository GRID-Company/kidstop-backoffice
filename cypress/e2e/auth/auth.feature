Feature: Autenticación
  Como usuario del backoffice de Kidstop
  Quiero poder iniciar sesión
  Para acceder a las funcionalidades del sistema

  Background:
    Given el usuario está en la página de login

  Scenario: Login exitoso con credenciales de Administrador
    When el usuario ingresa el email de administrador
    And el usuario ingresa la contraseña de administrador
    And el usuario hace clic en el botón de iniciar sesión
    Then el usuario debería ser redirigido a "/catalogo"
    And el usuario debería ver la página del catálogo

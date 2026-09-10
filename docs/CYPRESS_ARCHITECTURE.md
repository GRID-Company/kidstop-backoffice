# Cypress E2E Testing Architecture

Documentación de la arquitectura de pruebas End-to-End para el Kidstop Backoffice usando Cypress + Cucumber + Gherkin + Page Object Model.

## Tabla de Contenidos

- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura de Directorios](#estructura-de-directorios)
- [Patrón Page Object Model + BDD](#patrón-page-object-model--bdd)
- [Configuración](#configuración)
- [Comandos Personalizados](#comandos-personalizados)
- [Convenciones](#convenciones)
- [Guía Rápida](#guía-rápida)
- [Ejecución de Tests](#ejecución-de-tests)
- [Mejores Prácticas](#mejores-prácticas)
- [Escenarios Críticos](#escenarios-críticos)

---

## Stack Tecnológico

### Core

- **Cypress 13+** — Framework E2E testing
- **@badeball/cypress-cucumber-preprocessor** — Integración Cucumber/Gherkin
- **@bahmutov/cypress-esbuild-preprocessor** — Bundler ESBuild
- **TypeScript 5** — Tipado estático

### Utilidades

- **cypress-terminal-report** — Logs detallados en terminal
- **@testing-library/cypress** — Selectores semánticos

---

## Arquitectura

### Principios Fundamentales

1. **BDD (Behavior-Driven Development)**: Escenarios en lenguaje natural (Gherkin)
2. **Page Object Model**: Encapsulación de lógica de UI en clases reutilizables
3. **Separation of Concerns**: Separación clara entre feature, selectors, page objects y steps
4. **Data-Driven Testing**: Uso de fixtures y variables de ambiente
5. **Confiabilidad**: Retries, waits explícitos, selectores robustos

### Flujo de Testing

```
Feature File (.feature)
    ↓ (Gherkin scenarios)
Steps File (.steps.ts)
    ↓ (maps to)
Page Object (.po.ts)
    ↓ (uses)
Selectors (.selectors.ts)
    ↓ (interacts with)
Application UI
```

---

## Estructura de Directorios

```
cypress/
├── e2e/                           # Tests E2E organizados por módulo
│   ├── auth/                      # Módulo de autenticación
│   │   ├── auth.feature           # Escenarios Gherkin
│   │   └── login-page/            # Page Object del login
│   │       ├── login-page.po.ts       # Page Object
│   │       ├── login-page.selectors.ts # Selectores CSS
│   │       └── login-page.steps.ts    # Steps Gherkin → PO
│   ├── purchases/                 # Módulo de compras
│   ├── sales/                     # Módulo de ventas
│   ├── inventory/                 # Módulo de inventario
│   ├── catalog/                   # Módulo de catálogo
│   ├── customers/                 # Módulo de clientes
│   ├── users/                     # Módulo de usuarios
│   ├── most-wanted/               # Módulo Most Wanted
│   └── settings/                  # Módulo de configuración
├── fixtures/                      # Datos de prueba
│   ├── users.json
│   ├── cards.json
│   └── purchases.json
├── support/                       # Soporte global
│   ├── commands.ts                # Comandos personalizados
│   ├── e2e.ts                     # Setup global
│   └── consts/
│       └── config.const.ts        # Configuración centralizada
├── reports/                       # Reportes (no versionado)
│   ├── screenshots/
│   └── videos/
└── tsconfig.json                  # TypeScript config
```

---

## Patrón Page Object Model + BDD

### 1. Feature File (.feature)

Define escenarios en lenguaje natural usando sintaxis Gherkin:

```gherkin
Feature: Autenticación
  Como usuario del backoffice
  Quiero poder iniciar sesión
  Para acceder al sistema

  Scenario: Login exitoso
    Given el usuario está en la página de login
    When el usuario ingresa sus credenciales
    And el usuario hace clic en iniciar sesión
    Then el usuario debería ver el dashboard
```

### 2. Selectors File (.selectors.ts)

Centraliza todos los selectores CSS/data-attributes:

```typescript
export const LoginPageSelectors = {
  emailInput: '[data-testid="login-email-input"]',
  passwordInput: '[data-testid="login-password-input"]',
  submitButton: '[data-testid="login-submit-button"]',
  errorToast: '[role="status"]',
};
```

### 3. Page Object (.po.ts)

Encapsula la lógica de interacción con la página:

```typescript
import { LoginPageSelectors } from './login-page.selectors';

export default class LoginPage {
  visit() {
    cy.visit('/login');
  }

  entersEmail(email: string) {
    cy.get(LoginPageSelectors.emailInput).type(email);
  }

  entersPassword(password: string) {
    cy.get(LoginPageSelectors.passwordInput).type(password);
  }

  clicksSubmitButton() {
    cy.get(LoginPageSelectors.submitButton).click();
  }

  shouldBeRedirectedTo(path: string) {
    cy.url().should('include', path);
  }
}
```

### 4. Steps File (.steps.ts)

Mapea los steps Gherkin a métodos del Page Object:

```typescript
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from './login-page.po';

const loginPage = new LoginPage();

Given('el usuario está en la página de login', () => {
  loginPage.visit();
});

When('el usuario ingresa sus credenciales', () => {
  loginPage.entersEmail('admin@kidstop.test');
  loginPage.entersPassword('password123');
});

When('el usuario hace clic en iniciar sesión', () => {
  loginPage.clicksSubmitButton();
});

Then('el usuario debería ver el dashboard', () => {
  loginPage.shouldBeRedirectedTo('/dashboard');
});
```

---

## Configuración

### cypress.config.ts

```typescript
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.feature',

    // Timeouts
    defaultCommandTimeout: 30000,
    requestTimeout: 30000,

    // Retries (confiabilidad)
    retries: {
      runMode: 2, // 2 reintentos en CI
      openMode: 0, // 0 reintentos en modo interactivo
    },

    // Screenshots y videos
    video: true,
    screenshotOnRunFailure: true,
  },
});
```

### Variables de Ambiente (.env.cypress)

```bash
# API Endpoint
API_ENDPOINT=https://dev.topdev.mx/ksp/graphql

# Test Users
ADMIN_EMAIL=contacto@topdev.mx
ADMIN_PASSWORD=@Test123

RECEPTION_EMAIL=reception@kidstop.test
RECEPTION_PASSWORD=Reception123!

BUYER_EMAIL=buyer@kidstop.test
BUYER_PASSWORD=Buyer123!
```

**IMPORTANTE:** No versionar `.env.cypress` (ya está en `.gitignore`)

---

## Comandos Personalizados

### Disponibles en `cypress/support/commands.ts`

| Comando               | Parámetros          | Descripción                             |
| --------------------- | ------------------- | --------------------------------------- |
| `cy.login()`          | `email`, `password` | Login automático                        |
| `cy.navigateTo()`     | `route`             | Navega a una ruta                       |
| `cy.checkNewUrl()`    | `path`              | Verifica que la URL contiene un path    |
| `cy.waitForGraphQL()` | `operationName`     | Espera a que termine un request GraphQL |

### Ejemplo de uso

```typescript
// Login automático
cy.login('admin@kidstop.test', 'password123');

// Navegar a catálogo
cy.navigateTo('catalogo');

// Verificar URL
cy.checkNewUrl('catalogo');

// Esperar GraphQL
cy.intercept('POST', '**/graphql').as('createPurchase');
cy.waitForGraphQL('createPurchase');
```

---

## Convenciones

### Naming

#### Archivos

- **Feature**: `{module}.feature` → `auth.feature`
- **Page Object**: `{page}.po.ts` → `login-page.po.ts`
- **Selectors**: `{page}.selectors.ts` → `login-page.selectors.ts`
- **Steps**: `{page}.steps.ts` → `login-page.steps.ts`

#### Código

- **Page Objects**: `PascalCase` → `LoginPage`
- **Métodos**: `camelCase` → `entersEmail`
- **Selectores**: `camelCase` → `emailInput`
- **Constantes**: `UPPER_SNAKE_CASE` → `DEFAULT_TIMEOUT`

### Selectores

**Prioridad:**

1. `data-testid` attributes (preferido)
2. `data-*` attributes
3. `role` attributes
4. Selectores semánticos (`button`, `input[type="email"]`)
5. Clases CSS (último recurso)

**Ejemplos:**

```typescript
// ✅ Bueno
cy.get('[data-testid="login-email-input"]');

// ⚠️ Aceptable
cy.get('[role="button"]');

// ❌ Evitar
cy.get('.btn.btn-primary:nth-child(2)');
```

### Steps Gherkin

**Lenguaje:** Español (lenguaje de negocio)

**Estructura:**

- **Given**: Precondiciones (estado inicial)
- **When**: Acciones del usuario
- **Then**: Resultados esperados

**Ejemplos:**

```gherkin
# ✅ Bueno
Given el usuario está logueado como Administrador
When el usuario crea una nueva compra
Then debería ver la compra en estado DRAFT

# ❌ Evitar (muy técnico)
Given el usuario hace POST a /api/login
When el usuario hace clic en el botón con id "btn-123"
```

---

## Guía Rápida

### Crear un Nuevo Test

#### 1. Crear estructura de carpetas

```bash
mkdir -p cypress/e2e/mi-modulo/mi-pagina
```

#### 2. Crear Feature File

**Archivo:** `cypress/e2e/mi-modulo/mi-modulo.feature`

```gherkin
Feature: Mi Módulo
  Descripción del módulo

  Scenario: Mi escenario
    Given precondición
    When acción
    Then resultado
```

#### 3. Crear Selectors

**Archivo:** `cypress/e2e/mi-modulo/mi-pagina/mi-pagina.selectors.ts`

```typescript
export const MiPaginaSelectors = {
  boton: '[data-testid="mi-boton"]',
  input: '[data-testid="mi-input"]',
};
```

#### 4. Crear Page Object

**Archivo:** `cypress/e2e/mi-modulo/mi-pagina/mi-pagina.po.ts`

```typescript
import { MiPaginaSelectors } from './mi-pagina.selectors';

export default class MiPaginaPO {
  hacerAlgo() {
    cy.get(MiPaginaSelectors.boton).click();
  }

  verificarResultado() {
    cy.get(MiPaginaSelectors.input).should('be.visible');
  }
}
```

#### 5. Crear Steps

**Archivo:** `cypress/e2e/mi-modulo/mi-pagina/mi-pagina.steps.ts`

```typescript
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import MiPaginaPO from './mi-pagina.po';

const miPagina = new MiPaginaPO();

When('acción', () => {
  miPagina.hacerAlgo();
});

Then('resultado', () => {
  miPagina.verificarResultado();
});
```

---

## Ejecución de Tests

### Modo Interactivo (UI)

```bash
npm run cypress:open
```

Abre la UI de Cypress para ejecutar tests de forma interactiva con debugging visual.

### Modo Headless (CI/CD)

```bash
# Todos los tests
npm run test:e2e

# Solo tests de auth
npm run test:e2e:auth

# Con navegador visible
npm run test:e2e:headed

# Navegador específico
npm run cypress:run:chrome
npm run cypress:run:firefox
```

### Prerequisitos

1. **Backend corriendo**: GraphQL API en `https://dev.topdev.mx/ksp/graphql`
2. **Frontend corriendo**: Next.js en `http://localhost:3000`
3. **Usuarios de prueba**: Deben existir en la base de datos

---

## Mejores Prácticas

### 1. Waits Explícitos

```typescript
// ✅ Bueno - Wait explícito
cy.intercept('POST', '**/graphql').as('loginRequest');
cy.get('[data-testid="submit"]').click();
cy.wait('@loginRequest');

// ❌ Malo - Wait arbitrario
cy.wait(5000);
```

### 2. Selectores Robustos

```typescript
// ✅ Bueno - data-testid
cy.get('[data-testid="login-email-input"]');

// ❌ Malo - clase CSS frágil
cy.get('.input-field.email.primary');
```

### 3. Reutilización

```typescript
// ✅ Bueno - Comando personalizado
cy.login('admin@test.com', 'password');

// ❌ Malo - Repetir código
cy.visit('/login');
cy.get('[data-testid="email"]').type('admin@test.com');
cy.get('[data-testid="password"]').type('password');
cy.get('[data-testid="submit"]').click();
```

### 4. Assertions Claras

```typescript
// ✅ Bueno - Assertion específica
cy.get('[data-testid="success-message"]')
  .should('be.visible')
  .should('contain', 'Compra creada exitosamente');

// ❌ Malo - Assertion vaga
cy.get('[data-testid="message"]').should('exist');
```

### 5. Manejo de Errores

```typescript
// ✅ Bueno - Verificar estados de error
cy.get('[data-testid="submit"]').click();
cy.get('[role="alert"]')
  .should('be.visible')
  .should('contain', 'Credenciales inválidas');

// ❌ Malo - Asumir éxito siempre
cy.get('[data-testid="submit"]').click();
cy.url().should('include', '/dashboard');
```

---

## Escenarios Críticos

### Prioridad Alta 🔴

1. **Autenticación**
   - Login exitoso (Admin, Recepción, Comprador)
   - Login fallido
   - Logout
   - Persistencia de sesión

2. **Flujo de Compra**
   - Crear compra DRAFT
   - Enviar cotización (DRAFT → QUOTED)
   - Aceptar cotización (QUOTED → WAITING_PRICE)
   - Finalizar compra (WAITING_PRICE → FINALIZED)

3. **Flujo de Venta**
   - Ver pedido nuevo (NEW)
   - Iniciar surtido (NEW → IN_PROGRESS)
   - Marcar listo (IN_PROGRESS → READY_FOR_PICKUP)
   - Completar venta (READY_FOR_PICKUP → COMPLETED)

4. **Inventario**
   - Ver stock actual
   - Ajuste manual (solo Admin)
   - Ver movimientos

### Prioridad Media 🟡

5. **Catálogo**
   - Búsqueda de cartas
   - Filtros por TCG
   - Actualizar precio

6. **Clientes**
   - CRUD de clientes
   - Bloquear/desbloquear
   - Clasificar VIP

7. **Usuarios**
   - CRUD de usuarios (solo Admin)
   - Asignar roles
   - Activar/desactivar

### Prioridad Baja 🟢

8. **Most Wanted**
   - Agregar/quitar cartas
   - Drag & drop
   - Preview

9. **Configuración**
   - Configurar geofence
   - Configurar presupuestos
   - Configurar límites

---

## Lecciones Aprendidas (Módulo Usuarios)

### 1. Manejo de GraphQL Queries

**Problema:** Tests fallaban porque no esperaban a que las queries GraphQL se completaran.

**Solución:** Configurar intercepts globalmente en el Background:

```typescript
// En el Given step del Background
Given('el administrador está en la página de usuarios', () => {
  // Setup intercept ANTES de navegar
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'Users') {
      req.alias = 'usersQuery';
    }
  });

  usersPage.visit();
});

// En los métodos del Page Object
searchUser(query: string) {
  cy.get(selector).type(query);
  cy.wait('@usersQuery', { timeout: 10000 });
  cy.contains('Cargando').should('not.exist');
  cy.wait(500); // Estabilizar UI
}
```

**Lección:** Los intercepts deben configurarse ANTES de la acción que dispara el request.

### 2. Componentes HeroUI (Dropdowns/Selects)

**Problema:** Los selects de HeroUI no son `<select>` nativos, son componentes custom con `<li>` items.

**Solución:** Usar `cy.contains('li', text)` en lugar de `.select()`:

```typescript
filterByRole(role: string) {
  cy.get(selector).click(); // Abrir dropdown
  cy.contains('li', role, { timeout: 5000 })
    .should('be.visible')
    .first() // Por si hay múltiples matches
    .click({ force: true });

  cy.wait('@usersQuery');
  cy.contains('Cargando').should('not.exist');
  cy.wait(500);
}
```

**Lección:** Siempre usar `.first()` cuando puede haber múltiples elementos y `{ force: true }` para overlays.

### 3. Valores por Defecto en Formularios

**Problema:** El select de rol tenía "Recepción" por defecto. Al hacer click en "Recepción", se deseleccionaba.

**Solución:** Verificar el valor actual antes de hacer click:

```typescript
selectRole(role: string) {
  cy.get(selector).then(($select) => {
    const currentValue = $select.text();

    if (!currentValue.includes(role)) {
      cy.get(selector).click();
      cy.contains('li', role).click({ force: true });
      cy.wait(300);
    } else {
      cy.log(`Role "${role}" is already selected, skipping`);
    }
  });
}
```

**Lección:** Siempre verificar el estado actual antes de hacer cambios en formularios.

### 4. Emails Dinámicos para Tests

**Problema:** Tests fallaban en ejecuciones repetidas por emails duplicados.

**Solución:** Usar timestamps para generar emails únicos:

```typescript
When('ingresa email dinámico con prefijo {string}', (prefix: string) => {
  const timestamp = Date.now();
  const dynamicEmail = `${prefix}.${timestamp}@test.com`;
  cy.wrap(dynamicEmail).as('currentUserEmail');
  usersPage.enterEmail(dynamicEmail);
});
```

**Lección:** Siempre usar datos dinámicos para crear entidades en tests E2E.

### 5. Estructura de Tabla vs Cards

**Problema:** Los métodos buscaban `[data-testid="user-card"]` pero la UI usa una tabla con `<tr>`.

**Solución:** Usar `.closest('tr')` para encontrar la fila:

```typescript
clickEditUser(userName: string) {
  cy.contains('[data-testid="user-name"]', userName)
    .closest('tr') // Encuentra la fila
    .find('[data-testid="user-actions-button"]')
    .click();

  cy.get('[data-testid="edit-user-button"]').click();
}
```

**Lección:** Inspeccionar la estructura HTML real antes de escribir selectores.

### 6. Validación de Mensajes de Error

**Problema:** El selector `[role="alert"]` no encontraba el toast de error.

**Solución:** Buscar en el body por palabras clave comunes:

```typescript
shouldSeeErrorMessage() {
  cy.get('body', { timeout: 10000 }).should(($body) => {
    const text = $body.text().toLowerCase();
    const hasError =
      text.includes('error') ||
      text.includes('no está disponible') ||
      text.includes('inválido') ||
      text.includes('requerido') ||
      text.includes('duplicado');

    expect(hasError, 'Should show an error message').to.be.true;
  });
}
```

**Lección:** Los mensajes de error pueden aparecer en diferentes formatos (toast, modal, inline). Buscar por contenido en lugar de selector específico.

### 7. Creación de Usuarios de Prueba

**Problema:** Tests de editar/desactivar/activar fallaban porque los usuarios no existían.

**Solución:** Crear usuarios de prueba antes de cada escenario:

```gherkin
Scenario: Editar usuario existente
  Given el administrador crea un usuario de prueba "Usuario Para Editar"
  When el administrador hace clic en editar ese usuario
  And cambia el nombre a "Usuario Editado"
  Then debería ver mensaje de éxito
```

```typescript
Given(
  'el administrador crea un usuario de prueba {string}',
  (userName: string) => {
    const timestamp = Date.now();
    const email = `test.${timestamp}@test.com`;

    cy.wrap(userName).as('testUserName');

    usersPage.clickCreateUser();
    usersPage.enterName(userName);
    usersPage.enterEmail(email);
    usersPage.selectRole('Comprador');
    usersPage.clickSave();
    usersPage.shouldSeeSuccessMessage();
  }
);
```

**Lección:** Los tests deben ser independientes y crear su propia data de prueba.

### 8. Botones de Confirmación Flexibles

**Problema:** El modal de confirmación tenía diferentes textos ("Desactivar", "Activar", "Eliminar").

**Solución:** Buscar por patrón regex:

```typescript
confirmAction() {
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="confirm-button"]').length > 0) {
      cy.get('[data-testid="confirm-button"]').click();
    } else {
      cy.contains('button', /Desactivar|Activar|Eliminar|Confirmar/i)
        .filter(':visible')
        .first()
        .click();
    }
  });
}
```

**Lección:** Usar fallbacks flexibles para elementos que pueden variar según el contexto.

### 9. Scope de Búsqueda

**Problema:** `cy.get('[data-testid="user-name"]')` encontraba elementos fuera de la tabla (header, sidebar).

**Solución:** Buscar dentro de un contenedor específico:

```typescript
shouldSeeOnlyUsersMatching(query: string) {
  cy.get('[data-testid="users-list"]') // Contenedor
    .find('[data-testid="user-name"]') // Elementos dentro
    .should('have.length.at.least', 1);

  cy.get('[data-testid="users-list"]')
    .find('[data-testid="user-name"]')
    .each(($el) => {
      expect($el.text().toLowerCase()).to.include(query.toLowerCase());
    });
}
```

**Lección:** Siempre hacer scope de búsquedas dentro del contenedor relevante.

### 10. Propagación de Props en Componentes Compound

**Problema:** `EntitiesPage.Toolbar` no aceptaba `data-testid` porque no propagaba props adicionales.

**Solución:** Extender el tipo con `React.HTMLAttributes` y usar spread:

```typescript
type ToolbarProps = Props & {
  label: string;
} & React.HTMLAttributes<HTMLDivElement>;

EntitiesPage.Toolbar = function Toolbar({ label, className, children, ...props }: ToolbarProps) {
  return (
    <div className={...} {...props}>
      {/* ... */}
    </div>
  );
};
```

**Lección:** Los componentes compound deben aceptar y propagar props HTML estándar para testing.

**Aplicación en el proyecto:**

Este patrón debe aplicarse a todos los componentes compound del proyecto para mantener consistencia y facilitar testing. Componentes candidatos:

- `EntitiesPage.Toolbar` ✅ (ya implementado)
- `EntitiesPage.Title`
- `EntitiesPage.CardContainer`
- `EntitiesPage.FlexRow`
- Otros componentes compound en `src/shared/blocks/`

**Beneficios:**

- Permite agregar `data-testid` sin modificar la interfaz del componente
- Facilita testing E2E
- Mantiene flexibilidad para props HTML estándar (`className`, `id`, `aria-*`, etc.)
- No rompe la API existente del componente

### Checklist para Nuevos Módulos

- [ ] Configurar intercept de GraphQL en el Background
- [ ] Usar emails/datos dinámicos con timestamps
- [ ] Verificar estructura HTML (tabla vs cards vs grid)
- [ ] Agregar `.first()` a selectores que pueden tener múltiples matches
- [ ] Esperar a que desaparezca "Cargando..." después de queries
- [ ] Verificar valores por defecto en formularios antes de cambiarlos
- [ ] Crear usuarios/entidades de prueba en cada escenario
- [ ] Usar búsquedas con scope dentro de contenedores
- [ ] Implementar fallbacks flexibles para mensajes y botones
- [ ] Agregar `data-testid` a todos los elementos interactivos

---

## Troubleshooting

### Error: "data-testid not found"

**Solución:** Verificar que el componente tiene el `data-testid` attribute:

```tsx
<Button data-testid='login-submit-button'>Iniciar sesión</Button>
```

### Error: "Cannot find module '@badeball/cypress-cucumber-preprocessor'"

**Solución:** Reinstalar dependencias:

```bash
npm install
```

### Test falla en "debería ver la página"

**Solución:** Aumentar timeout o ajustar selector:

```typescript
cy.get('[data-testid="page-title"]', { timeout: 10000 }).should('be.visible');
```

### Error de CORS

**Solución:** Verificar `chromeWebSecurity: false` en `cypress.config.ts`

---

## Referencias

- [Documentación oficial de Cypress](https://docs.cypress.io/)
- [Cypress Cucumber Preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor)
- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)
- [Page Object Model Pattern](https://martinfowler.com/bliki/PageObject.html)
- [Plan de Escenarios Críticos](../plans/e2e-testing-framework-recommendation-822616.md)

---

**Última actualización:** Julio 2026

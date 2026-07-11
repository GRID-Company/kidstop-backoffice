export const config = {
  params: {
    app_url: Cypress.config('baseUrl') || 'http://localhost:3000',
    api_endpoint:
      Cypress.env('API_ENDPOINT') || 'https://dev.topdev.mx/ksp/graphql',

    logins: {
      admin: {
        role: 'ADMIN',
        email: Cypress.env('ADMIN_EMAIL') || 'contacto@topdev.mx',
        password: Cypress.env('ADMIN_PASSWORD') || '@Test123',
      },
      reception: {
        role: 'RECEPTION',
        email: Cypress.env('RECEPTION_EMAIL') || 'reception@kidstop.test',
        password: Cypress.env('RECEPTION_PASSWORD') || 'Reception123!',
      },
      buyer: {
        role: 'BUYER',
        email: Cypress.env('BUYER_EMAIL') || 'buyer@kidstop.test',
        password: Cypress.env('BUYER_PASSWORD') || 'Buyer123!',
      },
    },

    timeouts: {
      short: 5000,
      medium: 10000,
      long: 30000,
      uiStabilization: 500,
      dropdownClose: 300,
      graphqlQuery: 10000,
    },
  },
};

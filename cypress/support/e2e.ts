import './commands';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('cypress-terminal-report/src/installLogsCollector')();

import '@testing-library/cypress/add-commands';

if (Cypress.env('hideXHR')) {
  const app = window.top;
  if (
    app &&
    !app.document.head.querySelector('[data-hide-command-log-request]')
  ) {
    const style = app.document.createElement('style');
    style.setAttribute('data-hide-command-log-request', 'true');
    style.innerHTML =
      '.command-name-request, .command-name-xhr { display: none }';
    app.document.head.appendChild(style);
  }
}

Cypress.on('uncaught:exception', (err) => {
  if (
    err.message.includes('ResizeObserver') ||
    err.message.includes('Hydration') ||
    err.message.includes('chunk')
  ) {
    return false;
  }
  return true;
});

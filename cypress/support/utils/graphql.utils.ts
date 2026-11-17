import type { CyHttpMessages } from 'cypress/types/net-stubbing';

export function getGraphQLOperationName(
  req: CyHttpMessages.IncomingHttpRequest
): string | null {
  const body = req.body as unknown;

  if (body && typeof body === 'object' && 'operationName' in body) {
    const operationName = (body as { operationName?: unknown }).operationName;
    return typeof operationName === 'string' ? operationName : null;
  }

  let text = '';
  if (typeof body === 'string') {
    text = body;
  } else if (body instanceof ArrayBuffer) {
    text = new TextDecoder().decode(body);
  } else if (ArrayBuffer.isView(body)) {
    text = new TextDecoder().decode(body);
  }

  const match = text.match(/"operationName"\s*:\s*"([^"]+)"/);
  return match ? match[1] : null;
}

export function interceptGraphQLOperations(
  operationNames: string[],
  alias?: string
): void {
  cy.intercept('POST', '**/graphql', (req) => {
    const operationName = getGraphQLOperationName(req);
    if (operationName && operationNames.includes(operationName)) {
      req.alias = alias ?? operationName;
    }
  });
}

export function stubGraphQLData(operationName: string, data: unknown): void {
  const dataKey =
    operationName.charAt(0).toLowerCase() + operationName.slice(1);
  cy.intercept('POST', '**/graphql', (req) => {
    if (getGraphQLOperationName(req) !== operationName) return;
    req.reply({
      statusCode: 200,
      body: { data: { [dataKey]: data } },
    });
  });
}

export function stubGraphQLError(
  operationName: string,
  messages: string | string[],
  code = 'BAD_REQUEST'
): void {
  const list = Array.isArray(messages) ? messages : [messages];
  cy.intercept('POST', '**/graphql', (req) => {
    if (getGraphQLOperationName(req) !== operationName) return;
    req.reply({
      statusCode: 200,
      body: {
        data: null,
        errors: list.map((message) => ({
          message,
          extensions: { code },
        })),
      },
    });
  });
}

export const LOGIN_MUTATION = `mutation Login($loginUserInput: LoginUserInput!) {
  login(loginUserInput: $loginUserInput) {
    access_token
  }
}`;

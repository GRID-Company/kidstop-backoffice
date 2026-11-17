import { config } from '../consts/config.const';
import { getGraphQLOperationName, LOGIN_MUTATION } from './graphql.utils';

type CreatedEntityType = 'purchase' | 'seller';

interface CreatedEntity {
  type: CreatedEntityType;
  guid: string;
}

const REGISTRY_KEY = '__e2eCreated';

const CREATE_OPS: Record<string, { type: CreatedEntityType; dataKey: string }> =
  {
    CreatePurchase: { type: 'purchase', dataKey: 'createPurchase' },
    CreateSeller: { type: 'seller', dataKey: 'createSeller' },
  };

const DRAIN_ORDER: CreatedEntityType[] = ['purchase', 'seller'];

const DELETE_MUTATIONS: Record<
  CreatedEntityType,
  { query: string; variables: (guid: string) => Record<string, unknown> }
> = {
  purchase: {
    query: `mutation RejectPurchase($updatePurchaseStatusInput: UpdatePurchaseStatusInput!) {
      updatePurchaseStatus(updatePurchaseStatusInput: $updatePurchaseStatusInput) { guid status }
    }`,
    variables: (guid) => ({
      updatePurchaseStatusInput: { purchaseGuid: guid, newStatus: 'REJECTED' },
    }),
  },
  seller: {
    query: `mutation DeleteSeller($guid: String!) {
      deleteSeller(guid: $guid)
    }`,
    variables: (guid) => ({ guid }),
  },
};

const registry = (): CreatedEntity[] =>
  (Cypress.env(REGISTRY_KEY) as CreatedEntity[] | undefined) ?? [];

export const resetCreatedRegistry = () => {
  Cypress.env(REGISTRY_KEY, []);
};

export const trackCreated = (type: CreatedEntityType, guid?: string) => {
  if (!guid) return;
  if (registry().some((entity) => entity.guid === guid)) return;
  Cypress.env(REGISTRY_KEY, [...registry(), { type, guid }]);
};

export const lastCreatedOfType = (
  type: CreatedEntityType
): string | undefined =>
  [...registry()].reverse().find((entity) => entity.type === type)?.guid;

export const installCreateSniffer = () => {
  cy.intercept('POST', '**/graphql', (req) => {
    req.on('response', (res) => {
      const operationName = getGraphQLOperationName(req);
      const mapping = operationName ? CREATE_OPS[operationName] : undefined;
      if (!mapping) return;
      const guid = (res.body as { data?: Record<string, { guid?: string }> })
        ?.data?.[mapping.dataKey]?.guid;
      trackCreated(mapping.type, guid);
    });
  });
};

const cleanupRequest = (
  token: string,
  query: string,
  variables: Record<string, unknown>
) =>
  cy.request({
    method: 'POST',
    url: (Cypress.env('API_ENDPOINT') || config.params.api_endpoint) as string,
    headers: { Authorization: `Bearer ${token}` },
    body: { query, variables },
    failOnStatusCode: false,
  });

export const drainCreatedEntities = () => {
  const entries = registry();
  resetCreatedRegistry();
  cy.task('cleanup:log', [
    `[e2e-cleanup] drain: ${entries.length} entidades registradas`,
    entries.map((e) => `${e.type}:${e.guid}`).join(', '),
  ]);
  if (!entries.length) return;

  const credentials = config.params.logins.admin;
  cleanupRequest('', LOGIN_MUTATION, {
    loginUserInput: {
      emailAddress: credentials.email,
      password: credentials.password,
    },
  }).then((response) => {
    const token = (
      response.body as { data?: { login?: { access_token?: string } } }
    )?.data?.login?.access_token;
    if (!token) {
      cy.task('cleanup:log', '[e2e-cleanup] login falló, se omite el drenado');
      return;
    }
    const ordered = DRAIN_ORDER.flatMap((type) =>
      entries.filter((entity) => entity.type === type)
    );
    for (const entity of ordered) {
      const mutation = DELETE_MUTATIONS[entity.type];
      cleanupRequest(
        token,
        mutation.query,
        mutation.variables(entity.guid)
      ).then((res) => {
        const errors = (res.body as { errors?: { message: string }[] })?.errors;
        if (errors?.length) {
          cy.task(
            'cleanup:log',
            `[e2e-cleanup] ${entity.type} ${entity.guid}: ${errors
              .map((e) => e.message)
              .join(', ')}`
          );
        }
      });
    }
  });
};

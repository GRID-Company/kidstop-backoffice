import type { CypressRole } from '../consts/config.const';
import { trackCreated } from './cleanup.utils';
import { uniqueName, uniquePhone } from './data.utils';

const CREATE_SELLER = `mutation CreateSeller($createSellerInput: CreateSellerInput!) {
  createSeller(createSellerInput: $createSellerInput) {
    guid
    name
    phone
  }
}`;

interface CreateSellerData {
  createSeller: { guid: string; name: string; phone?: string | null };
}

const FIRST_POKEMON_CARD = `query PokemonCardInternalList($findPokemonCardsPublicArgs: FindPokemonCardsPublicArgs!) {
  pokemonCardInternalList(findPokemonCardsPublicArgs: $findPokemonCardsPublicArgs) {
    data {
      guid
      language
    }
  }
}`;

interface FirstPokemonCardData {
  pokemonCardInternalList: {
    data: Array<{ guid: string; language: string }>;
  };
}

const CREATE_PURCHASE = `mutation CreatePurchase($createPurchaseInput: CreatePurchaseInput!) {
  createPurchase(createPurchaseInput: $createPurchaseInput) {
    guid
    reference
    status
  }
}`;

interface CreatePurchaseData {
  createPurchase: { guid: string; reference: string; status: string };
}

const UPDATE_PURCHASE_STATUS = `mutation UpdatePurchaseStatus($updatePurchaseStatusInput: UpdatePurchaseStatusInput!) {
  updatePurchaseStatus(updatePurchaseStatusInput: $updatePurchaseStatusInput) {
    guid
    status
  }
}`;

export interface TestSeller {
  guid: string;
  name: string;
  phone?: string | null;
}

export interface TestPurchase {
  guid: string;
  reference: string;
  status: string;
  seller: TestSeller;
}

export const createTestSeller = (
  role: CypressRole = 'admin'
): Cypress.Chainable<TestSeller> => {
  return cy.apiLoginAs(role).then(() =>
    cy
      .gql<CreateSellerData>(CREATE_SELLER, {
        createSellerInput: {
          name: uniqueName('Vendedor E2E'),
          phone: uniquePhone(),
          notes: 'Vendedor creado por tests E2E',
        },
      })
      .then((data) => {
        trackCreated('seller', data.createSeller.guid);
        return data.createSeller;
      })
  );
};

export const createTestPurchase = (
  role: CypressRole = 'admin'
): Cypress.Chainable<TestPurchase> => {
  return createTestSeller(role).then((seller) =>
    cy
      .gql<FirstPokemonCardData>(FIRST_POKEMON_CARD, {
        findPokemonCardsPublicArgs: {
          skip: 0,
          limit: 1,
          sort: { column: 'releaseDate', order: 'DESC' },
        },
      })
      .then((cards) => {
        const card = cards.pokemonCardInternalList.data[0];
        if (!card) {
          throw new Error(
            'No hay cartas Pokémon en el catálogo para la prueba'
          );
        }
        return cy
          .gql<CreatePurchaseData>(CREATE_PURCHASE, {
            createPurchaseInput: {
              tcg: 'POKEMON',
              sellerGuid: seller.guid,
              notes: 'Compra creada por tests E2E',
              items: [
                {
                  pokemonCardGuid: card.guid,
                  condition: 'NEAR_MINT',
                  language: card.language,
                  offerPrice: 10,
                  referencePrice: 15,
                  quantity: 1,
                },
              ],
            },
          })
          .then((data) => {
            trackCreated('purchase', data.createPurchase.guid);
            return { ...data.createPurchase, seller };
          });
      })
  );
};

export const quoteTestPurchase = (
  purchaseGuid: string,
  role: CypressRole = 'admin'
) => {
  return cy.apiLoginAs(role).then(() =>
    cy.gql(UPDATE_PURCHASE_STATUS, {
      updatePurchaseStatusInput: {
        purchaseGuid,
        newStatus: 'QUOTED',
      },
    })
  );
};

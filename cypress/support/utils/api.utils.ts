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

const FIRST_POKEMON_CARDS = `query PokemonCardInternalList($findPokemonCardsPublicArgs: FindPokemonCardsPublicArgs!) {
  pokemonCardInternalList(findPokemonCardsPublicArgs: $findPokemonCardsPublicArgs) {
    data {
      guid
      language
    }
  }
}`;

const FIRST_MAGIC_CARDS = `query MagicCardInternalList($findMagicCardsPublicArgs: FindMagicCardsPublicArgs!) {
  magicCardInternalList(findMagicCardsPublicArgs: $findMagicCardsPublicArgs) {
    data {
      guid
      language
    }
  }
}`;

interface CardListData {
  data: Array<{ guid: string; language: string }>;
}

interface PokemonCardListData {
  pokemonCardInternalList: CardListData;
}

interface MagicCardListData {
  magicCardInternalList: CardListData;
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

export interface TestPurchaseOptions {
  tcg?: 'POKEMON' | 'MAGIC';
  itemCount?: number;
}

const CONDITIONS = ['NEAR_MINT', 'LIGHTLY_PLAYED', 'MODERATELY_PLAYED'];
const MAGIC_LANGUAGES = ['ENGLISH', 'SPANISH'];

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

const fetchTestCards = (tcg: 'POKEMON' | 'MAGIC', itemCount: number) => {
  if (tcg === 'MAGIC') {
    return cy
      .gql<MagicCardListData>(FIRST_MAGIC_CARDS, {
        findMagicCardsPublicArgs: {
          skip: 0,
          limit: itemCount,
          sort: { column: 'releaseDate', order: 'DESC' },
        },
      })
      .then((data) => data.magicCardInternalList.data);
  }
  return cy
    .gql<PokemonCardListData>(FIRST_POKEMON_CARDS, {
      findPokemonCardsPublicArgs: {
        skip: 0,
        limit: itemCount,
        sort: { column: 'releaseDate', order: 'DESC' },
      },
    })
    .then((data) => data.pokemonCardInternalList.data);
};

export const createTestPurchase = (
  roleOrOptions: CypressRole | TestPurchaseOptions = 'admin',
  options: TestPurchaseOptions = {}
): Cypress.Chainable<TestPurchase> => {
  const { role, tcg, itemCount } =
    typeof roleOrOptions === 'string'
      ? {
          role: roleOrOptions,
          tcg: 'POKEMON' as const,
          itemCount: 1,
          ...options,
        }
      : {
          role: 'admin' as CypressRole,
          tcg: 'POKEMON' as const,
          itemCount: 1,
          ...roleOrOptions,
        };

  return createTestSeller(role).then((seller) =>
    fetchTestCards(tcg, itemCount).then((cards) => {
      if (cards.length < itemCount) {
        throw new Error(
          `Se necesitan ${itemCount} cartas ${tcg} en el catálogo para la prueba`
        );
      }
      const items = cards.slice(0, itemCount).map((card, index) => ({
        ...(tcg === 'POKEMON'
          ? { pokemonCardGuid: card.guid }
          : { magicCardGuid: card.guid }),
        condition: CONDITIONS[index % CONDITIONS.length],
        language:
          tcg === 'MAGIC'
            ? MAGIC_LANGUAGES[index % MAGIC_LANGUAGES.length]
            : card.language,
        offerPrice: 10 + index,
        referencePrice: 15 + index,
        quantity: 1,
      }));
      return cy
        .gql<CreatePurchaseData>(CREATE_PURCHASE, {
          createPurchaseInput: {
            tcg,
            sellerGuid: seller.guid,
            notes: 'Compra creada por tests E2E',
            items,
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

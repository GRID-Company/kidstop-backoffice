import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type PokemonCardInternalListQueryVariables = Types.Exact<{
  findPokemonCardsPublicArgs: Types.FindPokemonCardsPublicArgs;
}>;

export type PokemonCardInternalListQuery = {
  pokemonCardInternalList: {
    count: number | null;
    data: Array<{
      guid: string;
      name: string;
      setName: string | null;
      setCode: string | null;
      sellPrice: number | null;
      availableStock: boolean;
      totalStock: number;
      imageUri: string | null;
      inventoryCards: Array<{
        condition: string;
        stock: number;
        purchasePrice: number | null;
        sellPrice: number | null;
      }> | null;
    }> | null;
  };
};

export type PokemonCardInternalDetailQueryVariables = Types.Exact<{
  guid: Types.Scalars['String']['input'];
}>;

export type PokemonCardInternalDetailQuery = {
  pokemonCardInternalDetail: {
    guid: string;
    name: string;
    cardNumber: string | null;
    rarity: string | null;
    variant: string | null;
    setName: string | null;
    setCode: string | null;
    sellPrice: number | null;
    totalStock: number;
    imageUri: string | null;
    inventoryCards: Array<{
      condition: string;
      stock: number;
      purchasePrice: number | null;
      sellPrice: number | null;
    }> | null;
  };
};

export type PokemonCardCollectionsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type PokemonCardCollectionsQuery = {
  pokemonCardCollections: Array<{
    guid: string;
    name: string;
    code: string | null;
  }>;
};

export type PokemonCardRaritiesQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type PokemonCardRaritiesQuery = { pokemonCardRarities: Array<string> };

export type PokemonCardVariantsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type PokemonCardVariantsQuery = { pokemonCardVariants: Array<string> };

export type PokemonCardGenresQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type PokemonCardGenresQuery = { pokemonCardGenres: Array<string> };

export const PokemonCardInternalListDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'PokemonCardInternalList' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'findPokemonCardsPublicArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FindPokemonCardsPublicArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pokemonCardInternalList' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'findPokemonCardsPublicArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'findPokemonCardsPublicArgs' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'setName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'setCode' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sellPrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'availableStock' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalStock' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'imageUri' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inventoryCards' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'condition' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'stock' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'purchasePrice' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'sellPrice' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'count' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PokemonCardInternalListQuery,
  PokemonCardInternalListQueryVariables
>;
export const PokemonCardInternalDetailDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'PokemonCardInternalDetail' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'guid' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pokemonCardInternalDetail' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'guid' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'guid' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'cardNumber' } },
                { kind: 'Field', name: { kind: 'Name', value: 'rarity' } },
                { kind: 'Field', name: { kind: 'Name', value: 'variant' } },
                { kind: 'Field', name: { kind: 'Name', value: 'setName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'setCode' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sellPrice' } },
                { kind: 'Field', name: { kind: 'Name', value: 'totalStock' } },
                { kind: 'Field', name: { kind: 'Name', value: 'imageUri' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'inventoryCards' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'condition' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'stock' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'purchasePrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sellPrice' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PokemonCardInternalDetailQuery,
  PokemonCardInternalDetailQueryVariables
>;
export const PokemonCardCollectionsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'PokemonCardCollections' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pokemonCardCollections' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PokemonCardCollectionsQuery,
  PokemonCardCollectionsQueryVariables
>;
export const PokemonCardRaritiesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'PokemonCardRarities' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pokemonCardRarities' },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PokemonCardRaritiesQuery,
  PokemonCardRaritiesQueryVariables
>;
export const PokemonCardVariantsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'PokemonCardVariants' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pokemonCardVariants' },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PokemonCardVariantsQuery,
  PokemonCardVariantsQueryVariables
>;
export const PokemonCardGenresDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'PokemonCardGenres' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'pokemonCardGenres' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PokemonCardGenresQuery,
  PokemonCardGenresQueryVariables
>;

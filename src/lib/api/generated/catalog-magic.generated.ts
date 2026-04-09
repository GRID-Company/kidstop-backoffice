import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type MagicCardInternalListQueryVariables = Types.Exact<{
  findMagicCardsPublicArgs: Types.FindMagicCardsPublicArgs;
}>;

export type MagicCardInternalListQuery = {
  magicCardInternalList: {
    count: number | null;
    data: Array<{
      guid: string;
      name: string;
      edition: string | null;
      collectorNumber: string | null;
      isFoil: boolean;
      sellPrice: number | null;
      availableStock: boolean;
      totalStock: number;
      imageUri: string | null;
      inventoryCards: Array<{
        guid: string;
        condition: string;
        stock: number;
        purchasePrice: number | null;
        sellPrice: number | null;
      }> | null;
    }> | null;
  };
};

export type MagicCardInternalDetailQueryVariables = Types.Exact<{
  guid: Types.Scalars['String']['input'];
}>;

export type MagicCardInternalDetailQuery = {
  magicCardInternalDetail: {
    guid: string;
    name: string;
    edition: string | null;
    collectorNumber: string | null;
    isFoil: boolean;
    rarity: string | null;
    sellPrice: number | null;
    totalStock: number;
    imageUri: string | null;
    inventoryCards: Array<{
      guid: string;
      condition: string;
      stock: number;
      purchasePrice: number | null;
      sellPrice: number | null;
    }> | null;
  };
};

export type MagicCardCollectionsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type MagicCardCollectionsQuery = {
  magicCardCollections: Array<{
    guid: string;
    name: string;
    editionIconUri: string | null;
  }>;
};

export type MagicCardRaritiesQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type MagicCardRaritiesQuery = { magicCardRarities: Array<string> };

export type MagicCardWithMetricsQueryVariables = Types.Exact<{
  guid: Types.Scalars['String']['input'];
}>;

export type MagicCardWithMetricsQuery = {
  magicCardWithMetrics: {
    priceRetail: number | null;
    priceBuy: number | null;
    variantsMetrics: Array<{
      condition: string;
      stock: number;
      lastSellDate: unknown | null;
      avgDaysInInventory: number | null;
      wishlistCount: number;
    }>;
  };
};

export const MagicCardInternalListDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'MagicCardInternalList' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'findMagicCardsPublicArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FindMagicCardsPublicArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'magicCardInternalList' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'findMagicCardsPublicArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'findMagicCardsPublicArgs' },
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
                        name: { kind: 'Name', value: 'edition' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'collectorNumber' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'isFoil' },
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
                              name: { kind: 'Name', value: 'guid' },
                            },
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
  MagicCardInternalListQuery,
  MagicCardInternalListQueryVariables
>;
export const MagicCardInternalDetailDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'MagicCardInternalDetail' },
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
            name: { kind: 'Name', value: 'magicCardInternalDetail' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'edition' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'collectorNumber' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'isFoil' } },
                { kind: 'Field', name: { kind: 'Name', value: 'rarity' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sellPrice' } },
                { kind: 'Field', name: { kind: 'Name', value: 'totalStock' } },
                { kind: 'Field', name: { kind: 'Name', value: 'imageUri' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'inventoryCards' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
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
  MagicCardInternalDetailQuery,
  MagicCardInternalDetailQueryVariables
>;
export const MagicCardCollectionsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'MagicCardCollections' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'magicCardCollections' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'editionIconUri' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  MagicCardCollectionsQuery,
  MagicCardCollectionsQueryVariables
>;
export const MagicCardRaritiesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'MagicCardRarities' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'magicCardRarities' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  MagicCardRaritiesQuery,
  MagicCardRaritiesQueryVariables
>;
export const MagicCardWithMetricsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'MagicCardWithMetrics' },
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
            name: { kind: 'Name', value: 'magicCardWithMetrics' },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'variantsMetrics' },
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
                        name: { kind: 'Name', value: 'lastSellDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avgDaysInInventory' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'wishlistCount' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'priceRetail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceBuy' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  MagicCardWithMetricsQuery,
  MagicCardWithMetricsQueryVariables
>;

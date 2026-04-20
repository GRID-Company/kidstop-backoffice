import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type BulkSearchMagicCardsQueryVariables = Types.Exact<{
  input: Types.BatchSearchMagicCardsInput;
}>;

export type BulkSearchMagicCardsQuery = {
  magicBatchCardSearch: {
    results: Array<{
      originalLine: string;
      parsedName: string | null;
      parsedSet: string | null;
      parsedNumber: string | null;
      bestMatch: {
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
      } | null;
      relatedCards: Array<{
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
      }>;
    }>;
  };
};

export type BulkSearchPokemonCardsQueryVariables = Types.Exact<{
  input: Types.BatchSearchPokemonCardsInput;
}>;

export type BulkSearchPokemonCardsQuery = {
  pokemonBatchCardSearch: {
    results: Array<{
      originalLine: string;
      parsedName: string | null;
      parsedSet: string | null;
      parsedNumber: string | null;
      bestMatch: {
        guid: string;
        name: string;
        cardNumber: string | null;
        setName: string | null;
        setCode: string | null;
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
      } | null;
      relatedCards: Array<{
        guid: string;
        name: string;
        cardNumber: string | null;
        setName: string | null;
        setCode: string | null;
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
      }>;
    }>;
  };
};

export type BulkMagicCardMetricsQueryVariables = Types.Exact<{
  guid: Types.Scalars['String']['input'];
}>;

export type BulkMagicCardMetricsQuery = {
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

export type BulkPokemonCardMetricsQueryVariables = Types.Exact<{
  guid: Types.Scalars['String']['input'];
}>;

export type BulkPokemonCardMetricsQuery = {
  pokemonCardWithMetrics: {
    ungradedPrice: number | null;
    gradedPriceSeven: number | null;
    gradedPriceEightOrAbove: number | null;
    variantsMetrics: Array<{
      condition: string;
      stock: number;
      lastSellDate: unknown | null;
      avgDaysInInventory: number | null;
      wishlistCount: number;
    }>;
  };
};

export const BulkSearchMagicCardsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'BulkSearchMagicCards' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'BatchSearchMagicCardsInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'magicBatchCardSearch' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'results' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'originalLine' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'parsedName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'parsedSet' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'parsedNumber' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'bestMatch' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'guid' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
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
                                    name: {
                                      kind: 'Name',
                                      value: 'purchasePrice',
                                    },
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'relatedCards' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'guid' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
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
                                    name: {
                                      kind: 'Name',
                                      value: 'purchasePrice',
                                    },
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
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  BulkSearchMagicCardsQuery,
  BulkSearchMagicCardsQueryVariables
>;
export const BulkSearchPokemonCardsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'BulkSearchPokemonCards' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'BatchSearchPokemonCardsInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pokemonBatchCardSearch' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'results' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'originalLine' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'parsedName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'parsedSet' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'parsedNumber' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'bestMatch' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'guid' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'cardNumber' },
                            },
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
                                    name: {
                                      kind: 'Name',
                                      value: 'purchasePrice',
                                    },
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'relatedCards' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'guid' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'cardNumber' },
                            },
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
                                    name: {
                                      kind: 'Name',
                                      value: 'purchasePrice',
                                    },
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
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  BulkSearchPokemonCardsQuery,
  BulkSearchPokemonCardsQueryVariables
>;
export const BulkMagicCardMetricsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'BulkMagicCardMetrics' },
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
  BulkMagicCardMetricsQuery,
  BulkMagicCardMetricsQueryVariables
>;
export const BulkPokemonCardMetricsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'BulkPokemonCardMetrics' },
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
            name: { kind: 'Name', value: 'pokemonCardWithMetrics' },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'ungradedPrice' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'gradedPriceSeven' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'gradedPriceEightOrAbove' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  BulkPokemonCardMetricsQuery,
  BulkPokemonCardMetricsQueryVariables
>;

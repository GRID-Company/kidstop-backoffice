import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type PokemonCardScanSearchQueryVariables = Types.Exact<{
  input: Types.CardScanSearchInput;
}>;

export type PokemonCardScanSearchQuery = {
  pokemonCardScanSearch: {
    resolvedByAI: boolean;
    error: string | null;
    bestMatch: {
      guid: string;
      name: string;
      variant: string | null;
      setName: string | null;
      setCode: string | null;
      cardNumber: string | null;
      sellPrice: number | null;
      availableStock: boolean;
      totalStock: number;
      imageUri: string | null;
      language: Types.CardLanguage;
      inventoryCards: Array<{
        guid: string;
        condition: string;
        stock: number;
        purchasePrice: number | null;
        sellPrice: number | null;
      }> | null;
      cardMetrics: {
        ungradedPrice: number | null;
        gradedPriceSeven: number | null;
        gradedPriceEightOrAbove: number | null;
        variantsMetrics: Array<{
          condition: string;
          language: string;
          stock: number;
          lastSellDate: unknown | null;
          avgDaysInInventory: number | null;
          wishlistCount: number;
        }>;
      } | null;
    } | null;
    relatedCards: Array<{
      guid: string;
      name: string;
      variant: string | null;
      setName: string | null;
      setCode: string | null;
      cardNumber: string | null;
      sellPrice: number | null;
      availableStock: boolean;
      totalStock: number;
      imageUri: string | null;
      language: Types.CardLanguage;
    }>;
    aiResolved: {
      name: string | null;
      cardNumber: string | null;
      setCode: string | null;
      setName: string | null;
      cardText: string | null;
      detectedLanguage: string | null;
      nameEs: string | null;
      setNameEs: string | null;
      cardTextEs: string | null;
    } | null;
  };
};

export type MagicCardScanSearchQueryVariables = Types.Exact<{
  input: Types.CardScanSearchInput;
}>;

export type MagicCardScanSearchQuery = {
  magicCardScanSearch: {
    resolvedByAI: boolean;
    error: string | null;
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
      language: Types.CardLanguage;
      inventoryCards: Array<{
        guid: string;
        condition: string;
        stock: number;
        purchasePrice: number | null;
        sellPrice: number | null;
      }> | null;
      cardMetrics: {
        priceRetail: number | null;
        priceBuy: number | null;
        variantsMetrics: Array<{
          condition: string;
          language: string;
          stock: number;
          lastSellDate: unknown | null;
          avgDaysInInventory: number | null;
          wishlistCount: number;
        }>;
      } | null;
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
      language: Types.CardLanguage;
    }>;
    aiResolved: {
      name: string | null;
      cardNumber: string | null;
      setCode: string | null;
      setName: string | null;
      cardText: string | null;
      detectedLanguage: string | null;
      nameEs: string | null;
      setNameEs: string | null;
      cardTextEs: string | null;
    } | null;
  };
};

export const PokemonCardScanSearchDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'PokemonCardScanSearch' },
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
              name: { kind: 'Name', value: 'CardScanSearchInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pokemonCardScanSearch' },
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
                  name: { kind: 'Name', value: 'resolvedByAI' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'bestMatch' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'variant' },
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
                        name: { kind: 'Name', value: 'cardNumber' },
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
                        name: { kind: 'Name', value: 'language' },
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cardMetrics' },
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
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'language' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'stock' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'lastSellDate',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'avgDaysInInventory',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'wishlistCount',
                                    },
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
                              name: {
                                kind: 'Name',
                                value: 'gradedPriceEightOrAbove',
                              },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'variant' },
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
                        name: { kind: 'Name', value: 'cardNumber' },
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
                        name: { kind: 'Name', value: 'language' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'aiResolved' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cardNumber' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'setCode' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'setName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cardText' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'detectedLanguage' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'nameEs' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'setNameEs' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cardTextEs' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PokemonCardScanSearchQuery,
  PokemonCardScanSearchQueryVariables
>;
export const MagicCardScanSearchDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'MagicCardScanSearch' },
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
              name: { kind: 'Name', value: 'CardScanSearchInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'magicCardScanSearch' },
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
                  name: { kind: 'Name', value: 'resolvedByAI' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'bestMatch' },
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
                        name: { kind: 'Name', value: 'language' },
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cardMetrics' },
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
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'language' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'stock' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'lastSellDate',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'avgDaysInInventory',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'wishlistCount',
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'priceRetail' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'priceBuy' },
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
                        name: { kind: 'Name', value: 'language' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'aiResolved' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cardNumber' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'setCode' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'setName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cardText' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'detectedLanguage' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'nameEs' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'setNameEs' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cardTextEs' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  MagicCardScanSearchQuery,
  MagicCardScanSearchQueryVariables
>;

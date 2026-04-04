import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type InventoryItemsQueryVariables = Types.Exact<{
  findInventoryItemsArgs: Types.FindInventoryItemsArgs;
}>;

export type InventoryItemsQuery = {
  inventoryItems: {
    count: number | null;
    data: Array<{
      guid: string;
      tcg: string;
      condition: string;
      stock: number;
      purchasePrice: number | null;
      sellPrice: number | null;
      lastSellDate: unknown | null;
      avgDaysInInventory: number | null;
      pokemonCardSummary: {
        guid: string;
        name: string;
        cardNumber: string | null;
        setName: string | null;
        setCode: string | null;
        rarity: string | null;
        imageUri: string | null;
      } | null;
      magicCardSummary: {
        guid: string;
        name: string;
        edition: string | null;
        collectorNumber: string | null;
        rarity: string | null;
        imageUri: string | null;
        isFoil: boolean;
      } | null;
    }> | null;
  };
};

export type InventoryMovementsQueryVariables = Types.Exact<{
  findInventoryMovementsArgs: Types.FindInventoryMovementsArgs;
}>;

export type InventoryMovementsQuery = {
  inventoryMovements: {
    count: number | null;
    data: Array<{
      guid: string;
      movementType: string;
      quantity: number;
      reference: string | null;
      notes: string;
      createdDate: unknown;
      createdBy: { name: string | null } | null;
      inventoryItem: {
        guid: string;
        tcg: string;
        condition: string;
        stock: number;
        pokemonCardSummary: {
          guid: string;
          name: string;
          cardNumber: string | null;
          setName: string | null;
          setCode: string | null;
          imageUri: string | null;
        } | null;
        magicCardSummary: {
          guid: string;
          name: string;
          edition: string | null;
          collectorNumber: string | null;
          imageUri: string | null;
          isFoil: boolean;
        } | null;
      };
    }> | null;
  };
};

export type IndicatorsInventoryItemsQueryVariables = Types.Exact<{
  tcg?: Types.InputMaybe<Types.Scalars['String']['input']>;
  forceRefresh?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;

export type IndicatorsInventoryItemsQuery = {
  indicatorsInventoryItems: {
    totalStock: number;
    lastSellDate: unknown | null;
    avgDaysInInventory: number | null;
  };
};

export type CreateInventoryMovementMutationVariables = Types.Exact<{
  createInventoryMovementInput: Types.CreateInventoryMovementInput;
}>;

export type CreateInventoryMovementMutation = {
  createInventoryMovement: {
    guid: string;
    movementType: string;
    quantity: number;
    reference: string | null;
    notes: string;
    createdDate: unknown;
  };
};

export type UpdatePokemonCardPricesMutationVariables = Types.Exact<{
  updateInventoryItemPricesInput: Types.UpdateInventoryItemPricesInput;
}>;

export type UpdatePokemonCardPricesMutation = {
  updatePokemonCardPrices: {
    guid: string;
    purchasePrice: number | null;
    sellPrice: number | null;
  };
};

export const InventoryItemsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'InventoryItems' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'findInventoryItemsArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FindInventoryItemsArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'inventoryItems' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'findInventoryItemsArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'findInventoryItemsArgs' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
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
                        name: { kind: 'Name', value: 'pokemonCardSummary' },
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
                              name: { kind: 'Name', value: 'rarity' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'imageUri' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'magicCardSummary' },
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
                              name: { kind: 'Name', value: 'rarity' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'imageUri' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'isFoil' },
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
} as unknown as DocumentNode<InventoryItemsQuery, InventoryItemsQueryVariables>;
export const InventoryMovementsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'InventoryMovements' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'findInventoryMovementsArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FindInventoryMovementsArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'inventoryMovements' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'findInventoryMovementsArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'findInventoryMovementsArgs' },
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'movementType' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quantity' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'reference' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdBy' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inventoryItem' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'guid' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'tcg' },
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
                                value: 'pokemonCardSummary',
                              },
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
                                    name: { kind: 'Name', value: 'imageUri' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'magicCardSummary' },
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
                                    name: {
                                      kind: 'Name',
                                      value: 'collectorNumber',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'imageUri' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'isFoil' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'count' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  InventoryMovementsQuery,
  InventoryMovementsQueryVariables
>;
export const IndicatorsInventoryItemsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'IndicatorsInventoryItems' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'tcg' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'forceRefresh' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'indicatorsInventoryItems' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'tcg' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'tcg' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'forceRefresh' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'forceRefresh' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalStock' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'lastSellDate' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'avgDaysInInventory' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  IndicatorsInventoryItemsQuery,
  IndicatorsInventoryItemsQueryVariables
>;
export const CreateInventoryMovementDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateInventoryMovement' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createInventoryMovementInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateInventoryMovementInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createInventoryMovement' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createInventoryMovementInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createInventoryMovementInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'movementType' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
                { kind: 'Field', name: { kind: 'Name', value: 'reference' } },
                { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateInventoryMovementMutation,
  CreateInventoryMovementMutationVariables
>;
export const UpdatePokemonCardPricesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdatePokemonCardPrices' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateInventoryItemPricesInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateInventoryItemPricesInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updatePokemonCardPrices' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateInventoryItemPricesInput' },
                value: {
                  kind: 'Variable',
                  name: {
                    kind: 'Name',
                    value: 'updateInventoryItemPricesInput',
                  },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'purchasePrice' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'sellPrice' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdatePokemonCardPricesMutation,
  UpdatePokemonCardPricesMutationVariables
>;

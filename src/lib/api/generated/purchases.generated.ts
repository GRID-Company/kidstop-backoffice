import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type PurchasesQueryVariables = Types.Exact<{
  findPurchasesArgs: Types.FindPurchasesArgs;
}>;

export type PurchasesQuery = {
  purchases: {
    count: number | null;
    data: Array<{
      guid: string;
      reference: string;
      status: string;
      tcg: string;
      total: number;
      notes: string | null;
      createdDate: unknown;
      updatedDate: unknown;
      buyer: { guid: string; name: string | null } | null;
      seller: {
        guid: string;
        name: string;
        phone: string | null;
        email: string | null;
        notes: string | null;
      } | null;
      items: Array<{
        guid: string;
        condition: string;
        offerPrice: number;
        referencePrice: number | null;
        sellPrice: number | null;
        quantity: number;
        tcg: string;
        pokemonCardSummary: {
          guid: string;
          name: string;
          setName: string | null;
          setCode: string | null;
          cardNumber: string | null;
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
      payments: Array<{ amount: number; method: string }> | null;
    }> | null;
  };
};

export type PurchaseQueryVariables = Types.Exact<{
  guid: Types.Scalars['String']['input'];
}>;

export type PurchaseQuery = {
  purchase: {
    guid: string;
    reference: string;
    status: string;
    tcg: string;
    total: number;
    notes: string | null;
    createdDate: unknown;
    updatedDate: unknown;
    buyer: { guid: string; name: string | null } | null;
    seller: {
      guid: string;
      name: string;
      phone: string | null;
      email: string | null;
      notes: string | null;
    } | null;
    items: Array<{
      guid: string;
      condition: string;
      offerPrice: number;
      referencePrice: number | null;
      sellPrice: number | null;
      quantity: number;
      tcg: string;
      pokemonCardSummary: {
        guid: string;
        name: string;
        setName: string | null;
        setCode: string | null;
        cardNumber: string | null;
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
    payments: Array<{ amount: number; method: string }> | null;
    createdBy: { guid: string; name: string | null } | null;
  };
};

export type CreatePurchaseMutationVariables = Types.Exact<{
  createPurchaseInput: Types.CreatePurchaseInput;
}>;

export type CreatePurchaseMutation = {
  createPurchase: {
    guid: string;
    reference: string;
    status: string;
    tcg: string;
    total: number;
    notes: string | null;
    createdDate: unknown;
    items: Array<{
      guid: string;
      condition: string;
      offerPrice: number;
      referencePrice: number | null;
      quantity: number;
      pokemonCardSummary: {
        guid: string;
        name: string;
        setName: string | null;
        setCode: string | null;
        cardNumber: string | null;
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
    payments: Array<{ amount: number; method: string }> | null;
  };
};

export type UpdatePurchaseMutationVariables = Types.Exact<{
  updatePurchaseInput: Types.UpdatePurchaseInput;
}>;

export type UpdatePurchaseMutation = {
  updatePurchase: {
    guid: string;
    reference: string;
    status: string;
    tcg: string;
    total: number;
    notes: string | null;
    updatedDate: unknown;
    seller: {
      guid: string;
      name: string;
      phone: string | null;
      email: string | null;
      notes: string | null;
    } | null;
    payments: Array<{ amount: number; method: string }> | null;
  };
};

export type UpdatePurchaseItemsMutationVariables = Types.Exact<{
  updatePurchaseItemsInput: Types.UpdatePurchaseItemsInput;
}>;

export type UpdatePurchaseItemsMutation = {
  updatePurchaseItems: {
    guid: string;
    reference: string;
    status: string;
    total: number;
    items: Array<{
      guid: string;
      condition: string;
      offerPrice: number;
      referencePrice: number | null;
      quantity: number;
      pokemonCardSummary: {
        guid: string;
        name: string;
        setName: string | null;
        setCode: string | null;
        cardNumber: string | null;
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

export type UpdatePurchaseStatusMutationVariables = Types.Exact<{
  updatePurchaseStatusInput: Types.UpdatePurchaseStatusInput;
}>;

export type UpdatePurchaseStatusMutation = {
  updatePurchaseStatus: {
    guid: string;
    reference: string;
    status: string;
    updatedDate: unknown;
  };
};

export type SetPurchaseItemSellPriceMutationVariables = Types.Exact<{
  setPurchaseItemSellPriceInput: Types.SetPurchaseItemSellPriceInput;
}>;

export type SetPurchaseItemSellPriceMutation = {
  setPurchaseItemSellPrice: {
    guid: string;
    offerPrice: number;
    referencePrice: number | null;
    sellPrice: number | null;
    condition: string;
    quantity: number;
  };
};

export type FinalizePurchaseMutationVariables = Types.Exact<{
  purchaseGuid: Types.Scalars['String']['input'];
}>;

export type FinalizePurchaseMutation = {
  finalizePurchase: {
    guid: string;
    reference: string;
    status: string;
    total: number;
    updatedDate: unknown;
    items: Array<{
      guid: string;
      condition: string;
      offerPrice: number;
      sellPrice: number | null;
      quantity: number;
    }> | null;
    payments: Array<{ amount: number; method: string }> | null;
  };
};

export type SellersQueryVariables = Types.Exact<{
  findSellersArgs: Types.FindSellersArgs;
}>;

export type SellersQuery = {
  sellers: {
    count: number | null;
    data: Array<{
      guid: string;
      name: string;
      phone: string | null;
      email: string | null;
      notes: string | null;
      createdDate: unknown;
      updatedDate: unknown;
    }> | null;
  };
};

export type CreateSellerMutationVariables = Types.Exact<{
  createSellerInput: Types.CreateSellerInput;
}>;

export type CreateSellerMutation = {
  createSeller: {
    guid: string;
    name: string;
    phone: string | null;
    email: string | null;
    notes: string | null;
    createdDate: unknown;
    updatedDate: unknown;
    createdBy: { guid: string; name: string | null } | null;
  };
};

export type UpdateSellerMutationVariables = Types.Exact<{
  updateSellerInput: Types.UpdateSellerInput;
}>;

export type UpdateSellerMutation = {
  updateSeller: {
    guid: string;
    name: string;
    phone: string | null;
    email: string | null;
    notes: string | null;
    createdDate: unknown;
    updatedDate: unknown;
  };
};

export type DeleteSellerMutationVariables = Types.Exact<{
  guid: Types.Scalars['String']['input'];
}>;

export type DeleteSellerMutation = { deleteSeller: boolean };

export const PurchasesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Purchases' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'findPurchasesArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FindPurchasesArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'purchases' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'findPurchasesArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'findPurchasesArgs' },
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
                        name: { kind: 'Name', value: 'reference' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'buyer' },
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
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'seller' },
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
                              name: { kind: 'Name', value: 'phone' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'email' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'notes' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
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
                              name: { kind: 'Name', value: 'offerPrice' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'referencePrice' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'sellPrice' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'quantity' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'tcg' },
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
                                    name: {
                                      kind: 'Name',
                                      value: 'collectorNumber',
                                    },
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'payments' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'amount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'method' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedDate' },
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
} as unknown as DocumentNode<PurchasesQuery, PurchasesQueryVariables>;
export const PurchaseDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Purchase' },
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
            name: { kind: 'Name', value: 'purchase' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'reference' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'buyer' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'seller' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'phone' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'condition' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'offerPrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'referencePrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sellPrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quantity' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'payments' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amount' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'method' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'createdBy' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedDate' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PurchaseQuery, PurchaseQueryVariables>;
export const CreatePurchaseDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreatePurchase' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createPurchaseInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreatePurchaseInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createPurchase' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createPurchaseInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createPurchaseInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'reference' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'condition' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'offerPrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'referencePrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quantity' },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'payments' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amount' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'method' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreatePurchaseMutation,
  CreatePurchaseMutationVariables
>;
export const UpdatePurchaseDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdatePurchase' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updatePurchaseInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdatePurchaseInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updatePurchase' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updatePurchaseInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updatePurchaseInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'reference' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'seller' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'phone' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'payments' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amount' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'method' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedDate' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdatePurchaseMutation,
  UpdatePurchaseMutationVariables
>;
export const UpdatePurchaseItemsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdatePurchaseItems' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updatePurchaseItemsInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdatePurchaseItemsInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updatePurchaseItems' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updatePurchaseItemsInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updatePurchaseItemsInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'reference' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'condition' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'offerPrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'referencePrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quantity' },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdatePurchaseItemsMutation,
  UpdatePurchaseItemsMutationVariables
>;
export const UpdatePurchaseStatusDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdatePurchaseStatus' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updatePurchaseStatusInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdatePurchaseStatusInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updatePurchaseStatus' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updatePurchaseStatusInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updatePurchaseStatusInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'reference' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedDate' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdatePurchaseStatusMutation,
  UpdatePurchaseStatusMutationVariables
>;
export const SetPurchaseItemSellPriceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SetPurchaseItemSellPrice' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'setPurchaseItemSellPriceInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'SetPurchaseItemSellPriceInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'setPurchaseItemSellPrice' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'setPurchaseItemSellPriceInput' },
                value: {
                  kind: 'Variable',
                  name: {
                    kind: 'Name',
                    value: 'setPurchaseItemSellPriceInput',
                  },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'offerPrice' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'referencePrice' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'sellPrice' } },
                { kind: 'Field', name: { kind: 'Name', value: 'condition' } },
                { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SetPurchaseItemSellPriceMutation,
  SetPurchaseItemSellPriceMutationVariables
>;
export const FinalizePurchaseDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'FinalizePurchase' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'purchaseGuid' },
          },
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
            name: { kind: 'Name', value: 'finalizePurchase' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'purchaseGuid' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'purchaseGuid' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'reference' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'condition' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'offerPrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sellPrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quantity' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'payments' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amount' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'method' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedDate' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  FinalizePurchaseMutation,
  FinalizePurchaseMutationVariables
>;
export const SellersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Sellers' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'findSellersArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FindSellersArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'sellers' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'findSellersArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'findSellersArgs' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'phone' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedDate' },
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
} as unknown as DocumentNode<SellersQuery, SellersQueryVariables>;
export const CreateSellerDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateSeller' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createSellerInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateSellerInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createSeller' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createSellerInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createSellerInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'phone' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'createdBy' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedDate' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateSellerMutation,
  CreateSellerMutationVariables
>;
export const UpdateSellerDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateSeller' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateSellerInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateSellerInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateSeller' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateSellerInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updateSellerInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'phone' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedDate' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateSellerMutation,
  UpdateSellerMutationVariables
>;
export const DeleteSellerDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteSeller' },
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
            name: { kind: 'Name', value: 'deleteSeller' },
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
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteSellerMutation,
  DeleteSellerMutationVariables
>;

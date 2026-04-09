import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SalesQueryVariables = Types.Exact<{
  findSalesArgs: Types.FindSalesArgs;
}>;

export type SalesQuery = {
  sales: {
    count: number | null;
    data: Array<{
      guid: string;
      saleCode: string;
      status: string;
      tcg: string;
      total: number;
      notes: string | null;
      cancelReason: string | null;
      emailNotificationSent: boolean;
      kioskCustomerName: string | null;
      kioskCustomerEmail: string | null;
      statusTimestamps: string | null;
      createdDate: unknown;
      updatedDate: unknown;
      customer: {
        guid: string;
        name: string | null;
        emailAddress: string;
        phone: string | null;
      } | null;
      items: Array<{
        guid: string;
        tcg: string;
        condition: string;
        quantity: number;
        price: number;
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
    }> | null;
  };
};

export type SaleQueryVariables = Types.Exact<{
  guid: Types.Scalars['String']['input'];
}>;

export type SaleQuery = {
  sale: {
    guid: string;
    saleCode: string;
    status: string;
    tcg: string;
    total: number;
    notes: string | null;
    cancelReason: string | null;
    emailNotificationSent: boolean;
    kioskCustomerName: string | null;
    kioskCustomerEmail: string | null;
    statusTimestamps: string | null;
    createdDate: unknown;
    updatedDate: unknown;
    customer: {
      guid: string;
      name: string | null;
      emailAddress: string;
      phone: string | null;
    } | null;
    items: Array<{
      guid: string;
      tcg: string;
      condition: string;
      quantity: number;
      price: number;
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
    createdBy: { guid: string; name: string | null } | null;
  };
};

export type UpdateSaleStatusMutationVariables = Types.Exact<{
  updateSaleStatusInput: Types.UpdateSaleStatusInput;
}>;

export type UpdateSaleStatusMutation = {
  updateSaleStatus: {
    guid: string;
    saleCode: string;
    status: string;
    statusTimestamps: string | null;
    emailNotificationSent: boolean;
    updatedDate: unknown;
  };
};

export type CancelSaleMutationVariables = Types.Exact<{
  cancelSaleInput: Types.CancelSaleInput;
}>;

export type CancelSaleMutation = {
  cancelSale: {
    guid: string;
    saleCode: string;
    status: string;
    cancelReason: string | null;
    updatedDate: unknown;
  };
};

export const SalesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Sales' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'findSalesArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FindSalesArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'sales' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'findSalesArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'findSalesArgs' },
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
                        name: { kind: 'Name', value: 'saleCode' },
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
                        name: { kind: 'Name', value: 'cancelReason' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'emailNotificationSent' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'customer' },
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
                              name: { kind: 'Name', value: 'emailAddress' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'phone' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'kioskCustomerName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'kioskCustomerEmail' },
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
                              name: { kind: 'Name', value: 'tcg' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'condition' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'quantity' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'price' },
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
                        name: { kind: 'Name', value: 'statusTimestamps' },
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
} as unknown as DocumentNode<SalesQuery, SalesQueryVariables>;
export const SaleDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Sale' },
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
            name: { kind: 'Name', value: 'sale' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'saleCode' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'cancelReason' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'emailNotificationSent' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'customer' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'emailAddress' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'phone' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'kioskCustomerName' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'kioskCustomerEmail' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'condition' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quantity' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'price' } },
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
                  name: { kind: 'Name', value: 'statusTimestamps' },
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
} as unknown as DocumentNode<SaleQuery, SaleQueryVariables>;
export const UpdateSaleStatusDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateSaleStatus' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateSaleStatusInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateSaleStatusInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateSaleStatus' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateSaleStatusInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updateSaleStatusInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'saleCode' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'statusTimestamps' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'emailNotificationSent' },
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
  UpdateSaleStatusMutation,
  UpdateSaleStatusMutationVariables
>;
export const CancelSaleDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CancelSale' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'cancelSaleInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CancelSaleInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cancelSale' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'cancelSaleInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'cancelSaleInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'saleCode' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'cancelReason' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedDate' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CancelSaleMutation, CancelSaleMutationVariables>;

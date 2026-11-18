import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CustomerCardListsQueryVariables = Types.Exact<{
  findCustomerCardListsArgs: Types.FindCustomerCardListsArgs;
}>;

export type CustomerCardListsQuery = {
  customerCardLists: {
    count: number | null;
    data: Array<{
      guid: string;
      name: string;
      tcg: string;
      itemCount: number | null;
      createdDate: unknown;
      updatedDate: unknown;
      customer: {
        guid: string;
        name: string | null;
        emailAddress: string;
        clientStatus: string | null;
      };
    }> | null;
  };
};

export type CustomerCardListQueryVariables = Types.Exact<{
  cardListGuid: Types.Scalars['String']['input'];
}>;

export type CustomerCardListQuery = {
  customerCardList: {
    guid: string;
    name: string;
    tcg: string;
    itemCount: number | null;
    createdDate: unknown;
    updatedDate: unknown;
    customer: {
      guid: string;
      name: string | null;
      emailAddress: string;
      clientStatus: string | null;
    };
    items: Array<{
      guid: string;
      condition: string;
      language: Types.CardLanguage;
      quantity: number;
      availableStock: number | null;
      sellPrice: number | null;
      tcg: string;
      createdDate: unknown;
      pokemonCardSummary: {
        guid: string;
        name: string;
        setName: string | null;
        setCode: string | null;
        cardNumber: string | null;
        imageUri: string | null;
        rarity: string | null;
        variant: string | null;
      } | null;
      magicCardSummary: {
        guid: string;
        name: string;
        edition: string | null;
        collectorNumber: string | null;
        imageUri: string | null;
        rarity: string | null;
        isFoil: boolean;
      } | null;
    }> | null;
  };
};

export type ExportCustomerCardListsQueryVariables = Types.Exact<{
  findCustomerCardListsArgs: Types.FindCustomerCardListsArgs;
}>;

export type ExportCustomerCardListsQuery = {
  exportCustomerCardLists: { downloadUrl: string; filename: string };
};

export type ExportCustomerListsForMarketingQueryVariables = Types.Exact<{
  exportCustomerCardListsMarketingArgs: Types.ExportCustomerCardListsMarketingArgs;
}>;

export type ExportCustomerListsForMarketingQuery = {
  exportCustomerListsForMarketing: { downloadUrl: string; filename: string };
};

export const CustomerCardListsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'CustomerCardLists' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'findCustomerCardListsArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FindCustomerCardListsArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customerCardLists' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'findCustomerCardListsArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'findCustomerCardListsArgs' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'itemCount' },
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
                              name: { kind: 'Name', value: 'clientStatus' },
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
} as unknown as DocumentNode<
  CustomerCardListsQuery,
  CustomerCardListsQueryVariables
>;
export const CustomerCardListDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'CustomerCardList' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'cardListGuid' },
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
            name: { kind: 'Name', value: 'customerCardList' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'cardListGuid' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'cardListGuid' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                { kind: 'Field', name: { kind: 'Name', value: 'itemCount' } },
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'clientStatus' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
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
                        name: { kind: 'Name', value: 'quantity' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'availableStock' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sellPrice' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdDate' },
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
                              name: { kind: 'Name', value: 'imageUri' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'rarity' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'variant' },
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
                              name: { kind: 'Name', value: 'imageUri' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'rarity' },
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
  CustomerCardListQuery,
  CustomerCardListQueryVariables
>;
export const ExportCustomerCardListsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ExportCustomerCardLists' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'findCustomerCardListsArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FindCustomerCardListsArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'exportCustomerCardLists' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'findCustomerCardListsArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'findCustomerCardListsArgs' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'downloadUrl' } },
                { kind: 'Field', name: { kind: 'Name', value: 'filename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ExportCustomerCardListsQuery,
  ExportCustomerCardListsQueryVariables
>;
export const ExportCustomerListsForMarketingDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ExportCustomerListsForMarketing' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: {
              kind: 'Name',
              value: 'exportCustomerCardListsMarketingArgs',
            },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'ExportCustomerCardListsMarketingArgs',
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'exportCustomerListsForMarketing' },
            arguments: [
              {
                kind: 'Argument',
                name: {
                  kind: 'Name',
                  value: 'exportCustomerCardListsMarketingArgs',
                },
                value: {
                  kind: 'Variable',
                  name: {
                    kind: 'Name',
                    value: 'exportCustomerCardListsMarketingArgs',
                  },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'downloadUrl' } },
                { kind: 'Field', name: { kind: 'Name', value: 'filename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ExportCustomerListsForMarketingQuery,
  ExportCustomerListsForMarketingQueryVariables
>;

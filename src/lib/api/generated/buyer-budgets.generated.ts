import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type BuyerBudgetsQueryVariables = Types.Exact<{
  tcg?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type BuyerBudgetsQuery = {
  buyerBudgets: Array<{
    guid: string;
    tcg: string;
    assignedAmount: number;
    usedAmount: number;
    utilization: number;
    createdDate: unknown;
    updatedDate: unknown;
    buyer: { guid: string; name: string | null; emailAddress: string };
  }>;
};

export type UpdateBuyerBudgetMutationVariables = Types.Exact<{
  updateBuyerBudgetInput: Types.UpdateBuyerBudgetInput;
}>;

export type UpdateBuyerBudgetMutation = {
  updateBuyerBudget: {
    guid: string;
    tcg: string;
    assignedAmount: number;
    usedAmount: number;
    utilization: number;
    createdDate: unknown;
    updatedDate: unknown;
    buyer: { guid: string; name: string | null; emailAddress: string };
  };
};

export const BuyerBudgetsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'BuyerBudgets' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'tcg' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'buyerBudgets' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'tcg' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'tcg' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'assignedAmount' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'usedAmount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'utilization' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'buyer' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'emailAddress' },
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
} as unknown as DocumentNode<BuyerBudgetsQuery, BuyerBudgetsQueryVariables>;
export const UpdateBuyerBudgetDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateBuyerBudget' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateBuyerBudgetInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateBuyerBudgetInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateBuyerBudget' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateBuyerBudgetInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updateBuyerBudgetInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'assignedAmount' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'usedAmount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'utilization' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'buyer' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'emailAddress' },
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
  UpdateBuyerBudgetMutation,
  UpdateBuyerBudgetMutationVariables
>;

import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type BranchOfficesQueryVariables = Types.Exact<{
  findBranchOfficesArgs: Types.FindBranchOfficesArgs;
}>;

export type BranchOfficesQuery = {
  branchOffices: {
    count: number | null;
    data: Array<{
      createdDate: unknown;
      guid: string;
      name: string;
      updatedDate: unknown;
    }> | null;
  };
};

export const BranchOfficesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'BranchOffices' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'findBranchOfficesArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FindBranchOfficesArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'branchOffices' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'findBranchOfficesArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'findBranchOfficesArgs' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdDate' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedDate' },
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
} as unknown as DocumentNode<BranchOfficesQuery, BranchOfficesQueryVariables>;

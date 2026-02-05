import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SelectGlassesQueryVariables = Types.Exact<{
  selectGlassesArgs: Types.SelectGlassesArgs;
}>;

export type SelectGlassesQuery = {
  selectGlasses: {
    count: number | null;
    data: Array<{
      guid: string;
      name: string;
      sku: string;
      thickness: number;
    }> | null;
  };
};

export type SelectProfilesQueryVariables = Types.Exact<{
  selectProfilesArgs: Types.SelectProfilesArgs;
}>;

export type SelectProfilesQuery = {
  selectProfiles: {
    count: number | null;
    data: Array<{ guid: string; name: string; sku: string }> | null;
  };
};

export type SelectChapesQueryVariables = Types.Exact<{
  selectChapesArgs: Types.SelectChapesArgs;
}>;

export type SelectChapesQuery = {
  selectChapes: {
    count: number | null;
    data: Array<{
      guid: string;
      line: string;
      name: string;
      sku: string;
      unitMeasure: string;
    }> | null;
  };
};

export const SelectGlassesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'SelectGlasses' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'selectGlassesArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'SelectGlassesArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'selectGlasses' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'selectGlassesArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'selectGlassesArgs' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'thickness' },
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
} as unknown as DocumentNode<SelectGlassesQuery, SelectGlassesQueryVariables>;
export const SelectProfilesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'SelectProfiles' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'selectProfilesArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'SelectProfilesArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'selectProfiles' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'selectProfilesArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'selectProfilesArgs' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
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
} as unknown as DocumentNode<SelectProfilesQuery, SelectProfilesQueryVariables>;
export const SelectChapesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'SelectChapes' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'selectChapesArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'SelectChapesArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'selectChapes' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'selectChapesArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'selectChapesArgs' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'unitMeasure' },
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
} as unknown as DocumentNode<SelectChapesQuery, SelectChapesQueryVariables>;

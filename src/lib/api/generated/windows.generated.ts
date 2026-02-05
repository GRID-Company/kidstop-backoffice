import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type WindowsQueryVariables = Types.Exact<{
  findWindowsArgs: Types.FindWindowsArgs;
}>;

export type WindowsQuery = {
  windows: {
    count: number | null;
    data: Array<{
      categoryType: string | null;
      createdDate: unknown;
      description: string | null;
      guid: string;
      hasMosquitoNet: boolean;
      name: string;
      updatedDate: unknown;
      windowTypes: Array<string>;
      technicalImage: { guid: string; name: string; path: string } | null;
      sampleImages: Array<{ guid: string; name: string; path: string }> | null;
      subWindows: Array<{
        guid: string;
        horizontalProfiles: Array<{ quantity: number }>;
        verticalProfiles: Array<{ quantity: number }>;
      }>;
    }> | null;
  };
};

export type CreateWindowMutationVariables = Types.Exact<{
  createWindowInput: Types.CreateWindowInput;
}>;

export type CreateWindowMutation = { createWindow: { guid: string } };

export const WindowsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Windows' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'findWindowsArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FindWindowsArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'windows' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'findWindowsArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'findWindowsArgs' },
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
                        name: { kind: 'Name', value: 'categoryType' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'description' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hasMosquitoNet' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'windowTypes' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'technicalImage' },
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
                              name: { kind: 'Name', value: 'path' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sampleImages' },
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
                              name: { kind: 'Name', value: 'path' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'subWindows' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'guid' },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'horizontalProfiles',
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'quantity' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'verticalProfiles' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'quantity' },
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
} as unknown as DocumentNode<WindowsQuery, WindowsQueryVariables>;
export const CreateWindowDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateWindow' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createWindowInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateWindowInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createWindow' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createWindowInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createWindowInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateWindowMutation,
  CreateWindowMutationVariables
>;

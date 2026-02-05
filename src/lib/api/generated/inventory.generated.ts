import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetProfileVariantsQueryVariables = Types.Exact<{
  findProfilesArgs: Types.FindProfilesArgs;
}>;

export type GetProfileVariantsQuery = {
  getProfileVariants: {
    count: number | null;
    data: Array<{
      createdDate: unknown;
      guid: string;
      size: number;
      updatedDate: unknown;
      stock: Array<{ guid: string; minStock: number; stock: number }> | null;
      profileGroup: {
        category: string;
        color: string;
        guid: string;
        name: string;
        line: string;
        price: number;
        sku: string;
        supplier: string;
        createdDate: unknown;
        updatedDate: unknown;
      };
    }> | null;
  };
};

export type GetChapesQueryVariables = Types.Exact<{
  findChapesArgs: Types.FindChapesArgs;
}>;

export type GetChapesQuery = {
  getChapes: {
    count: number | null;
    data: Array<{
      category: string;
      color: string;
      createdDate: unknown;
      guid: string;
      line: string;
      name: string;
      price: number;
      sku: string;
      supplier: string;
      unitMeasure: string;
      updatedDate: unknown;
      stock: Array<{ guid: string; minStock: number; stock: number }> | null;
    }> | null;
  };
};

export type GetGlassesQueryVariables = Types.Exact<{
  findGlassesArgs: Types.FindGlassesArgs;
}>;

export type GetGlassesQuery = {
  getGlasses: {
    count: number | null;
    data: Array<{
      category: string;
      guid: string;
      name: string;
      price: number;
      sku: string;
      thickness: number;
      stock: Array<{ minStock: number; stock: number }> | null;
    }> | null;
  };
};

export type CreateProfileMutationVariables = Types.Exact<{
  createProfileInput: Types.CreateProfileInput;
}>;

export type CreateProfileMutation = { createProfile: { guid: string } };

export type CreateChapeMutationVariables = Types.Exact<{
  createChapeInput: Types.CreateChapeInput;
}>;

export type CreateChapeMutation = { createChape: { guid: string } };

export type CreateGlassMutationVariables = Types.Exact<{
  createGlassInput: Types.CreateGlassInput;
}>;

export type CreateGlassMutation = { createGlass: { guid: string } };

export const GetProfileVariantsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetProfileVariants' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'findProfilesArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FindProfilesArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getProfileVariants' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'findProfilesArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'findProfilesArgs' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'size' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'stock' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'guid' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'minStock' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'stock' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'profileGroup' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'category' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'color' },
                            },
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
                              name: { kind: 'Name', value: 'line' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'price' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'sku' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'supplier' },
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
  GetProfileVariantsQuery,
  GetProfileVariantsQueryVariables
>;
export const GetChapesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetChapes' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'findChapesArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FindChapesArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getChapes' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'findChapesArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'findChapesArgs' },
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
                        name: { kind: 'Name', value: 'category' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdDate' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'supplier' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'unitMeasure' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'stock' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'guid' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'minStock' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'stock' },
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
} as unknown as DocumentNode<GetChapesQuery, GetChapesQueryVariables>;
export const GetGlassesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetGlasses' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'findGlassesArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FindGlassesArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getGlasses' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'findGlassesArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'findGlassesArgs' },
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
                        name: { kind: 'Name', value: 'category' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'thickness' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'stock' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'minStock' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'stock' },
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
} as unknown as DocumentNode<GetGlassesQuery, GetGlassesQueryVariables>;
export const CreateProfileDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateProfile' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createProfileInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateProfileInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createProfile' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createProfileInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createProfileInput' },
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
  CreateProfileMutation,
  CreateProfileMutationVariables
>;
export const CreateChapeDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateChape' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createChapeInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateChapeInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createChape' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createChapeInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createChapeInput' },
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
} as unknown as DocumentNode<CreateChapeMutation, CreateChapeMutationVariables>;
export const CreateGlassDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateGlass' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'createGlassInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateGlassInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createGlass' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createGlassInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'createGlassInput' },
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
} as unknown as DocumentNode<CreateGlassMutation, CreateGlassMutationVariables>;

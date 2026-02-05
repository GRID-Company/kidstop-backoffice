import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type UploadFileMutationVariables = Types.Exact<{
  uploadFileArgs: Types.UploadFileInput;
}>;

export type UploadFileMutation = {
  uploadFile: { category: string; guid: string; name: string; path: string };
};

export const UploadFileDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UploadFile' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'uploadFileArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UploadFileInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'uploadFile' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'uploadFileArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'uploadFileArgs' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'path' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UploadFileMutation, UploadFileMutationVariables>;

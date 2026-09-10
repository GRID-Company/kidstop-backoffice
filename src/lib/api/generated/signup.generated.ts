import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type UserFinishSignUpMutationVariables = Types.Exact<{
  userFinishSignupInput: Types.UserFinishSignupInput;
}>;

export type UserFinishSignUpMutation = {
  userFinishSignUp: { success: boolean };
};

export const UserFinishSignUpDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UserFinishSignUp' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'userFinishSignupInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UserFinishSignupInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userFinishSignUp' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'userFinishSignupInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'userFinishSignupInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UserFinishSignUpMutation,
  UserFinishSignUpMutationVariables
>;

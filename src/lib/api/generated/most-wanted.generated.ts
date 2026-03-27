import type * as Types from '../schema-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type MostWantedPokemonCardsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type MostWantedPokemonCardsQuery = {
  mostWantedPokemonCards: Array<{
    guid: string;
    tcg: string;
    priority: string;
    active: boolean;
    notes: string | null;
    createdDate: unknown;
    updatedDate: unknown;
    pokemonCardSummary: {
      guid: string;
      name: string;
      setName: string | null;
      setCode: string | null;
      cardNumber: string | null;
      rarity: string | null;
      imageUri: string | null;
    } | null;
  }>;
};

export type MostWantedMagicCardsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type MostWantedMagicCardsQuery = {
  mostWantedMagicCards: Array<{
    guid: string;
    tcg: string;
    priority: string;
    active: boolean;
    notes: string | null;
    createdDate: unknown;
    updatedDate: unknown;
    magicCardSummary: {
      guid: string;
      name: string;
      edition: string | null;
      collectorNumber: string | null;
      rarity: string | null;
      imageUri: string | null;
      isFoil: boolean;
    } | null;
  }>;
};

export type MostWantedCardsQueryVariables = Types.Exact<{
  findMostWantedCardsArgs: Types.FindMostWantedCardsArgs;
}>;

export type MostWantedCardsQuery = {
  mostWantedCards: {
    count: number | null;
    data: Array<{
      guid: string;
      tcg: string;
      priority: string;
      active: boolean;
      notes: string | null;
      createdDate: unknown;
      updatedDate: unknown;
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

export type MostWantedCardQueryVariables = Types.Exact<{
  mostWantedCardGuid: Types.Scalars['String']['input'];
}>;

export type MostWantedCardQuery = {
  mostWantedCard: {
    guid: string;
    tcg: string;
    priority: string;
    active: boolean;
    notes: string | null;
    createdDate: unknown;
    updatedDate: unknown;
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
  };
};

export type AddMostWantedCardMutationVariables = Types.Exact<{
  addMostWantedCardInput: Types.AddMostWantedCardInput;
}>;

export type AddMostWantedCardMutation = {
  addMostWantedCard: {
    guid: string;
    tcg: string;
    priority: string;
    active: boolean;
    notes: string | null;
    createdDate: unknown;
    updatedDate: unknown;
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
  };
};

export type UpdateMostWantedCardMutationVariables = Types.Exact<{
  updateMostWantedCardInput: Types.UpdateMostWantedCardInput;
}>;

export type UpdateMostWantedCardMutation = {
  updateMostWantedCard: {
    guid: string;
    tcg: string;
    priority: string;
    active: boolean;
    notes: string | null;
    createdDate: unknown;
    updatedDate: unknown;
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
  };
};

export type RemoveMostWantedCardMutationVariables = Types.Exact<{
  mostWantedCardGuid: Types.Scalars['String']['input'];
}>;

export type RemoveMostWantedCardMutation = { removeMostWantedCard: boolean };

export type ReorderMostWantedCardsMutationVariables = Types.Exact<{
  reorderMostWantedCardsInput: Types.ReorderMostWantedCardsInput;
}>;

export type ReorderMostWantedCardsMutation = {
  reorderMostWantedCards: boolean;
};

export const MostWantedPokemonCardsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'MostWantedPokemonCards' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'mostWantedPokemonCards' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priority' } },
                { kind: 'Field', name: { kind: 'Name', value: 'active' } },
                { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pokemonCardSummary' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
  MostWantedPokemonCardsQuery,
  MostWantedPokemonCardsQueryVariables
>;
export const MostWantedMagicCardsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'MostWantedMagicCards' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'mostWantedMagicCards' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priority' } },
                { kind: 'Field', name: { kind: 'Name', value: 'active' } },
                { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'magicCardSummary' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
  MostWantedMagicCardsQuery,
  MostWantedMagicCardsQueryVariables
>;
export const MostWantedCardsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'MostWantedCards' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'findMostWantedCardsArgs' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FindMostWantedCardsArgs' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'mostWantedCards' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'findMostWantedCardsArgs' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'findMostWantedCardsArgs' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'priority' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'active' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
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
  MostWantedCardsQuery,
  MostWantedCardsQueryVariables
>;
export const MostWantedCardDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'MostWantedCard' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'mostWantedCardGuid' },
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
            name: { kind: 'Name', value: 'mostWantedCard' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'mostWantedCardGuid' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'mostWantedCardGuid' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priority' } },
                { kind: 'Field', name: { kind: 'Name', value: 'active' } },
                { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pokemonCardSummary' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
                { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedDate' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MostWantedCardQuery, MostWantedCardQueryVariables>;
export const AddMostWantedCardDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'AddMostWantedCard' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'addMostWantedCardInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'AddMostWantedCardInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'addMostWantedCard' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'addMostWantedCardInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'addMostWantedCardInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priority' } },
                { kind: 'Field', name: { kind: 'Name', value: 'active' } },
                { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pokemonCardSummary' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
  AddMostWantedCardMutation,
  AddMostWantedCardMutationVariables
>;
export const UpdateMostWantedCardDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateMostWantedCard' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateMostWantedCardInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateMostWantedCardInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateMostWantedCard' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateMostWantedCardInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updateMostWantedCardInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tcg' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priority' } },
                { kind: 'Field', name: { kind: 'Name', value: 'active' } },
                { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pokemonCardSummary' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'guid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
  UpdateMostWantedCardMutation,
  UpdateMostWantedCardMutationVariables
>;
export const RemoveMostWantedCardDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveMostWantedCard' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'mostWantedCardGuid' },
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
            name: { kind: 'Name', value: 'removeMostWantedCard' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'mostWantedCardGuid' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'mostWantedCardGuid' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RemoveMostWantedCardMutation,
  RemoveMostWantedCardMutationVariables
>;
export const ReorderMostWantedCardsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'ReorderMostWantedCards' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'reorderMostWantedCardsInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'ReorderMostWantedCardsInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'reorderMostWantedCards' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'reorderMostWantedCardsInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'reorderMostWantedCardsInput' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ReorderMostWantedCardsMutation,
  ReorderMostWantedCardsMutationVariables
>;

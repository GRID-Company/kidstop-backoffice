import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://your-api.com/graphql',

  documents: ['src/lib/api/graphql/**/*.{graphql,gql}'],

  generates: {
    'src/lib/api/schema-types.ts': {
      plugins: ['typescript'],
      config: {
        defaultScalarType: 'unknown',
        scalars: {
          DateTime: 'number',
          JSON: 'unknown',
        },
        skipTypename: true,
      },
    },
    'src/lib/api/': {
      preset: 'near-operation-file',
      presetConfig: {
        baseTypesPath: './schema-types.ts',
        folder: '../generated',
        extension: '.generated.ts',
      },
      plugins: ['typescript-operations', 'typed-document-node'],
      config: {
        useTypeImports: true,
        defaultScalarType: 'unknown',
        scalars: {
          DateTime: 'number',
          JSON: 'unknown',
        },
        skipTypename: true,
        avoidOptionals: {
          field: true,
          inputValue: false,
        },
        skipTypeNameForRoot: true,
      },
    },
  },

  ignoreNoDocuments: true,
};

export default config;

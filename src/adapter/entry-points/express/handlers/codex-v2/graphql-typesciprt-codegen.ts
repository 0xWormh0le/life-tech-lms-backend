import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: './src/adapter/entry-points/express/handlers/codex-v2/schema.graphql',
  generates: {
    './src/adapter/entry-points/express/handlers/codex-v2/_gen/resolvers-type.ts':
      {
        config: {
          useIndexSignature: true,
        },
        plugins: ['typescript', 'typescript-resolvers'],
      },
  },
}

export default config

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest-formatting/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest-formatting',
    'no-type-assertion',
    'import',
  ],
  root: true,
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/require-await': 'off',
    'no-type-assertion/no-type-assertion': 'error',
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './src/domain',
            from: './src/adapter',
          },
          {
            target: './src/domain/entities',
            from: './src/domain/usecases',
          },
          {
            target: './src/adapter/repositories',
            from: './src/adapter/entry-points',
          },
          {
            target: './**/codex-v2/**/*',
            from: './**/{authentication,classlink,clever,clever-roster-sync,codex,maintenance,playerApi}/**/*',
          },
        ],
      },
    ],
    'lines-between-class-members': ['error', 'always'],
    '@typescript-eslint/padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: 'import',
        next: '*',
      },
      {
        blankLine: 'any',
        prev: 'import',
        next: 'import',
      },
      {
        blankLine: 'always',
        prev: 'export',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: 'class',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['const', 'let', 'var'],
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'if',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
    ],
  },
  overrides: [
    {
      files: ['*.test.ts'],
      rules: {
        'no-type-assertion/no-type-assertion': 'off',
      },
    },
  ],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
}

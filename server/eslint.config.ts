import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['**/*.js', 'node_modules', 'dist']),
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      prettier,
    },
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
      globals: {
        NodeJS: true,
      },
    },
    rules: {
      'max-len': ['warn', { code: 120 }],
      'prettier/prettier': 'error',
      eqeqeq: 'error',
      complexity: ['warn', 7],
      'no-case-declarations': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'all', argsIgnorePattern: '^_.*' }],
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      'no-duplicate-imports': 'error',
      'no-nested-ternary': 'error',
      'no-use-before-define': 'warn',
      'func-style': ['warn', 'declaration', { allowArrowFunctions: true }],
      'prefer-arrow-callback': 'warn',
      'no-delete-var': 'error',
      'no-empty-function': 'error',
      'no-empty-pattern': 'error',
      'no-fallthrough': 'error',
      'no-global-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-octal': 'error',
      'no-redeclare': 'error',
      'no-self-assign': 'error',
      'no-shadow-restricted-names': 'error',
      'no-unused-labels': 'error',
      'no-useless-catch': 'error',
      'no-useless-escape': 'error',
      'no-with': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]);

import prettier from 'eslint-plugin-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import { sharedIgnorePatterns, sharedTsRules } from '../eslint.shared.mjs';

export default defineConfig([
  globalIgnores(sharedIgnorePatterns),
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
    rules: sharedTsRules,
  },
]);

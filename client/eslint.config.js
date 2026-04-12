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
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        sourceType: 'module',
      },
    },
    rules: sharedTsRules,
  },
]);

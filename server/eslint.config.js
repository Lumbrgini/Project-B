import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default [
  {
    languageOptions: { globals: globals.browser },
    rules: {
      'no-console': ['error', { allow: ['error'] }],
      'no-var': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      'indent': ['error', 2, { 'SwitchCase': 1 }],
    },
  },
];

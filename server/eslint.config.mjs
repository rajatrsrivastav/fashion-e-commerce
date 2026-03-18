import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    ignores: [
      'node_modules/**',
      'dist/**',
      '.env',
      'package.json',
      'package-lock.json',
    ],
  },
  pluginJs.configs.recommended,
  pluginPrettierRecommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
    {
        // Build output and tooling caches are never linted.
        ignores: ['dist/**', 'coverage/**', 'node_modules/**', '.vitest/**'],
    },

    js.configs.recommended,

    {
        // Type-aware linting, scoped to TypeScript only: the presets below pull in
        // rules that need a TS program and would crash on plain .mjs files.
        files: ['**/*.ts', '**/*.mts', '**/*.cts'],
        extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: globals.node,
        },
        rules: {
            // The library deliberately exposes a static-only utility class.
            '@typescript-eslint/no-extraneous-class': 'off',
            '@typescript-eslint/consistent-type-imports': [
                'error',
                { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/explicit-module-boundary-types': 'error',
            // Formatting numbers into CSS strings is the library's job.
            '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
            // The public color shapes are type aliases on purpose: consumers
            // should not be able to declaration-merge extra fields into them.
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        },
    },

    {
        // Config files: plain ESM, no type information available.
        files: ['**/*.mjs', '**/*.js', '**/*.cjs'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.node,
        },
    },

    {
        // Tests exercise error paths and poke at internals more freely.
        files: ['tests/**/*.ts'],
        rules: {
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
        },
    },

    // Must stay last — disables every rule that conflicts with Prettier.
    prettier
);

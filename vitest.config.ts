import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['tests/**/*.test.ts'],
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'html'],
            include: ['src/**/*.ts'],
            // Re-export barrel, type-only module, and a static data table:
            // none of them contain logic worth a coverage threshold.
            exclude: ['src/index.ts', 'src/types.ts', 'src/html-colors.ts'],
            thresholds: {
                statements: 90,
                branches: 85,
                functions: 90,
                lines: 90,
            },
        },
    },
});

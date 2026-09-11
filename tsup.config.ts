import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    // Dual output so the package works in ESM and CommonJS consumers alike.
    format: ['esm', 'cjs'],
    // Emits index.d.ts (ESM) and index.d.cts (CJS) for TypeScript consumers.
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: false,
    // Matches tsconfig "target": keeps output readable and broadly compatible.
    target: 'es2020',
    outDir: 'dist',
});

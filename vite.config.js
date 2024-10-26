import ts from '@rollup/plugin-typescript'

/** @type {import('vite').UserConfig} */
export default {
    plugins: [
        ts({
            tsconfig: './tsconfig.json', // Link to your tsconfig.json
            declaration: true,
            declarationDir: 'dist', // Output for .d.ts files
            rootDir: 'src', // Source root
        }),
    ],
    build: {
        outDir: 'dist',
        lib: {
            entry: 'src/main.ts',
            formats: ['es'],
        },
    },
    assetsInclude: ['autumn_field_puresky_1k.hdr'],
}

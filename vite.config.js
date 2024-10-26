import ts from '@rollup/plugin-typescript'
import { viteStaticCopy } from 'vite-plugin-static-copy'

/** @type {import('vite').UserConfig} */
export default {
    plugins: [
        ts({
            tsconfig: './tsconfig.json', // Link to your tsconfig.json
            declaration: true,
            declarationDir: 'dist', // Output for .d.ts files
            rootDir: 'src', // Source root
        }),
        viteStaticCopy({
            targets: [
                {
                    src: 'package.json',
                    dest: '',
                },
            ],
        }),
    ],
    build: {
        outDir: 'dist',
        lib: {
            entry: 'src/main.ts',
            formats: ['es'],
            fileName: 'configurator',
        },
    },
    publicDir: false,
}

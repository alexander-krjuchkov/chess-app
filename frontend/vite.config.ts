import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import typedCssModulesPlugin from 'vite-plugin-typed-css-modules';

declare const process: {
    env: Record<string, string>;
};

const isDocker = process.env.VITE_FROM_DOCKER === 'true';

const backendOrigin = isDocker
    ? 'http://backend:3000'
    : 'http://localhost:3000';
const viteServerHost = isDocker;

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), typedCssModulesPlugin()],
    server: {
        port: 5173, // this port is also involved in the auth client settings
        strictPort: true,
        proxy: {
            '/api': backendOrigin,
        },
        host: viteServerHost,
    },
    css: {
        modules: {
            localsConvention: 'camelCaseOnly',
        },
    },
});

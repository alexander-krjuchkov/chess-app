import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

declare const process: {
    env: { [key: string]: string };
};

const isDocker = process.env.VITE_FROM_DOCKER === 'true';

const apiBase = '/api';

const defaultServerConfig = {
    proxy: {
        [apiBase]: 'http://localhost:3000',
    },
};

const serverConfigForDocker = {
    proxy: {
        [apiBase]: 'http://backend:3000',
    },
    port: 5173,
    strictPort: true,
    host: true,
};

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: isDocker ? serverConfigForDocker : defaultServerConfig,
});

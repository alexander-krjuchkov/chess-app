import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

declare const process: {
    env: { [key: string]: string };
};

const isDocker = process.env.VITE_FROM_DOCKER === 'true';

const apiBase = '/api';

const commonServerConfig = {
    port: 5173, // this port is also involved in the auth client settings
    strictPort: true,
};

const standaloneServerConfig = {
    ...commonServerConfig,
    proxy: {
        [apiBase]: 'http://localhost:3000',
    },
};

const serverConfigForDocker = {
    ...commonServerConfig,
    proxy: {
        [apiBase]: 'http://backend:3000',
    },
    host: true,
};

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: isDocker ? serverConfigForDocker : standaloneServerConfig,
});

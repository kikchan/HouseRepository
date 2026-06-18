import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = `http://localhost:${env.PORT || 4000}`;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/auth': backendTarget,
        '/houses': backendTarget,
        '/uploads': backendTarget,
      },
    },
  };
});

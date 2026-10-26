import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      // Keep browser calls same-origin while Apache/XAMPP serves the PHP API on port 80/443.
      // Target HTTPS so Apache does not redirect with 301, and accept local self-signed SSL certs.
      proxy: {
        '/x.moneyy': {
          target: env.XMONEY_PROXY_TARGET || 'https://127.0.0.1',
          changeOrigin: true,
          secure: false,
          headers: {
            Origin: 'http://localhost:3000',
          },
        },
        '/x.money': {
          target: env.XMONEY_PROXY_TARGET || 'https://127.0.0.1',
          changeOrigin: true,
          secure: false,
          headers: {
            Origin: 'http://localhost:3000',
          },
          rewrite: (path) => path.replace(/^\/x\.money(?:\/|$)/, '/x.moneyy/'),
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

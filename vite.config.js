import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: 'localhost',
    port: 3000,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://d2tpstq7myhvzo.cloudfront.net *.amazoncognito.com; connect-src 'self' https://*.amazonaws.com https://*.amazoncognito.com https://backend-api.com https://your-real-backend-url.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-src https://eu-central-1dyayaoak4.auth.eu-central-1.amazoncognito.com; form-action 'self' https://eu-central-1dyayaoak4.auth.eu-central-1.amazoncognito.com;"
    }
  }
});
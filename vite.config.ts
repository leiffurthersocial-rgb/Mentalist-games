import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// `base` is set for GitHub Pages project-page deployment (served from
// https://<user>.github.io/<repo>/). Override with the BASE_PATH env var if
// your repository name differs, e.g. BASE_PATH=/my-fork/ npm run build.
// For a user/organization page (served from the domain root) set BASE_PATH=/.
const base = process.env.BASE_PATH ?? '/Mentalist-games/';

export default defineConfig({
  base,
  plugins: [react()],
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// Defaults to the domain root, which is correct for Vercel (and any host that
// serves the app from its own domain). GitHub Pages project pages are served
// from a /<repo>/ subpath instead — the deploy workflow overrides this via the
// BASE_PATH env var, e.g. BASE_PATH=/my-repo/ npm run build.
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [react()],
});

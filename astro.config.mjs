import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ site: 'https://wivork.com', integrations: [react()], vite: { plugins: [tailwindcss()] }, devToolbar: { enabled: false } });

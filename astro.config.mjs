// @ts-check
import { defineConfig } from 'astro/config';
import { SITIO_URL } from './sitio.mjs';

// https://astro.build/config
export default defineConfig({
  site: SITIO_URL,
  output: 'static',
});

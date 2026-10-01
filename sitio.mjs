// Única fuente del dominio público. La usan astro.config.mjs (site) y scripts/qr.mjs.
// SITIO_CONFIRMADO pasa a true solo cuando SITIO_URL y SITIO_URL/qr abren por HTTPS en un celular (AC-7).

export const SITIO_URL = 'https://ecopunto-intec.pages.dev';
export const SITIO_CONFIRMADO = true;

if (SITIO_URL.endsWith('/')) {
  throw new Error(`SITIO_URL no debe terminar en "/": ${SITIO_URL}`);
}

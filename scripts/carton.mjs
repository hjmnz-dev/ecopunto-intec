// Genera el mosaico de cartón sin costuras (spec 0002).
// AVIF a calidad 56: con menos, la compresión borra las fibras del interior pero no las del borde y se nota la costura.
// Frecuencias en múltiplos de 1/512 para que el mosaico cierre sin costuras.
// Se corre una vez con `npm run carton`; los archivos resultantes se versionan.
import { mkdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

const LIMITE_AVIF = 40 * 1024;
const destino = new URL('../src/assets/texturas/', import.meta.url);

function svg(lado) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}">
  <filter id="carton" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.0390625 0.900390625" numOctaves="3" seed="7" stitchTiles="stitch" result="fibras"/>
    <feColorMatrix in="fibras" type="matrix" result="oscuras"
      values="0 0 0 0 0.561  0 0 0 0 0.384  0 0 0 0 0.220  2.4 0 0 0 -0.9"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.005859375 0.0390625" numOctaves="3" seed="11" stitchTiles="stitch" result="vetas"/>
    <feColorMatrix in="vetas" type="matrix" result="claras"
      values="0 0 0 0 0.784  0 0 0 0 0.604  0 0 0 0 0.416  0 2.2 0 0 -0.85"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.900390625" numOctaves="1" seed="3" stitchTiles="stitch" result="grano"/>
    <feColorMatrix in="grano" type="matrix" result="motas"
      values="0 0 0 0 0.42  0 0 0 0 0.28  0 0 0 0 0.16  0 0 1.6 0 -0.7"/>
    <feMerge>
      <feMergeNode in="SourceGraphic"/>
      <feMergeNode in="claras"/>
      <feMergeNode in="oscuras"/>
      <feMergeNode in="motas"/>
    </feMerge>
  </filter>
  <rect width="100%" height="100%" fill="#ae7a4a" filter="url(#carton)"/>
</svg>`;
}

await mkdir(destino, { recursive: true });

async function generar(lado) {
  const base = sharp(Buffer.from(svg(lado))).flatten({ background: '#ae7a4a' });
  await base
    .clone()
    .avif({ quality: 56, effort: 9 })
    .toFile(new URL('carton.avif', destino).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
  await base
    .clone()
    .webp({ quality: 60 })
    .toFile(new URL('carton.webp', destino).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
  const avif = (await stat(new URL('carton.avif', destino))).size;
  const webp = (await stat(new URL('carton.webp', destino))).size;
  return { avif, webp };
}

let lado = 512;
let pesos = await generar(lado);
if (pesos.avif > LIMITE_AVIF) {
  lado = 256;
  pesos = await generar(lado);
}
console.log(`Cartón ${lado}px: AVIF ${(pesos.avif / 1024).toFixed(1)} KB, WebP ${(pesos.webp / 1024).toFixed(1)} KB`);
if (lado === 256) console.log('Aviso: mosaico de 256 px; se muestra a background-size: 512px.');

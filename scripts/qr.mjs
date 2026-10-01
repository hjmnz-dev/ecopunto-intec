// Genera qr/ecopunto-intec-qr.svg con SITIO_URL + '/qr' (spec 0005: Web Analytics cuenta la ruta /qr aparte).
// Se niega a generar hasta que el enlace esté confirmado en línea (AC-7).
import { mkdir, writeFile } from 'node:fs/promises';
import QRCode from 'qrcode';
import { SITIO_URL, SITIO_CONFIRMADO } from '../sitio.mjs';

if (!SITIO_CONFIRMADO) {
  console.error(
    'SITIO_CONFIRMADO es false en sitio.mjs. Confirma que el enlace abre en un celular (AC-7) antes de generar el QR.',
  );
  process.exit(1);
}

const url = `${SITIO_URL}/qr`;
const svg = await QRCode.toString(url, {
  type: 'svg',
  errorCorrectionLevel: 'M',
  margin: 4,
  color: { dark: '#000000', light: '#ffffff' },
});

const destino = new URL('../qr/ecopunto-intec-qr.svg', import.meta.url);
await mkdir(new URL('../qr/', import.meta.url), { recursive: true });
await writeFile(destino, svg);
console.log(`QR generado en qr/ecopunto-intec-qr.svg con la URL: ${url}`);

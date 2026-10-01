# Verify: contador de visitas · spec 0005 · updated 2026-10-01

_Steps derived from spec 0005 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] En el panel de Cloudflare, Workers & Pages → `ecopunto-intec` → Metrics → Web Analytics muestra el medidor activado, y hubo un push después de activarlo → AC-1 (comprobado: lo activaste y el beacon aparece desde el push `c848664`)
- [x] Abrir `SITIO_URL/qr` en un celular → la página completa, la barra conserva `/qr`, y en la red sale una petición a `cloudflareinsights.com` → AC-1, AC-2 (comprobado con vista de celular 375 px: ruta `/qr`, `cdn-cgi/rum` respondió 204)
- [ ] Escanear `qr/ecopunto-intec-qr.svg` con un celular → abre `https://ecopunto-intec.pages.dev/qr` → AC-3 (decodificado con OpenCV desde el SVG: da esa URL; falta escanearlo con la cámara de un celular)
- [x] Abrir una vez `/` y una vez `/qr` desde un celular; de 5 a 15 minutos después, el panel (host `ecopunto-intec.pages.dev`) muestra las visitas totales y, filtrando por la ruta `/qr`, la visita del QR → AC-4 (fila de Value sourcing: visitas totales, visitas desde el QR, ruta que ve el medidor) (comprobado por ti en el panel)
- [x] Recorrer `/` y `/qr` hasta el pie → `document.cookie` vacío, cero cookies en la pestaña Application, `localStorage` y `sessionStorage` vacíos, ningún aviso de cookies → AC-5
- [x] El pie muestra debajo de los créditos "Contamos las visitas sin cookies y sin guardar datos personales." → AC-6 (fila de Value sourcing: línea de privacidad, sale de `campana.creditos.privacidad`)
- [x] Bloquear `static.cloudflareinsights.com` en las herramientas del navegador y recargar → escenas, juego y quiz funcionan igual, sin errores propios en consola → AC-7 (comprobado con la página local, que no trae el script: juego y quiz responden, GSAP corre, cero errores)
- [x] Con JavaScript desactivado, `/qr` se lee completa → AC-7 (comprobado en el HTML servido de `/qr`: 5 escenas, avisos sin JS del juego y del quiz y el pie completos)

## Commands

- [x] `curl -s SITIO_URL/ | grep -c beacon.min.js` y lo mismo con `/qr` → 1 en ambas (el token lo inyecta Cloudflare, no está en el repo) → AC-1 (fila de Value sourcing: script de medición)
- [x] `curl -sI SITIO_URL/qr` y `curl -sI SITIO_URL/qr/` → `HTTP/1.1 200`, sin cabecera `Location` → AC-2
- [x] `curl -s SITIO_URL/qr | grep canonical` → `href="https://ecopunto-intec.pages.dev"`, sin `/qr`; igual `og:url` → AC-2 (fila de Value sourcing: canonical y `og:url`)
- [x] `npm run qr` → imprime `https://ecopunto-intec.pages.dev/qr` y el SVG no cambia en git → AC-3 (fila de Value sourcing: URL dentro del QR)
- [x] `curl -sI "SITIO_URL/?src=qr"` → `HTTP/1.1 200` → AC-7
- [x] `npm run check`, `npm run build`, `npm run format:check` → pasan; `dist/_redirects` existe con `/qr / 200` y `/qr/ / 200` → AC-7

## Acceptance-criteria coverage

- AC-1: panel activado, petición a `cloudflareinsights.com`, `curl` del beacon
- AC-2: `curl -sI` de `/qr` y `/qr/`, barra conserva `/qr`, canonical
- AC-3: `npm run qr`, escaneo con celular
- AC-4: panel con total y ruta `/qr`
- AC-5: cookies y almacenamiento vacíos
- AC-6: línea de privacidad en el pie
- AC-7: script bloqueado, sin JS, `?src=qr` en 200, check, build y formato

## Estado al cerrar `/develop` (2026-10-01)

Comprobado en línea: AC-2 (200 sin `Location` en `/qr` y `/qr/`, mismo `<title>`, canonical y `og:url` sin ruta), AC-6, AC-7 (`?src=qr` en 200; check, build y formato pasan) y AC-5 en `/qr` (sin cookies ni almacenamiento, sin `Set-Cookie`). AC-3 comprobado por código: el SVG es idéntico al que se genera para `https://ecopunto-intec.pages.dev/qr`; falta escanearlo con un celular. Pendiente: AC-1 y AC-4, que esperan que actives Web Analytics.

Después de activar Web Analytics (commit `c848664`): AC-1 comprobado en línea. `beacon.min.js` (con `defer`) está en `/`, `/qr`, `/qr/` y `/?src=qr`, y al abrir `/qr` sale la petición a `cloudflareinsights.com/cdn-cgi/rum`, sin cookies, sin almacenamiento y sin errores en consola. Pendiente: AC-4 (mirar el panel) y escanear el QR.

AC-4 confirmado por ti en el panel de Web Analytics (2026-10-01): se ven las visitas totales y las de la ruta `/qr`. Pendiente: escanear el QR con un celular.

`/check verify` (2026-10-01): PASS en AC-1 a AC-7. Los seis comandos y siete de los ocho pasos manuales quedaron marcados. El escaneo con cámara sigue sin marcar: el QR se decodificó con OpenCV y da `https://ecopunto-intec.pages.dev/qr`, pero conviene escanearlo con un celular antes de imprimirlo.

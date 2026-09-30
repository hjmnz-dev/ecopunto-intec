# Verify: Stack y publicación · spec 0001 · updated 2026-09-30
_Steps derived from spec 0001 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
- [x] Corre `npm run dev`, abre `http://localhost:4321` arriba del todo y baja hasta la segunda sección → los tres textos con `data-animar` entran con un fundido hacia arriba, una sola vez → AC-1
- [x] Activa movimiento reducido en el sistema (Windows: Configuración, Accesibilidad, Efectos visuales, Efectos de animación apagado) y recarga → la sección de prueba ya está visible, sin fundido ni parpadeo → AC-2
- [x] Desactiva JavaScript en el navegador y recarga → todo el texto se ve de inmediato → AC-3
- [x] Bloquea el script de animación (DevTools, Network, bloquear la URL de `animaciones`) y recarga → el contenido aparece como mucho a los 3 segundos → AC-3
- [x] Abre `https://ecopunto-intec.pages.dev` y `https://ecopunto-intec.pages.dev/?src=qr` en un celular con datos móviles → ambas responden 200 por HTTPS y la segunda conserva `?src=qr` en la barra de direcciones → AC-7
- [x] Haz un push pequeño a `main` → Cloudflare Pages publica un nuevo deploy sin pasos manuales → AC-7

## Commands
- [x] `npm run build` → termina sin errores y `dist/` solo tiene archivos estáticos (`index.html`, `_astro/`, favicons) → AC-4
- [x] `npm run check` → `0 errors, 0 warnings` → AC-5
- [x] `git remote -v` y `git status -sb` → `origin` apunta a `hjmnz-dev/ecopunto-intec` (público) y `main` está al día; `package-lock.json`, `docs/`, `.agents/`, `.claude/`, `.mcp.json` y `skills-lock.json` están versionados → AC-6
- [x] `curl -sI https://ecopunto-intec.pages.dev/?src=qr` → `HTTP/2 200`, sin `Location` → AC-7

## Value sourcing
- [x] Dominio: `SITIO_URL` en `sitio.mjs` coincide con el subdominio que muestra el panel de Cloudflare; cambia temporalmente el valor a uno con `/` final y corre `npm run build` → falla con el error de barra final
- [x] `SITIO_CONFIRMADO`: con `false`, `npm run qr` se niega a generar; con `true` (después de AC-7) genera `qr/ecopunto-intec-qr.svg` e imprime `https://ecopunto-intec.pages.dev/?src=qr`
- [x] Canonical: en `dist/index.html`, `<link rel="canonical">` es `https://ecopunto-intec.pages.dev`, sin `?src=qr` ni barra final, aunque la página se abra con `?src=qr`
- [x] URL del QR: escanea el SVG generado con un celular → abre `SITIO_URL/?src=qr`
- [x] Título y descripción: por ahora vienen de `index.astro` como props de `Base.astro`; pasan a `src/data/campana.ts` en la parte #4
- [x] Animar o no: con `prefers-reduced-motion: reduce` los elementos no reciben estilos de GSAP; sin JS la clase `js` nunca se agrega

## Acceptance-criteria coverage
- AC-1 … paso 1 de UI · AC-2 … paso 2 · AC-3 … pasos 3 y 4 · AC-4 … `npm run build` · AC-5 … `npm run check` · AC-6 … `git remote` · AC-7 … pasos 5 y 6 de UI y `curl`

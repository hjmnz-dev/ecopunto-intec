# 0005. Contador de visitas: Cloudflare Web Analytics y la ruta /qr

**Date**: 2026-10-01
**Status**: In Progress

## Summary

Para el informe del proyecto, la página cuenta sus visitas con Cloudflare Web Analytics, el medidor gratuito del mismo proveedor donde ya está publicada, que no usa cookies ni guarda datos personales. Como ese medidor ignora la parte `?src=qr` de la dirección, el QR pasa a apuntar a `SITIO_URL/qr`, una ruta que muestra exactamente la misma página y que el panel cuenta por separado. Para construir esto hace falta una línea de reescritura (servir `/` cuando piden `/qr`), regenerar el QR, una línea de privacidad en el pie y que tú actives Web Analytics en el panel de Cloudflare. No hay código de medición en el repo ni claves que guardar.

## Requirements

**User stories**:
- Como equipo de la campaña, quiero ver cuántas visitas tuvo la página y cuántas llegaron desde el QR, para ponerlo en el informe del proyecto.
- Como estudiante que escanea el QR, quiero que la página abra igual que siempre, sin avisos de cookies ni datos míos guardados, para leerla sin fricción.

**Acceptance criteria** (el contrato):
- **AC-1**: Web Analytics está activado en el proyecto `ecopunto-intec` de Cloudflare Pages y, después del siguiente despliegue, el HTML servido en `SITIO_URL` y en `SITIO_URL/qr` incluye el script `static.cloudflareinsights.com/beacon.min.js`, y al abrir la página sale una petición a `cloudflareinsights.com`.
- **AC-2**: `SITIO_URL/qr` y `SITIO_URL/qr/` responden 200 por HTTPS con la misma página que `/` (mismo `<title>`, mismo contenido), sin redirección: la barra de direcciones conserva `/qr`. El `canonical` y `og:url` siguen siendo `SITIO_URL`, sin `/qr`.
- **AC-3**: `npm run qr` genera `qr/ecopunto-intec-qr.svg` con la URL `SITIO_URL/qr` (y la imprime en consola); escanear ese QR con un celular abre `SITIO_URL/qr`.
- **AC-4**: En el panel de Web Analytics del sitio, de 5 a 15 minutos después de abrir una vez `/` y una vez `/qr` desde un celular, se ven las visitas totales del sitio y, filtrando por la ruta `/qr`, las que llegaron desde el QR.
- **AC-5**: Al abrir `/` y `/qr`, el navegador no recibe ni guarda cookies (`document.cookie` vacío, ninguna cookie en las herramientas del navegador) y la página no escribe nada en `localStorage` ni `sessionStorage`. No aparece ningún aviso de cookies.
- **AC-6**: El pie muestra, debajo de los créditos, la línea de privacidad leída de `campana.creditos.privacidad` ("Contamos las visitas sin cookies y sin guardar datos personales.").
- **AC-7**: La medición no cambia la página: `SITIO_URL/?src=qr` (el QR viejo) sigue abriendo la página con 200; sin JavaScript, con un bloqueador de anuncios o si el script de Cloudflare no carga, todo se ve y funciona igual; `npm run check`, `npm run build` y `npm run format:check` pasan.

## Decision

**Chosen option**: Option 1: Cloudflare Web Analytics con la ruta `/qr` servida por reescritura

Se activa Cloudflare Web Analytics desde el panel de Pages (Cloudflare inyecta su script al publicar) y el QR apunta a `/qr`, que `public/_redirects` sirve con el contenido de `/` (estado 200, sin redirigir), para que el panel cuente esas visitas como una ruta aparte.

**Implementation skills**: `cloudflare` (`cloudflare/skills`, `.agents/skills/cloudflare/`, referencias `web-analytics/` y `pages/`) · `web-perf` (`cloudflare/skills`, `.agents/skills/web-perf/`)

## Feature design

**Data model sketch**:
No hay datos propios. Lo único que existe vive en Cloudflare:

| Dato | Dónde vive | Quién lo escribe | Retención |
|---|---|---|---|
| Visita (ruta, país, tipo de dispositivo, navegador, origen) | Panel de Web Analytics del sitio `ecopunto-intec.pages.dev` | El script de Cloudflare, una vez por carga de página | 6 meses, después se borra solo |

Nada se guarda en el navegador del estudiante ni en el repo.

**State transitions**: no aplica.

**API surface** (rutas e interfaces que esta parte toca):

| Ruta o interfaz | Método | Entradas | Salida | Acceso | Errores clave |
|---|---|---|---|---|---|
| `SITIO_URL/` | GET | ninguna (`?src=qr` se ignora) | La página, con el script de Web Analytics | Público | Ninguno nuevo |
| `SITIO_URL/qr` y `/qr/` | GET | ninguna | El mismo HTML de `/`, estado 200, la URL queda en `/qr` | Público | Si la regla falta: 404 (por eso AC-2 se comprueba antes de regenerar el QR) |
| `public/_redirects` | archivo | `/qr / 200` y `/qr/ / 200` | Regla de reescritura que Cloudflare Pages lee de `dist/_redirects` | Repo | Una regla mal escrita no rompe `/`, solo `/qr` |
| `scripts/qr.mjs` (`npm run qr`) | CLI | `SITIO_URL`, `SITIO_CONFIRMADO` de `sitio.mjs` | `qr/ecopunto-intec-qr.svg` con `SITIO_URL/qr` | Local | Se niega si `SITIO_CONFIRMADO` es `false` (sin cambios) |
| Panel de Web Analytics | dashboard | Filtro por host `ecopunto-intec.pages.dev` y por ruta | Visitas y vistas de página | Tu cuenta de Cloudflare | Sin API: los números se leen o se capturan del panel |

**Value sourcing**:

| Acción | Valor que produce o muestra | Fuente |
|---|---|---|
| Informe: visitas totales | Métrica "Visits" del sitio, todas las rutas | Panel de Web Analytics, filtrado por host `ecopunto-intec.pages.dev` |
| Informe: visitas desde el QR | Métrica "Visits" con la ruta `/qr` (más `/qr/` si aparece) | Panel de Web Analytics, filtro de ruta |
| Script de medición en el HTML | `beacon.min.js` con su token | Cloudflare lo inyecta en cada despliegue al activar Web Analytics en Pages; no hay token en el repo |
| Ruta que ve el medidor | `/qr` | `location.pathname`, que la reescritura 200 conserva |
| URL dentro del QR | `SITIO_URL/qr` | `sitio.mjs` (`SITIO_URL`) más el sufijo `/qr` decidido aquí, en `scripts/qr.mjs` |
| Línea de privacidad del pie | "Contamos las visitas sin cookies y sin guardar datos personales." | `campana.creditos.privacidad` en `src/data/campana.ts` (campo nuevo en el tipo `Campana`) |
| Canonical y `og:url` | `SITIO_URL` sin ruta | `Base.astro`, sin cambios (ya se calcula desde `Astro.site`) |

**Key invariants**:
- `/qr` y `/` sirven el mismo HTML; no existe un `src/pages/qr.astro` ni una copia del contenido.
- El canonical nunca incluye `/qr` ni `?src=qr`.
- El repo no contiene el script de Cloudflare ni su token; quitar Web Analytics es apagarlo en el panel.
- La página no usa cookies, `localStorage` ni `sessionStorage`.
- La medición nunca bloquea la página: el script llega con `defer` desde Cloudflare y ningún código de la página depende de él.

**Security model**:
Público, solo lectura. El panel solo lo ve quien tenga acceso a tu cuenta de Cloudflare. Web Analytics no usa cookies, no guarda direcciones IP y no sigue a nadie entre sitios, así que no hace falta aviso de cookies ni consentimiento; la línea del pie es por transparencia. No hay datos personales en juego, así que no aplica ningún marco de cumplimiento.

**Configuration required**:
- Ninguna variable de entorno ni secreto.
- Requisito previo, en tus manos: en el panel de Cloudflare, **Workers & Pages → `ecopunto-intec` → Metrics → Web Analytics → Enable**. El script aparece en el siguiente despliegue (cualquier push a `main`).

**Critical test scenarios**:
- Happy path: abrir `/qr` en un celular → la página completa, la barra dice `/qr`, sale la petición a `cloudflareinsights.com`, y a los 15 minutos el panel muestra 1 visita en `/qr`, verifies **AC-1**, **AC-2**, **AC-4**
- Failure case: bloquear `static.cloudflareinsights.com` en las herramientas del navegador → la página, las escenas, el juego y el quiz funcionan igual y no hay errores propios en consola, verifies **AC-7**
- Privacidad: después de recorrer `/` y `/qr`, la pestaña Application del navegador muestra cero cookies y almacenamiento vacío, verifies **AC-5**
- QR: `npm run qr` imprime `https://ecopunto-intec.pages.dev/qr`; escanear el SVG abre esa dirección, verifies **AC-3**

## Build plan

Skateboard: cada paso deja la página publicada y presentable. El QR se regenera solo cuando `/qr` ya responde en línea, igual que la regla de `SITIO_CONFIRMADO` del spec 0001.

1. **Tú**: activa Web Analytics en Pages (ruta en *Configuration required*). Hazlo primero para que el próximo push ya publique con el script, satisfies **AC-1**
2. Crear `public/_redirects` con un comentario en español y las dos reglas `/qr / 200` y `/qr/ / 200`; actualizar el comentario de `Base.astro` que menciona `?src=qr` para que hable de `/qr`, satisfies **AC-2**, **AC-7**
3. Agregar `privacidad: string` al tipo de `creditos` y su texto en `src/data/campana.ts`; mostrarla en el `<footer class="pie">` de `src/pages/index.astro` como un segundo párrafo con los tokens existentes, satisfies **AC-6**
4. `npm run check`, `npm run build`, `npm run format:check`; confirmar que `dist/_redirects` existe; commit y push a `main`, satisfies **AC-7**
5. En línea: `curl -sI SITIO_URL/qr` y `/qr/` → 200 sin `Location`; el HTML de `/` y `/qr` trae `beacon.min.js`; `?src=qr` sigue en 200, satisfies **AC-1**, **AC-2**, **AC-7**
6. Cambiar `scripts/qr.mjs` para codificar `${SITIO_URL}/qr` (comentario de cabecera incluido), correr `npm run qr`, escanear el SVG y hacer commit del nuevo `qr/ecopunto-intec-qr.svg`, satisfies **AC-3**
7. Comprobar cookies y almacenamiento en `/` y `/qr`, abrir `/` y `/qr` desde un celular y revisar el panel a los 15 minutos, satisfies **AC-4**, **AC-5**

## Consequences

**Positive**:
- Cero código de medición y cero cuentas nuevas: todo queda con el mismo proveedor que ya publica la página.
- Sin cookies ni aviso de consentimiento; la página no pierde peso de forma notable (un script pequeño con `defer`).
- La URL del QR queda más corta (`/qr` en vez de `/?src=qr`), así el código impreso tiene menos puntos y se escanea mejor.

**Negative / tradeoffs**:
- El panel no tiene API: los números del informe se leen a mano o con captura de pantalla.
- Los datos duran 6 meses; si el informe se entrega después, hay que capturar los números antes.
- Quien bloquea anuncios o rastreadores no se cuenta, así que el número real es algo mayor que el del panel. Conviene decirlo en el informe.
- Las visitas del propio equipo al probar también cuentan; no hay forma limpia de excluirlas sin cookies.
- Si alguien copia la dirección desde la barra estando en `/qr` y la comparte, esas visitas cuentan como QR. El canonical apunta a `/`, y Chrome en Android comparte el canonical, así que el efecto debería ser pequeño.
- Web Analytics no da "personas únicas", solo visitas y vistas de página. El informe habla de visitas.
- `/qr` no existe en `npm run dev` (la reescritura solo la hace Cloudflare); se prueba en línea.

**Neutral**:
- El QR viejo (`/?src=qr`) sigue funcionando, pero sus visitas se cuentan solo en el total.
- Las publicaciones de prueba (subdominios con el hash del despliegue) pueden aparecer en el panel; se filtran por host.
- La decisión del spec 0001 sobre la URL del QR (`/?src=qr`) queda reemplazada por `/qr` en este punto.

## Follow-up

- [ ] Antes de entregar el informe (y antes de 6 meses), capturar el panel con el total y la ruta `/qr` para el periodo de la campaña.
- [ ] El spec 0001 todavía describe el QR con `/?src=qr` (AC-7 y su sección del QR); que `/sync` lo marque como desactualizado en ese punto.
- [ ] Imprimir el QR nuevo (2.5 cm o más) solo después del paso 6.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).

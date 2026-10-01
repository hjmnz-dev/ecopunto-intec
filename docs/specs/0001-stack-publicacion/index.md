# 0001. Stack y publicación: Astro, GSAP y Cloudflare Pages

**Date**: 2026-09-30
**Status**: Accepted

## Summary

La página del Ecopunto INTEC se construye con Astro (un generador de páginas estáticas) en TypeScript, con animaciones al hacer scroll hechas con GSAP, y se publica gratis en Cloudflare Pages en `ecopunto-intec.pages.dev`. Se eligió así porque la mayoría entra desde un QR en el celular: la página tiene que pesar poco, animarse igual en todos los navegadores, respetar a quien pidió menos movimiento y tener un enlace corto que nunca cambie. Para construir, esto significa un proyecto Astro fuera de OneDrive, en un repo público de GitHub que Cloudflare publica solo con cada push. El QR apuntaba a `/?src=qr`; desde el spec 0005 apunta a `/qr` (la misma página, que Web Analytics cuenta aparte), y no se imprime hasta que ese enlace esté en línea y confirmado.

## Requirements

**User stories**:
- Como dev de la campaña, quiero un proyecto publicado que arranque con una animación de prueba, para construir cada sección esta noche sin decidir herramientas otra vez.
- Como estudiante que escanea el QR, quiero que la página cargue rápido en mi celular y se lea aunque haya pedido menos movimiento o mi conexión falle, para entender la campaña sin esperar ni marearme.

**Acceptance criteria** (lo que deja listo el andamiaje, o *scaffold*, de esta parte):
- **AC-1**: `npm run dev` abre la página en el navegador local con una sección de prueba que entra animada al hacer scroll (GSAP + ScrollTrigger, con el contrato de animación de abajo).
- **AC-2**: Con movimiento reducido activado en el sistema, la sección de prueba aparece directamente en su estado final, sin animación y sin parpadeo.
- **AC-3**: Con JavaScript desactivado, o si el script de animación no carga en 3 segundos, todo el contenido de la página se ve.
- **AC-4**: `npm run build` termina sin errores y deja un sitio 100 % estático en `dist/`.
- **AC-5**: `npm run check` (chequeo de tipos de Astro con TypeScript estricto) pasa sin errores.
- **AC-6**: El proyecto completo (incluidos `docs/`, `.agents/`, `.claude/`, `.mcp.json` y `skills-lock.json`) vive en `C:\dev\ecopunto-intec`, es un repo git con el `.gitignore` y `.gitattributes` de abajo y `package-lock.json` versionado, y está subido como repo público `ecopunto-intec` en GitHub.
- **AC-7**: El repo está conectado a Cloudflare Pages: un push a `main` publica, y `SITIO_URL` y `SITIO_URL/?src=qr` abren por HTTPS en un celular (respuesta 200, sin redirección que pierda `?src=qr`). Con eso, `SITIO_CONFIRMADO` pasa a `true`. _Actualizado por el spec 0005: el QR usa `SITIO_URL/qr`; `?src=qr` sigue respondiendo 200._

## Decision

**Chosen option**: Option 1: Astro + GSAP + Cloudflare Pages

La página se construye con Astro y TypeScript estricto, se anima con GSAP y ScrollTrigger, y se publica en Cloudflare Pages conectado al repo público de GitHub.

**Implementation skills**: `gsap-core` (`greensock/gsap-skills`, `.agents/skills/gsap-core/`) · `gsap-scrolltrigger` (`greensock/gsap-skills`, `.agents/skills/gsap-scrolltrigger/`) · `cloudflare` (`cloudflare/skills`, `.agents/skills/cloudflare/`) · `wrangler` (`cloudflare/skills`, `.agents/skills/wrangler/`) · `web-perf` (`cloudflare/skills`, `.agents/skills/web-perf/`) · `accessibility` (`addyosmani/web-quality-skills`, `.agents/skills/accessibility/`)

## Proposed stack

| Layer | Choice | Reason |
|---|---|---|
| Tipo de app | Sitio estático de una sola página, sin backend | No hay usuarios ni datos que guardar; lo estático es lo más rápido y barato. |
| Lenguaje | TypeScript estricto (`astro/tsconfigs/strict`) | Un porcentaje o paso mal escrito falla al compilar, no en el celular de alguien. |
| Framework | Astro, versión estable al crear el proyecto (se anota en `AGENTS.md`), salida `static` sin adaptador | Envía solo HTML y CSS salvo el script que se pida; trae componentes y optimización de imágenes. |
| Estilos | CSS con variables globales (tokens) + estilos por componente de Astro | El estilo artesanal (cartón, cinta, papel) necesita CSS propio; sin dependencias. |
| Animación | `gsap` con ScrollTrigger, un solo módulo cliente | Igual en todos los navegadores (incluido Firefox), gratis completo, y sirve para #10 y #11. |
| Scroll | Nativo, sin Lenis | En celular no aporta; se revisa tras la Release 1. |
| Fuentes | Autoalojadas: `@fontsource-variable/*` si la fuente tiene versión variable, si no `@fontsource/*` | Se sirven desde el mismo dominio: más rápido y sin enviar datos a Google. Qué fuentes, lo decide #3. |
| Contenido | Un archivo TypeScript tipado, `src/data/campana.ts` | Todo el texto en un lugar, con tipos. No va en `src/content/` para no chocar con las content collections de Astro. |
| Imágenes | `astro:assets` (`<Image>` / `<Picture>`), originales en `src/assets/` | Genera AVIF/WebP y tamaños para celular, con ancho y alto fijos (sin saltos de diseño). |
| Paquetes | npm, con `package-lock.json` versionado | Es el que está instalado; Cloudflare lo detecta por el lockfile. |
| Runtime | Node 24 (LTS): `.node-version`, `engines` en `package.json` y `NODE_VERSION=24` en Cloudflare | El mismo que ya tienes. Si el build de Cloudflare no acepta 24, se baja todo a 22. |
| Base de datos / Auth | Ninguna | No hay datos ni cuentas. |
| Repositorio | GitHub, público, `ecopunto-intec`, rama `main` | Sin secretos en una página estática; sirve de portafolio. |
| Hosting | Cloudflare Pages, plan gratuito | Enlace corto en la raíz del dominio, HTTPS incluido, analítica sin cookies para #13. |
| Deploy | Integración Git de Cloudflare: cada push a `main` publica; cada rama tiene vista previa | Sin archivos de CI ni tokens que guardar. |
| Dominio | `https://ecopunto-intec.pages.dev`, sin barra final | Gratis y estable; se confirma en línea (AC-7) antes de generar el QR. |
| QR | Script `npm run qr` con el paquete `qrcode`, SVG estático | Vectorial para imprimir, versionado, sin servicio intermedio que caduque. |
| Vista previa al compartir | `public/og.png` de 1200×630 exportada de Canva + etiquetas Open Graph | Cero código; se ve con el estilo de la campaña. |
| Analítica | Cloudflare Web Analytics, decidido en el spec 0005 (#13) | Mismo proveedor, sin cookies; se activa en el panel de Pages, sin código en el repo. |
| Formato y lint | Se decide en #2 (`/audit`) | Parte propia en el scope. |

### Configuración decidida

**Estructura de carpetas**:
```
ecopunto-intec/
├─ astro.config.mjs      # site = SITIO_URL, salida static
├─ sitio.mjs             # SITIO_URL y SITIO_CONFIRMADO
├─ .node-version         # 24
├─ .gitignore
├─ .gitattributes        # * text=auto eol=lf
├─ tsconfig.json         # extends astro/tsconfigs/strict
├─ scripts/qr.mjs        # genera qr/ecopunto-intec-qr.svg
├─ qr/                   # QR generado, versionado, no se publica
├─ public/               # og.png, favicon, _redirects (/qr, spec 0005), se copian tal cual
├─ docs/  .agents/  .claude/  .mcp.json  skills-lock.json   # se mueven con el proyecto
└─ src/
   ├─ pages/index.astro
   ├─ layouts/Base.astro       # <html lang="es">, meta, fuentes, scripts de animación
   ├─ components/              # secciones y piezas (.astro)
   ├─ data/campana.ts          # textos y cifras (parte #4)
   ├─ assets/                  # imágenes de Canva a optimizar
   ├─ styles/tokens.css        # colores, tipografías, tiempos (parte #3)
   ├─ styles/global.css
   └─ scripts/animaciones.ts   # único punto que registra GSAP
```

**`.gitignore`**: `node_modules/`, `dist/`, `.astro/`, `.wrangler/`, `.env*`, `.claude/settings.local.json`. El resto de `.claude/` y `.agents/` (las skills) sí se versiona.

**Scripts de `package.json`**: `dev` (`astro dev`), `build` (`astro build`), `preview` (`astro preview`), `check` (`astro check`), `qr` (`node scripts/qr.mjs`). Dependencias de desarrollo: `@astrojs/check`, `typescript`, `qrcode`. `engines.node`: `>=22`.

**Cloudflare** (pasos manuales que haces tú: crear la cuenta, verificar el correo y autorizar la app de Cloudflare en GitHub):
- Tipo de proyecto: **Pages**. En *Workers & Pages → Create*, el panel ofrece Workers primero; Pages está en el enlace "Looking to deploy Pages? Get started".
- Build: preset Astro, comando `npm run build`, salida `dist`, rama de producción `main`, variable `NODE_VERSION=24` (obligatoria).
- Si Pages no estuviera disponible: Workers con Static Assets (`wrangler.jsonc` con `assets.directory = "./dist"`, sin adaptador), aceptando el enlace `ecopunto-intec.<cuenta>.workers.dev`. `SITIO_URL` toma ese valor.
- Las vistas previas por rama quedan públicas; la URL canónica fija a `SITIO_URL` evita que compitan en buscadores. Sin `_headers` ni página 404 propia: Cloudflare ya cachea bien los archivos con hash y sirve un 404 por defecto.

**Contrato de animación** (el mecanismo es de esta parte; duraciones, distancias y curvas los ajusta #3):

En el `<head>` de `Base.astro`, un script en línea (el único `is:inline` permitido):
```html
<script is:inline>
  {
    const r = document.documentElement;
    r.classList.add('js');
    setTimeout(() => { if (!r.classList.contains('anim-listo')) r.classList.remove('js'); }, 3000);
  }
</script>
```
En `global.css`:
```css
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
  .js [data-animar] { visibility: hidden; }
}
```
`src/scripts/animaciones.ts`, cargado desde `Base.astro` con un `<script>` normal (Astro lo empaqueta como módulo; nunca `is:inline` ni islas `client:*`):
```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  gsap.set('[data-animar]', { autoAlpha: 0, y: 24 });
  ScrollTrigger.batch('[data-animar]', {
    start: 'top 85%',
    once: true,
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, stagger: 0.1, overwrite: true }),
  });
});
document.documentElement.classList.add('anim-listo');

const cargada = document.readyState === 'complete'
  ? Promise.resolve()
  : new Promise((ok) => addEventListener('load', ok, { once: true }));
Promise.all([document.fonts.ready, cargada]).then(() => ScrollTrigger.refresh());
```
Reglas:
- Lo que entra animado lleva `data-animar`. Cada entrada corre una sola vez.
- Toda animación nueva (#5 a #12) vive dentro de `gsap.matchMedia()` con `(prefers-reduced-motion: no-preference)`. Si el visitante cambia la preferencia en vivo, `matchMedia` revierte los estilos y el contenido queda visible.
- El CSS solo esconde bajo `.js` y sin movimiento reducido. Si GSAP no llega en 3 segundos (datos móviles lentos), se quita `.js` y todo aparece.
- La sección de prueba de AC-1 es temporal; la reemplaza la portada en #5.

**Fuentes**: importar solo el subconjunto `latin` (cubre ñ, ¿, ¡ y tildes) en `woff2`, con `font-display: swap` (el valor por defecto de Fontsource). Precargar solo la fuente de títulos con `<link rel="preload" as="font" type="font/woff2" crossorigin>`, usando su URL importada con `?url`.

**Enlaces y QR**:
- `sitio.mjs` exporta `SITIO_URL` (sin barra final; el archivo lanza un error si termina en `/`) y `SITIO_CONFIRMADO` (`false` hasta cumplir AC-7). Es la única fuente del dominio: la usan `astro.config.mjs` (`site`) y `scripts/qr.mjs`.
- `scripts/qr.mjs` se niega a generar si `SITIO_CONFIRMADO` es `false`, codifica `SITIO_URL + '/qr'` en SVG (antes `'/?src=qr'`; cambió en el spec 0005) (corrección de errores M, margen de 4 módulos, negro sobre blanco, sin colores de campaña ni fondo transparente) e imprime en consola la URL que codificó.
- La URL canónica y `og:url` son `SITIO_URL` sin ruta ni parámetros, para que `/qr` (o el viejo `?src=qr`) no se copie al compartir. `/qr` sirve la misma página por reescritura en `public/_redirects` (spec 0005).
- Restricciones para #9: QR impreso de al menos 2.5 cm por lado; `og.png` de menos de 300 KB (o JPG), con `og:image:width` y `og:image:height` declarados, más `og:type website`, `og:locale es_DO` y `twitter:card summary_large_image`.

**Value sourcing**:
| Qué | Valor | Fuente |
|---|---|---|
| Dominio público | `https://ecopunto-intec.pages.dev` | Subdominio que asigna Cloudflare al proyecto; se copia a `SITIO_URL` después de verlo en el panel. |
| Si el dominio ya se puede imprimir | `SITIO_CONFIRMADO` | `sitio.mjs`, pasa a `true` al cumplir AC-7. |
| `site`, canonical, `og:url`, URL absoluta de `og:image` | Derivados | `SITIO_URL` (`new URL('/og.png', Astro.site)` para la imagen). |
| URL dentro del QR | `SITIO_URL/qr` | Derivada de `SITIO_URL` + la ruta `/qr` del spec 0005 (antes `/?src=qr`, decidida aquí). |
| `<title>`, descripción, textos, cifras, listas, pasos | Contenido de la campaña | `src/data/campana.ts` (parte #4); `Base.astro` los recibe como props. |
| Colores, fuentes, tiempos de animación | Tokens | `src/styles/tokens.css` y paquetes Fontsource (parte #3). |
| Si se anima o no | `prefers-reduced-motion` + clase `js` | Preferencia del sistema, leída por el CSS y por `gsap.matchMedia()`. |
| Imagen al compartir y favicon | `public/og.png`, `public/favicon.svg` | Exportados de Canva (partes #4 y #9); favicon provisional con el logo. |

**Qué hace cada parte del scope con esta decisión**:
- **#1 (esta)**: mover todo a `C:\dev\ecopunto-intec` (el original en OneDrive lo borras tú cuando compruebes la copia), iniciar git, crear el proyecto Astro con esta estructura, instalar GSAP con la sección de prueba, subir el repo y conectar Cloudflare (AC-1 a AC-7).
- **#2**: formateo y convenciones en `AGENTS.md`, incluida la versión exacta de Astro.
- **#3**: tokens, fuentes concretas y ajuste fino de movimiento sobre el contrato de arriba.
- **#4**: `src/data/campana.ts`, las imágenes en `src/assets/` y el favicon.
- **#9**: meta Open Graph, `og.png`, generar el QR (con el dominio ya confirmado) e imprimirlo.
- **#13**: activar Cloudflare Web Analytics y contar las llegadas por QR con la ruta `/qr` (spec 0005).

## Consequences

**Positive**:
- La página envía casi solo HTML, CSS e imágenes optimizadas; carga rápido con datos móviles.
- Cada push publica solo; la Release 1 está en línea desde la primera sección.
- Contadores (#10), juego (#11) y analítica (#13) ya tienen herramienta, sin sumar proveedores.

**Negative / tradeoffs**:
- Hay que crear y mantener una cuenta de Cloudflare además de GitHub, y esos pasos son manuales.
- GSAP añade unos 40 KB comprimidos de JavaScript (aproximado) a una página que sin él no tendría casi nada.
- El enlace depende de que `ecopunto-intec` esté libre en `pages.dev`, y de que Pages siga disponible. Si no, cambia `SITIO_URL`; por eso nada se imprime antes de AC-7.
- El truco de la clase `js` agrega un script en línea y una espera de hasta 3 segundos en el peor caso (sin GSAP) antes de mostrar el contenido.
- Mover la carpeta fuera de OneDrive quita el respaldo automático; GitHub pasa a ser el respaldo, así que conviene hacer push seguido.
- El repo es público: el scope y los specs (con nombres del equipo y datos agregados de la encuesta) quedan visibles. Los mismos datos ya aparecen en la página.

**Neutral**:
- Si algún día hay dominio propio, `pages.dev` sigue funcionando, así que los QR impresos no se rompen.
- Las fuentes elegidas en #3 tienen que existir en Fontsource; si no, se suben los `.woff2` a mano con el mismo patrón.

## Follow-up

- [x] Confirmar al crear la cuenta que el plan gratuito de Cloudflare sigue sin pedir tarjeta y con builds suficientes (dato de conocimiento, no verificado en la web). Resuelto: la cuenta gratuita publica cada push desde el 2026-09-30.
- [ ] Revisar tras la Release 1 si hace falta scroll suavizado en computadora (Lenis solo con mouse y apagado con movimiento reducido).
- [x] Anotar en el `AGENTS.md` raíz (parte #2, `/audit`) el stack, la versión de Astro, el contrato de animación y la sección `## Agent skills`: `gsap-core`, `gsap-scrolltrigger`, `cloudflare`, `wrangler`, `web-perf`, `accessibility` (en `.agents/skills/`), con MCP servers Astro Docs y Cloudflare, y `astro-developer` como rechazada (es para contribuir al monorepo de Astro, no para usarlo). Hecho en la parte #2; el MCP de Cloudflare no quedó anotado porque no se conectó.
- [ ] Conectar tú los servidores MCP elegidos: Astro Docs (`https://mcp.docs.astro.build/mcp`) y el de Cloudflare (la URL oficial está en la documentación de Cloudflare, sección MCP servers). Astro Docs ya está conectado (`.mcp.json`); falta el de Cloudflare, que es opcional.

## Rationale

Razonamiento y opciones: ver [rationale.md](rationale.md).

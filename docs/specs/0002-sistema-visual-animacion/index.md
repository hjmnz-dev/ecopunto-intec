# 0002. Sistema visual y animación: collage de cartón fiel al Canva

**Date**: 2026-09-30
**Status**: Accepted

## Summary

La página se ve como la presentación de Canva: fondo de cartón, tarjetas de papel crema o salvia sujetas con cinta verde, títulos con letra de marcador (Londrina Solid) sobre una tira de cuaderno y texto en Nunito color verde tinta. La portada es la excepción: es fotográfica y clara, como la diapositiva 1, y el cartón empieza al bajar. El movimiento es medio (0.7 s, sube 32 px); las tarjetas se "pegan", los títulos se "escriben" y en pantallas anchas el cartón hace parallax (se mueve más lento que el contenido). Con movimiento reducido, sin JavaScript o si GSAP falla, todo aparece quieto y completo. Para construir, esto significa tokens en `tokens.css`, siete componentes en `src/components/ui/`, una textura de cartón generada por script, efectos en `animaciones.ts` y un `design.md` en la raíz.

## Requirements

**User stories**:
- Como estudiante que escanea el QR, quiero que la página se sienta como la campaña que vi en el campus, para reconocerla y confiar en lo que dice.
- Como estudiante que pidió menos movimiento en su celular, quiero ver todo el contenido quieto y completo, para leer sin marearme.
- Como dev de la campaña, quiero componentes y reglas listas, para armar cada sección esta noche sin decidir estilo otra vez.

**Acceptance criteria**:
- **AC-1**: Existe `design.md` en la raíz con la paleta (nombre del token, hex y para qué se usa), las dos fuentes con su grosor, las texturas (cartón, papel, cuaderno, cinta), el catálogo de componentes con sus props, las reglas de movimiento (valores, efectos y su atributo, movimiento reducido, parallax) y las reglas de accesibilidad.
- **AC-2**: `src/styles/tokens.css` define todos los colores, fuentes, tamaños, espacios, anchos y sombras. Ningún archivo en `src/` fuera de `tokens.css` escribe un color hex o `rgb(` literal (los componentes usan `var(--...)`).
- **AC-3**: Los títulos usan Londrina Solid 900 y el texto Nunito variable, ambos autoalojados desde Fontsource. En la página publicada se descargan como mucho dos archivos `woff2` de fuentes, ninguno desde Google, y la fuente de títulos va precargada.
- **AC-4**: Debajo de la portada se ve el cartón: una imagen de mosaico sin costuras visibles (AVIF de 40 KB o menos, con WebP de respaldo) sobre el color `--color-carton`. Si la imagen no carga, el fondo sigue siendo color cartón.
- **AC-5**: La página de muestra (temporal, en `index.astro`) enseña todos los componentes base en un celular de 390 px de ancho sin scroll horizontal: `TituloSeccion`, `TarjetaCinta` (papel crema y salvia; cinta arriba, en esquinas y a los lados; giro izquierda, recto y derecha), `BloqueDato` con 76.1 %, `ListaIconos`, `ImagenMarco`, `EtiquetaSiNo` en sí y en no, y `Seccion`.
- **AC-6**: Todo texto cumple contraste WCAG AA sobre su superficie (4.5:1 texto normal, 3:1 texto grande y bordes de foco). Ningún texto va directo sobre el cartón; siempre va sobre papel, cuaderno o etiqueta.
- **AC-7**: Sin movimiento reducido, cada elemento entra una sola vez al llegar al 85 % de la pantalla: `data-animar` sube 32 px y aparece en 0.7 s; `data-animar="tarjeta"` entra girada, se asienta en su giro final y después aparece su cinta; `data-animar="titulo"` muestra la tira y luego el texto se descubre de izquierda a derecha.
- **AC-8**: En pantallas de 1024 px o más con mouse y sin movimiento reducido, la capa de cartón se desplaza más lento que el contenido al hacer scroll. En pantallas más chicas, con pantalla táctil o con movimiento reducido, el cartón queda quieto.
- **AC-9**: Con movimiento reducido activado, todo se ve desde el primer momento en su estado final (tarjetas con su giro, cintas visibles, títulos completos, fondo quieto), sin animación ni parpadeo. Si la preferencia cambia en vivo, el contenido vuelve a su estado final.
- **AC-10**: Sin JavaScript, o si GSAP no carga en 3 segundos, todo el contenido nuevo (`data-animar` con cualquier valor y `data-entrada`) se ve, igual que el contrato del spec 0001.
- **AC-11**: En el DOM, el texto de los títulos está en mayúsculas y minúsculas normales (las mayúsculas vienen solo de CSS); cintas, íconos decorativos y la capa de cartón llevan `aria-hidden="true"`; y `ImagenMarco` no compila sin la prop `alt`.
- **AC-12**: `npm run build` y `npm run check` pasan, y la primera carga de la muestra transfiere 200 KB o menos sin contar la imagen de muestra (HTML, CSS, JS, fuentes y cartón), medido como "transferido" en la pestaña Network sobre la vista previa de Cloudflare.
- **AC-13**: Después de la entrada animada, cada tarjeta queda con el mismo giro que tiene sin animación (su `giro` de reposo), y los títulos con tildes o eñes no quedan recortados.

## Decision

**Chosen option**: Option 1: Collage con CSS y una sola textura generada

Se recrea el estilo del Canva con tokens CSS, dos fuentes de Fontsource, papel y cinta hechos con CSS, un mosaico de cartón generado por script y efectos GSAP registrados en el único módulo de animación del spec 0001.

**Implementation skills**: `gsap-core` (`greensock/gsap-skills`, `.agents/skills/gsap-core/`) · `gsap-scrolltrigger` (`greensock/gsap-skills`, `.agents/skills/gsap-scrolltrigger/`) · `accessibility` (`addyosmani/web-quality-skills`, `.agents/skills/accessibility/`) · `web-perf` (`cloudflare/skills`, `.agents/skills/web-perf/`)

## Feature design

**Data model sketch**: no hay datos persistentes. El "modelo" son los tokens y las props de los componentes.

Tokens (`src/styles/tokens.css`, valores medidos en el Canva "Ecopunto intec"):

| Token | Valor | Uso |
|---|---|---|
| `--color-carton` | `#ae7a4a` | Fondo de la página y color de respaldo del mosaico |
| `--color-carton-oscuro` | `#8f6238` | Fibras y sombras del cartón generado |
| `--color-papel` | `#eee4cb` | Tarjeta crema (por defecto) |
| `--color-salvia` | `#bfc296` | Tarjeta del bloque de dato |
| `--color-cuaderno` | `#fbf7ee` | Tira de cuaderno de los títulos y marco de imagen |
| `--color-cuadricula` | `#c9d6e3` | Líneas de la tira de cuaderno |
| `--color-cinta` | `rgb(97 178 92 / 0.85)` | Cinta verde (`#61b25c` semitransparente) |
| `--color-tinta` | `#15322b` | Todo el texto, íconos y borde de foco |
| `--color-tinta-suave` | `#2c463e` | Texto secundario (notas, detalle del dato); 5.5:1 sobre salvia, 8.1:1 sobre crema |
| `--color-si` | `#61b25c` | Fondo de la etiqueta "sí" (texto en tinta) |
| `--color-no` | `#ba5b5e` | Fondo de la etiqueta "no" (rojo INTEC, texto blanco en grande) |
| `--color-blanco` | `#ffffff` | Texto sobre `--color-no` |
| `--color-portada` | `#f5f5f2` | Fondo claro de la portada fotográfica |
| `--font-titulo` | `'Londrina Solid', 'Arial Narrow', sans-serif` | Títulos, cifras, etiquetas; siempre 900 y `text-transform: uppercase` |
| `--font-texto` | `'Nunito Variable', system-ui, sans-serif` | Párrafos y listas; 400 y 700 |
| `--texto-base` | `1.125rem` | Párrafos (18 px), `line-height: 1.5` |
| `--texto-chico` | `1rem` | Notas y detalle |
| `--titulo-seccion` | `clamp(2.25rem, 8vw, 3.75rem)` | `TituloSeccion`, `line-height: 0.95` |
| `--titulo-portada` | `clamp(3rem, 14vw, 6rem)` | Portada (#5) |
| `--dato-cifra` | `clamp(3.5rem, 18vw, 6rem)` | Cifra de `BloqueDato` |
| `--texto-etiqueta` | `1.5rem` | `EtiquetaSiNo` (24 px en 900: el blanco sobre `--color-no` mide 4.4:1 y solo pasa como texto grande, así que nunca va más chico) |
| `--espacio-1` a `--espacio-6` | `0.25rem 0.5rem 1rem 1.5rem 2.5rem 4rem` | Márgenes y rellenos |
| `--relleno-papel` | `var(--espacio-4)` | Relleno interno de tarjetas, tira y marco |
| `--espacio-seccion` | `var(--espacio-6)` | Espacio vertical entre secciones |
| `--margen-lateral` | `1rem`, y `1.5rem` desde 768 px | Borde de 16 px en celular |
| `--ancho-texto` | `40rem` | Columna de lectura |
| `--ancho-seccion` | `64rem` | Grillas de tarjetas |
| `--giro-izquierda` / `--giro-derecha` | `-1.5deg` / `1.2deg` | Giro de reposo de tarjetas e imágenes |
| `--sombra-papel` | `0 2px 0 rgb(0 0 0 / 0.08), 0 10px 20px -10px rgb(60 35 10 / 0.5)` | Papel sobre cartón |

Valores de movimiento (`src/scripts/movimiento.ts`, única fuente, solo los usa GSAP): `DURACION = 0.7`, `DISTANCIA = 32`, `CURVA = 'power2.out'`, `ESCALONADO = 0.12`, `INICIO = 'top 85%'`, `GIRO_ENTRADA = 4` (grados extra con que entra la tarjeta), `DURACION_CINTA = 0.3`, `RETRASO_CINTA = 0.15`, `DURACION_TITULO = 0.8`, `PARALLAX = -10` (porcentaje de desplazamiento de la capa en toda la página).

Componentes (`src/components/ui/`, todos `.astro`, sin JavaScript propio):

| Componente | Props | Qué renderiza |
|---|---|---|
| `Seccion` | `id: string` (req) · `ancho?: 'texto' \| 'amplio'` (def. `'amplio'`) | `<section>` centrada con `--margen-lateral`, ancho máximo del token y `padding-block: var(--espacio-seccion)`. Con `ancho="amplio"`, su contenido directo en `.grilla` va en 1 columna, 2 desde 768 px y 3 desde 1024 px, con `gap: var(--espacio-5)` |
| `TituloSeccion` | `nivel?: 2 \| 3` (def. 2) · `id?: string` · slot = texto | Tira de cuaderno cuadriculado (`padding-inline: 2.5rem` para que las cintas queden dentro) con una cinta en cada esquina superior; el `<h2>`/`<h3>` va dentro; `data-animar="titulo"` en la tira |
| `TarjetaCinta` | `papel?: 'crema' \| 'salvia'` (def. `'crema'`) · `cinta?: 'arriba' \| 'esquinas' \| 'lados' \| 'ninguna'` (def. `'arriba'`) · `giro?: 'izquierda' \| 'recto' \| 'derecha'` (def. `'recto'`) · `as?: 'div' \| 'article' \| 'li'` (def. `'div'`) · `animar?: boolean` (def. `true`) · slot | Papel con textura sutil, sombra y `padding: var(--relleno-papel)`; giro de reposo con la propiedad CSS `rotate`; atributo `data-giro` con el valor de la prop; cintas como `<span class="cinta" aria-hidden="true">`; `data-animar="tarjeta"` si `animar` |
| `BloqueDato` | `valor: number` (req) · `frase: string` (req) · `detalle?: string` · `animar?: boolean` (def. `true`, se pasa a la tarjeta) | `TarjetaCinta` salvia con cinta a los lados. En orden: cifra (`--dato-cifra`, `--font-titulo`, formateada `valor.toFixed(1)` + U+00A0 + `%`, con `data-valor={valor}` para #10), frase (`--texto-base`, 700) y detalle opcional (`--texto-chico`, `--color-tinta-suave`) |
| `ListaIconos` | `items: { icono: NombreIcono; texto: string }[]` (req) | `<ul>` sin viñetas, `gap: var(--espacio-3)`, ícono de 2 rem en tinta (`aria-hidden`) y texto al lado. Siempre va dentro de una `TarjetaCinta` (nunca directo sobre el cartón) |
| `ImagenMarco` | `src: ImageMetadata` (req) · `alt: string` (req, `''` solo si es decorativa) · `anchos?: number[]` (def. `[320, 640, 960]`) · `sizes?: string` (def. `'(min-width: 768px) 50vw, 100vw'`) · `giro?` (def. `'recto'`) · `cinta?` (def. `'arriba'`) · `animar?: boolean` (def. `true`) | Marco de `--color-cuaderno` con `padding: var(--espacio-2)`, sombra y cinta; `<Picture>` de `astro:assets` en AVIF y WebP con ancho y alto fijos y `loading="lazy"`; entra con `data-animar="tarjeta"` |
| `EtiquetaSiNo` | `tipo: 'si' \| 'no'` (req) · `texto: string` (req) | Sello en `--font-titulo` a `--texto-etiqueta` con ícono `check` o `x`; sí = fondo `--color-si` y texto tinta, no = fondo `--color-no` y texto `--color-blanco` |
| `Icono` | `nombre: NombreIcono` (req) · `tamano?: string` (def. `'1.5rem'`) · `etiqueta?: string` | `<span>` de `width` y `height` = `tamano` con el SVG dentro a 100 % (se le quitan `width` y `height` de Lucide), trazo `currentColor`; con `etiqueta`, el `<span>` lleva `role="img"` y `aria-label`; sin ella, `aria-hidden="true"` |

`NombreIcono` es una unión escrita a mano en `Icono.astro` (`'check' | 'x' | ...`). Los SVG se cargan con `import.meta.glob('../../icons/*.svg', { query: '?raw', import: 'default', eager: true })`, y el componente lanza un error al compilar si el nombre no tiene archivo. Set inicial copiado de Lucide (licencia ISC, trazo 2): `check`, `x`, `clipboard-list`, `users`, `trending-up`, `recycle`. Cada sección suma los suyos copiando el SVG y agregando el nombre a la unión.

Texturas:
- **Cartón**: `scripts/carton.mjs` (script `npm run carton`, se corre una vez, no en el build) dibuja un SVG de 512 × 512 con `feTurbulence type="fractalNoise"` (`baseFrequency="0.04 0.9"` para fibras horizontales, `numOctaves="3"`, `seed="7"`, `stitchTiles="stitch"`) teñido de `#ae7a4a` a `#8f6238` con amplitud baja, y lo convierte con `sharp` a `src/assets/texturas/carton.avif` (`quality: 35`, `effort: 9`) y `carton.webp` (`quality: 60`). Si el AVIF pasa de 40 KB, el mosaico baja a 256 px y se muestra estirado a `background-size: 512px`. Los dos archivos se versionan. Los hex del script viven en el script (no es `src/`).
- **Capa de cartón**: `<div class="fondo-carton" data-parallax aria-hidden="true">` dentro de `Base.astro`, con `position: fixed; inset: -15vh 0; z-index: -1; background-repeat: repeat; background-size: 512px`. Primero `background-image: url(carton.webp)` como respaldo y en la línea siguiente `background-image: image-set(url(carton.avif) type('image/avif'), url(carton.webp) type('image/webp'))`. El color de fondo de la página va en `html { background: var(--color-carton) }` con `body { background: transparent }`, para que la capa se vea. `will-change: transform` solo cuando corre el parallax.
- **Desborde**: `main { overflow-x: clip }` (no `hidden`, para no romper `position: sticky` ni ScrollTrigger), así las cintas y giros nunca crean scroll horizontal.
- **Papel**: color del token más un ruido SVG en línea (data URI con `feTurbulence`, opacidad 0.06, menos de 1 KB, sin colores hex: el ruido se tiñe con `feColorMatrix`) y `--sombra-papel`. Bordes rectos.
- **Cuaderno**: `--color-cuaderno` con `repeating-linear-gradient` de líneas de 1 px en `--color-cuadricula` cada 22 px, en ambos sentidos.
- **Cinta**: elemento `.cinta` de 5.5 rem × 1.6 rem (4 rem × 1.4 rem en `TituloSeccion`) en `--color-cinta`, extremos dentados con `mask-image` (zigzag con `conic-gradient` usando las palabras `black` y `transparent`, no hex). Se ubica con `inset` y márgenes, y su ángulo con la propiedad `rotate`, fijo por posición (nunca al azar): `arriba` = una, centrada, 0.8 rem por encima del borde, `rotate: 3deg`; `esquinas` = arriba a la izquierda `rotate: -35deg` y abajo a la derecha `rotate: -35deg`; `lados` = una a cada lado a media altura, `rotate: 90deg`; `TituloSeccion` = una en cada esquina superior, `rotate: -8deg` y `8deg`. `transform-origin: left center` (la cinta de la derecha en `lados`: `right center`).

Portada (regla para #5): la portada no lleva cartón; usa `--color-portada` opaco y la imagen de la diapositiva 1 (la exporta #4). El cartón empieza en la primera `Seccion` después de la portada. La imagen y el título principal de la portada se ven desde el primer momento (no llevan `data-entrada`, para no retrasar la carga visible). Solo los elementos secundarios (lema, botón de bajar, adornos) entran al cargar la página con `data-entrada="1"`, `"2"`, …: orden numérico ascendente, los que comparten número entran juntos, escalonados 0.15 s; si hay 5 números o más, el escalonado baja a `0.5 / (n - 1)` s para que todo termine en 1.2 s o menos.

**State transitions**: cada elemento animable pasa `oculto → entrando → final` una sola vez. `oculto` solo existe con `.js` y sin movimiento reducido; si la preferencia cambia en vivo, `gsap.matchMedia` revierte y el elemento queda en `final`.

**API surface**: no hay endpoints. La interfaz son los atributos que lee `src/scripts/animaciones.ts`:

| Atributo | Selector exacto | Efecto (solo sin movimiento reducido) |
|---|---|---|
| `data-animar` vacío o `"subir"` | `[data-animar=""], [data-animar="subir"]` | `gsap.set` a `autoAlpha: 0, y: DISTANCIA`; `ScrollTrigger.batch` con `start: INICIO`, `once: true`, `onEnter` → `gsap.to(els, { autoAlpha: 1, y: 0, duration: DURACION, ease: CURVA, stagger: ESCALONADO, overwrite: true })` |
| `data-animar="tarjeta"` | `[data-animar="tarjeta"]` | Una línea de tiempo por tarjeta, lanzada desde el `onEnter` del lote con `delay: i * ESCALONADO`: `gsap.from(tarjeta, { autoAlpha: 0, y: DISTANCIA, scale: 0.98, rotation: '+=' + signo * GIRO_ENTRADA, duration: DURACION, ease: CURVA })` (el `+=` en un `from` es relativo al giro final, así la tarjeta termina en su giro de reposo) y luego sus cintas, `'>-0.1'` más `RETRASO_CINTA`: `scaleX 0 → 1`, `autoAlpha 0 → 1` en `DURACION_CINTA`. El estado inicial de las cintas (`scaleX: 0, autoAlpha: 0`) se pone solo con el selector `[data-animar="tarjeta"] .cinta`, así una tarjeta con `animar={false}` muestra sus cintas. Signo: `data-giro="izquierda"` → `-1`, `"derecha"` → `+1`, `"recto"` → alterna según su posición en `document.querySelectorAll('[data-animar="tarjeta"]')` (pares `+1`, impares `-1`) |
| `data-animar="titulo"` | `[data-animar="titulo"]` | `gsap.set` de la tira a `autoAlpha: 0, y: DISTANCIA` y de su encabezado a `clipPath: 'inset(0 100% 0 0)'`. En el `onEnter`, por tira con `delay: i * ESCALONADO`: la tira sube en 0.4 s con `CURVA`, luego el encabezado va a `clipPath: 'inset(0 0% 0 0)'` en `DURACION_TITULO` con `power1.inOut` y `clearProps: 'clipPath'` al terminar (para no recortar tildes ni eñes) |
| `data-entrada` | `[data-entrada]` ordenado por número | Al cargar: una línea de tiempo con cada grupo subiendo (`autoAlpha`, `y: DISTANCIA`, `DURACION`, `CURVA`), escalonado según la regla de la portada |
| `data-parallax` | `[data-parallax]` | `gsap.to(capa, { yPercent: PARALLAX, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 0, end: 'max', scrub: true, invalidateOnRefresh: true } })` |

`animaciones.ts` sigue siendo el único archivo que importa y registra GSAP (spec 0001). Puede importar funciones de `src/scripts/efectos/*.ts` que reciben `gsap` y `ScrollTrigger` como parámetros. El `gsap.set('[data-animar]', ...)` genérico del spec 0001 se elimina y se reemplaza por los selectores exactos de la tabla. Hay dos bloques `matchMedia` separados, para que rotar una tablet o cambiar el ancho no vuelva a esconder lo ya revelado:
- `gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', ...)`: subir, tarjeta, título y `data-entrada`.
- `gsap.matchMedia().add('(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (pointer: fine)', ...)`: solo el parallax.

En `global.css` la regla de ocultar pasa a `.js [data-animar], .js [data-entrada] { visibility: hidden; }` dentro de `prefers-reduced-motion: no-preference`. Un elemento con `data-animar` nunca va dentro de otro con `data-animar` (lo que hay dentro de una tarjeta o de un título entra con ella).

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Pintar cualquier superficie o texto | Colores | Tokens de `tokens.css`, medidos en el Canva (tabla de arriba) |
| Pintar títulos y texto | Familia y grosor | `@fontsource/londrina-solid/latin-900.css` y `@fontsource-variable/nunito/wght.css` (el navegador baja solo el archivo latino por `unicode-range`) |
| Precargar la fuente de títulos | URL del `woff2` | `@fontsource/londrina-solid/files/londrina-solid-latin-900-normal.woff2?url` en `Base.astro` |
| Pintar el fondo | Mosaico de cartón | `src/assets/texturas/carton.{avif,webp}` generados por `scripts/carton.mjs` con semilla fija |
| Girar tarjeta o imagen en reposo | Ángulo | Prop `giro` → `--giro-izquierda`, `0`, `--giro-derecha` |
| Colocar cintas | Posición | Prop `cinta` |
| Elegir papel | Color | Prop `papel` → `--color-papel` o `--color-salvia` |
| Mostrar la cifra de un dato | `76.1 %` | Prop `valor` (en #7 viene de `src/data/campana.ts`; en la muestra, literal del Canva) formateada con `toFixed(1)` + espacio fijo + `%` |
| Mostrar la frase del dato | Texto | Prop `frase` (misma fuente que `valor`) |
| Mostrar texto de etiqueta sí/no | Texto | Prop `texto` (en #6 viene de `campana.ts`) |
| Dibujar un ícono | SVG | Prop `nombre` → `src/icons/<nombre>.svg` (Lucide) |
| Texto alternativo de imagen | `alt` | Prop `alt` obligatoria |
| Duración, distancia, curva, escalonado | Números | `src/scripts/movimiento.ts` |
| Animar o no | Sí/no | `prefers-reduced-motion` + clase `js` (spec 0001) |
| Hacer parallax o no | Sí/no | `(min-width: 1024px) and (pointer: fine)` + movimiento no reducido |
| Signo del giro de entrada de una tarjeta | `+` o `-` | `data-giro` de la tarjeta; si es `recto`, su posición entre todas las tarjetas animadas (pares `+`, impares `-`) |
| Giro final de una tarjeta | Ángulo de reposo | El mismo `rotate` de CSS (la animación usa giro relativo con `+=`) |
| Texto de la muestra | Frases | Textos del Canva (lema, 76.1 %, frases de la diapositiva 6); temporal hasta #4 y #5 |
| Imagen de la muestra | Imagen | `src/assets/muestra/reciclar.png`, generada con `sharp` desde el SVG `recycle` de Lucide; temporal |

**Key invariants**:
- Solo `tokens.css` contiene colores literales; solo `movimiento.ts` contiene valores de movimiento.
- Ningún texto va directo sobre el cartón.
- Los títulos se escriben en mayúsculas y minúsculas normales en el código; las mayúsculas vienen de CSS.
- Solo se animan `transform`, `opacity`, `visibility` y `clip-path`.
- Todo efecto vive dentro de `gsap.matchMedia` con movimiento no reducido y corre una sola vez (el parallax es la única animación continua y solo en pantallas anchas con mouse).
- El giro de reposo se escribe con la propiedad CSS `rotate`. GSAP lo absorbe en su propio `transform` al animar, por eso la entrada usa giro relativo (`'+='` dentro de `gsap.from`) y termina exactamente en el giro de reposo. Nunca se anima una tarjeta hacia `rotation: 0`.
- `ListaIconos` y cualquier texto van dentro de una tarjeta, una tira o una etiqueta; nunca directo sobre el cartón.
- Un `data-animar` nunca va anidado dentro de otro.
- Cintas, íconos decorativos y la capa de cartón llevan `aria-hidden="true"`.

**Security model**: página pública sin datos personales. Sin cambios respecto al spec 0001. Las fuentes y la textura se sirven desde el mismo dominio.

**Critical test scenarios**:
- Happy path: en un celular de 390 px la muestra enseña los siete componentes sin scroll horizontal, y al bajar cada tarjeta se pega y cada título se escribe una vez, verifies **AC-5**, **AC-7**
- Failure case: con movimiento reducido todo está quieto y completo desde el inicio; sin JS o con GSAP bloqueado todo aparece antes de 3 s, verifies **AC-9**, **AC-10**
- Parallax: a 1440 px con mouse el cartón se mueve más lento; a 390 px o con emulación táctil no se mueve, verifies **AC-8**
- Giro final: después de la entrada, `getComputedStyle(tarjeta).transform` equivale al giro de reposo de su `data-giro`, y un título con "¿CÓMO?" se ve completo, verifies **AC-13**
- Cambio de ancho: con la muestra ya revelada, pasar de 1440 px a 900 px apaga el parallax sin volver a esconder tarjetas ni títulos, verifies **AC-8**, **AC-9**
- Accesibilidad: en el DOM los títulos están en minúsculas normales y cintas, íconos decorativos y la capa llevan `aria-hidden`; los contrastes miden AA, verifies **AC-6**, **AC-11**
- Peso: la primera carga sin la imagen de muestra transfiere 200 KB o menos, verifies **AC-12**

## Build plan

Skateboard: primero una muestra quieta completa y presentable, luego se suma el movimiento, y el parallax al final porque es lo más prescindible.

1. Instalar `@fontsource/londrina-solid` y `@fontsource-variable/nunito`; agregar `sharp` como dependencia de desarrollo explícita (hoy llega solo a través de Astro). Llenar `tokens.css` con la tabla de tokens; en `global.css` poner fuentes, tamaño base, color de tinta y `:focus-visible` (contorno de 3 px en tinta con 2 px de separación); importar las fuentes y precargar Londrina en `Base.astro`, satisfies **AC-2**, **AC-3**, **AC-6**
2. Escribir `scripts/carton.mjs` y el script `npm run carton`, generar y versionar `carton.avif` y `carton.webp`, y agregar la capa `.fondo-carton` a `Base.astro`, satisfies **AC-4**
3. Copiar los seis SVG de Lucide a `src/icons/` y crear `Icono.astro` con el tipo `NombreIcono`, satisfies **AC-11**
4. Crear `Seccion`, `TituloSeccion`, `TarjetaCinta`, `BloqueDato`, `ListaIconos`, `ImagenMarco` y `EtiquetaSiNo` en `src/components/ui/`, estáticos, con sus estilos, satisfies **AC-5**, **AC-6**, **AC-11**
5. Generar `src/assets/muestra/reciclar.png` y reemplazar la sección de prueba de `index.astro` por la muestra de todos los componentes y variantes, satisfies **AC-5**
6. Crear `src/scripts/movimiento.ts`, ampliar la regla de ocultar en `global.css`, quitar el `gsap.set('[data-animar]')` genérico del spec 0001 y sumar a `animaciones.ts` los efectos subir, tarjeta con cinta (giro relativo), título (con `clearProps`) y `data-entrada`, satisfies **AC-7**, **AC-9**, **AC-10**, **AC-13**
7. Sumar el parallax de `.fondo-carton` con la condición de ancho y mouse, satisfies **AC-8**, **AC-9**
8. Escribir `design.md` en la raíz a partir de lo construido, satisfies **AC-1**
9. Correr `npm run build` y `npm run check`, revisar que el CSS de `dist/` conserve `image-set()` con `type()`, medir el peso de la primera carga en la vista previa de Cloudflare y los contrastes, y ajustar si algo se pasa, satisfies **AC-6**, **AC-12**

## Consequences

**Positive**:
- La web se reconoce como la misma campaña que los materiales del campus.
- Las secciones #5 a #9 solo combinan componentes y leen tokens; no deciden estilo.
- Toda la identidad pesa unos 100 KB (dos fuentes y un mosaico), sin fotos de fondo.
- El contrato de accesibilidad del spec 0001 se mantiene con todos los efectos nuevos.

**Negative / tradeoffs**:
- Tres efectos más el parallax suman lógica a `animaciones.ts` y más casos que probar con movimiento reducido y sin JS.
- El cartón generado se ve más parejo que una foto real de cartón.
- Londrina Solid se carga solo en 900: no hay títulos finos ni medianos.
- La capa fija del parallax obliga a pintar una capa extra en computadora; si da tirones se quita sin tocar nada más (paso 7 del plan).
- El cuaderno, la cinta y el papel con CSS no copian al píxel las fotos de Canva.
- La portada y el resto usan dos estilos distintos (foto y collage); #5 tiene que cuidar la transición.

**Neutral**:
- Los valores del spec 0001 (24 px, duración por defecto de GSAP) se reemplazan por los de `movimiento.ts`, como ese spec preveía.
- `sharp` pasa a ser dependencia de desarrollo explícita.
- La muestra en `index.astro` es temporal: la reemplaza la portada en #5.

## Follow-up

- [ ] #4 exporta la imagen de la diapositiva 1 para la portada. Esa imagen trae el logo y el lema incrustados como dibujo: #5 tiene que poner el lema como texto real y un `alt` que describa la imagen.
- [ ] #10 (contadores) lee `data-valor` de la cifra de `BloqueDato` en vez de parsear el texto.
- [ ] Anotar en el `AGENTS.md` raíz (parte #2, `/audit`) que `design.md` es la fuente del estilo, los valores de `data-animar` y la regla de "nada de colores fuera de `tokens.css`".
- [ ] El "Done when" del scope nombra tres componentes; este spec deja siete por decisión tuya. No hace falta cambiar el scope.

## Rationale

Razonamiento y opciones: ver [rationale.md](rationale.md).

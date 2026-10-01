# 0003. La página como historia al hacer scroll: la vida de un cargador

**Date**: 2026-09-30
**Status**: In Progress

## Summary

La página deja de seguir el orden de las diapositivas y cuenta una historia mientras bajas: un cargador funciona, se daña, termina en un cajón, casi va a la basura, nadie sabe dónde llevarlo, y al final llega al Ecopunto. Cada momento es una escena que se queda fija en pantalla mientras sus dibujos se mueven y sus cifras cuentan solas, también en celular. Después de la historia viene una guía clara para actuar: qué sí y qué no depositar, los 4 pasos y cómo reconocer el contenedor. Se construye sobre el sistema visual del spec 0002 (collage de cartón), más audaz, con dibujos SVG propios en vez de imágenes del Canva; con movimiento reducido o sin JavaScript, todo se lee como una página normal en su estado final.

## Requirements

**User stories**:
- Como estudiante que escanea el QR, quiero que la página me atrape desde la primera pantalla y me cuente el problema como una historia, para entenderlo sin leer bloques de texto.
- Como estudiante que solo quiere saber qué hacer, quiero saltar directo a la guía, para usar el Ecopunto hoy.
- Como estudiante que pidió menos movimiento, quiero leer la misma historia quieta y completa.

**Acceptance criteria**:
- **AC-1**: La página tiene, en este orden: enlace de salto, portada, cinco escenas de historia (A "Funciona y se daña", B "Al cajón", C "A la basura", D "Nadie sabe dónde", E "El Ecopunto"), la guía (sí y no, 4 pasos, cómo reconocer el contenedor), "Sobre la campaña" (cómo se obtuvo la información, objetivo y acciones), el cierre y el pie. Todo el texto sale de `src/data/campana.ts`; la muestra temporal del spec 0002 desaparece.
- **AC-2**: Sin movimiento reducido y con pantalla de 600 px de alto o más, a 390 × 844 y a 1440 × 900, cada escena A a E se queda fija mientras su línea de tiempo avanza con el scroll; al subir, retrocede; al terminar, la página sigue normal.
- **AC-3**: En cada momento con dato (B 76.1, C 39.1, D 80.4, E 78.3 y luego 91.3), la cifra cuenta desde 0 al ritmo del scroll y termina exactamente en su valor con un decimal, y la grilla de 46 puntos marca `round(valor × 46 / 100)` puntos (35, 18, 37, 36 y 42).
- **AC-4**: El cargador aparece en cada escena y en la E termina dentro del contenedor del Ecopunto; en el cierre se ve dentro del contenedor.
- **AC-5**: La escena C se ve oscura (capa `--color-noche`) y vuelve al cartón antes de soltarse.
- **AC-6**: Con movimiento reducido, sin JavaScript, o si GSAP no carga en 3 segundos, ninguna escena se fija ni ocupa una pantalla vacía, todo el texto se lee (en la A los dos momentos, en la E los dos datos), cada dibujo está en su pose final, cada cifra muestra su valor final y cada grilla tiene sus puntos marcados.
- **AC-7**: A 390 × 700 ninguna escena fija corta texto ni dibujo; si una escena no cabe en la pantalla, no se fija y se muestra estática. En ningún ancho hay scroll horizontal.
- **AC-8**: El enlace "Ir directo a qué depositar" es lo primero en el orden de foco, se ve siempre, mide al menos 44 px de alto y lleva a la guía con el teclado y con el dedo (el foco queda en la guía); dibujos y puntos llevan `aria-hidden`; cada cifra se anuncia una sola vez con su valor final; hay un solo `h1` y un `h2` por escena o sección; todo el texto cumple AA.
- **AC-9**: La pista "Baja y sigue su historia" de la portada rebota 3 veces después de la entrada y se detiene; nada se mueve solo más de 5 segundos.
- **AC-10**: La primera carga transfiere 200 KB o menos, la historia no carga imágenes de mapa de bits (todo es SVG en línea) y CLS es menor a 0.1.
- **AC-11**: `npm run check` y `npm run build` pasan.

## Decision

**Chosen option**: Option 1: Escenas fijas con `position: sticky` y ScrollTrigger con scrub, sobre el collage, con dibujos SVG propios

Cada escena es una pista alta con un escenario `sticky`; ScrollTrigger solo lee el avance (sin `pin`) y mueve una línea de tiempo con `scrub`. Se construye sobre los tokens y componentes del spec 0002.

**Implementation skills**: `gsap-scrolltrigger` (`greensock/gsap-skills`, `.agents/skills/gsap-scrolltrigger/`) · `gsap-core` (`greensock/gsap-skills`, `.agents/skills/gsap-core/`) · `accessibility` (`addyosmani/web-quality-skills`, `.agents/skills/accessibility/`) · `web-perf` (`cloudflare/skills`, `.agents/skills/web-perf/`)

## Feature design

**Data model sketch** (contenido nuevo en `src/data/campana.ts`). Los textos reutilizados se definen como constantes antes del objeto `campana` (un literal no puede leerse a sí mismo). Tipos nuevos:

```ts
type DatoCorto = Pick<Dato, 'valor' | 'frase'>;
interface Momento { titulo: string; texto?: string; dato?: DatoCorto }
interface EscenaHistoria { id: 'funciona' | 'cajon' | 'basura' | 'nadie-sabe' | 'ecopunto'; momentos: readonly Momento[] }
// Campana suma:
historia: { saltar: string; pista: string; escenas: readonly EscenaHistoria[] };
guia: { titulo; si; no; contenedor: Bloque };
sobre: { titulo: string };
```

Contenido (texto nuevo escrito en este spec; el resto sale de bloques que ya existen):

| Escena | Momento 1 | Momento 2 |
|---|---|---|
| A `funciona` | "Este cargador te acompaña todo el semestre." + `porque.puntos[0]` | "Hasta que un día deja de funcionar." + `porque.puntos[1]` |
| B `cajon` | "Y termina guardado en un cajón." + dato `encuesta.datos[0]` (76.1) | |
| C `basura` | "O peor: en la basura común." + dato 39.1 "de los participantes ha desechado aparatos junto a la basura común." + texto `problema.puntos[1]` y `porque.puntos[2]` | |
| D `nadie-sabe` | "¿Y dónde se lleva?" + dato `encuesta.datos[1]` (80.4) | |
| E `ecopunto` | "Para eso existe el Ecopunto." + dato `encuesta.datos[2]` (78.3) | "Y casi todos quieren saber cómo usarlo." + dato `encuesta.datos[3]` (91.3) |

`historia.saltar = 'Ir directo a qué depositar'`, `historia.pista = 'Baja y sigue su historia'`, `sobre.titulo = 'Sobre la campaña'`. `guia.contenedor = { titulo: '¿Cómo reconozco el contenedor?', puntos: ['Es un contenedor verde y blanco.', 'Dice "Ecopunto INTEC" y "Pequeños aparatos, grandes cambios".', 'Tiene el símbolo de reciclaje.', 'Muestra qué sí puedes depositar y qué no.'] }` (rasgos de la imagen del contenedor, diapositiva 16). El 39.1 sale de `encuesta.datos[0].detalle` (se elimina `detalle` de ese dato y del tipo si nadie más lo usa).

**Modo estático y modo fijo** (la decisión clave):
- El HTML que sirve el servidor es el **modo estático**: cada escena es una sección normal (alto automático) con el dibujo en su pose final y **todos** sus momentos apilados, cada uno en su `TarjetaCinta animar={false}` crema. Así se ve con movimiento reducido, sin JS y si GSAP no llega.
- El **modo fijo** lo activa el JS dentro de `gsap.matchMedia('(prefers-reduced-motion: no-preference) and (min-height: 600px)')`: agrega la clase `escena-fija` a cada escena que cabe y la quita en la limpieza. Solo bajo esa clase: la sección pasa a ser una pista de alto `calc(100svh + LARGO)` (con línea previa en `vh` de respaldo), su `.escenario` es `position: sticky; top: 0; height: 100svh`, y los momentos de la escena ocupan **la misma celda de grilla** (`grid-area: 1 / 1`) y se reemplazan con `opacity`, así el alto es el del momento más alto, no la suma.
- **Prueba de que cabe**: al activar, si el `.escenario` de una escena tiene `scrollHeight > clientHeight`, se le quita `escena-fija`, no se le arma línea de tiempo y queda estática.
- Disposición del escenario: en celular, dibujo arriba de alto `min(32svh, 16rem)` y la tarjeta abajo; desde 1024 px, dos columnas (dibujo a la izquierda, tarjeta a la derecha) centradas.

**Líneas de tiempo** (todas en unidades de 0 a 1 con `ease: 'none'` en el avance; el último 15 % es pausa sin cambios para que la cifra final se vea antes de soltar; contenido con `opacity`, nunca `autoAlpha`):

| Escena | Tramos |
|---|---|
| A | 0 a 0.35: nivel de batería del celular `scaleX 0 → 1` y momento 1 aparece · 0.35 a 0.5: aparece la chispa, la pieza `cable` cruza a `cable-roto` con `opacity`, pantalla del celular a negro · 0.5 a 0.85: momento 1 se va y entra momento 2 |
| B | 0 a 0.25: frente del cajón se abre (`y`) y el cargador cae dentro (`y`, `rotation`) · 0.25 a 0.85: cifra 0 → 76.1 y los 35 puntos se marcan en el mismo tramo |
| C | 0 a 0.2: capa `.noche` `opacity 0 → 1` · 0.2 a 0.4: cargador cae al basurero · 0.4 a 0.75: cifra 0 → 39.1 y 18 puntos · 0.75 a 0.85: aparece el texto del impacto · 0.9 a 1: capa `.noche` vuelve a `opacity 0` antes de soltar |
| D | 0 a 0.3: flechas `rotation` sin rumbo y los "?" aparecen · 0.3 a 0.85: cifra 0 → 80.4 y 37 puntos |
| E | 0 a 0.25: contenedor sube desde abajo · 0.25 a 0.4: el cargador vuela y entra por la boca · 0.4 a 0.6: cifra 0 → 78.3 y 36 puntos · 0.6 a 0.65: momento 1 se va, momento 2 entra, su cifra arranca en 0 y su grilla vacía · 0.65 a 0.85: cifra 0 → 91.3 y 42 puntos |

Cada paso posterior sobre una misma propiedad usa `fromTo` con `immediateRender: false`. LARGO de cada pista: `LARGO_ESCENA = 120` (en % de pantalla) y `LARGO_ESCENA_DOBLE = 180` para A y E, en `movimiento.ts`. ScrollTrigger de cada escena: `{ trigger: escena, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true }` (sin `pin`). `ScrollTrigger.config({ ignoreMobileResize: true })` una vez en `animaciones.ts`.

**Cifra** (`src/components/historia/Cifra.astro`, prop `valor`): `<p class="cifra">` con un `<span class="solo-lector">76.1 %</span>` y una caja `aria-hidden` con dos capas en la misma celda: una invisible con el texto final (reserva el ancho, así no tiembla) y la animada `data-cifra={valor}`. El JS escribe `0.0 %` al activar, cuenta con `onUpdate` (`toFixed(1)` + U+00A0 + `%`) y en la limpieza vuelve a escribir el valor final. Va siempre sobre papel crema, en `--color-verde` a `--cifra-escena`.

**Puntos46** (`src/components/historia/Puntos46.astro`, props `total`, `marcados`): grilla `aria-hidden` de `total` puntos, 23 por fila en todos los anchos (2 filas). Cada punto tiene dos capas: contorno en `--color-tinta` y relleno en `--color-verde`; solo los primeros `marcados` tienen relleno y llevan `data-punto`. La animación lleva el relleno de `scale 0, opacity 0` a su estado final; el punto n se marca cuando la cuenta pasa n/46 del tramo. Siempre sobre papel crema.

**Dibujos** (`src/components/ilustraciones/`): cada componente devuelve un `<g>` (sin `<svg>` propio y **sin atributos `id`**), con colores por `var(--...)` y trazo `--color-tinta` de 3. Cada escena tiene un solo `<svg viewBox="0 0 400 300" aria-hidden="true">` donde compone sus piezas. Los recipientes tienen capa de atrás y de adelante para que el cargador quede adentro: `Cajon`, `Basurero` y `Contenedor` exponen un `<slot name="dentro">` entre ambas capas. Partes animables (`data-parte`):

| Componente | Partes | Poses (prop `pose`) |
|---|---|---|
| `Cargador` | `cuerpo`, `enchufe`, `cable`, `cable-roto`, `chispa` | `enchufado` (cable sano, sin chispa), `roto` (cable-roto y chispa), `guardado`, `basura`, `perdido`, `reciclado` (estas cuatro: cable-roto, sin chispa) |
| `Celular` | `pantalla`, `bateria-nivel` | `cargando` (pantalla encendida, nivel lleno), `apagado` (pantalla negra, nivel vacío) |
| `Cajon` | `atras`, `frente` | abierto |
| `Basurero` | `atras`, `tapa`, `frente` | con tapa abierta |
| `Contenedor` | `atras`, `boca`, `frente` (verde y blanco, texto "Ecopunto INTEC", símbolo de reciclaje) | normal |
| `Preguntas` | `pregunta-1`, `pregunta-2`, `pregunta-3`, `flecha-1`, `flecha-2`, `flecha-3` | normal |

Poses finales por escena: portada `enchufado` + `Celular cargando`; A `roto` + `Celular apagado`; B `guardado` dentro del cajón; C `basura` dentro del basurero; D `perdido` con `Preguntas`; E y cierre `reciclado` dentro del contenedor. Sin filtros CSS sobre los dibujos. El favicon pasa a ser el símbolo de reciclaje en `--color-verde` sobre círculo crema (`public/favicon.svg`, colores literales permitidos ahí porque no es `src/`).

**Componentes nuevos** (`src/components/historia/`):

| Componente | Props | Qué hace |
|---|---|---|
| `Escena` | `id` · `tono?: 'carton' \| 'noche'` · slot `dibujo` · slot por defecto (los momentos) | `<section class="escena" data-escena={id} aria-labelledby>` con `.escenario`, `.dibujo` y `.momentos`; con `tono="noche"` agrega la capa `.noche` (`position: absolute; inset: 0; height: 100lvh; background: var(--color-noche)`), visible en modo estático |
| `Momento` | `titulo` · `texto?` · `dato?` · `nivel?: 2 \| 3` (el primero de cada escena es `h2`, el segundo `h3`) | `TarjetaCinta animar={false}` crema con el título en `--titulo-historia`, texto, `Cifra` y `Puntos46` si hay dato, y la frase del dato |
| `Cifra`, `Puntos46` | ver arriba | |
| `Guia` | ninguna (lee `campana`) | Sí y no con `ListaIconos` y `EtiquetaSiNo`; 4 pasos, cada uno una `TarjetaCinta` (con su `data-animar="tarjeta"`) con el número en `--font-titulo` y su ícono; contenedor con un `<svg>` que compone `Contenedor` y la lista `guia.contenedor`. `id="guia"` y `tabindex="-1"` |

Íconos nuevos copiados de Lucide (en el orden de cada lista): sí → `plug-zap`, `cable`, `mouse`, `keyboard`, `headphones`, `calculator`, `usb`, `cpu`; no → `apple`, `cup-soda`, `milk`, `scroll-text`, `leaf`, `droplets`, `trash-2`; pasos → `search`, `shuffle`, `recycle`, `smartphone`.

**Portada y cierre**: portada en modo estático y fijo igual (no se fija): `h1` con `campana.nombre` a `--titulo-portada`, lema, subtítulo, un `<svg>` con `Cargador enchufado` y `Celular cargando`, y la pista. En celular: título, dibujo, lema, pista; desde 1024 px dos columnas. Entra al cargar con `data-entrada` (spec 0002), sin `data-entrada` en el `h1`. La pista es un elemento hijo con `data-pista` que rebota (`y`) 3 veces (`repeat: 2`, 0.8 s cada una) empezando 1.2 s después de cargar. Cierre: `TituloSeccion` con `campana.cierre.titulo`, subtítulo, y un `<svg>` con `Contenedor` y `Cargador reciclado` adentro. Pie: `campana.creditos` en una tira de papel.

**Enlace de salto**: primer elemento de `<body>`, siempre visible (barra fina arriba en papel crema, no oculta hasta el foco), alto mínimo 44 px, apunta a `#guia`. Se quita `scroll-behavior: smooth` de `global.css` (choca con ScrollTrigger y con saltos por ancla).

**Tokens nuevos** (`tokens.css`): `--color-noche: #241c15`, `--color-verde: #2f8f3a` (solo cifras de 24 px o más, puntos y formas; nunca sobre salvia), `--cifra-escena: clamp(3rem, 14vw, 5.5rem)`, `--titulo-historia: clamp(1.6rem, 6.5vw, 2.6rem)`.

**API surface** (atributos que lee el JavaScript):

| Atributo | Lo lee | Efecto (modo fijo) |
|---|---|---|
| `data-escena="<id>"` | `src/scripts/escenas/<id>.ts` vía `src/scripts/escenas/index.ts` | Pista sticky y línea de tiempo con scrub |
| `data-parte="<nombre>"` | La escena que lo contiene | Pieza animada |
| `data-cifra="<valor>"` | `src/scripts/escenas/cifra.ts` | Cuenta dentro de la línea de su escena |
| `data-punto` | `src/scripts/escenas/puntos.ts` | Se marca dentro de la línea de su escena |
| `data-pista` | `src/scripts/efectos/pista.ts` | Rebota 3 veces y se detiene |

**Orden de registro en `animaciones.ts`**: dentro del bloque de movimiento, primero las escenas (cambian alturas de la página), después `entrada`, `subir`, `tarjetas`, `titulos`, la pista, y al final `ScrollTrigger.refresh()`; el parallax sigue en su bloque aparte. Si GSAP llega después de los 3 segundos, las escenas se activan igual al cargar (la historia se vuelve fija en ese momento).

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Portada | Nombre, lema, subtítulo, pista | `campana.nombre`, `campana.lema`, `campana.subtitulo`, `campana.historia.pista` |
| Enlace de salto | Texto y destino | `campana.historia.saltar`, `#guia` |
| Escenas A a E | Títulos, textos | `campana.historia.escenas[i].momentos[j]` |
| Momentos con dato | Cifra | `dato.valor`, `toFixed(1)` + U+00A0 + `%` |
| Momentos con dato | Puntos marcados | `Math.round(dato.valor * campana.encuesta.participantes / 100)` |
| Momentos con dato | Total de puntos | `campana.encuesta.participantes` (46) |
| Escena C | Oscuridad | `tono="noche"` → `--color-noche` |
| Pose del cargador | Pose | Fija por escena (tabla de poses) |
| Fijar o no | Sí/no | `prefers-reduced-motion`, `min-height: 600px`, clase `js` y la prueba de que cabe |
| Largo de cada pista | % de pantalla | `LARGO_ESCENA`, `LARGO_ESCENA_DOBLE` |
| Guía | Listas, pasos, rasgos del contenedor | `campana.guia.si`, `campana.guia.no`, `campana.pasos`, `campana.guia.contenedor` |
| Guía | Íconos | Mapa fijo de este spec |
| Sobre la campaña | Título, método, objetivo, acciones | `campana.sobre.titulo`, `campana.encuesta.metodo`, `campana.objetivoGeneral`, `campana.acciones` |
| Cierre y pie | Textos | `campana.cierre`, `campana.creditos` |

**Key invariants**:
- El HTML servido es el modo estático completo; el modo fijo solo existe mientras la clase `escena-fija` está puesta, y la limpieza de `matchMedia` la quita y repone las cifras finales.
- Nada dentro de una escena lleva `data-animar` (por eso `TarjetaCinta animar={false}` y sin `TituloSeccion`).
- Ningún `id` dentro de los dibujos SVG.
- Contenido de escena animado solo con `opacity` y transformaciones; nunca `visibility`.
- Texto, cifras y puntos siempre sobre papel crema (en la escena C también).

**Security model**: página pública sin datos personales; sin cambios respecto a los specs 0001 y 0002.

**Critical test scenarios**:
- Happy path: a 390 × 844, bajar toda la historia fija cada escena, cuenta las cifras y termina con el cargador dentro del contenedor, verifies **AC-2**, **AC-3**, **AC-4**
- Failure case: con movimiento reducido o sin JS, la historia se lee completa y quieta, con los dos momentos de A y E, cifras y puntos finales, sin pantallas vacías, verifies **AC-6**
- Celular chico y apaisado: a 390 × 700 nada se corta; a 844 × 390 no se fija nada, verifies **AC-7**
- Accesibilidad: Tab desde el inicio enfoca el enlace de salto y Enter deja el foco en la guía; cada cifra se lee una vez, verifies **AC-8**

## Build plan

Skateboard: primero la historia completa, quieta y publicable; después se fija y anima escena por escena.

1. Sumar a `campana.ts` `historia`, `guia.contenedor`, `sobre` y mover el 39.1; agregar los tokens nuevos y quitar `scroll-behavior: smooth`, satisfies **AC-1**, **AC-5**
2. Dibujar los componentes SVG de `src/components/ilustraciones/` y el favicon; copiar los íconos de Lucide de la guía, satisfies **AC-4**, **AC-8**, **AC-10**
3. Crear `Escena`, `Momento`, `Cifra`, `Puntos46` y `Guia`, y armar en `index.astro` la página completa en modo estático (enlace de salto, portada, A a E, guía, sobre la campaña, cierre, pie), quitando la muestra; medir el peso; publicar, satisfies **AC-1**, **AC-3**, **AC-6**, **AC-7**, **AC-8**, **AC-10**
4. Crear el CSS de `escena-fija`, `src/scripts/escenas/` (activar, prueba de que cabe, cifra, puntos) y la escena A; luego B, C, D y E, una por una, probadas a 390 × 844, 390 × 700 y 1440 × 900, satisfies **AC-2**, **AC-3**, **AC-4**, **AC-5**, **AC-7**
5. Sumar la pista con su límite de 3 rebotes y reordenar el registro en `animaciones.ts`, satisfies **AC-9**
6. Probar movimiento reducido, sin JS, teclado, peso y CLS; actualizar `design.md`, satisfies **AC-6**, **AC-8**, **AC-10**, **AC-11**

## Consequences

**Positive**:
- La página explica el problema como una historia y cada cifra es un momento.
- `position: sticky` evita espaciadores de GSAP, tiembla menos en celular y deja el respaldo trivial.
- Los dibujos SVG eliminan el bloqueo de exportación del Canva y pesan casi nada.
- Reutiliza el sistema verificado del spec 0002 y el contenido de `campana.ts`.

**Negative / tradeoffs**:
- La opción con más trabajo de la noche: cinco líneas de tiempo que probar en tres tamaños.
- En pantallas de menos de 600 px de alto (celular apaisado) la historia no se fija.
- La página es más larga de recorrer; el enlace de salto compensa.
- Los dibujos hechos a mano se ven más simples que las fotos del Canva.
- Se reemplazan dos reglas del spec 0002: la portada es ilustrada (no fotográfica) y no hay `scroll-behavior: smooth`.

**Neutral**:
- Las partes #5 a #8 del scope se reemplazan por esta; la #4 cierra con textos y deja las imágenes del Canva sin usar.

## Follow-up

- [ ] Nombres de los integrantes para el pie (no están en el Canva).
- [ ] La parte #10 (contadores y gráficos) queda cubierta en gran parte por las cifras y grillas de esta historia; revisarla al cerrar la Release 1.
- [ ] La imagen para compartir (#9) puede salir de una captura de la portada ilustrada.

## Rationale

Razonamiento y opciones: ver [rationale.md](rationale.md).

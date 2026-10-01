# Design: Ecopunto INTEC

Guía del sistema visual y de movimiento de la página. La decisión completa y su razonamiento están en el [spec 0002](docs/specs/0002-sistema-visual-animacion/index.md) (sistema visual) y el [spec 0003](docs/specs/0003-historia-scroll/index.md) (la historia al hacer scroll). Los valores viven en el código: colores, letras y medidas en [`src/styles/tokens.css`](src/styles/tokens.css), movimiento en [`src/scripts/movimiento.ts`](src/scripts/movimiento.ts). Si este archivo y el código no coinciden, manda el código.

## Character

Un collage de campaña escolar hecho a mano, como la presentación de Canva "Ecopunto intec": cartón reciclado de fondo, notas de papel crema o salvia sujetas con cinta verde, títulos con letra de marcador sobre una tira de cuaderno. Cercano, ordenado y fácil de leer en un celular. La página cuenta una historia al bajar (la vida de un cargador) con dibujos planos de trazo verde oscuro. La portada es la excepción al cartón: clara, con el cargador enchufado.

## Build mandate

- Todo texto va sobre papel, cuaderno o etiqueta. Nunca directo sobre el cartón (ahí el contraste no alcanza).
- Solo `tokens.css` escribe colores literales. Los componentes usan `var(--...)`. Las máscaras usan las palabras `black` y `transparent`.
- Los títulos se escriben en mayúsculas y minúsculas normales; las mayúsculas las pone CSS.
- Se arma con los componentes de `src/components/ui/`. Si falta algo, primero se busca si un componente con otras props lo resuelve.
- Mobile first: se diseña a 390 px y luego se abre a 768 y 1024.
- Ningún elemento con `data-animar` va dentro de otro con `data-animar`.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `--color-carton` | `#ae7a4a` | Fondo de la página y color de respaldo del cartón |
| `--color-carton-oscuro` | `#8f6238` | Fibras del cartón (solo en `scripts/carton.mjs`) |
| `--color-papel` | `#eee4cb` | Tarjeta crema (por defecto) |
| `--color-salvia` | `#bfc296` | Tarjeta del bloque de dato |
| `--color-cuaderno` | `#fbf7ee` | Tira de los títulos y marco de imagen |
| `--color-cuadricula` | `#c9d6e3` | Líneas de la tira de cuaderno |
| `--color-cinta` | `#61b25c` al 85 % | Cinta verde |
| `--color-tinta` | `#15322b` | Todo el texto, íconos y borde de foco |
| `--color-tinta-suave` | `#2c463e` | Notas y detalle del dato |
| `--color-si` | `#61b25c` | Etiqueta "sí" (texto en tinta) |
| `--color-no` | `#ba5b5e` | Etiqueta "no" (texto blanco, solo grande) |
| `--color-portada` | `#f5f5f2` | Fondo claro de la portada |
| `--color-noche` | `#241c15` | Capa oscura de la escena "A la basura" (texto siempre sobre papel) |
| `--color-verde` | `#2f8f3a` | Cifras de la historia (24 px o más), puntos y formas; nunca sobre salvia |
| `--color-chispa` | `#f2b705` | Solo la chispa del cargador; nunca texto |

Contrastes medidos: tinta sobre papel 10.9, sobre salvia 7.5, sobre cuaderno 12.9; tinta suave sobre salvia 5.5 y sobre papel 8.1; tinta sobre etiqueta "sí" 5.3; blanco sobre etiqueta "no" 4.4 (por eso la etiqueta siempre va a 24 px en 900); borde de foco sobre cartón 3.7.

## Letras

| Uso | Familia | Grosor | Paquete |
|---|---|---|---|
| Títulos, cifras, etiquetas | Londrina Solid (`--font-titulo`) | 900, siempre en mayúsculas por CSS | `@fontsource/londrina-solid/latin-900.css`, precargada en `Base.astro` |
| Párrafos y listas | Nunito Variable (`--font-texto`) | 400 y 700 | `@fontsource-variable/nunito/wght.css` (el navegador baja solo el archivo latino) |

Tamaños: texto 18 px (`--texto-base`), notas 16 px (`--texto-chico`), título de sección `--titulo-seccion`, portada `--titulo-portada`, cifra `--dato-cifra`, etiqueta `--texto-etiqueta`, cifra de escena `--cifra-escena`, título de momento `--titulo-historia`.

## Texturas

- **Cartón**: mosaico de 512 px sin costuras, generado por `npm run carton` en `src/assets/texturas/` (AVIF de unos 32 KB con WebP de respaldo). Va en la capa fija `.fondo-carton` de `Base.astro`.
- **Papel**: clase `.papel` (en `global.css`): color de `--papel`, ruido sutil `--textura-papel` y `--sombra-papel`.
- **Cuaderno**: la tira de `TituloSeccion`, líneas cada 22 px en `--color-cuadricula`.
- **Cinta**: clase `.cinta` (en `global.css`), extremos dentados con máscara. Cada componente fija su posición y ángulo con la propiedad `rotate`, nunca al azar.

## Componentes (`src/components/ui/`)

| Componente | Props | Para qué |
|---|---|---|
| `Seccion` | `id` · `ancho?: 'texto' \| 'amplio'` | Bloque centrado con margen lateral. En `amplio`, un `div.grilla` va en 1, 2 (768 px) o 3 (1024 px) columnas |
| `TituloSeccion` | `nivel?: 2 \| 3` · `id?` · slot | Título sobre tira de cuaderno con dos cintas |
| `TarjetaCinta` | `papel?: 'crema' \| 'salvia'` · `cinta?: 'arriba' \| 'esquinas' \| 'lados' \| 'ninguna'` · `giro?: 'izquierda' \| 'recto' \| 'derecha'` · `as?` · `animar?` · slot | La pieza base: papel con cinta y giro de reposo |
| `BloqueDato` | `valor` · `frase` · `detalle?` · `giro?` · `animar?` | Cifra grande en papel salvia; `data-valor` queda listo para los contadores (#10) |
| `ListaIconos` | `items: { icono, texto }[]` | Lista con ícono de trazo. Siempre dentro de una `TarjetaCinta` |
| `ImagenMarco` | `src` · `alt` (obligatorio) · `anchos?` · `sizes?` · `giro?` · `cinta?` · `animar?` | Imagen optimizada (AVIF y WebP) en marco de papel |
| `EtiquetaSiNo` | `tipo: 'si' \| 'no'` · `texto` | Sello verde "sí" o rojo "no" con ícono |
| `Icono` | `nombre` · `tamano?` · `etiqueta?` | SVG de Lucide desde `src/icons/`. Sin `etiqueta` es decorativo (`aria-hidden`) |

Para sumar un ícono: copia su SVG de Lucide a `src/icons/` (sin `width`, `height` ni `class`) y agrega el nombre a `NombreIcono` en `Icono.astro`.

## La historia (spec 0003)

Enlace de salto, portada, cinco escenas (A funciona y se daña, B al cajón, C a la basura, D nadie sabe dónde, E el Ecopunto), guía, "Sobre la campaña", cierre y pie. Todo el texto sale de `src/data/campana.ts`.

- **Modo estático** (el HTML servido): cada escena es una sección normal con el dibujo en su pose final y todos sus momentos apilados. Es lo que ve quien pidió menos movimiento, quien no tiene JS o si GSAP no carga.
- **Modo fijo** (lo pone `src/scripts/escenas/` con la clase `escena-fija`, solo sin movimiento reducido y con 600 px de alto o más): la escena es una pista alta con un escenario `sticky`; los momentos se superponen y una línea de tiempo con scrub los reemplaza. Si una escena no cabe en la pantalla, se queda estática.
- **Componentes** (`src/components/historia/`): `Escena` (`id`, `tono`, `etiqueta`), `Momento` (`momento`, `indice`), `Cifra` (`valor`; lector de pantalla lee el valor final una vez), `Puntos46` (`total`, `marcados`; un punto por persona encuestada), `Guia`.
- **Dibujos** (`src/components/ilustraciones/`): `Cargador` (poses `enchufado`, `roto`, `guardado`, `basura`, `perdido`, `reciclado`), `Celular`, `Cajon`, `Basurero`, `Contenedor`, `Preguntas`. Cada uno devuelve un `<g>` sin `id` ni filtros; los recipientes tienen un slot `dentro` entre su capa de atrás y su frente. Las partes animables llevan `data-parte`. Colores con las clases de `src/styles/ilustraciones.css`.
- **Reglas**: el HTML es el estado final y toda animación va desde un estado inicial hacia él; nada dentro de una escena lleva `data-animar`; el contenido de escena se anima solo con `opacity` y transformaciones; cifras y puntos siempre sobre papel crema.

## Movimiento

Valores en `src/scripts/movimiento.ts`: 0.7 s, sube 32 px, curva `power2.out`, 0.12 s entre elementos, empieza cuando el elemento llega al 85 % de la pantalla, y cada entrada ocurre una sola vez.

| Atributo | Efecto |
|---|---|
| `data-animar` (vacío o `"subir"`) | Aparece subiendo |
| `data-animar="tarjeta"` | Entra girada 4° de más y se asienta en su giro de reposo; después aparecen sus cintas. Lo ponen `TarjetaCinta` e `ImagenMarco` |
| `data-animar="titulo"` | La tira sube y el título se descubre de izquierda a derecha. Lo pone `TituloSeccion` |
| `data-entrada="1"`, `"2"`, … | Entra al cargar la página, en orden (portada). La imagen y el título principal de la portada no lo llevan |
| `data-parallax` | La capa de cartón se mueve más lento que el contenido, solo desde 1024 px y con mouse |

Reglas:
- `src/scripts/animaciones.ts` es el único archivo que importa GSAP. Cada efecto vive en `src/scripts/efectos/`.
- Todo corre dentro de `gsap.matchMedia` con `prefers-reduced-motion: no-preference`; el parallax tiene su propio bloque con la condición de ancho y mouse.
- Con movimiento reducido, sin JavaScript o si GSAP no llega en 3 s, todo se ve en su estado final: tarjetas con su giro, cintas visibles, títulos completos y fondo quieto.
- Solo se animan `transform`, `opacity`, `visibility` y `clip-path`.
- El giro de entrada de las tarjetas es relativo (`'+='`). Nunca se anima una tarjeta hacia `rotation: 0`, porque perdería su giro de reposo.

## Accesibilidad

- Contraste AA en todo texto (ver la paleta); borde de foco de 3 px en tinta con 2 px de separación.
- Cintas, íconos decorativos y la capa de cartón llevan `aria-hidden="true"`.
- Las imágenes llevan `alt` siempre; `alt=""` solo si son decorativas.
- `main` usa `overflow-x: clip`: las cintas y los giros nunca crean scroll horizontal.
- La primera carga (sin imágenes de contenido) pesa menos de 200 KB.

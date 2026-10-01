# Verify: Sistema visual y animación · spec 0002 · updated 2026-09-30
_Steps derived from spec 0002 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
- [x] Abre la muestra en un celular de 390 px de ancho y recorre toda la página → se ven `TituloSeccion`, `TarjetaCinta` (crema y salvia; cinta arriba, esquinas y lados; giro izquierda, recto y derecha), `BloqueDato` con 76.1 %, `ListaIconos`, `ImagenMarco`, `EtiquetaSiNo` sí y no, y `Seccion`, sin scroll horizontal → AC-5
- [x] Debajo de la primera tarjeta se ve el cartón con fibras y sin costuras; bloquea `carton.avif` y `carton.webp` en DevTools → el fondo sigue color cartón → AC-4
- [x] Sin movimiento reducido, baja despacio → cada texto sube y aparece una vez; cada tarjeta entra girada, se asienta y luego aparece su cinta; cada título se descubre de izquierda a derecha; subir y volver a bajar no repite nada → AC-7
- [x] Al terminar las entradas, compara cada tarjeta con la misma página en movimiento reducido → mismo giro de reposo; "¿Cómo obtuvimos la información?" y "¿Va al Ecopunto?" se ven completos, sin tildes cortadas → AC-13
- [x] A 1440 px con mouse, baja → el cartón se mueve más lento que las tarjetas; a 390 px, con emulación táctil o con movimiento reducido → el cartón queda quieto → AC-8
- [x] Con todo revelado a 1440 px, achica la ventana a 900 px → el parallax se apaga y nada se vuelve a esconder → AC-8, AC-9
- [x] Activa movimiento reducido y recarga → todo se ve desde el inicio en su estado final (tarjetas giradas, cintas, títulos completos), sin parpadeo; cambia la preferencia con la página abierta → todo queda visible → AC-9
- [x] Desactiva JavaScript y recarga → todo se ve; con JS, bloquea el script de animación → todo aparece antes de 3 s → AC-10
- [x] Inspecciona el DOM → los títulos están escritos en mayúsculas y minúsculas normales; `.cinta`, `.icono` decorativo y `.fondo-carton` llevan `aria-hidden="true"` → AC-11
- [x] Navega con Tab (cuando haya enlaces o botones) → el foco se ve con borde de 3 px en tinta → AC-6

## Commands
- [x] `npm run check` → `0 errors` → AC-12
- [x] `npm run build` → termina sin errores; en el CSS de `dist/_astro/` quedan `background-image:url(...carton...webp)` y el bloque `@supports` con `image-set(... type("image/avif") ...)` → AC-4, AC-12
- [x] Busca colores literales fuera de `tokens.css`: `grep -rnE "#[0-9a-fA-F]{3,8}\b|rgb\(" src --include=*.astro --include=*.css --include=*.ts` → solo aparecen líneas de `src/styles/tokens.css` → AC-2
- [x] En la pestaña Network de la página publicada (o su vista previa de Cloudflare), primera carga → solo dos `woff2` (`londrina-solid-latin-900-normal`, `nunito-latin-wght-normal`), ninguno de Google; Londrina aparece precargada → AC-3
- [x] En la misma carga, suma "transferido" sin la imagen de muestra → 200 KB o menos (estimado con brotli: unos 146 KB) → AC-12
- [x] Crea un uso de `ImagenMarco` sin `alt` y corre `npm run check` → error de tipos; bórralo → AC-11
- [x] `design.md` en la raíz tiene paleta, letras, texturas, componentes con props, movimiento y accesibilidad → AC-1

## Value sourcing
- [x] Colores: cada `var(--color-*)` de los componentes resuelve al hex de la tabla de `tokens.css` (medidos del Canva)
- [x] Fuentes: `document.fonts` muestra `Londrina Solid 900` y `Nunito Variable` cargadas, desde el mismo dominio
- [x] Precarga: el `<link rel="preload">` de `Base.astro` apunta al mismo archivo `londrina-solid-latin-900-normal` que usa el CSS (sin descarga doble)
- [x] Cartón: `npm run carton` regenera `carton.avif` (unos 32 KB) y `carton.webp` iguales, con semilla fija; un mosaico de 2 × 2 no muestra costuras
- [x] Giro de reposo: cambia `giro` de una tarjeta de `izquierda` a `derecha` → su ángulo pasa de -1.5° a 1.2° y su entrada gira con el signo contrario
- [x] Giro de entrada en tarjetas `recto`: las pares entran con `+4°` y las impares con `-4°` según su posición entre todas las tarjetas animadas
- [x] Cinta: cambiar `cinta` cambia posición y ángulo de forma fija (arriba 3°, esquinas -35°, lados 90°)
- [x] Papel: `papel="salvia"` usa `--color-salvia`; el detalle del dato usa `--color-tinta-suave`
- [x] Cifra del dato: `valor={76.1}` muestra `76.1 %` con espacio fijo (U+00A0) y la cifra lleva `data-valor="76.1"`
- [x] Íconos: un `nombre` sin archivo en `src/icons/` hace fallar el build con un mensaje claro
- [x] Movimiento: cambiar `DURACION` en `movimiento.ts` cambia la duración de todas las entradas
- [x] Animar o no: con `prefers-reduced-motion: reduce`, sin JS o sin GSAP no hay estilos de GSAP en línea; el parallax solo corre con `(min-width: 1024px) and (pointer: fine)`

## Acceptance-criteria coverage
- AC-1 … `design.md` · AC-2 … grep de colores · AC-3 … Network, fuentes · AC-4 … cartón y respaldo · AC-5 … recorrido a 390 px · AC-6 … contrastes (en `design.md`) y foco · AC-7 … entradas · AC-8 … parallax y cambio de ancho · AC-9 … movimiento reducido · AC-10 … sin JS y script bloqueado · AC-11 … DOM y `alt` obligatorio · AC-12 … check, build y peso · AC-13 … giro final y títulos completos

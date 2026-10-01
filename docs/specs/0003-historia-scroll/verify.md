# Verify: Historia al hacer scroll · spec 0003 · updated 2026-10-01
_Steps derived from spec 0003 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
- [ ] Recorre la página de arriba a abajo → enlace de salto, portada, escenas A a E, guía (sí y no, 4 pasos, contenedor), "Sobre la campaña", cierre y pie, en ese orden; la muestra del spec 0002 ya no está → AC-1
- [ ] A 390 × 844 y a 1440 × 900 sin movimiento reducido, baja por cada escena → se queda fija mientras su línea de tiempo avanza; sube y retrocede; al final la página sigue → AC-2
- [ ] En cada momento con dato, baja despacio → la cifra cuenta desde 0.0 % y termina en 76.1, 39.1, 80.4, 78.3 y 91.3; los puntos verdes llegan a 35, 18, 37, 36 y 42 de 46 al mismo ritmo → AC-3
- [ ] Sigue al cargador → aparece en cada escena (enchufado, roto, en el cajón, en el basurero, perdido) y en la E entra al contenedor; en el cierre está dentro del contenedor → AC-4
- [ ] En la escena C → el fondo se oscurece al entrar y vuelve al cartón antes de soltarse → AC-5
- [ ] Con movimiento reducido, sin JS, con GSAP bloqueado (todo visible a los 3 s) y al cambiar la preferencia con la página abierta → ninguna escena fija, sin pantallas vacías, los dos momentos de A y E visibles, dibujos en pose final, cifras finales y 168 puntos marcados → AC-6
- [ ] A 390 × 700 → las cinco escenas fijas caben sin cortar texto ni dibujo; a 844 × 390 (apaisado) ninguna se fija; nunca hay scroll horizontal → AC-7
- [ ] Desde arriba, Tab → "Ir directo a qué depositar" enfocado, visible, 44 px de alto; Enter → el foco queda en la guía; las cifras se leen una vez (texto `solo-lector`) y dibujos y puntos son `aria-hidden`; un `h1` y un `h2` por escena o sección → AC-8
- [ ] En la portada → la flecha rebota 3 veces después de la entrada y se queda quieta antes de los 5 s → AC-9

## Commands
- [ ] `npm run check` y `npm run build` → 0 errores → AC-11
- [ ] Primera carga en la página publicada (Network, transferido) → 200 KB o menos (medido: unos 163 KB), sin imágenes de mapa de bits salvo la textura de cartón, sin pedidos a otros dominios → AC-10
- [ ] CLS con un PerformanceObserver durante la carga y el recorrido completo → menor a 0.1 (medido: 0) → AC-10

## Value sourcing
- [ ] Títulos y textos de cada escena coinciden con `campana.historia.escenas` (y los textos reutilizados de `porque`, `problema` y `encuesta.datos`)
- [ ] Puntos marcados = `Math.round(valor × 46 / 100)` para los cinco datos; total = `campana.encuesta.participantes`
- [ ] Cifras con un decimal, espacio fijo (U+00A0) y `%`
- [ ] Poses del cargador por escena según la tabla del spec
- [ ] Largo de cada pista: 120 % de pantalla, 180 % en A y E (`movimiento.ts`)
- [ ] Fijar o no: solo con movimiento no reducido, 600 px de alto o más, y si la escena cabe
- [ ] Guía: listas, pasos y rasgos del contenedor desde `campana.guia` y `campana.pasos`; íconos en el orden del spec (paso 3 con `recycle`, no basurero)
- [ ] Sobre la campaña, cierre y pie desde `campana.sobre`, `encuesta`, `objetivoGeneral`, `acciones`, `cierre` y `creditos`

## Acceptance-criteria coverage
- AC-1 recorrido · AC-2 escenas fijas · AC-3 cifras y puntos · AC-4 cargador · AC-5 escena oscura · AC-6 respaldos · AC-7 tamaños · AC-8 teclado y lector · AC-9 pista · AC-10 peso y CLS · AC-11 check y build

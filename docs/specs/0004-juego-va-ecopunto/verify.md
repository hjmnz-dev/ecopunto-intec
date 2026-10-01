# Verify: Juego "¿Va al Ecopunto?" · spec 0004 · updated 2026-10-01
_Steps derived from spec 0004 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
- [x] Entre la guía y "Sobre la campaña" está la sección `#juego` con su `h2` e introducción → AC-1
- [x] Juega una partida tocando en un celular de 390 px → 8 objetos de uno en uno, "n de 8", 4 que sí van y 4 que no; recargando cambia el orden → AC-2
- [x] Los botones "Va al Ecopunto" y "No va" miden 46 px de alto y responden al toque, al clic y a Enter → AC-3
- [x] Cada respuesta muestra al instante ícono, "¡Correcto!" o "No exactamente." y el porqué, en una región `aria-live`; los botones se bloquean y el foco pasa a "Siguiente" → AC-4
- [x] Tras el objeto 8 → "Acertaste N de 8", mensaje según el puntaje (7 de 8: "¡Muy bien!…") y "Jugar otra vez", que reinicia en "1 de 8" con otro orden; el foco va al resultado y luego al nombre del objeto → AC-5
- [x] Sin JS → el juego no se muestra y se lee el aviso que remite a la guía; con movimiento reducido no hay animación → AC-6
- [x] A 390 px no hay scroll horizontal; los botones ocultos (`hidden`) no aparecen antes de tiempo → AC-7

## Commands
- [x] `npm run check`, `npm run build` y `npm run format:check` → sin errores → AC-8
- [x] Primera carga publicada → 165 KB (unos 2 KB más que sin el juego), CLS 0 → AC-7

## Acceptance-criteria coverage
- AC-1 sección · AC-2 partida · AC-3 botones · AC-4 respuesta · AC-5 final y reinicio · AC-6 sin JS · AC-7 tamaño y peso · AC-8 comandos

# 0004. Juego "¿Va al Ecopunto?": clasificar objetos tocando

**Date**: 2026-10-01
**Status**: Accepted

## Summary

Después de la guía, la página propone un juego corto: aparece un objeto a la vez (cargador, botella, audífonos, restos de comida…) y el estudiante toca "Va al Ecopunto" o "No va". Enseguida ve si acertó y por qué, y al final su puntaje con la opción de jugar otra vez. Se juega tocando (no arrastrando), así funciona igual con el dedo, el mouse o el teclado. Sin JavaScript se muestra un aviso que remite a la guía. Estas decisiones las tomó Claude con las opciones recomendadas mientras el equipo no estaba; se pueden cambiar.

## Requirements

**User stories**:
- Como estudiante que acaba de leer la guía, quiero ponerme a prueba con objetos reales, para recordar qué va al Ecopunto.
- Como estudiante que usa lector de pantalla o teclado, quiero jugar igual que los demás.

**Acceptance criteria**:
- **AC-1**: Entre la guía y "Sobre la campaña" hay una sección `#juego` con un `h2` "¿Va al Ecopunto?" y una introducción; todo el texto sale de `campana.juego`.
- **AC-2**: El juego muestra 8 objetos (4 que sí van y 4 que no), uno a la vez, en orden al azar en cada partida, con el progreso "n de 8".
- **AC-3**: Cada objeto se responde con dos botones de al menos 44 px de alto ("Va al Ecopunto" y "No va"), que funcionan con toque, mouse y teclado; no hace falta arrastrar.
- **AC-4**: Al responder, se ve al instante si fue correcto o no, con ícono y texto (no solo color) y el porqué de ese objeto; un lector de pantalla lo anuncia (`aria-live="polite"`) y el foco pasa al botón "Siguiente". Los botones de respuesta se desactivan hasta pasar al siguiente objeto.
- **AC-5**: Después del objeto 8 se ve "Acertaste N de 8" con un mensaje según el puntaje y el botón "Jugar otra vez", que reinicia con un orden nuevo; el foco va al resultado.
- **AC-6**: Sin JavaScript, el juego no se muestra y en su lugar se lee un aviso que remite a la guía. Con movimiento reducido no hay animaciones en el juego.
- **AC-7**: Todo el texto cumple AA; no hay scroll horizontal a 390 px; el juego suma 10 KB o menos a la primera carga.
- **AC-8**: `npm run check`, `npm run build` y `npm run format:check` pasan.

## Decision

**Chosen option**: Option 1: Un objeto a la vez con dos botones, en un script propio sin dependencias

Componente `Juego.astro` (HTML del juego oculto hasta que llega el JS, más el aviso sin JS) y un módulo `src/scripts/juego.ts` que maneja el estado en memoria. Nada se guarda.

**Implementation skills**: `accessibility` (`addyosmani/web-quality-skills`, `.agents/skills/accessibility/`)

## Feature design

**Data model sketch** (`campana.juego` en `src/data/campana.ts`; texto nuevo escrito en este spec):

```ts
interface ObjetoJuego { nombre: string; icono: NombreIcono; va: boolean; porque: string }
juego: {
  titulo: '¿Va al Ecopunto?',
  intro: 'Toca si cada objeto va al Ecopunto o no. Son 8 objetos.',
  sinJs: 'El juego necesita JavaScript. La guía de arriba tiene toda la información sobre qué depositar.',
  botones: { si: 'Va al Ecopunto', no: 'No va', siguiente: 'Siguiente', otraVez: 'Jugar otra vez' },
  correcto: '¡Correcto!', incorrecto: 'No exactamente.',
  progreso: '{n} de {total}',            // se reemplazan {n} y {total}
  resultado: 'Acertaste {aciertos} de {total}',
  mensajes: [                              // el primero cuyo `desde` <= aciertos
    { desde: 8, texto: '¡Perfecto! Ya sabes usar el Ecopunto.' },
    { desde: 5, texto: '¡Muy bien! Repasa la guía para no fallar ninguno.' },
    { desde: 0, texto: 'Vale la pena repasar la guía de arriba antes de usar el Ecopunto.' },
  ],
  objetos: [
    { nombre: 'Cargador', icono: 'plug-zap', va: true, porque: 'Es un accesorio electrónico pequeño: va al Ecopunto.' },
    { nombre: 'Cable', icono: 'cable', va: true, porque: 'Los cables tienen cobre y plástico que se recuperan: van al Ecopunto.' },
    { nombre: 'Audífonos', icono: 'headphones', va: true, porque: 'Son un aparato electrónico: van al Ecopunto, nunca a la basura común.' },
    { nombre: 'Mouse', icono: 'mouse', va: true, porque: 'Es un accesorio electrónico: va al Ecopunto.' },
    { nombre: 'Restos de comida', icono: 'apple', va: false, porque: 'Es un desecho orgánico: no va al Ecopunto.' },
    { nombre: 'Botella', icono: 'milk', va: false, porque: 'Las botellas no son electrónicas: no van al Ecopunto.' },
    { nombre: 'Vaso', icono: 'cup-soda', va: false, porque: 'Un vaso no es un residuo electrónico: no va al Ecopunto.' },
    { nombre: 'Papel sanitario', icono: 'scroll-text', va: false, porque: 'Es basura común: no va al Ecopunto.' },
  ],
}
```

**Estado** (en memoria, en `juego.ts`): `orden: number[]` (índices barajados con Fisher–Yates y `Math.random` al empezar cada partida), `actual: number`, `aciertos: number`, `fase: 'pregunta' | 'respuesta' | 'final'`. Transiciones: pregunta → (toca un botón) respuesta → (Siguiente) pregunta del siguiente, o final tras el 8 → (Jugar otra vez) pregunta con orden nuevo.

**Interfaz** (`src/components/historia/Juego.astro`, dentro de `Seccion id="juego"`):
- `TituloSeccion` con `juego.titulo` y la intro en una `TarjetaCinta`.
- `<p class="juego-sin-js">` con `juego.sinJs`, visible por defecto.
- `<div class="juego" data-juego hidden>`: tarjeta grande con el ícono del objeto (`Icono`, 5 rem, `aria-hidden`), su nombre en un `h3`, el progreso, dos botones (`EtiquetaSiNo` no sirve aquí; botones propios con los colores de `--color-si` y `--color-no` y texto de 24 px en 900), una región `aria-live="polite"` para la respuesta (ícono `check` o `x` + "¡Correcto!" o "No exactamente." + `porque`) y el botón "Siguiente". En la fase final, el resultado en un `h3` con `tabindex="-1"`, el mensaje y "Jugar otra vez".
- Los datos de los objetos llegan al script en un `<script type="application/json" data-juego-datos>` con `campana.juego` (no se ejecuta; no rompe la regla de un solo `is:inline` del spec 0001). Los íconos de los 8 objetos se dibujan en el HTML (uno por objeto, `hidden` salvo el actual) para no repetir los SVG en el JSON.
- `juego.ts` quita `hidden` al juego y oculta el aviso sin JS al cargar.

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Sección | Título, intro, aviso sin JS | `campana.juego.titulo`, `.intro`, `.sinJs` |
| Pregunta | Nombre e ícono del objeto | `campana.juego.objetos[orden[actual]]` |
| Pregunta | Progreso | `juego.progreso` con `{n} = actual + 1`, `{total} = objetos.length` |
| Respuesta | Correcto o no | `respuesta === objeto.va` |
| Respuesta | Texto | `juego.correcto` / `juego.incorrecto` + `objeto.porque` |
| Final | Puntaje | `juego.resultado` con `{aciertos}` y `{total}` |
| Final | Mensaje | El primer `juego.mensajes[i]` con `desde <= aciertos` |
| Orden | Barajado | Fisher–Yates con `Math.random` en cada partida |
| Botones | Textos | `juego.botones` |

**Key invariants**:
- Nada se guarda (ni `localStorage` ni cookies).
- Siempre hay exactamente un objeto visible en fase pregunta o respuesta; los botones de respuesta solo funcionan en fase pregunta.
- La respuesta nunca se comunica solo con color: siempre ícono y texto.
- El juego no usa GSAP ni `data-animar`; con movimiento reducido no hay transiciones.

**Security model**: página pública, sin datos personales ni almacenamiento.

**Critical test scenarios**:
- Happy path: responder los 8 objetos con toques, ver cada porqué y el resultado; "Jugar otra vez" reinicia con otro orden, verifies **AC-2**, **AC-3**, **AC-4**, **AC-5**
- Teclado: Tab hasta "Va al Ecopunto", Enter, el foco queda en "Siguiente"; al final el foco queda en el resultado, verifies **AC-3**, **AC-4**, **AC-5**
- Sin JS: se ve el aviso y no el juego, verifies **AC-6**

## Build plan

Skateboard: el juego completo y simple en una sola pasada; las animaciones quedan fuera.

1. Sumar `juego` (y el tipo `ObjetoJuego`) a `campana.ts`, satisfies **AC-1**, **AC-2**
2. Crear `Juego.astro` con aviso sin JS, HTML del juego oculto y datos en JSON, y ubicarlo entre la guía y "Sobre la campaña", satisfies **AC-1**, **AC-3**, **AC-6**, **AC-7**
3. Crear `src/scripts/juego.ts` con el estado, el barajado, las respuestas, el foco y el reinicio, satisfies **AC-2**, **AC-3**, **AC-4**, **AC-5**, **AC-6**
4. Probar toque, teclado, sin JS, 390 px y peso; formatear; publicar, satisfies **AC-7**, **AC-8**

## Consequences

**Positive**:
- Refuerza la guía con práctica, sin dependencias nuevas.
- Accesible por diseño: botones reales, sin arrastre, respuestas anunciadas.

**Negative / tradeoffs**:
- Tocar es menos "juego" que arrastrar al contenedor; el arrastre podría sumarse después como alternativa.
- Sin JavaScript no hay juego (solo el aviso).
- Los textos del porqué son nuevos y no salen del Canva; el equipo debería revisarlos.

**Neutral**:
- El mini quiz (#12) puede reutilizar los mismos estilos de botones y respuesta.

## Follow-up

- [ ] Que el equipo revise los textos del porqué de cada objeto y los mensajes del resultado.

## Rationale

Razonamiento y opciones: ver [rationale.md](rationale.md).

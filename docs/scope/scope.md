# Scope: Ecopunto INTEC

Página web animada de una sola página, parte de la campaña de sensibilización sobre el manejo adecuado de los residuos electrónicos en INTEC. Está dirigida a estudiantes que llegan desde un código QR en el campus (casi siempre desde el celular) y les explica el problema, los datos de la encuesta, qué depositar en el Ecopunto y cómo usarlo.

**Build approach:** Skateboard (primero la página completa, simple y publicada; luego se suma un interactivo a la vez, dejando siempre algo presentable). (basis: la fecha límite es esta noche, así que cada paso tiene que dejar una página usable)
**Workflow:** Alpha (después de `/develop`, un `/check verify` sobre la página real). El nivel de rigor por defecto del proyecto. `/architect` es la primera parada recomendada para una parte con una decisión real, pero puedes saltarla si ya sabes cómo construirla. Cualquier parte puede llevar su propia etiqueta (por ejemplo `· Prototype`) para hacer más o menos.

**Contexto de la campaña:** presentación de Canva "Ecopunto intec" (16 diapositivas). Encuesta en línea a 46 estudiantes: 76.1 % guarda los aparatos que ya no usa y 39.1 % los ha tirado a la basura común; 80.4 % no sabe dónde llevarlos; 78.3 % usaría contenedores dentro de INTEC; 91.3 % calificó entre 4 y 5 la utilidad de un instructivo. Lema: "Pequeños aparatos, grandes cambios". Cierre: "Tu residuo electrónico tiene un lugar. La basura común no es uno de ellos". No habrá ubicaciones fijas de ecopuntos.

_Estas son recomendaciones para mantener el trabajo ordenado, no requisitos. Salta lo que no encaje: si ya sabes cómo construir una parte, usa `/develop` y salta `/architect`. Tú decides cuándo una parte está `done`._

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Stack y publicación | Foundation | done |
| 2 | Estándares y herramientas | Foundation | planned |
| 3 | Sistema visual y animación | Foundation | in-progress |
| 4 | Contenido e imágenes de la campaña | Foundation | planned |
| 5 | Portada y el problema | Release 1 | planned |
| 6 | Guía del Ecopunto | Release 1 | planned |
| 7 | Datos de la encuesta | Release 1 | planned |
| 8 | Cierre y pie de página | Release 1 | planned |
| 9 | Publicación en línea y código QR | Release 1 | planned |
| 10 | Contadores y gráficos animados | Release 2 | planned |
| 11 | Juego "¿Va al Ecopunto?" | Release 3 | planned |
| 12 | Mini quiz final | Release 4 | planned |
| 13 | Contador de visitas | Release 5 | planned |

## Foundations

### 1. Stack y publicación
Decidir con qué se construye la página, cómo se hacen las animaciones al hacer scroll y dónde se publica con un enlace público gratuito, y dejar un proyecto que arranque. Se decide todo junto porque esta noche no hay tiempo para varias rondas. (basis: foundations before features; la herramienta de publicación condiciona el enlace del QR)
**Done when:** la decisión queda escrita en un spec y la página vacía abre en el navegador local con una animación de prueba al hacer scroll.
spec [0001](../specs/0001-stack-publicacion/index.md) · code in `src/`
- [x] Decide the stack (spec): `/architect stack y publicación`
- [x] Scaffold from the decision: `/develop stack y publicación`
- [x] Verify it: `/check verify stack y publicación`

### 2. Estándares y herramientas
Anotar las convenciones del proyecto a partir del proyecto real, en versión ligera (formato y orden de archivos), para que cada sesión siguiente trabaje igual.
**Done when:** existe un `AGENTS.md` raíz con el stack real y las convenciones, y el formateo corre sin errores.
- [ ] Capture conventions + tooling choices: `/audit`

### 3. Sistema visual y animación
Traducir el estilo de Canva a la web: fondo de cartón reciclado, cinta verde, letra tipo marcador, verde Ecopunto, tarjetas tipo papel. Incluye las reglas de movimiento (cómo entran las secciones, duración, qué pasa si el usuario pidió menos movimiento en su celular). (basis: every page depends on the design system; accesibilidad de animaciones)
**Done when:** `design.md` define colores, tipografías, texturas y reglas de animación; hay componentes base (tarjeta con cinta, título de sección, bloque de dato) que se ven bien en celular, y con movimiento reducido activado el contenido aparece sin animación.
spec [0002](../specs/0002-sistema-visual-animacion/index.md) · code in `src/components/ui/`, `src/styles/`, `src/scripts/`
- [x] Design it (spec): `/architect sistema visual y animación`
- [x] Build it: `/develop sistema visual y animación`
  - [x] Tokens, fuentes y fondo de cartón (AC-2, AC-3, AC-4, AC-6)
  - [x] Íconos, siete componentes base y página de muestra (AC-5, AC-6, AC-11)
  - [x] Movimiento: entradas, tarjeta con cinta, título y parallax (AC-7, AC-8, AC-9, AC-10, AC-13)
  - [x] `design.md` y control de peso y contraste (AC-1, AC-6, AC-12)
- [ ] Verify it: `/check verify sistema visual y animación`

### 4. Contenido e imágenes de la campaña
Exportar de Canva las imágenes (logo Ecopunto INTEC, contenedor, objetos como cargador, cable, audífonos, botella) y pasar los textos de las diapositivas a un solo lugar en el proyecto, para que las secciones solo tengan que leerlos.
**Done when:** las imágenes están en el proyecto optimizadas para web (livianas, con texto alternativo) y los textos, porcentajes, listas de sí y no, y los 4 pasos están en un archivo de contenido.
- [ ] Build it: `/develop contenido e imágenes de la campaña`

## Release 1: La página completa y publicada

La versión mínima que ya cumple la campaña: un estudiante escanea el QR, entiende el problema, ve los datos y sabe qué depositar y cómo. Animaciones sencillas de entrada en cada sección. Si la noche termina aquí, ya tienes una página presentable.

### 5. Portada y el problema
Portada con el logo, el lema y una entrada animada, seguida de "¿Por qué este proyecto?", "¿Cuál es el problema?" y el objetivo de la campaña.
**Done when:** al abrir la página se ve la portada animada con el lema; al bajar aparecen el porqué, el problema y el objetivo con animaciones de entrada; se lee bien en un celular.
- [ ] Build it: `/develop portada y el problema`

### 6. Guía del Ecopunto
El corazón de la página: qué sí depositar y qué no (dos columnas con los objetos), los 4 pasos para usar el Ecopunto y la sección "¿Dónde lo llevo?" que enseña a reconocer el contenedor, sin mapa. (basis: 91.3 % valora un instructivo y 80.4 % no sabe dónde llevarlo)
**Done when:** se ven las listas de sí y no con sus imágenes, los 4 pasos aparecen uno tras otro al hacer scroll, y la imagen del contenedor explica cómo reconocerlo en el campus.
- [ ] Build it: `/develop guía del ecopunto`

### 7. Datos de la encuesta
Los cuatro hallazgos de la encuesta de 46 estudiantes como tarjetas grandes y claras, con una entrada animada sencilla. Los contadores y gráficos animados vienen en la Release 2.
**Done when:** las cuatro cifras (76.1 %, 80.4 %, 78.3 %, 91.3 %) se ven con su frase, más la nota de cómo se obtuvo la información.
- [ ] Build it: `/develop datos de la encuesta`

### 8. Cierre y pie de página
Mensaje final "Tu residuo electrónico tiene un lugar. La basura común no es uno de ellos", con el contenedor, y un pie con el nombre del proyecto, INTEC y los integrantes.
**Done when:** la página termina con el mensaje de cierre animado y un pie con los créditos.
- [ ] Build it: `/develop cierre y pie de página`

### 9. Publicación en línea y código QR
Subir la página a un enlace público, con título y vista previa al compartirla en redes o WhatsApp, y generar el código QR para los materiales del campus.
**Done when:** la página abre desde el enlace público en un celular, el enlace compartido muestra título, descripción e imagen, y el QR impreso lleva a la página.
- [ ] Build it: `/develop publicación en línea y código QR`

## Release 2: Datos que se mueven

### 10. Contadores y gráficos animados
Los porcentajes de la encuesta suben de 0 a su valor y los gráficos se dibujan solos cuando la sección entra en pantalla. Mejora la sección 7, no la reemplaza.
**Done when:** cada cifra cuenta hasta su valor una sola vez al entrar en pantalla, los gráficos se dibujan con el mismo dato, y con movimiento reducido se muestran directamente en su valor final.
- [ ] Build it: `/develop contadores y gráficos animados`

## Release 3: Aprender jugando

### 11. Juego "¿Va al Ecopunto?" · needs a decision
El estudiante arrastra o toca objetos (cable, botella, audífonos, restos de comida) y descubre si van al Ecopunto o no, con respuesta inmediata. Hay que decidir cómo se juega en celular (arrastrar o tocar), cuántos objetos y cómo se da la respuesta. (basis: behavior that is not trivial; los juegos de arrastrar necesitan una alternativa de toque)
**Done when:** en celular y computadora se puede clasificar cada objeto tocando o arrastrando, cada respuesta muestra si es correcta y por qué, y al final se ve el puntaje con opción de jugar otra vez.
- [ ] Design it (spec): `/architect juego ¿va al ecopunto?`

## Release 4: Comprobar lo aprendido

### 12. Mini quiz final
De 3 a 5 preguntas rápidas sacadas de la guía y los datos, con resultado al final y un mensaje que invita a usar el Ecopunto. Reutiliza el estilo de respuesta del juego.
**Done when:** el estudiante responde de 3 a 5 preguntas, ve si acertó en cada una y recibe un resultado final con un mensaje de cierre.
- [ ] Build it: `/develop mini quiz final`

## Release 5: Medir el impacto

### 13. Contador de visitas · needs a decision
Contar cuántas personas entran a la página y cuántas llegan desde el QR, para el informe del proyecto, sin recoger datos personales. Hay que decidir el servicio y cómo se distingue la llegada por QR. (basis: una elección de proveedor siempre necesita spec)
**Done when:** puedes ver el total de visitas y cuántas vinieron desde el QR, y la página no pide cookies ni guarda datos personales.
- [ ] Design it (spec): `/architect contador de visitas`

## Deferred
Fuera de esta noche, guardado para que el plan sea honesto.
- **Mapa de ecopuntos**: ubicaciones en el campus, solo si algún día hay ubicaciones fijas · needs a decision

## Legend

**The decision box.** Every feature carries exactly one, the sub-task whose label ends with `(spec)`. Its wording varies (`Design it (spec)` normally, `Decide the stack (spec)` on Stack y publicación), so skills locate it by that `(spec)` suffix, never by an exact label. Every other box is an execution box and `/architect` never ticks one.

**Feature lifecycle**: the scope updates as a feature moves; each row is what it shows and who sets it:

| State | Set by | The feature shows |
|---|---|---|
| `planned` · needs a decision | `/scope` | one box: `Design it (spec): /architect <feature>` |
| `in-progress` (designed) | **`/architect` at spec capture** | `Design it` ticked; spec linked; `Build it: /develop <feature>` + **2 to 5 milestones**; the tier's closing boxes (`Verify it` Alpha+, `Test it` Beta+, `Review it` + `Document it` GA); any surfaced follow-up enrolled |
| `in-progress` (building) | `/develop` | milestone sub-boxes tick one by one; code pointer filled |
| `in-progress` (verified) | `/check verify` | `Build it` + milestones ticked; `Verify it` ticked |
| `done` | **you, when you decide it is** (any skill sets it when you say so); `/sync` reconciles | boxes you ran ticked, skipped ones marked skipped; the tier's last stage (`Prototype` → after `/develop`; `Alpha` → after `/check verify`; `Beta`/`GA` → after `/test`) is the suggested point to call it done; `/sync` captures conventions |

- **Next step** = the first unticked box (always a command or a tracked milestone).
- **needs a decision** = run `/architect` first; otherwise straight to `/develop` (or `/audit` for standards & tooling). The tag drops once the spec is captured.
- **Atomic build tasks live in the spec's `## Build plan`, not here**: the scope carries only the milestone rollup.
- **Status** `planned` → `in-progress` → `done`, plus `existing` (pre-workflow) and `dropped` (de-scoped, kept for history).
- **Approach tag** beside a heading (e.g. `· Facade`) overrides the project default for that feature; no tag = inherits it.
- **Workflow tier tag** beside a heading (e.g. `· GA`, `· Prototype`) sets that one feature's rigor above or below the project default; no tag inherits the default. It decides the feature's check boxes and each skill's next suggestion.
- **Workflow** (header line) is the project default, what runs after `/develop`: **Prototype** = nothing (trust develop's own build time self check); **Alpha** = `/check verify`; **Beta** = `/check verify` then `/test`; **GA** = adds a fresh model `/check review` then `/document`. A feature built on an unratified decision (an `Assumed` spec) stays flagged, but that never blocks `done`.
- **Pointer line** (`spec <n> · code in <path>`): the spec link added by `/architect`, the code path by `/develop`.

## References

**Project sources**
- Presentación de Canva "Ecopunto intec" (16 diapositivas): objetivos, problema, resultados de la encuesta, qué sí y qué no depositar, 4 pasos de uso, estilo visual.
- Encuesta en línea a 46 estudiantes de INTEC (resultados incluidos en la presentación).

**Practices & standards**
- Skateboard MVP: entregar algo usable completo y hacerlo crecer por versiones.
- Foundations before features: stack, estilo y contenido antes de las secciones.
- Accesibilidad de animaciones: respetar la preferencia de movimiento reducido del sistema.
- Alternativa al arrastre: toda interacción de arrastrar tiene una opción de un solo toque.
- Privacidad en la medición: contar visitas sin datos personales ni cookies.

**Links**
- [Making sense of MVP (Henrik Kniberg)](https://blog.crisp.se/2016/01/25/henrikkniberg/making-sense-of-mvp): el enfoque Skateboard.
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion): detectar la preferencia de movimiento reducido.
- [WCAG 2.2, 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html): animaciones al hacer scroll.
- [WCAG, 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html): animaciones que se repiten.
- [WCAG 2.2, 2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html): alternativa de toque para el juego.
- [The Open Graph protocol](https://ogp.me/): vista previa al compartir el enlace.
- [web.dev: Web Vitals](https://web.dev/articles/vitals): que la página cargue rápido en celular.
- [The Global E-waste Monitor 2024 (ITU)](https://www.itu.int/en/ITU-D/Environment/Pages/Publications/The-Global-E-waste-Monitor-2024.aspx): datos globales, por si quieres sumar contexto a la sección del problema.

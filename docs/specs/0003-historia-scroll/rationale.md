# 0003. La página como historia al hacer scroll: razonamiento

## Context

> ⚠️ Premise note: la fecha límite es esta noche y una historia con escenas fijas es lo más trabajoso que se puede elegir. Por eso el plan arma primero la historia completa y quieta (ya presentable), y fija y anima las escenas una por una; si la noche se acaba, lo que esté sin animar se sigue leyendo bien.

La primera versión de la página seguía el orden de las diapositivas: portada, problema, guía, datos, cierre. El equipo quiere algo que llame mucho la atención y explique bien el tema a estudiantes que llegan desde un QR, casi siempre en celular y con poco tiempo. Una lista de secciones con datos sueltos no engancha; los datos de la encuesta (76.1 %, 39.1 %, 80.4 %, 78.3 %, 91.3 %) cuentan una historia por sí mismos si se ordenan como el recorrido de un aparato.

Además, el Canva no se puede exportar (el diseño pertenece a otra cuenta con descargas desactivadas), así que las fotos de objetos y la portada fotográfica no están disponibles. Cualquier diseño que dependa de ellas queda bloqueado.

El sistema visual y el contrato de movimiento (specs 0001 y 0002) ya están construidos y verificados: GSAP con ScrollTrigger, respaldo sin JS y con movimiento reducido, tokens y componentes de collage. Lo que falta decidir es cómo se cuenta la historia, qué se ve en cada momento y con qué dibujos.

## Options considered

### Option 1: Escenas fijas con position: sticky y ScrollTrigger con scrub, sobre el collage, con dibujos SVG propios

Cinco escenas con un escenario `sticky` y líneas de tiempo con scrub (ScrollTrigger solo lee el avance, sin `pin`), sobre los tokens y componentes existentes, con dibujos SVG hechos para el proyecto. Elegido `sticky` en vez del `pin` de GSAP tras la revisión cruzada: sin espaciadores, menos temblor en celular y respaldo trivial.

**Pros**:
- El efecto más llamativo con la herramienta que ya está instalada y probada.
- SVG en línea: pesa casi nada, se anima por partes y no depende del Canva.
- Mantiene la identidad de la campaña del campus.

**Cons**:
- Mucho trabajo de animación y de pruebas en dos tamaños.
- Fijar en celular exige cuidar alturas (`svh`) y rendimiento.

### Option 2: Historia sin fijar, escenas que entran al bajar

La misma historia, pero cada escena es una sección normal con entradas al hacer scroll.

**Pros**:
- La mitad del trabajo y casi sin riesgo en celulares viejos.

**Cons**:
- Mucho menos impacto: se parece a la versión anterior con otro texto.

### Option 3: Video o animación Lottie por escena

Animaciones hechas en una herramienta externa y reproducidas en cada escena.

**Pros**:
- Animaciones más ricas.

**Cons**:
- Herramienta y formato nuevos, archivos más pesados, y nadie del equipo las produce esta noche.

## Rationale

La opción 1 es la única que da el impacto pedido sin sumar herramientas: ScrollTrigger ya está en el proyecto y su fijado con scrub es justo el patrón de "historia al hacer scroll". El riesgo de la noche se controla con el orden del plan (primero todo quieto y publicado) y con la regla de que el HTML es el estado final, que además resuelve accesibilidad y el respaldo sin JS sin código extra.

La historia de un cargador convierte cada cifra en un momento con sentido (guardarlo, tirarlo, no saber dónde llevarlo, querer usar el Ecopunto) y termina naturalmente en la guía. La grilla de 46 puntos hace visible que cada cifra son personas reales de la encuesta. Las ilustraciones SVG reemplazan las fotos que el Canva no deja exportar y se pueden animar pieza por pieza.

Fijar también en celular fue elección del equipo porque casi todos entran desde el QR; se cuida con escenas cortas, `100svh`, `ignoreMobileResize` y animaciones solo de transformaciones.

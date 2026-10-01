# 0004. Juego "¿Va al Ecopunto?": razonamiento

## Context

El scope pide un juego en el que el estudiante clasifique objetos y descubra si van al Ecopunto, con respuesta inmediata y puntaje, que funcione en celular y en computadora. Quedaba por decidir cómo se juega en celular (arrastrar o tocar), cuántos objetos y cómo se da la respuesta. Casi todos llegan desde el QR, en celular, y la página ya es larga (historia y guía), así que el juego tiene que ser corto y claro. Además, las interacciones de arrastrar necesitan una alternativa de un solo toque (WCAG 2.5.7).

Estas decisiones las tomó Claude con las opciones recomendadas mientras el equipo no estaba, por pedido explícito de trabajar sin parar; quedan abiertas a cambio.

## Options considered

### Option 1: Un objeto a la vez con dos botones

**Pros**:
- Funciona igual con dedo, mouse, teclado y lector de pantalla, sin código extra.
- Muy poco JavaScript, sin dependencias.

**Cons**:
- Se siente menos como un juego que arrastrar al contenedor.

### Option 2: Arrastrar cada objeto al contenedor o al basurero, con botones como alternativa

**Pros**:
- Más lúdico y visual.

**Cons**:
- Arrastrar en celular choca con el scroll de la página y con las escenas fijas.
- Hay que construir y probar dos formas de jugar.

### Option 3: Todos los objetos a la vista para clasificar en dos columnas

**Pros**:
- Se ve todo de un vistazo.

**Cons**:
- En 390 px se vuelve una lista larga y la respuesta por objeto se pierde.

## Rationale

La opción 1 cumple el "Done when" (tocar o arrastrar) con la forma más accesible y más rápida de construir esta noche, y no compite con el scroll de la historia. Ocho objetos (cuatro y cuatro, de las listas de la guía) alcanzan para practicar sin cansar. Mostrar el porqué en cada respuesta convierte el error en aprendizaje, que es el objetivo de la campaña. El arrastre puede sumarse después como alternativa si el equipo lo quiere.

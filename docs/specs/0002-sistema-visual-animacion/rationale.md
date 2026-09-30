# 0002. Sistema visual y animación: razonamiento

## Context

> ⚠️ Premise note: la fecha límite es esta noche y el movimiento elegido suma tres efectos (tarjeta que se pega, título que se escribe y parallax) encima de la entrada básica. Cada efecto es otro caso que puede romper el contrato de "todo visible sin animación". Por eso el plan construye primero la muestra quieta, suma el movimiento después y deja el parallax al final, como la pieza que se puede quitar sin tocar nada más.

La campaña ya tiene una identidad fuerte en Canva: fondo de cartón, tarjetas de papel crema sujetas con cinta verde, títulos en mayúsculas con letra de marcador y recortes de libro viejo. La portada rompe ese estilo a propósito: es una foto clara del campus con el logo verde. Los estudiantes van a ver esos materiales impresos en el campus y luego escanear el QR, así que la página tiene que sentirse como la misma campaña.

La página se ve casi siempre en celular, muchas veces con datos móviles. Un collage hecho con fotos pesa mucho, y un estilo "a mano" puede costar legibilidad si el texto largo usa letra manuscrita o se apoya directo sobre un fondo marrón. El contraste del texto verde oscuro sobre el cartón (unos 3.6:1) no alcanza para párrafos.

El spec 0001 ya fijó el mecanismo de animación (GSAP con ScrollTrigger, una sola entrada por elemento, nada escondido sin JS o con movimiento reducido) y dejó para esta parte los valores, las fuentes concretas y los efectos. Sin esta decisión, cada sección de la Release 1 inventaría su propio estilo y su propio movimiento esta misma noche.

Las fuentes de Canva llegan como códigos internos sin nombre, así que la equivalencia se decidió comparando candidatas de Fontsource sobre el cartón y el papel con los colores medidos en las miniaturas de la presentación.

## Options considered

### Option 1: Collage con CSS y una sola textura generada

Tokens medidos en el Canva, Londrina Solid y Nunito de Fontsource, papel, cuaderno y cinta hechos con CSS, y un mosaico de cartón generado por script en AVIF. Los efectos se suman al módulo de animación existente.

**Pros**:
- Se ve como el Canva y pesa unos 100 KB en total.
- Sin licencias que revisar: fuentes libres, íconos ISC, textura propia.
- Los componentes escalan nítidos en cualquier pantalla.

**Cons**:
- El cartón y la cinta se ven un poco más "limpios" que las fotos de Canva.
- Hay que escribir a mano el CSS de la cinta dentada y del cuaderno.

### Option 2: Exportar los elementos de Canva como imágenes

Exportar el cartón, el papel, la cinta y los recortes de periódico de Canva y usarlos como imágenes de fondo.

**Pros**:
- Fidelidad máxima a la presentación.
- Menos CSS artesanal.

**Cons**:
- Varias imágenes grandes: pesa mucho más en datos móviles.
- Los elementos de Canva tienen licencia propia; usarlos sueltos en la web exige revisarla.
- Las imágenes se ven borrosas o pixeladas al estirarse en pantallas grandes.

### Option 3: Todo con CSS y SVG, sin imágenes

Igual que la opción 1, pero el cartón también es un gradiente o un filtro SVG en línea.

**Pros**:
- Lo más liviano posible.
- Ningún archivo de imagen que generar ni versionar.

**Cons**:
- Un filtro SVG a pantalla completa cuesta en celulares de gama baja.
- El cartón se ve más plano, como ruido de color, y pierde la sensación de material.

### Option 4: Un framework de utilidades con plugin de texturas

Usar un framework de clases de utilidad y componentes de terceros con estilos "papel".

**Pros**:
- Más rápido para maquetar grillas y espacios.

**Cons**:
- Suma una dependencia y configuración al stack del spec 0001, que decidió CSS propio.
- Los estilos de terceros empujan hacia un look genérico, lejos del collage.

## Rationale

La fuerza principal es el celular con datos móviles: la identidad tiene que llegar completa sin fotos de fondo pesadas. La opción 1 concentra el peso en dos fuentes y un mosaico pequeño, y todo lo demás es CSS que no pesa y escala nítido. La opción 2 gana en fidelidad, pero paga en peso y en una licencia que nadie tiene tiempo de revisar esta noche. La opción 3 ahorra unos 30 KB a cambio de un filtro costoso de pintar y un cartón menos creíble. La opción 4 contradice el spec 0001, que eligió CSS propio justo porque el estilo es artesanal.

En letra, Londrina Solid 900 es la candidata que más se parece a los títulos del Canva, y Nunito (parecida al texto de la diapositiva 6) se lee mejor en párrafos que una letra manuscrita. Por el contraste, el texto va en el verde tinta del logo y nunca directo sobre el cartón: la tira de cuaderno de los títulos resuelve lo mismo que en la diapositiva 6, un título que se lee sobre cualquier fondo.

En movimiento, el ritmo medio se nota sin hacerse esperar. Los tres efectos imitan gestos del collage (pegar, escribir, profundidad), y cada uno vive dentro de `gsap.matchMedia` para no romper el contrato del spec 0001. El parallax queda limitado a pantallas anchas con mouse: en celular casi no se percibe, gasta batería y puede dar tirones, y quien pidió menos movimiento nunca lo ve.

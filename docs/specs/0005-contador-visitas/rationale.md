# 0005. Contador de visitas: razonamiento

## Context

El informe del proyecto necesita dos números: cuántas visitas tuvo la página de la campaña y cuántas llegaron desde el código QR pegado en el campus. La página es un sitio estático en Cloudflare Pages, sin backend ni base de datos, y casi todos entran desde un celular. (basis: `docs/scope/scope.md`, parte #13; spec 0001)

Hay un límite claro de privacidad: la página no puede pedir cookies ni guardar datos personales. Son estudiantes que escanean un QR para leer una guía; un aviso de cookies sería fricción y no tendría sentido para una campaña de sensibilización. (basis: scope, "Done when" de la parte #13; práctica de medición sin datos personales)

El QR ya existe y apunta a `SITIO_URL/?src=qr`, una marca que el spec 0001 dejó lista para esta parte. El QR todavía no se imprimió, así que su URL se puede cambiar sin costo. El equipo es pequeño y trabaja con plazos cortos, así que cualquier pieza nueva que haya que operar (cuentas, claves, código de servidor) pesa mucho más que en un proyecto grande. (basis: spec 0001, `scripts/qr.mjs`; respuesta del equipo)

Si no se decide, el informe se queda sin datos de alcance, y si el QR se imprime antes de decidir, su URL queda fija para siempre.

## Options considered

### Option 1: Cloudflare Web Analytics con la ruta `/qr` servida por reescritura

Se activa Web Analytics desde el panel de Pages, que inyecta su script al publicar. El QR apunta a `/qr`, y una línea en `public/_redirects` sirve el contenido de `/` en esa ruta con estado 200, sin redirigir. El panel cuenta `/qr` como una ruta aparte. (basis: spec 0001, que ya anotaba Web Analytics para #13; skill `cloudflare`, referencias `web-analytics/` y `pages/`)

**Pros**:
- Mismo proveedor que ya publica la página: sin cuentas nuevas, sin claves en el repo, sin código de medición.
- Sin cookies ni almacenamiento en el navegador; no hace falta aviso.
- Gratis y sin límite de visitas.
- URL del QR más corta, código impreso más simple.

**Cons**:
- No lee la parte `?src=qr` de la dirección, por eso obliga a cambiar el QR a `/qr`.
- Solo panel, sin API ni exportación; datos por 6 meses.
- Sin "personas únicas" ni eventos propios (no puede contar, por ejemplo, partidas del juego).

### Option 2: Un servicio externo sin cookies que lea `?src=qr`

GoatCounter o Umami Cloud, con su script en `Base.astro`. Ambos cuentan visitas sin cookies y pueden separar la llegada por un parámetro de la dirección, así que el QR actual se podría quedar como está. (basis: práctica de medición sin datos personales)

**Pros**:
- No obliga a cambiar el QR.
- Más detalle que Web Analytics (parámetros de campaña, en algunos casos eventos propios y exportación).

**Cons**:
- Una cuenta nueva con otro proveedor y un script de otro dominio en el HTML.
- El script vive en el repo y hay que mantenerlo; los planes gratis tienen límites que cambian.
- Más piezas para una pregunta que tiene dos números como respuesta.

### Option 3: Contador propio con una Pages Function

Un `functions/_middleware.ts` que, en cada petición con `src=qr` (y en cada petición a `/`), suma uno en Workers Analytics Engine o KV, consultable por API. (basis: skill `cloudflare`, referencias `pages-functions/` y `analytics-engine/`)

**Pros**:
- Cuenta del lado del servidor: funciona aunque el visitante bloquee scripts.
- Datos propios, consultables por API, sin depender de un panel.

**Cons**:
- Convierte un sitio solo estático en uno con código de servidor, con su despliegue, sus límites y sus fallas.
- Cuenta peticiones, no visitas: bots, vistas previas de WhatsApp y recargas inflan el número si no se filtran a mano.
- Mucho más trabajo y más superficie que mantener para el mismo resultado.

## Rationale

El problema son dos números para un informe, con la condición de no usar cookies ni datos personales, en un sitio estático que un equipo pequeño mantiene con prisa. La opción 1 da exactamente eso sin agregar ninguna pieza nueva: el proveedor ya está, el script lo pone Cloudflare y la página no cambia. El único obstáculo real es que Web Analytics no guarda la parte `?src=qr` de la dirección (lo dice su documentación), y como el QR todavía no está impreso, cambiarlo a `/qr` cuesta casi nada y hasta mejora el código impreso. (basis: FAQ de Cloudflare Web Analytics; spec 0001)

La opción 2 evitaría cambiar el QR, pero ese cambio es gratis hoy, y a cambio sumaría una cuenta, un proveedor y un script que nadie más del equipo conoce. La opción 3 es la más exacta, pero rompe la decisión de que la página sea solo estática (spec 0001) y cuenta peticiones crudas que hay que limpiar; es la herramienta para cuando se necesiten datos por API, no para este informe.

Decisiones menores tomadas al escribir el spec:
- **Reescritura en `_redirects` en vez de una página `src/pages/qr.astro`**: una línea, sin duplicar el HTML ni mover el contenido de `index.astro` a un componente compartido. Runner up: la página Astro duplicada, que sí se vería en `npm run dev` pero obliga a refactorizar. Cloudflare Pages aplica las reglas de `_redirects` aunque exista un archivo con ese nombre, y la reescritura 200 conserva la URL. (basis: documentación de redirects de Cloudflare Pages)
- **Ruta `/qr`**: corta, clara en el panel y achica el QR. Runner up: `/campus`, más descriptiva pero sin ventaja.
- **Inyección automática desde Pages en vez del fragmento manual en `Base.astro`**: no deja token ni script en el repo y no mide en local. Runner up: el fragmento manual, útil solo si un día se quisiera medir fuera de Cloudflare. (basis: guía de Web Analytics para Pages)
- **Ambas reglas, `/qr` y `/qr/`**: por si algún lector de QR o navegador agrega la barra final.
- **Línea de privacidad en `creditos`**: el pie ya lee de ahí y la línea es parte de los créditos de la página. (basis: `AGENTS.md`, todo el texto sale de `src/data/campana.ts`)

## References

**Project sources**:
- `docs/scope/scope.md`, parte #13 (intención y "Done when").
- Spec 0001 (stack, publicación en Cloudflare Pages, marca `?src=qr`, Web Analytics anotado para #13, regla de `SITIO_CONFIRMADO`).
- `AGENTS.md` (texto en `campana.ts`, dominio solo en `sitio.mjs`).
- Skill `cloudflare` (`.agents/skills/cloudflare/references/web-analytics/` y `pages/`): sin cookies, sin IP guardada, 6 meses de datos, solo panel.

**Practices & standards**:
- Medición sin datos personales ni cookies.
- Tecnología aburrida y reutilizar lo que ya está en el stack.

**Links** (verificados durante el diseño):
- [Cloudflare Web Analytics FAQ](https://developers.cloudflare.com/web-analytics/faq/): no guarda la parte de la dirección después de `?`.
- [Cloudflare Pages: Redirects](https://developers.cloudflare.com/pages/configuration/redirects/): reescrituras con estado 200 a rutas propias.
- [Cloudflare Pages: Enable Web Analytics](https://developers.cloudflare.com/pages/how-to/web-analytics/): activarlo en Metrics; el script se agrega en el siguiente despliegue.

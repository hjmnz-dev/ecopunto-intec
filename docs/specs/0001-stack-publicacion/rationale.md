# 0001. Stack y publicación: razonamiento

Registro de la decisión (el porqué). `/develop` no necesita leer este archivo; el spec para construir está en [index.md](index.md).

## Context

La campaña Ecopunto INTEC necesita una página web animada de una sola página. La mayoría de las visitas llegará desde un código QR pegado en el campus, así que casi siempre se abrirá en un celular, a veces con datos móviles lentos. También entrarán desde computadora cuando se comparta el enlace. La página es estática: textos, datos de una encuesta, imágenes exportadas de Canva y animaciones al hacer scroll. No hay usuarios, ni cuentas, ni base de datos. (basis: docs/scope/scope.md, intro y parte #1)

Las fuerzas que deciden el stack son cuatro:

- **Tiempo.** La fecha límite es esta noche. El enfoque es Skateboard (primero una página completa y simple, luego un interactivo a la vez), así que cada paso tiene que dejar algo publicable. (basis: build approach del scope)
- **Movimiento con accesibilidad.** Las secciones entran animadas al hacer scroll, más adelante habrá contadores (#10) y un juego de arrastrar o tocar (#11). Todo tiene que respetar la preferencia de movimiento reducido del sistema y verse igual en Chrome, Safari de iPhone y Firefox. (basis: WCAG 2.3.3 Animation from Interactions; prefers-reduced-motion)
- **Un enlace que no puede cambiar.** El QR se imprime. Si el dominio o la ruta cambian después, los carteles quedan rotos. El enlace tiene que ser gratis, estable, corto y con HTTPS. (basis: la herramienta de publicación condiciona el enlace del QR, parte #1)
- **Equipo.** Construye una persona con experiencia como dev, apoyada por Claude Code, con Node 24, npm, git y `gh` ya instalados y cuenta de GitHub. Después de la campaña la página casi no se mantiene.

Además, la carpeta del proyecto está dentro de OneDrive. Una instalación de dependencias crea miles de archivos que OneDrive intenta sincronizar, lo que vuelve lento el servidor local y puede bloquear archivos durante el build.

## Options considered

Se compararon stacks completos, no piezas sueltas.

### Option 1: Astro + GSAP + Cloudflare Pages

Astro genera HTML estático con cero JavaScript por defecto; GSAP con ScrollTrigger hace las animaciones; Cloudflare Pages publica desde GitHub en `ecopunto-intec.pages.dev`. (basis: Astro está hecho para sitios de contenido; GSAP es gratis completo desde la compra por Webflow)

**Pros**:
- Componentes, optimización de imágenes (AVIF/WebP con tamaños para celular) y un archivo de contenido tipado, sin armar nada a mano.
- GSAP funciona igual en todos los navegadores y trae `matchMedia` para el movimiento reducido; sirve también para #10 y #11.
- Enlace corto en la raíz del dominio (sin ruta base), deploy automático por push y analítica gratis sin cookies para #13.

**Cons**:
- Hay que crear una cuenta de Cloudflare.
- GSAP con ScrollTrigger suma unos 40 KB comprimidos de JavaScript (aproximado) que Astro solo no tendría.

### Option 2: Vite + TypeScript sin framework + GSAP + GitHub Pages

Un proyecto Vite con HTML, CSS y TS directos, publicado con GitHub Actions en `usuario.github.io/ecopunto-intec`.

**Pros**:
- Lo más liviano con servidor de desarrollo rápido; sin cuenta nueva.

**Cons**:
- Sin componentes ni optimización de imágenes incluida: se repite marcado y las fotos de Canva se optimizan a mano.
- El enlace lleva el usuario de GitHub y una ruta base, más largo en el QR y fácil de romper si se renombra el repo.

### Option 3: HTML/CSS/JS puro con animaciones CSS nativas + GitHub Pages

Sin herramientas de build. Las entradas se hacen con `animation-timeline: view()` y un IntersectionObserver.

**Pros**:
- Cero dependencias y cero pasos de build; cualquiera del equipo lo edita.

**Cons**:
- Las animaciones de scroll con CSS no funcionan en Firefox en 2026, así que igual hace falta JS de respaldo. (basis: MDN animation-timeline)
- Contadores, gráficos y el juego (#10, #11) terminan en código propio que GSAP ya resuelve.

### Option 4: Next.js con export estático + Motion + Vercel

React completo exportado como estático, animaciones con Motion, publicado en `ecopunto-intec.vercel.app`.

**Pros**:
- Ecosistema grande y animaciones declarativas en React.

**Cons**:
- Envía React a cada celular para una página sin estado: más peso, peor carga en datos móviles.
- El plan Hobby de Vercel es solo para uso no comercial (esta campaña lo cumple, pero es una restricción más).

## Rationale

Astro gana por el celular y el tiempo. Una página de contenido que se abre desde un QR con datos móviles tiene que pesar poco, y Astro envía solo HTML y CSS salvo el script de animación que se pide explícitamente. Además resuelve de fábrica lo que esta noche costaría horas: optimizar las imágenes de Canva, separar el contenido en un archivo tipado y armar componentes reutilizables (tarjeta con cinta, título de sección). Next.js resuelve lo mismo pero cargando React sin necesidad; Vite y HTML puro son más livianos pero dejan las imágenes y la repetición a mano. (basis: Web Vitals en celular; boring technology)

GSAP gana sobre CSS nativo porque Firefox todavía no soporta las animaciones de scroll con CSS y porque #10 y #11 necesitan líneas de tiempo y contadores que GSAP ya trae. Su `matchMedia` deja la regla de movimiento reducido en un solo lugar. Que ahora sea gratis completo quita la única objeción que tenía. Motion era el segundo: más liviano, pero con menos herramientas para el juego.

Cloudflare gana sobre GitHub Pages por el QR: `ecopunto-intec.pages.dev` es corto, está en la raíz (sin ruta base que configurar ni romper) y no depende del nombre de usuario. Su analítica gratuita sin cookies es justo lo que #13 pide, así que reusa el mismo proveedor en vez de sumar uno. El costo es crear una cuenta, que es gratis y sin tarjeta según el conocimiento disponible (verificar al crearla). GitHub Pages es el segundo: no pide cuenta nueva.

El resto sigue el mismo criterio de mínimo necesario: CSS con variables en vez de Tailwind porque el estilo es artesanal (cartón, cinta, papel) y terminaría en CSS propio igual; fuentes autoalojadas para no depender de Google ni enviarle datos del visitante; scroll nativo porque Lenis no aporta nada en celular (se apaga en táctil) y complica teclado y movimiento reducido. Se revisa tras la Release 1.

## References

**Project sources** (verificables en este repo):
- `docs/scope/scope.md`: intro de la campaña, parte #1 (Stack y publicación), build approach Skateboard, workflow Alpha, partes #9, #10, #11 y #13 que dependen de esta decisión.
- Entorno local revisado el 2026-09-30: Node 24, npm 11, git 2.52, `gh` 2.101 instalados; proyecto sin código ni `AGENTS.md`.

**Practices & standards**:
- Skateboard MVP: cada paso deja algo usable y publicado.
- Boring technology: herramientas probadas con buena documentación.
- Progressive enhancement: el contenido se ve aunque el JavaScript falle.
- Accesibilidad de animaciones: `prefers-reduced-motion`, WCAG 2.3.3 Animation from Interactions.
- Web Vitals en celular: poco JavaScript, imágenes optimizadas.
- QR estático: la URL va dentro del código, sin servicios intermedios que caduquen.

**Links** (verificados en la revisión web del 2026-09-30):
- [Astro](https://astro.build): framework para sitios de contenido.
- [GSAP pricing](https://gsap.com/pricing): GSAP y todos sus plugins, gratis.
- [MDN: animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline): soporte de animaciones de scroll con CSS (sin Firefox).
- [Cloudflare Pages docs](https://developers.cloudflare.com/pages/): hosting estático con subdominio `pages.dev`.
- [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages): la alternativa considerada.
- [Astro: deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/): guía oficial de la alternativa.

# Ecopunto INTEC

Página de una sola página de la campaña sobre residuos electrónicos en INTEC, contada como historia al hacer scroll. Publicada en https://ecopunto-intec.pages.dev. Avance y siguiente paso: `docs/scope/scope.md`.

## Stack

- **Language / Runtime**: TypeScript 6 estricto (`astro/tsconfigs/strict`), Node 24 (`.node-version`)
- **Framework**: Astro 7.3.5, salida `static` sin adaptador
- **Key dependencies**: GSAP 3.15 con ScrollTrigger, Fontsource (Londrina Solid 900, Nunito Variable), sharp (texturas)
- **Package manager**: npm (`package-lock.json` versionado)
- **Hosting**: Cloudflare Pages conectado a GitHub `hjmnz-dev/ecopunto-intec`: cada push a `main` publica solo

## Build approach

**Skateboard**: primero la página completa, simple y publicada; luego se suma un interactivo a la vez, dejando siempre algo presentable.

## Commands

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # sitio estático en dist/
npm run check          # tipos (astro check)
npm run format:check   # Prettier (npm run format para corregir)
npm run carton         # regenera la textura de cartón (src/assets/texturas/)
npm run qr             # QR de SITIO_URL/?src=qr en qr/ (solo con SITIO_CONFIRMADO)
```

## Specs

Stored in `docs/specs/`. Format: `docs/specs/NNNN-title/index.md` (más `rationale.md` y `verify.md`).

## Rules

- Todo el texto de la página sale de `src/data/campana.ts`; las secciones solo leen de ahí.
- Estilo: `design.md` manda. Solo `src/styles/tokens.css` lleva colores literales; los componentes usan `var(--...)`.
- `src/scripts/animaciones.ts` es el único archivo que importa GSAP; efectos en `src/scripts/efectos/`, escenas en `src/scripts/escenas/`.
- El HTML servido es el estado final: toda animación va desde un estado inicial hacia él, dentro de `gsap.matchMedia` sin movimiento reducido. Sin JS o con movimiento reducido, todo se ve completo.
- Nada dentro de una escena (`data-escena`) lleva `data-animar`; los dibujos SVG no llevan `id` ni filtros.
- El dominio vive solo en `sitio.mjs` (`SITIO_URL`, sin barra final).
- Código y comentarios en español; formato con Prettier antes de cada commit.

## Git

- integration: off (se trabaja directo en `main`; cada push publica en Cloudflare Pages)

## Agent skills

- [gsap-core](.agents/skills/gsap-core/): `greensock/gsap-skills`, tweens, timelines y `matchMedia`
- [gsap-scrolltrigger](.agents/skills/gsap-scrolltrigger/): `greensock/gsap-skills`, scroll, scrub y escenas
- [accessibility](.agents/skills/accessibility/): `addyosmani/web-quality-skills`, WCAG 2.2
- [web-perf](.agents/skills/web-perf/): `cloudflare/skills`, peso y Core Web Vitals
- [cloudflare](.agents/skills/cloudflare/), [wrangler](.agents/skills/wrangler/): `cloudflare/skills`, publicación

`Declined: astro-developer` · `MCP servers: astro-docs (connected, .mcp.json)`

## Context files

<!-- Nested AGENTS.md files are listed here as they are created -->

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._

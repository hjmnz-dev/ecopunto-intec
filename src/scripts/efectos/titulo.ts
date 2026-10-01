// data-animar="titulo": la tira de cuaderno sube y luego el título se descubre de izquierda a derecha.
// clearProps quita el recorte al final para no cortar tildes ni eñes.
import { CURVA, DISTANCIA, DURACION_TIRA, DURACION_TITULO, ESCALONADO, INICIO } from '../movimiento';
import type { Contexto, Gsap, Lote, Trigger } from './tipos';

export function titulos(gsap: Gsap, ScrollTrigger: Trigger, ctx: Contexto) {
  const tiras = gsap.utils.toArray<HTMLElement>('[data-animar="titulo"]');
  if (!tiras.length) return;
  const encabezado = (tira: HTMLElement) => tira.querySelector<HTMLElement>('h1, h2, h3');

  gsap.set(tiras, { autoAlpha: 0, y: DISTANCIA });
  for (const tira of tiras) {
    const h = encabezado(tira);
    if (h) gsap.set(h, { clipPath: 'inset(0 100% 0 0)' });
  }

  const alEntrar: Lote = (lote) => {
    (lote as HTMLElement[]).forEach((tira, i) => {
      const tl = gsap.timeline({ delay: i * ESCALONADO });
      tl.to(tira, { autoAlpha: 1, y: 0, duration: DURACION_TIRA, ease: CURVA });
      const h = encabezado(tira);
      if (h) {
        tl.to(h, {
          clipPath: 'inset(0 0% 0 0)',
          duration: DURACION_TITULO,
          ease: 'power1.inOut',
          clearProps: 'clipPath',
        });
      }
    });
  };
  ScrollTrigger.batch(tiras, { start: INICIO, once: true, onEnter: ctx.add('tituloAlEntrar', alEntrar) as Lote });
}

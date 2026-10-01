// data-animar vacío o "subir": aparece subiendo, una sola vez.
import { CURVA, DISTANCIA, DURACION, ESCALONADO, INICIO } from '../movimiento';
import type { Contexto, Gsap, Lote, Trigger } from './tipos';

export function subir(gsap: Gsap, ScrollTrigger: Trigger, ctx: Contexto) {
  const els = gsap.utils.toArray<HTMLElement>('[data-animar=""], [data-animar="subir"]');
  if (!els.length) return;
  gsap.set(els, { autoAlpha: 0, y: DISTANCIA });
  const alEntrar: Lote = (lote) => {
    gsap.to(lote, { autoAlpha: 1, y: 0, duration: DURACION, ease: CURVA, stagger: ESCALONADO, overwrite: true });
  };
  ScrollTrigger.batch(els, { start: INICIO, once: true, onEnter: ctx.add('subirAlEntrar', alEntrar) as Lote });
}

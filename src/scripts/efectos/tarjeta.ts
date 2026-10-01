// data-animar="tarjeta": entra girada y se asienta en su giro de reposo; después aparecen sus cintas.
// El giro de entrada es relativo ('+='), así termina exactamente en el `rotate` de CSS.
import {
  CURVA,
  DISTANCIA,
  DURACION,
  DURACION_CINTA,
  ESCALONADO,
  GIRO_ENTRADA,
  INICIO,
  RETRASO_CINTA,
} from '../movimiento';
import type { Contexto, Gsap, Lote, Trigger } from './tipos';

export function tarjetas(gsap: Gsap, ScrollTrigger: Trigger, ctx: Contexto) {
  const todas = gsap.utils.toArray<HTMLElement>('[data-animar="tarjeta"]');
  if (!todas.length) return;
  const posicion = new Map(todas.map((el, i) => [el, i]));
  const signo = (el: HTMLElement) => {
    if (el.dataset.giro === 'izquierda') return -1;
    if (el.dataset.giro === 'derecha') return 1;
    return (posicion.get(el) ?? 0) % 2 === 0 ? 1 : -1;
  };

  gsap.set(todas, { autoAlpha: 0 });
  gsap.set('[data-animar="tarjeta"] > .cinta', { scaleX: 0, autoAlpha: 0 });

  const alEntrar: Lote = (lote) => {
    (lote as HTMLElement[]).forEach((el, i) => {
      const cintas = el.querySelectorAll(':scope > .cinta');
      const tl = gsap.timeline({ delay: i * ESCALONADO });
      tl.from(el, {
        y: DISTANCIA,
        scale: 0.98,
        rotation: `+=${signo(el) * GIRO_ENTRADA}`,
        duration: DURACION,
        ease: CURVA,
      });
      tl.to(el, { autoAlpha: 1, duration: DURACION, ease: CURVA }, 0);
      if (cintas.length) {
        tl.to(
          cintas,
          { scaleX: 1, autoAlpha: 1, duration: DURACION_CINTA, ease: CURVA },
          DURACION - 0.1 + RETRASO_CINTA,
        );
      }
    });
  };
  ScrollTrigger.batch(todas, { start: INICIO, once: true, onEnter: ctx.add('tarjetaAlEntrar', alEntrar) as Lote });
}

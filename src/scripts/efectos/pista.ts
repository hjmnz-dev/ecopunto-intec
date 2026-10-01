// data-pista: la flecha de la portada rebota unas veces después de la entrada y se detiene
// (WCAG 2.2.2: nada se mueve solo más de 5 segundos).
import { PISTA_DURACION, PISTA_REBOTES, PISTA_RETRASO } from '../movimiento';
import type { Gsap } from './tipos';

export function pista(gsap: Gsap) {
  const flechas = gsap.utils.toArray<HTMLElement>('[data-pista]');
  if (!flechas.length) return;
  gsap.timeline({ delay: PISTA_RETRASO, repeat: PISTA_REBOTES - 1 })
    .to(flechas, { y: 10, duration: PISTA_DURACION / 2, ease: 'power1.out' })
    .to(flechas, { y: 0, duration: PISTA_DURACION / 2, ease: 'power1.in' });
}

// data-parallax: la capa de cartón se desplaza más lento que el contenido.
// Solo se registra en pantallas de 1024 px o más, con mouse y sin movimiento reducido.
import { PARALLAX } from '../movimiento';
import type { Gsap } from './tipos';

export function parallax(gsap: Gsap) {
  const capas = gsap.utils.toArray<HTMLElement>('[data-parallax]');
  if (!capas.length) return;
  gsap.set(capas, { willChange: 'transform' });
  gsap.to(capas, {
    yPercent: PARALLAX,
    ease: 'none',
    scrollTrigger: { trigger: document.documentElement, start: 0, end: 'max', scrub: true, invalidateOnRefresh: true },
  });
}

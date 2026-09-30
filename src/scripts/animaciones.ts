// Único punto que registra GSAP. Toda animación nueva vive dentro de
// gsap.matchMedia() con (prefers-reduced-motion: no-preference).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  gsap.set('[data-animar]', { autoAlpha: 0, y: 24 });
  ScrollTrigger.batch('[data-animar]', {
    start: 'top 85%',
    once: true,
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, stagger: 0.1, overwrite: true }),
  });
});
document.documentElement.classList.add('anim-listo');

const cargada = document.readyState === 'complete'
  ? Promise.resolve()
  : new Promise((ok) => addEventListener('load', ok, { once: true }));
Promise.all([document.fonts.ready, cargada]).then(() => ScrollTrigger.refresh());

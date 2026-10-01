// Único punto que importa y registra GSAP (spec 0001). Los efectos (spec 0002) viven en ./efectos/
// y solo corren sin movimiento reducido. El parallax va en su propio bloque para que cambiar
// el ancho de la ventana no vuelva a esconder lo ya revelado.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { entrada } from './efectos/entrada';
import { parallax } from './efectos/parallax';
import { subir } from './efectos/subir';
import { tarjetas } from './efectos/tarjeta';
import { titulos } from './efectos/titulo';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', (ctx) => {
  entrada(gsap);
  subir(gsap, ScrollTrigger, ctx);
  tarjetas(gsap, ScrollTrigger, ctx);
  titulos(gsap, ScrollTrigger, ctx);
});
mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (pointer: fine)', () => {
  parallax(gsap);
});
document.documentElement.classList.add('anim-listo');

const cargada = document.readyState === 'complete'
  ? Promise.resolve()
  : new Promise((ok) => addEventListener('load', ok, { once: true }));
Promise.all([document.fonts.ready, cargada]).then(() => ScrollTrigger.refresh());

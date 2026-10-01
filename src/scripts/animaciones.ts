// Único punto que importa y registra GSAP (spec 0001). Los efectos (spec 0002) viven en ./efectos/
// y las escenas de la historia (spec 0003) en ./escenas/. Todo corre solo sin movimiento reducido.
// Orden: primero las escenas (cambian el alto de la página), después las entradas y la pista,
// y el parallax en su propio bloque para que cambiar el ancho no vuelva a esconder lo revelado.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { entrada } from './efectos/entrada';
import { parallax } from './efectos/parallax';
import { pista } from './efectos/pista';
import { subir } from './efectos/subir';
import { tarjetas } from './efectos/tarjeta';
import { titulos } from './efectos/titulo';
import { escenas } from './escenas';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference) and (min-height: 600px)', () => escenas(gsap));
mm.add('(prefers-reduced-motion: no-preference)', (ctx) => {
  entrada(gsap);
  subir(gsap, ScrollTrigger, ctx);
  tarjetas(gsap, ScrollTrigger, ctx);
  titulos(gsap, ScrollTrigger, ctx);
  pista(gsap);
});
mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (pointer: fine)', () => {
  parallax(gsap);
});
document.documentElement.classList.add('anim-listo');

const cargada = document.readyState === 'complete'
  ? Promise.resolve()
  : new Promise((ok) => addEventListener('load', ok, { once: true }));
Promise.all([document.fonts.ready, cargada]).then(() => ScrollTrigger.refresh());

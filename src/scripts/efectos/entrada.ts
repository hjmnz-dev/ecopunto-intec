// data-entrada="1", "2", …: entra al cargar la página (portada, parte #5).
// El mismo número entra junto; con 5 grupos o más el escalonado se ajusta para terminar en TOPE_ENTRADA.
import { CURVA, DISTANCIA, DURACION, ESCALONADO_ENTRADA, TOPE_ENTRADA } from '../movimiento';
import type { Gsap } from './tipos';

export function entrada(gsap: Gsap) {
  const els = gsap.utils.toArray<HTMLElement>('[data-entrada]');
  if (!els.length) return;
  const grupos = new Map<number, HTMLElement[]>();
  for (const el of els) {
    const n = Number(el.dataset.entrada) || 0;
    grupos.set(n, [...(grupos.get(n) ?? []), el]);
  }
  const orden = [...grupos.keys()].sort((a, b) => a - b);
  const paso = orden.length >= 5 ? (TOPE_ENTRADA - DURACION) / (orden.length - 1) : ESCALONADO_ENTRADA;

  gsap.set(els, { autoAlpha: 0, y: DISTANCIA });
  const tl = gsap.timeline();
  orden.forEach((n, i) => {
    tl.to(grupos.get(n) ?? [], { autoAlpha: 1, y: 0, duration: DURACION, ease: CURVA }, i * paso);
  });
}

// Piezas comunes de las escenas de la historia (spec 0003).
// Cada línea de tiempo dura 1 unidad; el avance va con ease 'none' y el último tramo es pausa.
import { gsap } from 'gsap';
import { PAUSA_FINAL } from '../movimiento';
import { formatoCifra } from '../../components/historia/formato';

export type Linea = gsap.core.Timeline;

/** Elementos de una escena por data-parte (dentro del svg) o por selector. */
export function partes(escena: HTMLElement) {
  return {
    parte: (nombre: string) => escena.querySelectorAll<SVGElement>(`[data-parte="${nombre}"]`),
    todos: <T extends Element = HTMLElement>(sel: string) => [...escena.querySelectorAll<T>(sel)],
  };
}

/** Cuenta la cifra de 0 a su valor dentro del tramo [inicio, inicio + duracion]. */
export function contar(tl: Linea, cifra: HTMLElement | null, inicio: number, duracion: number) {
  if (!cifra) return;
  const valor = Number(cifra.dataset.cifra);
  const contador = { v: 0 };
  cifra.textContent = formatoCifra(0);
  tl.fromTo(
    contador,
    { v: 0 },
    {
      v: valor,
      ease: 'none',
      duration: duracion,
      immediateRender: false,
      onUpdate: () => {
        // Al revertir (modo fijo apagado) GSAP vuelve a 0: no tocar la cifra fuera del modo fijo.
        if (!cifra.closest('.escena-fija')) return;
        cifra.textContent = formatoCifra(Math.round(contador.v * 10) / 10);
      },
    },
    inicio,
  );
}

/** Marca los puntos verdes uno a uno dentro del mismo tramo que la cifra. */
export function marcar(tl: Linea, contenedor: Element | null, inicio: number, duracion: number) {
  if (!contenedor) return;
  const rellenos = [...contenedor.querySelectorAll('[data-punto]')];
  if (!rellenos.length) return;
  // Con stagger, GSAP solo pone en estado inicial el primer punto: se ocultan todos al activar
  // (queda registrado en el contexto de matchMedia, así que se revierte con el resto).
  gsap.set(rellenos, { scale: 0, opacity: 0 });
  tl.fromTo(
    rellenos,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, ease: 'none', duration: duracion / rellenos.length, stagger: duracion / rellenos.length },
    inicio,
  );
}

/** Aparece un momento (tarjeta) con opacidad y un pequeño ascenso. */
export function aparecer(tl: Linea, el: Element | null | undefined, inicio: number, duracion = 0.12, primero = true) {
  if (!el) return;
  tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: 'power1.out', duration: duracion, immediateRender: primero }, inicio);
}

/** Se va un momento para dejar lugar al siguiente. */
export function desaparecer(tl: Linea, el: Element | null | undefined, inicio: number, duracion = 0.06) {
  if (!el) return;
  tl.fromTo(el, { opacity: 1, y: 0 }, { opacity: 0, y: -16, ease: 'power1.in', duration: duracion, immediateRender: false }, inicio);
}

/** Cifra y puntos de un momento: el tramo de conteo de ese momento. */
export function datoDe(momento: Element | null | undefined) {
  return {
    cifra: momento?.querySelector<HTMLElement>('[data-cifra]') ?? null,
    puntos: momento?.querySelector('.puntos') ?? null,
  };
}

/** Rellena hasta 1 + pausa para que la cifra final se vea antes de soltar la escena. */
export function pausa(tl: Linea) {
  tl.to({}, { duration: PAUSA_FINAL }, 1 - PAUSA_FINAL);
}

/** Deja la escena en su estado final: cifras finales (el texto no lo revierte GSAP) y puntos
 *  sin estilos (los que nunca llegaron a animarse se quedan con el estado inicial al revertir). */
export function reponerFinal(escena: HTMLElement) {
  for (const cifra of escena.querySelectorAll<HTMLElement>('[data-cifra]')) {
    cifra.textContent = formatoCifra(Number(cifra.dataset.cifra));
  }
  for (const punto of escena.querySelectorAll('[data-punto]')) punto.removeAttribute('style');
}

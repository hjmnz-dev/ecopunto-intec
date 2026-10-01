// Modo fijo de las escenas de la historia (spec 0003). Se llama dentro de gsap.matchMedia con
// movimiento no reducido y pantalla de 600 px de alto o más. Sin esto, la página es el modo estático.
import type { gsap as GSAP } from 'gsap';
import type { IdEscena } from '../../data/campana';
import { LARGO_ESCENA, LARGO_ESCENA_DOBLE, SCRUB_ESCENA } from '../movimiento';
import { reponerFinal } from './comun';
import { lineas } from './lineas';

const CLASE = 'escena-fija';

/** Activa las escenas que caben en la pantalla y devuelve la limpieza. */
export function escenas(gsap: typeof GSAP): () => void {
  const todas = [...document.querySelectorAll<HTMLElement>('[data-escena]')];
  const activas: HTMLElement[] = [];

  for (const escena of todas) {
    const id = escena.dataset.escena as IdEscena;
    const armar = lineas[id];
    if (!armar) continue;
    const doble = escena.querySelectorAll('[data-momento]').length > 1;
    escena.style.setProperty('--largo', `${doble ? LARGO_ESCENA_DOBLE : LARGO_ESCENA}svh`);
    escena.classList.add(CLASE);

    // Prueba de que cabe: si el escenario no entra en la pantalla, la escena queda estática.
    const escenario = escena.querySelector<HTMLElement>('.escenario');
    if (escenario && escenario.scrollHeight > escenario.clientHeight + 1) {
      escena.classList.remove(CLASE);
      escena.style.removeProperty('--largo');
      continue;
    }

    activas.push(escena);
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: escena,
        start: 'top top',
        end: 'bottom bottom',
        scrub: SCRUB_ESCENA,
        invalidateOnRefresh: true,
      },
    });
    armar(tl, escena);
  }

  // GSAP llama a esta limpieza antes de revertir las animaciones: el estado final se repone
  // en el cuadro siguiente, cuando la reversión ya terminó.
  return () => {
    for (const escena of activas) {
      escena.classList.remove(CLASE);
      escena.style.removeProperty('--largo');
    }
    requestAnimationFrame(() => activas.forEach(reponerFinal));
  };
}

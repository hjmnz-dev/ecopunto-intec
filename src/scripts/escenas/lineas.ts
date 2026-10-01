// Líneas de tiempo de las cinco escenas (spec 0003, tabla "Líneas de tiempo").
// Todo va desde un estado inicial hacia el HTML servido, que es el estado final.
import type { IdEscena } from '../../data/campana';
import { aparecer, contar, datoDe, desaparecer, marcar, partes, pausa, type Linea } from './comun';

type Armar = (tl: Linea, escena: HTMLElement) => void;

const origenCentro = { transformOrigin: '50% 50%' };

const funciona: Armar = (tl, escena) => {
  const { parte, todos } = partes(escena);
  const [m1, m2] = todos('[data-momento]');
  // 0 a 0.35: el celular se carga y aparece el primer momento
  tl.fromTo(
    parte('bateria-nivel'),
    { scaleX: 0, transformOrigin: '0% 50%' },
    { scaleX: 1, ease: 'none', duration: 0.3 },
    0,
  );
  tl.fromTo(parte('pantalla'), { opacity: 1 }, { opacity: 1, duration: 0.01 }, 0);
  aparecer(tl, m1, 0.02);
  // 0.35 a 0.5: chispa, el cable se rompe, la pantalla se apaga
  tl.fromTo(
    parte('chispa'),
    { opacity: 0, scale: 0, ...origenCentro },
    { opacity: 1, scale: 1, ease: 'back.out(2)', duration: 0.08 },
    0.35,
  );
  tl.fromTo(parte('cable'), { opacity: 1 }, { opacity: 0, duration: 0.06 }, 0.38);
  tl.fromTo(parte('cable-roto'), { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.38);
  tl.fromTo(parte('cara-feliz'), { opacity: 1 }, { opacity: 0, duration: 0.05 }, 0.4);
  tl.fromTo(parte('cara-triste'), { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.4);
  tl.fromTo(parte('pantalla'), { opacity: 1 }, { opacity: 0, duration: 0.08, immediateRender: false }, 0.42);
  tl.fromTo(parte('pantalla-apagada'), { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.42);
  tl.fromTo(parte('bateria-nivel'), { scaleX: 1 }, { scaleX: 0, duration: 0.08, immediateRender: false }, 0.42);
  // 0.5 a 0.85: cambia el momento
  desaparecer(tl, m1, 0.5);
  aparecer(tl, m2, 0.56, 0.12, true);
  pausa(tl);
};

const cajon: Armar = (tl, escena) => {
  const { parte, todos } = partes(escena);
  const [m1] = todos('[data-momento]');
  aparecer(tl, m1, 0);
  tl.fromTo(parte('frente'), { y: -24 }, { y: 0, ease: 'power2.out', duration: 0.1 }, 0);
  tl.from(
    parte('cargador'),
    { y: '-=170', rotation: '+=50', ease: 'power2.in', duration: 0.18, ...origenCentro },
    0.06,
  );
  const { cifra, puntos } = datoDe(m1);
  contar(tl, cifra, 0.25, 0.6);
  marcar(tl, puntos, 0.25, 0.6);
  pausa(tl);
};

const basura: Armar = (tl, escena) => {
  const { parte, todos } = partes(escena);
  const [m1] = todos('[data-momento]');
  const noche = escena.querySelector('[data-noche]');
  if (noche) {
    tl.fromTo(noche, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.2 }, 0);
    tl.fromTo(noche, { opacity: 1 }, { opacity: 0, ease: 'none', duration: 0.1, immediateRender: false }, 0.9);
  }
  aparecer(tl, m1, 0.12);
  tl.from(parte('tapa'), { rotation: 35, svgOrigin: '0 30', duration: 0.1 }, 0.18);
  tl.from(parte('cargador'), { y: '-=200', rotation: '-=60', ease: 'power2.in', duration: 0.2, ...origenCentro }, 0.2);
  const { cifra, puntos } = datoDe(m1);
  contar(tl, cifra, 0.4, 0.35);
  marcar(tl, puntos, 0.4, 0.35);
  const texto = m1?.querySelector('[data-texto]');
  if (texto) tl.fromTo(texto, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.75);
};

const nadieSabe: Armar = (tl, escena) => {
  const { parte, todos } = partes(escena);
  const [m1] = todos('[data-momento]');
  aparecer(tl, m1, 0);
  for (const [i, n] of ['flecha-1', 'flecha-2', 'flecha-3'].entries()) {
    tl.from(parte(n), { rotation: i % 2 ? 160 : -160, opacity: 0, duration: 0.25, ...origenCentro }, 0.03 * i);
  }
  for (const [i, n] of ['pregunta-1', 'pregunta-2', 'pregunta-3'].entries()) {
    tl.from(parte(n), { scale: 0, opacity: 0, ease: 'back.out(2)', duration: 0.1, ...origenCentro }, 0.08 + 0.07 * i);
  }
  tl.from(parte('cargador'), { rotation: -12, yoyo: true, repeat: 3, duration: 0.07, ...origenCentro }, 0.02);
  const { cifra, puntos } = datoDe(m1);
  contar(tl, cifra, 0.3, 0.55);
  marcar(tl, puntos, 0.3, 0.55);
  pausa(tl);
};

const ecopunto: Armar = (tl, escena) => {
  const { parte, todos } = partes(escena);
  const [m1, m2] = todos('[data-momento]');
  aparecer(tl, m1, 0);
  tl.from(parte('contenedor'), { y: '+=320', ease: 'power2.out', duration: 0.25 }, 0);
  tl.from(
    parte('cargador'),
    { x: '-=220', y: '-=160', rotation: '-=200', ease: 'power1.inOut', duration: 0.15, ...origenCentro },
    0.25,
  );
  const d1 = datoDe(m1);
  contar(tl, d1.cifra, 0.4, 0.2);
  marcar(tl, d1.puntos, 0.4, 0.2);
  desaparecer(tl, m1, 0.6, 0.04);
  aparecer(tl, m2, 0.61, 0.04, true);
  const d2 = datoDe(m2);
  contar(tl, d2.cifra, 0.65, 0.2);
  marcar(tl, d2.puntos, 0.65, 0.2);
  pausa(tl);
};

export const lineas: Record<IdEscena, Armar> = {
  funciona,
  cajon,
  basura,
  'nadie-sabe': nadieSabe,
  ecopunto,
};

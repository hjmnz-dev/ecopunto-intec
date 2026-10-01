// Juego "¿Va al Ecopunto?" (spec 0004). Estado en memoria, nada se guarda.
// Fases: pregunta → respuesta → (siguiente) pregunta | final → (jugar otra vez) pregunta.
import type { Juego } from '../data/campana';

type Fase = 'pregunta' | 'respuesta' | 'final';

const raiz = document.querySelector<HTMLElement>('[data-juego]');
const datosEl = document.querySelector('[data-juego-datos]');
if (raiz && datosEl?.textContent) iniciar(raiz, JSON.parse(datosEl.textContent) as Juego);

function iniciar(raiz: HTMLElement, datos: Juego) {
  const $ = <T extends HTMLElement>(sel: string) => raiz.querySelector<T>(sel)!;
  const pregunta = $('[data-juego-pregunta]');
  const final = $('[data-juego-final]');
  const progreso = $('[data-juego-progreso]');
  const nombre = $('[data-juego-nombre]');
  const iconos = [...raiz.querySelectorAll<HTMLElement>('[data-juego-icono]')];
  const botones = [...raiz.querySelectorAll<HTMLButtonElement>('[data-juego-boton]')];
  const respuesta = $('[data-juego-respuesta]');
  const estado = $('[data-juego-estado]');
  const siguiente = $<HTMLButtonElement>('[data-juego-siguiente]');
  const resultado = $('[data-juego-resultado]');
  const mensaje = $('[data-juego-mensaje]');
  const otra = $<HTMLButtonElement>('[data-juego-otra]');

  const total = datos.objetos.length;
  let orden: number[] = [];
  let actual = 0;
  let aciertos = 0;
  let fase: Fase = 'pregunta';

  function barajar(): number[] {
    const indices = datos.objetos.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }

  function mostrarObjeto() {
    const indice = orden[actual];
    const objeto = datos.objetos[indice];
    fase = 'pregunta';
    iconos.forEach((icono) => (icono.hidden = Number(icono.dataset.juegoIcono) !== indice));
    nombre.textContent = objeto.nombre;
    progreso.textContent = datos.progreso.replace('{n}', String(actual + 1)).replace('{total}', String(total));
    botones.forEach((b) => (b.disabled = false));
    delete respuesta.dataset.resultado;
    estado.textContent = '';
    siguiente.hidden = true;
    pregunta.hidden = false;
    final.hidden = true;
  }

  function responder(va: boolean) {
    if (fase !== 'pregunta') return;
    fase = 'respuesta';
    const objeto = datos.objetos[orden[actual]];
    const bien = va === objeto.va;
    if (bien) aciertos++;
    botones.forEach((b) => (b.disabled = true));
    respuesta.dataset.resultado = bien ? 'bien' : 'mal';
    estado.textContent = `${bien ? datos.correcto : datos.incorrecto} ${objeto.porque}`;
    siguiente.hidden = false;
    siguiente.focus();
  }

  function avanzar() {
    if (fase !== 'respuesta') return;
    actual++;
    if (actual < total) {
      mostrarObjeto();
      nombre.focus();
    } else {
      terminar();
    }
  }

  function terminar() {
    fase = 'final';
    const texto = datos.mensajes.find((m) => aciertos >= m.desde)?.texto ?? '';
    resultado.textContent = datos.resultado.replace('{aciertos}', String(aciertos)).replace('{total}', String(total));
    mensaje.textContent = texto;
    pregunta.hidden = true;
    final.hidden = false;
    resultado.focus();
  }

  function empezar() {
    orden = barajar();
    actual = 0;
    aciertos = 0;
    mostrarObjeto();
  }

  botones.forEach((b) => b.addEventListener('click', () => responder(b.dataset.juegoBoton === 'si')));
  siguiente.addEventListener('click', avanzar);
  otra.addEventListener('click', () => {
    empezar();
    nombre.focus();
  });

  document.querySelector('[data-juego-sin-js]')?.setAttribute('hidden', '');
  raiz.hidden = false;
  empezar();
}

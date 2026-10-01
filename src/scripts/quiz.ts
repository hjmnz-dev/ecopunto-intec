// Mini quiz final (parte #12). Estado en memoria, nada se guarda.
// Fases: pregunta → respuesta → (siguiente) pregunta | final → (repetir) pregunta.
import type { Quiz } from '../data/campana';

const raiz = document.querySelector<HTMLElement>('[data-quiz]');
const datosEl = document.querySelector('[data-quiz-datos]');
if (raiz && datosEl?.textContent) iniciar(raiz, JSON.parse(datosEl.textContent) as Quiz);

function iniciar(raiz: HTMLElement, datos: Quiz) {
  const $ = <T extends HTMLElement>(sel: string) => raiz.querySelector<T>(sel)!;
  const pregunta = $('[data-quiz-pregunta]');
  const final = $('[data-quiz-final]');
  const progreso = $('[data-quiz-progreso]');
  const bloques = [...raiz.querySelectorAll<HTMLElement>('[data-quiz-bloque]')];
  const respuesta = $('[data-quiz-respuesta]');
  const estado = $('[data-quiz-estado]');
  const siguiente = $<HTMLButtonElement>('[data-quiz-siguiente]');
  const resultado = $('[data-quiz-resultado]');
  const mensaje = $('[data-quiz-mensaje]');
  const otra = $<HTMLButtonElement>('[data-quiz-otra]');

  const total = datos.preguntas.length;
  let actual = 0;
  let aciertos = 0;
  let respondida = false;

  const opcionesDe = (i: number) => [...bloques[i].querySelectorAll<HTMLButtonElement>('[data-quiz-opcion]')];

  function mostrar() {
    respondida = false;
    bloques.forEach((b, i) => (b.hidden = i !== actual));
    opcionesDe(actual).forEach((o) => {
      o.disabled = false;
      delete o.dataset.estado;
    });
    progreso.textContent = datos.progreso.replace('{n}', String(actual + 1)).replace('{total}', String(total));
    delete respuesta.dataset.resultado;
    estado.textContent = '';
    siguiente.hidden = true;
    pregunta.hidden = false;
    final.hidden = true;
  }

  function responder(elegida: number) {
    if (respondida) return;
    respondida = true;
    const p = datos.preguntas[actual];
    const bien = elegida === p.correcta;
    if (bien) aciertos++;
    opcionesDe(actual).forEach((o, j) => {
      o.disabled = true;
      if (j === p.correcta) o.dataset.estado = 'correcta';
      else if (j === elegida) o.dataset.estado = 'elegida-mal';
    });
    respuesta.dataset.resultado = bien ? 'bien' : 'mal';
    estado.textContent = `${bien ? datos.correcto : datos.incorrecto} ${p.porque}`;
    siguiente.hidden = false;
    siguiente.focus();
  }

  function avanzar() {
    if (!respondida) return;
    actual++;
    if (actual < total) {
      mostrar();
      bloques[actual].querySelector<HTMLElement>('.enunciado')?.focus();
    } else {
      terminar();
    }
  }

  function terminar() {
    resultado.textContent = datos.resultado.replace('{aciertos}', String(aciertos)).replace('{total}', String(total));
    mensaje.textContent = datos.mensajes.find((m) => aciertos >= m.desde)?.texto ?? '';
    pregunta.hidden = true;
    final.hidden = false;
    resultado.focus();
  }

  bloques.forEach((_, i) =>
    opcionesDe(i).forEach((o) => o.addEventListener('click', () => responder(Number(o.dataset.quizOpcion)))),
  );
  siguiente.addEventListener('click', avanzar);
  otra.addEventListener('click', () => {
    actual = 0;
    aciertos = 0;
    mostrar();
    bloques[0].querySelector<HTMLElement>('.enunciado')?.focus();
  });

  document.querySelector('[data-quiz-sin-js]')?.setAttribute('hidden', '');
  raiz.hidden = false;
  mostrar();
}

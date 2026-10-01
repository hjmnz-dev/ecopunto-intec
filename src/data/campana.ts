// Textos y cifras de la campaña, tomados de la presentación de Canva "Ecopunto intec" (16 diapositivas).
// Única fuente de contenido de la página: las secciones solo leen de aquí.
// Se corrigió la ortografía del Canva (eléctronicos, a travez, Parcitiparon, práticas, facilmente).
// Los textos de la historia (spec 0003) y del juego (spec 0004) son nuevos; los demás vienen del Canva.

import type { NombreIcono } from '../components/ui/Icono.astro';

export interface Bloque {
  titulo: string;
  puntos: readonly string[];
}

export interface Dato {
  /** Porcentaje con un decimal, tal como aparece en la encuesta. */
  valor: number;
  /** Lo que sigue a la cifra: "76.1 %" + frase. */
  frase: string;
  /** Pregunta de la encuesta de la que sale el dato. */
  pregunta: string;
}

export type DatoCorto = Pick<Dato, 'valor' | 'frase'>;

export interface Momento {
  titulo: string;
  texto?: string;
  dato?: DatoCorto;
}

export type IdEscena = 'funciona' | 'cajon' | 'basura' | 'nadie-sabe' | 'ecopunto';

export interface ObjetoJuego {
  nombre: string;
  icono: NombreIcono;
  va: boolean;
  porque: string;
}

export interface PreguntaQuiz {
  pregunta: string;
  opciones: readonly string[];
  /** Índice de la opción correcta. */
  correcta: number;
  porque: string;
}

export interface Quiz {
  titulo: string;
  intro: string;
  sinJs: string;
  botones: { siguiente: string; otraVez: string };
  correcto: string;
  incorrecto: string;
  progreso: string;
  resultado: string;
  mensajes: readonly { desde: number; texto: string }[];
  cierre: string;
  preguntas: readonly PreguntaQuiz[];
}

export interface Juego {
  titulo: string;
  intro: string;
  sinJs: string;
  botones: { si: string; no: string; siguiente: string; otraVez: string };
  correcto: string;
  incorrecto: string;
  /** Se reemplazan {n} y {total}. */
  progreso: string;
  /** Se reemplazan {aciertos} y {total}. */
  resultado: string;
  /** Se usa el primero cuyo desde sea menor o igual a los aciertos. */
  mensajes: readonly { desde: number; texto: string }[];
  objetos: readonly ObjetoJuego[];
}

export interface EscenaHistoria {
  id: IdEscena;
  momentos: readonly Momento[];
}

export interface Campana {
  nombre: string;
  lema: string;
  subtitulo: string;
  meta: { titulo: string; descripcion: string };
  porque: Bloque;
  problema: Bloque;
  objetivoGeneral: { titulo: string; texto: string };
  objetivosEspecificos: Bloque;
  acciones: Bloque;
  encuesta: {
    titulo: string;
    participantes: number;
    metodo: readonly string[];
    datos: readonly Dato[];
  };
  historia: { saltar: string; pista: string; escenas: readonly EscenaHistoria[] };
  guia: { titulo: string; si: Bloque; no: Bloque; contenedor: Bloque };
  pasos: Bloque;
  sobre: { titulo: string };
  juego: Juego;
  quiz: Quiz;
  cierre: { titulo: string; subtitulo: string };
  creditos: { proyecto: string; institucion: string; privacidad: string };
}

const porque = {
  titulo: '¿Por qué este proyecto?',
  puntos: [
    'Los dispositivos electrónicos forman parte de nuestra vida universitaria.',
    'Cuando dejan de funcionar, muchas veces no sabemos qué hacer con ellos.',
    'Esto genera impactos ambientales y representa una pérdida de recursos.',
  ],
} as const satisfies Bloque;

const problema = {
  titulo: '¿Cuál es el problema?',
  puntos: [
    'Desconocimiento sobre qué hacer con los aparatos electrónicos que ya no se utilizan.',
    'Impacto ambiental por un manejo inadecuado de estos residuos.',
    'Oportunidad de manejar la información y orientación dentro de la comunidad universitaria.',
  ],
} as const satisfies Bloque;

const datos = [
  {
    valor: 76.1,
    frase: 'de los participantes guarda los aparatos que ya no utiliza.',
    pregunta: '¿Qué haces normalmente con un aparato electrónico pequeño cuando ya no lo utilizas o deja de funcionar?',
  },
  {
    valor: 80.4,
    frase: 'de los participantes no sabe dónde llevar un residuo electrónico para que sea manejado correctamente.',
    pregunta: '¿Sabes dónde llevar un residuo electrónico para que sea manejado correctamente?',
  },
  {
    valor: 78.3,
    frase:
      'de los participantes definitivamente o probablemente utilizaría contenedores para residuos electrónicos dentro de INTEC.',
    pregunta:
      'Si se colocaran contenedores identificados para residuos electrónicos dentro de INTEC, ¿los utilizarías para depositar los aparatos que ya no necesitas?',
  },
  {
    valor: 91.3,
    frase: 'de los participantes calificó entre 4 y 5 la utilidad de colocar un instructivo.',
    pregunta:
      '¿Qué tan útil consideras que sería colocar un instructivo junto al punto de recolección para explicar qué residuos se pueden depositar y cómo hacerlo? (escala de 1 a 5)',
  },
] as const satisfies readonly Dato[];

/** De la misma pregunta que el 76.1 %: cuántos han tirado aparatos a la basura común. */
const datoBasura = {
  valor: 39.1,
  frase: 'de los participantes ha desechado aparatos junto a la basura común.',
} as const satisfies DatoCorto;

export const campana = {
  nombre: 'Ecopunto INTEC',
  lema: 'Pequeños aparatos, grandes cambios',
  subtitulo: 'Campaña de sensibilización sobre el manejo adecuado de residuos electrónicos',
  meta: {
    titulo: 'Ecopunto INTEC · Pequeños aparatos, grandes cambios',
    descripcion:
      'Campaña de sensibilización sobre el manejo adecuado de residuos electrónicos en INTEC: qué depositar en el Ecopunto y cómo usarlo.',
  },

  porque,
  problema,

  objetivoGeneral: {
    titulo: 'Objetivo general',
    texto:
      'Sensibilizar a la comunidad estudiantil del INTEC sobre el manejo adecuado de los residuos electrónicos, a través de una campaña informativa y una página web educativa.',
  },

  objetivosEspecificos: {
    titulo: 'Objetivos específicos',
    puntos: [
      'Informar sobre qué son los residuos electrónicos y su impacto.',
      'Orientar sobre el uso correcto de los Ecopuntos.',
      'Promover buenas prácticas de manejo y disposición.',
    ],
  },

  acciones: {
    titulo: '¿Qué vamos a hacer?',
    puntos: [
      'Campaña de sensibilización dirigida a estudiantes de INTEC.',
      'Página web informativa con toda la información sobre los Ecopuntos.',
      'Instructivo sobre qué depositar, qué no depositar y cómo utilizarlos.',
      'Código QR para acceder fácilmente a la información.',
      'Materiales visuales dentro del campus de INTEC.',
    ],
  },

  encuesta: {
    titulo: '¿Cómo obtuvimos la información?',
    participantes: 46,
    metodo: [
      'Se realizó una encuesta en línea a estudiantes del INTEC.',
      'Participaron 46 estudiantes de diferentes carreras.',
      'Los resultados nos permitieron identificar conocimientos, prácticas y expectativas sobre el manejo de los residuos electrónicos.',
    ],
    datos,
  },

  historia: {
    saltar: 'Ir directo a qué depositar',
    pista: 'Baja y sigue su historia',
    escenas: [
      {
        id: 'funciona',
        momentos: [
          { titulo: 'Este cargador te acompaña todo el semestre.', texto: porque.puntos[0] },
          { titulo: 'Hasta que un día deja de funcionar.', texto: porque.puntos[1] },
        ],
      },
      {
        id: 'cajon',
        momentos: [{ titulo: 'Y termina guardado en un cajón.', dato: datos[0] }],
      },
      {
        id: 'basura',
        momentos: [
          {
            titulo: 'O peor: en la basura común.',
            dato: datoBasura,
            texto: `${problema.puntos[1]} ${porque.puntos[2]}`,
          },
        ],
      },
      {
        id: 'nadie-sabe',
        momentos: [{ titulo: '¿Y dónde se lleva?', dato: datos[1] }],
      },
      {
        id: 'ecopunto',
        momentos: [
          { titulo: 'Para eso existe el Ecopunto.', dato: datos[2] },
          { titulo: 'Y casi todos quieren saber cómo usarlo.', dato: datos[3] },
        ],
      },
    ],
  },

  guia: {
    titulo: 'Uso correcto del Ecopunto',
    si: {
      titulo: 'Sí puedes depositar',
      puntos: [
        'Cargadores',
        'Cables',
        'Mouse',
        'Teclados pequeños',
        'Audífonos',
        'Calculadoras',
        'Memorias USB',
        'Otros accesorios electrónicos',
      ],
    },
    no: {
      titulo: 'No debes depositar',
      puntos: [
        'Restos de comida',
        'Vasos',
        'Botellas',
        'Papel sanitario',
        'Desechos orgánicos',
        'Líquidos',
        'Basura común',
      ],
    },
    contenedor: {
      titulo: '¿Cómo reconozco el contenedor?',
      puntos: [
        'Es un contenedor verde y blanco.',
        'Dice "Ecopunto INTEC" y "Pequeños aparatos, grandes cambios".',
        'Tiene el símbolo de reciclaje.',
        'Muestra qué sí puedes depositar y qué no.',
      ],
    },
  },

  // Mini quiz (parte #12): preguntas nuevas sacadas de la guía y de la encuesta, para que el equipo las revise.
  quiz: {
    titulo: 'Comprueba lo que aprendiste',
    intro: 'Cuatro preguntas rápidas sobre la guía y la encuesta.',
    sinJs: 'El quiz necesita JavaScript. Repasa la guía y los datos de la historia.',
    botones: { siguiente: 'Siguiente', otraVez: 'Repetir el quiz' },
    correcto: '¡Correcto!',
    incorrecto: 'No exactamente.',
    progreso: 'Pregunta {n} de {total}',
    resultado: 'Acertaste {aciertos} de {total}',
    mensajes: [
      { desde: 4, texto: '¡Todo correcto! Ya estás listo para usar el Ecopunto.' },
      { desde: 2, texto: '¡Bien! Un repaso rápido a la guía y quedas listo.' },
      { desde: 0, texto: 'Repasa la historia y la guía: ahí están todas las respuestas.' },
    ],
    cierre: 'Tu residuo electrónico tiene un lugar. La basura común no es uno de ellos.',
    preguntas: [
      {
        pregunta: '¿Qué porcentaje de los estudiantes encuestados no sabe dónde llevar un residuo electrónico?',
        opciones: ['39.1 %', '80.4 %', '91.3 %'],
        correcta: 1,
        porque: 'El 80.4 % no sabe dónde llevarlo: por eso existe el Ecopunto.',
      },
      {
        pregunta: '¿Cuál de estos objetos va al Ecopunto?',
        opciones: ['Una botella', 'Una memoria USB', 'Restos de comida'],
        correcta: 1,
        porque: 'Las memorias USB son accesorios electrónicos; la botella y la comida no.',
      },
      {
        pregunta: '¿Cuál es el primer paso para usar el Ecopunto?',
        opciones: [
          'Identificar si el objeto corresponde al tipo de residuo aceptado',
          'Mezclarlo con la basura común',
          'Desarmarlo antes de depositarlo',
        ],
        correcta: 0,
        porque: 'Primero identifica si el objeto es un residuo aceptado; después, sin mezclarlo, deposítalo.',
      },
      {
        pregunta: '¿Dónde NO debe terminar tu cargador viejo?',
        opciones: ['En el Ecopunto', 'En la basura común', 'En un punto de reciclaje de electrónicos'],
        correcta: 1,
        porque: 'La basura común no es lugar para residuos electrónicos.',
      },
    ],
  },

  pasos: {
    titulo: '¿Cómo utilizar el Ecopunto?',
    puntos: [
      'Identifica si el objeto corresponde al tipo de residuo aceptado.',
      'No lo mezcles con basura común.',
      'Deposítalo en el contenedor indicado.',
      'Revisa las instrucciones.',
    ],
  },

  sobre: { titulo: 'Sobre la campaña' },

  // Juego (spec 0004): textos nuevos, para que el equipo los revise.
  juego: {
    titulo: '¿Va al Ecopunto?',
    intro: 'Toca si cada objeto va al Ecopunto o no. Son 8 objetos.',
    sinJs: 'El juego necesita JavaScript. La guía de arriba tiene toda la información sobre qué depositar.',
    botones: { si: 'Va al Ecopunto', no: 'No va', siguiente: 'Siguiente', otraVez: 'Jugar otra vez' },
    correcto: '¡Correcto!',
    incorrecto: 'No exactamente.',
    progreso: '{n} de {total}',
    resultado: 'Acertaste {aciertos} de {total}',
    mensajes: [
      { desde: 8, texto: '¡Perfecto! Ya sabes usar el Ecopunto.' },
      { desde: 5, texto: '¡Muy bien! Repasa la guía para no fallar ninguno.' },
      { desde: 0, texto: 'Vale la pena repasar la guía de arriba antes de usar el Ecopunto.' },
    ],
    objetos: [
      {
        nombre: 'Cargador',
        icono: 'plug-zap',
        va: true,
        porque: 'Es un accesorio electrónico pequeño: va al Ecopunto.',
      },
      {
        nombre: 'Cable',
        icono: 'cable',
        va: true,
        porque: 'Los cables tienen cobre y plástico que se recuperan: van al Ecopunto.',
      },
      {
        nombre: 'Audífonos',
        icono: 'headphones',
        va: true,
        porque: 'Son un aparato electrónico: van al Ecopunto, nunca a la basura común.',
      },
      { nombre: 'Mouse', icono: 'mouse', va: true, porque: 'Es un accesorio electrónico: va al Ecopunto.' },
      { nombre: 'Restos de comida', icono: 'apple', va: false, porque: 'Es un desecho orgánico: no va al Ecopunto.' },
      { nombre: 'Botella', icono: 'milk', va: false, porque: 'Las botellas no son electrónicas: no van al Ecopunto.' },
      {
        nombre: 'Vaso',
        icono: 'cup-soda',
        va: false,
        porque: 'Un vaso no es un residuo electrónico: no va al Ecopunto.',
      },
      { nombre: 'Papel sanitario', icono: 'scroll-text', va: false, porque: 'Es basura común: no va al Ecopunto.' },
    ],
  },

  cierre: {
    titulo: 'Tu residuo electrónico tiene un lugar',
    subtitulo: 'La basura común no es uno de ellos',
  },

  creditos: {
    proyecto: 'Ecopunto INTEC',
    institucion: 'INTEC, Instituto Tecnológico de Santo Domingo',
    privacidad: 'Contamos las visitas sin cookies y sin guardar datos personales.',
  },
} as const satisfies Campana;

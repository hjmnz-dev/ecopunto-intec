// Textos y cifras de la campaña, tomados de la presentación de Canva "Ecopunto intec" (16 diapositivas).
// Única fuente de contenido de la página: las secciones solo leen de aquí.
// Se corrigió la ortografía del Canva (eléctronicos, a travez, Parcitiparon, práticas, facilmente).

export interface Bloque {
  titulo: string;
  puntos: readonly string[];
}

export interface Dato {
  /** Porcentaje con un decimal, tal como aparece en la encuesta. */
  valor: number;
  /** Lo que sigue a la cifra: "76.1 %" + frase. */
  frase: string;
  /** Segunda cifra o aclaración opcional. */
  detalle?: string;
  /** Pregunta de la encuesta de la que sale el dato. */
  pregunta: string;
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
  guia: {
    titulo: string;
    si: Bloque;
    no: Bloque;
  };
  pasos: Bloque;
  cierre: { titulo: string; subtitulo: string };
  creditos: { proyecto: string; institucion: string };
}

export const campana = {
  nombre: 'Ecopunto INTEC',
  lema: 'Pequeños aparatos, grandes cambios',
  subtitulo: 'Campaña de sensibilización sobre el manejo adecuado de residuos electrónicos',
  meta: {
    titulo: 'Ecopunto INTEC · Pequeños aparatos, grandes cambios',
    descripcion:
      'Campaña de sensibilización sobre el manejo adecuado de residuos electrónicos en INTEC: qué depositar en el Ecopunto y cómo usarlo.',
  },

  porque: {
    titulo: '¿Por qué este proyecto?',
    puntos: [
      'Los dispositivos electrónicos forman parte de nuestra vida universitaria.',
      'Cuando dejan de funcionar, muchas veces no sabemos qué hacer con ellos.',
      'Esto genera impactos ambientales y representa una pérdida de recursos.',
    ],
  },

  problema: {
    titulo: '¿Cuál es el problema?',
    puntos: [
      'Desconocimiento sobre qué hacer con los aparatos electrónicos que ya no se utilizan.',
      'Impacto ambiental por un manejo inadecuado de estos residuos.',
      'Oportunidad de manejar la información y orientación dentro de la comunidad universitaria.',
    ],
  },

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
    datos: [
      {
        valor: 76.1,
        frase: 'de los participantes guarda los aparatos que ya no utiliza.',
        detalle: 'Y el 39.1 % los ha desechado junto a la basura común.',
        pregunta:
          '¿Qué haces normalmente con un aparato electrónico pequeño cuando ya no lo utilizas o deja de funcionar?',
      },
      {
        valor: 80.4,
        frase: 'de los participantes no sabe dónde llevar un residuo electrónico para que sea manejado correctamente.',
        pregunta: '¿Sabes dónde llevar un residuo electrónico para que sea manejado correctamente?',
      },
      {
        valor: 78.3,
        frase: 'de los participantes definitivamente o probablemente utilizaría contenedores para residuos electrónicos dentro de INTEC.',
        pregunta:
          'Si se colocaran contenedores identificados para residuos electrónicos dentro de INTEC, ¿los utilizarías para depositar los aparatos que ya no necesitas?',
      },
      {
        valor: 91.3,
        frase: 'de los participantes calificó entre 4 y 5 la utilidad de colocar un instructivo.',
        pregunta:
          '¿Qué tan útil consideras que sería colocar un instructivo junto al punto de recolección para explicar qué residuos se pueden depositar y cómo hacerlo? (escala de 1 a 5)',
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
      puntos: ['Restos de comida', 'Vasos', 'Botellas', 'Papel sanitario', 'Desechos orgánicos', 'Líquidos', 'Basura común'],
    },
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

  cierre: {
    titulo: 'Tu residuo electrónico tiene un lugar',
    subtitulo: 'La basura común no es uno de ellos',
  },

  creditos: {
    proyecto: 'Ecopunto INTEC',
    institucion: 'INTEC, Instituto Tecnológico de Santo Domingo',
  },
} as const satisfies Campana;

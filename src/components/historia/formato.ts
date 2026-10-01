// Formato de cifras de la historia (spec 0003): un decimal, espacio fijo y "%".
const ESPACIO_FIJO = String.fromCharCode(0xa0); // U+00A0, no se parte la línea entre la cifra y %

export function formatoCifra(valor: number): string {
  return `${valor.toFixed(1)}${ESPACIO_FIJO}%`;
}

/** Cuántos de los 46 participantes representa un porcentaje. */
export function personas(valor: number, total: number): number {
  return Math.round((valor * total) / 100);
}

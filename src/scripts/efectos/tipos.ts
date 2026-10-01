import type { gsap } from 'gsap';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';

export type Gsap = typeof gsap;
export type Trigger = typeof ScrollTrigger;
export type Contexto = gsap.Context;
export type Lote = (elementos: Element[], triggers: ScrollTrigger[]) => void;

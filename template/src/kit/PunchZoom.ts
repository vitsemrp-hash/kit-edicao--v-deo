// Zoom da câmera: base alternando aberto/fechado por clipe + "punches" nas palavras-chave + "snap" nos cortes.
import { Easing, interpolate } from "remotion";
import { clamp } from "./theme";

export type Punch = { at: number; amount: number; hold: number; release?: number };
const popE = Easing.bezier(0.2, 1.3, 0.4, 1);
const relE = Easing.bezier(0.45, 0, 0.55, 1);

/** punch-in: sobe em 4 frames, segura `hold`, solta em `release` */
export const punch = (f: number, p: Punch) => {
  const { at, amount, hold, release = 8 } = p;
  if (f < at) return 0;
  if (f < at + 4) return amount * popE((f - at) / 4);
  if (f < at + 4 + hold) return amount;
  return amount * (1 - relE(Math.min(1, (f - at - 4 - hold) / release)));
};
/** "snap" no corte: começa 5% maior e assenta em 6 frames (esconde o corte seco) */
export const snap = (f: number, at: number, amount = 0.05) => (f >= at ? amount * (1 - Easing.bezier(0.16, 1, 0.3, 1)(Math.min(1, (f - at) / 6))) : 0);

/**
 * Escala da câmera no frame f.
 * base: [início, fim, escalaInicial, escalaFinal] por trecho (alternar 1.0 aberto / 1.1 fechado dá ritmo).
 */
export const cameraScale = (f: number, base: [number, number, number, number][], punches: Punch[] = [], snaps: number[] = []) => {
  const b = base.find(([a, e]) => f >= a && f < e) ?? base[base.length - 1];
  let s = b ? interpolate(f, [b[0], b[1] - 1], [b[2], b[3]], clamp) : 1;
  for (const p of punches) if (f >= p.at && f < p.at + p.hold + 30) s += punch(f, p);
  for (const c of snaps) if (f >= c && f < c + 8) s += snap(f, c);
  return s;
};

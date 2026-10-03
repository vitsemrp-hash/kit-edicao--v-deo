// Tema, fontes, área segura e funções de animação do kit.
import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, random, staticFile } from "remotion";

export const W = 1080;
export const H = 1920;
export const FPS = 30;

// Área segura Shorts/Reels: nada de texto nos 350 px de baixo, à direita de x=930 (botões) nem acima de y=140.
export const SAFE = { top: 140, bottom: H - 350, left: 60, right: 930 };

export const FONT = {
  base: "KitMontserrat", // legenda base (900)
  grot: "KitInterTight", // destaques grotesk
  ext: "KitArchivo", // caixa alta estendida (wdth 125, wght 900)
  serif: "KitPlayfair",
  script: "KitGreatVibes",
  head: "KitAnton", // Shorts
  sans: "KitInter", // UI: pills, contadores, cards
};
loadFont({ family: FONT.base, url: staticFile("fonts/Montserrat-VF.ttf"), weight: "100 900" });
loadFont({ family: FONT.grot, url: staticFile("fonts/InterTight-VF.ttf"), weight: "100 900" });
loadFont({ family: FONT.ext, url: staticFile("fonts/Archivo-VF.ttf"), weight: "100 900" });
loadFont({ family: FONT.serif, url: staticFile("fonts/PlayfairDisplay.ttf"), weight: "400 900" });
loadFont({ family: FONT.script, url: staticFile("fonts/GreatVibes-Regular.ttf"), weight: "400" });
loadFont({ family: FONT.head, url: staticFile("fonts/Anton-Regular.ttf"), weight: "400" });
loadFont({ family: FONT.sans, url: staticFile("fonts/Inter-Variable.ttf"), weight: "100 900" });

// Paleta padrão (troque por projeto). Regra: branco + UMA cor de acento; ciano só para dados/números.
export const C = {
  bg: "#0A0A0C",
  panel: "#141418",
  white: "#FFFFFF",
  accent: "#FFD21F",
  data: "#3FE0FF",
  grey: "#9A9AA2",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const expo = Easing.bezier(0.16, 1, 0.3, 1);
const EB = Easing.bezier(0.33, 0, 0.2, 1);

/** pop elástico 0.01 → 1.15 → 0.92 → 1 (k = velocidade) */
export const pop = (f: number, at: number, k = 1) =>
  interpolate(f - at, [0, 8 * k, 16 * k, 24 * k], [0.01, 1.15, 0.92, 1], { ...clamp, easing: EB });
export const popRot = (f: number, at: number, a = -35) => interpolate(f - at, [0, 8, 16, 24], [a, 5, -2, 0], { ...clamp, easing: EB });
export const fadeIn = (f: number, at: number, d = 6) => interpolate(f - at, [0, d], [0, 1], clamp);
/** sobe com micro-overshoot */
export const riseY = (f: number, at: number, amp = 150) => interpolate(f - at, [0, 8, 16, 24], [amp, -8, 3, 0], { ...clamp, easing: EB });
export const ease = (f: number, a: number, b: number, v0: number, v1: number, e = Easing.bezier(0.42, 0, 0.58, 1)) =>
  interpolate(f, [a, b], [v0, v1], { ...clamp, easing: e });
/** tremida que decai */
export const shake = (f: number, at: number, dur = 9, amp = 14) => {
  const t = f - at;
  if (t < 0 || t > dur) return { x: 0, y: 0 };
  const k = (1 - t / dur) * amp;
  return { x: (random(`sx${at}-${t}`) - 0.5) * 2 * k, y: (random(`sy${at}-${t}`) - 0.5) * 2 * k };
};
/** "slam": 2.4 → 0.9 → 1.05 → 1 em 9 frames */
export const slam = (f: number, at: number, from = 2.4) =>
  interpolate(f - at, [0, 3, 6, 9], [from, 0.9, 1.05, 1], { ...clamp, easing: Easing.out(Easing.quad) });

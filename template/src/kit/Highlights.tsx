// Destaques editoriais (técnicas do anúncio de referência; ver docs/client_ad_text_techniques.md).
// Regras: SEM contorno, sobre fundo escurecido, 1–3 palavras, uma cor de acento, saída em corte seco,
// e o bloco continua vivo (escala lenta) depois da entrada. Esconda a legenda base no intervalo do destaque.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, clamp, expo, shake, slam } from "./theme";

const EXT: React.CSSProperties = { fontFamily: FONT.ext, fontVariationSettings: "'wdth' 125, 'wght' 900", fontWeight: 900 };
const k = (f: number, a: number, d: number, e = expo) => interpolate(f, [a, a + d], [0, 1], { ...clamp, easing: e });

/** escurece o vídeo atrás do destaque (gradiente para preto na região do texto) */
export const Backdrop: React.FC<{ from: number; to: number; y?: number; strength?: number }> = ({ from, to, y = 960, strength = 0.75 }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const o = interpolate(f, [from, from + 4], [0, strength], clamp);
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 30% at 50% ${(y / 1920) * 100}%, rgba(0,0,0,${o}) 40%, rgba(0,0,0,${o * 0.5}) 75%, rgba(0,0,0,0) 100%)` }} />;
};

type HL = { from: number; to: number; y?: number };
const live = (f: number, from: number, to: number) => interpolate(f, [from, to], [1, 1.05], clamp); // "vida contínua"

/** A. palavras sobem uma a uma (opacidade 30→100%, y +10→0 em 4 frames) */
export const WordRise: React.FC<HL & { words: { t: string; at: number; accent?: boolean }[]; size?: number }> = ({ from, to, y = 960, words, size = 130 }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: y, translate: "0 -50%", display: "flex", justifyContent: "center", gap: size * 0.25, scale: live(f, from, to) }}>
      {words.map((w, i) => (
        <span key={i} style={{ ...EXT, fontSize: size, color: w.accent ? C.accent : C.white, lineHeight: 1,
          opacity: f < w.at ? 0 : interpolate(f, [w.at, w.at + 4], [0.3, 1], clamp), translate: `0 ${interpolate(f, [w.at, w.at + 4], [10, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px` }}>{w.t}</span>
      ))}
    </div>
  );
};

/** B. barra de acento cresce e revela o texto vazado (técnica "HOJE") */
export const BarReveal: React.FC<HL & { text: string; at: number; size?: number }> = ({ from, to, y = 960, text, at, size = 150 }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const p = k(f, at, 22);
  const w = 980 * p;
  const textP = k(f, at + 5, 10);
  return (
    <div style={{ position: "absolute", left: 50, top: y, translate: "0 -50%", height: size * 1.15, width: w, background: C.accent, overflow: "hidden", scale: live(f, from, to), transformOrigin: "0 50%" }}>
      <div style={{ ...EXT, position: "absolute", left: 40, top: "50%", translate: "0 -50%", fontSize: size, lineHeight: 1, color: C.bg, whiteSpace: "nowrap",
        clipPath: `inset(0 ${100 - textP * 100}% 0 0)` }}>{text}</div>
    </div>
  );
};

/** C. revelação com desfoque + preenchimento em gradiente (branco → cinza), palavras em escada */
export const BlurReveal: React.FC<HL & { words: string[]; at: number; size?: number; stagger?: number }> = ({ from, to, y = 960, words, at, size = 170, stagger = 2 }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, translate: "0 -50%", display: "flex", flexDirection: "column", scale: live(f, from, to), transformOrigin: "0 50%" }}>
      {words.map((w, i) => {
        const p = k(f, at + i * stagger, 13);
        return (
          <span key={i} style={{ fontFamily: FONT.grot, fontWeight: 800, fontSize: size, lineHeight: 0.85, letterSpacing: "-0.03em", marginLeft: i * 90,
            background: "linear-gradient(90deg, #fff 0%, #fff 35%, rgba(255,255,255,0.42) 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
            filter: `blur(${(1 - p) * 16}px)`, opacity: 0.4 + 0.6 * p }}>{w}</span>
        );
      })}
    </div>
  );
};

/** F. sobe de trás de uma linha invisível (máscara na base) em 4 frames */
export const MaskRise: React.FC<HL & { text: string; at: number; size?: number; color?: string; sub?: { text: string; at: number } }> = ({ from, to, y = 960, text, at, size = 160, color = C.white, sub }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const rise = (a: number, h: number) => interpolate(f, [a, a + 4], [h, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: y, translate: "0 -50%", display: "flex", flexDirection: "column", alignItems: "center", scale: live(f, from, to) }}>
      <div style={{ overflow: "hidden", padding: "0 20px" }}>
        <div style={{ ...EXT, fontSize: size, lineHeight: 1.05, color, translate: `0 ${rise(at, size * 1.1)}px` }}>{text}</div>
      </div>
      {sub ? (
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontFamily: FONT.grot, fontWeight: 600, fontSize: size * 0.36, color: C.accent, translate: `0 ${rise(sub.at, size * 0.5)}px` }}>{sub.text}</div>
        </div>
      ) : null}
    </div>
  );
};

/** linha inteira entra deslizando da direita (expo, 9 frames) */
export const SlideIn: React.FC<HL & { lines: { t: string; at: number; accent?: boolean }[]; size?: number }> = ({ from, to, y = 960, lines, size = 120 }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  return (
    <div style={{ position: "absolute", left: 80, top: y, translate: "0 -50%", display: "flex", flexDirection: "column", gap: 6, scale: live(f, from, to), transformOrigin: "0 50%" }}>
      {lines.map((l, i) => (
        <span key={i} style={{ ...EXT, fontSize: size, lineHeight: 1, color: l.accent ? C.accent : C.white, opacity: f >= l.at ? 1 : 0,
          translate: `${interpolate(f, [l.at, l.at + 9], [1100, 0], { ...clamp, easing: expo })}px 0` }}>{l.t}</span>
      ))}
    </div>
  );
};

/** eco tonal empilhado (a palavra repete 3x em tons de cinza, a última na cor de acento) */
export const EchoStack: React.FC<HL & { text: string; at: number; size?: number }> = ({ from, to, y = 960, text, at, size = 150 }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const tones = ["rgba(255,255,255,0.18)", "rgba(255,255,255,0.4)", C.accent];
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: y, translate: "0 -50%", display: "flex", flexDirection: "column", alignItems: "center", scale: live(f, from, to) }}>
      {tones.map((c, i) => (
        <span key={i} style={{ ...EXT, fontSize: size, lineHeight: 0.92, color: c, opacity: f >= at + i * 3 ? 1 : 0, translate: `0 ${interpolate(f, [at + i * 3, at + i * 3 + 6], [40, 0], { ...clamp, easing: expo })}px` }}>{text}</span>
      ))}
    </div>
  );
};

/** "slam" de impacto em pílula (bom para gancho de Shorts) */
export const SlamCard: React.FC<HL & { lines: string[]; at: number; size?: number; rotate?: number }> = ({ from, to, y = 1250, lines, at, size = 96, rotate = -4 }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const sh = shake(f, at + 3, 8, 14);
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: y, translate: "0 -50%", display: "flex", justifyContent: "center" }}>
      <div style={{ scale: slam(f, at), rotate: `${rotate}deg`, translate: `${sh.x}px ${sh.y}px`, background: C.accent, borderRadius: 34, padding: "22px 44px", boxShadow: "0 16px 50px rgba(0,0,0,0.65)", textAlign: "center" }}>
        {lines.map((l, i) => <div key={i} style={{ fontFamily: FONT.head, fontSize: size, color: C.bg, lineHeight: 1.02 }}>{l}</div>)}
      </div>
    </div>
  );
};

// Cena só de motion (a pessoa some, a voz continua): fundo animado + conteúdo próprio.
// Exemplo pronto: Checklist (itens entram com pop elástico e o check se desenha).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, clamp, pop, popRot, riseY } from "./theme";
import { Check } from "./UI";

/** fundo escuro vivo: gradiente radial que respira + grade sutil que desliza */
export const MotionBG: React.FC<{ tint?: string }> = ({ tint = C.accent }) => {
  const f = useCurrentFrame();
  const r = 55 + Math.sin(f / 18) * 6;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${tint}22 0%, rgba(0,0,0,0) ${r}%)` }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.04) 2px, transparent 2px)",
        backgroundSize: "90px 90px", backgroundPosition: `0 ${f * 1.2}px` }} />
    </AbsoluteFill>
  );
};

/** wrapper: entra com íris circular e mostra a cena só dentro de [from, to) (frames globais) */
export const MotionScene: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const r = interpolate(f, [from, from + 9], [0, 1300], clamp);
  return <AbsoluteFill style={{ clipPath: `circle(${r}px at 540px 860px)` }}>{children}</AbsoluteFill>;
};

export const Checklist: React.FC<{ title: string; items: { t: string; at: number }[]; titleAt: number }> = ({ title, items, titleAt }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <MotionBG />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 420, textAlign: "center", fontFamily: FONT.head, fontSize: 110, color: C.white, translate: `0 ${riseY(f, titleAt, 80)}px`, opacity: f >= titleAt ? 1 : 0 }}>{title}</div>
      <div style={{ position: "absolute", left: 170, top: 640, display: "flex", flexDirection: "column", gap: 44 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 34, opacity: f >= it.at ? 1 : 0 }}>
            <div style={{ scale: pop(f, it.at, 0.6), rotate: `${popRot(f, it.at)}deg` }}><Check size={110} draw={interpolate(f, [it.at + 4, it.at + 12], [0, 1], clamp)} /></div>
            <span style={{ fontFamily: FONT.ext, fontVariationSettings: "'wdth' 125, 'wght' 900", fontSize: 86, color: C.white, translate: `${interpolate(f, [it.at, it.at + 8], [60, 0], clamp)}px 0` }}>{it.t}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

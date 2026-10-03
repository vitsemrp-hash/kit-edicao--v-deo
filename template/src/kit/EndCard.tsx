// Card final: pergunta para comentar (palavras acendem junto com a fala), coração, campo de comentário
// e botão SEGUIR → SEGUINDO com toque de pata. Todos os frames são GLOBAIS.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, clamp, ease, fadeIn, pop } from "./theme";
import { Check, Paw } from "./UI";

export type EndCardProps = {
  from: number; // card aparece
  words: { t: string; at: number; accent?: boolean }[]; // pergunta, palavra a palavra (use os frames do EDL)
  heartAt: number;
  followAt: number; // botão aparece
  tapAt: number; // pata toca: vira SEGUINDO
  handle?: string;
  exitAt?: number; // card voa para cima (entrega para o loop)
  y?: number;
};

export const EndCard: React.FC<EndCardProps> = ({ from, words, heartAt, followAt, tapAt, handle = "@seucanal", exitAt, y = 520 }) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  const ex = exitAt !== undefined ? ease(f, exitAt, exitAt + 9, 0, 1, Easing.in(Easing.cubic)) : 0;
  if (ex >= 1) return null;
  const followed = f >= tapAt + 2;
  const pawY = ease(f, tapAt - 10, tapAt, 260, 0, Easing.out(Easing.cubic)) + ease(f, tapAt + 3, tapAt + 12, 0, 300, Easing.in(Easing.cubic));
  const press = interpolate(f - tapAt, [0, 2, 6], [1, 0.88, 1], clamp);
  const ring = f - (tapAt + 2);
  return (
    <AbsoluteFill style={{ opacity: 1 - ex, scale: 1 - ex * 0.7, translate: `0 ${-ex * 500}px` }}>
      <div style={{ position: "absolute", left: 80, top: y, width: 840, background: "#F7F4EC", borderRadius: 40, padding: "36px 40px 30px", boxShadow: "0 24px 70px rgba(0,0,0,0.6)", scale: pop(f, from, 0.6), border: `6px solid ${C.accent}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 84, height: 84, borderRadius: 42, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Paw size={56} /></div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 36, color: "#222" }}>{handle} <span style={{ fontWeight: 500, color: "#888" }}>• agora</span></div>
        </div>
        <div style={{ marginTop: 22, fontFamily: FONT.head, fontSize: 84, lineHeight: 1.08, color: C.bg, display: "flex", flexWrap: "wrap", columnGap: 20 }}>
          {words.map((w, i) => <span key={i} style={{ opacity: f >= w.at - 1 ? 1 : 0.12, color: w.accent ? "#0090A8" : C.bg }}>{w.t}</span>)}
          <span style={{ opacity: f >= words[words.length - 1].at + 6 ? 1 : 0, translate: `0 ${Math.sin(f / 4) * 6}px` }}>👇</span>
        </div>
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 26, fontFamily: FONT.sans, fontWeight: 700, fontSize: 34, color: "#666" }}>
          <span style={{ scale: pop(f, heartAt, 0.5), display: "inline-block", color: "#E5484D", fontSize: 46 }}>♥</span>
          <span style={{ opacity: fadeIn(f, heartAt) }}>{f >= heartAt ? Math.round(interpolate(f, [heartAt, heartAt + 30], [1, 128], clamp)) : ""}</span>
          <span>Responder</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 80, top: y + 470, width: 840, height: 100, borderRadius: 50, background: "rgba(255,255,255,0.14)", border: "3px solid rgba(255,255,255,0.35)", boxSizing: "border-box",
        display: "flex", alignItems: "center", padding: "0 36px", fontFamily: FONT.sans, fontWeight: 600, fontSize: 36, color: "rgba(255,255,255,0.75)", opacity: fadeIn(f, from + 12) }}>
        Comenta o seu palpite…<span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: C.accent, marginLeft: 4 }}>|</span>
      </div>
      {f >= followAt ? (
        <div style={{ position: "absolute", left: 0, width: 1080, top: y + 660, translate: "0 -50%", display: "flex", justifyContent: "center" }}>
          <div style={{ scale: pop(f, followAt, 0.6) * press, background: followed ? C.bg : C.accent, color: followed ? C.white : C.bg, border: `6px solid ${C.accent}`, borderRadius: 999, padding: "16px 48px",
            fontFamily: FONT.head, fontSize: 64, lineHeight: 1, display: "flex", alignItems: "center", gap: 16 }}>
            {followed ? <Check size={52} color={C.bg} draw={interpolate(f, [tapAt + 2, tapAt + 9], [0, 1], clamp)} /> : <Paw size={54} color={C.bg} />}
            {followed ? "SEGUINDO" : "SEGUIR"}
          </div>
        </div>
      ) : null}
      {f >= tapAt - 10 && f < tapAt + 12 ? <div style={{ position: "absolute", left: 640, top: y + 710 + pawY, translate: "-50% -50%", rotate: "-18deg" }}><Paw size={150} color={C.white} style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.6))" }} /></div> : null}
      {ring >= 0 && ring < 30 ? <div style={{ position: "absolute", left: 540, top: y + 660, translate: "-50% -50%", width: 40 + ring * 18, height: 40 + ring * 18, borderRadius: "50%", border: `6px solid ${C.accent}`, opacity: 1 - ring / 30 }} /> : null}
    </AbsoluteFill>
  );
};

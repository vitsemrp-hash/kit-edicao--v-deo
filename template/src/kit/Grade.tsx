// Acabamento: vinheta, faixa escura na zona da legenda, grão (opcional) e assinatura de marca no início.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, clamp, pop } from "./theme";
import { Paw } from "./UI";

export const Grade: React.FC<{ grain?: number; captionBand?: boolean }> = ({ grain = 0.06, captionBand = true }) => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
      {captionBand ? <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 56%, rgba(0,0,0,0.4) 66%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0) 90%)" }} /> : null}
      {grain > 0 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: grain, mixBlendMode: "overlay" }}>
          <filter id="kitgrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(f / 2) % 50} /></filter>
          <rect width="1080" height="1920" filter="url(#kitgrain)" />
        </svg>
      ) : null}
    </>
  );
};

/** assinatura (marca) no canto superior esquerdo, só no começo */
export const Signature: React.FC<{ name: string; accent: string; until?: number }> = ({ name, accent, until = 90 }) => {
  const f = useCurrentFrame();
  if (f >= until) return null;
  return (
    <div style={{ position: "absolute", left: 70, top: 150, display: "flex", alignItems: "center", gap: 16, opacity: interpolate(f, [until - 8, until], [1, 0], clamp), scale: pop(f, 0, 0.7), transformOrigin: "0 50%" }}>
      <Paw size={60} />
      <span style={{ fontFamily: FONT.head, fontSize: 44, color: C.white, WebkitTextStroke: "6px #000", paintOrder: "stroke fill" }}>{name} <span style={{ color: C.accent }}>{accent}</span></span>
    </div>
  );
};

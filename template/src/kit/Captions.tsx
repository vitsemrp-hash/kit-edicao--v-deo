// Legendas geradas por scripts/make_captions.py.
//  - BaseCaptions: legenda base (Montserrat Black, branca com contorno preto), 1–2 linhas.
//  - WordCaptions: palavra a palavra estilo Shorts (Anton), palavra-chave na cor de acento.
// As duas escondem o texto nas faixas `hide` (onde entra um destaque, cena motion ou card final).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, clamp, pop } from "./theme";

export type CapWord = { t: string; s: number; key: boolean };
export type CapChunk = { start: number; end: number; size: number; lines: CapWord[][] };
export type CapData = { style: string; chunks: CapChunk[] };

const visible = (data: CapData, f: number, hide: [number, number][]) => {
  if (hide.some(([a, b]) => f >= a && f < b)) return null;
  return data.chunks.find((c) => f >= c.start && f < c.end) ?? null;
};

export const BaseCaptions: React.FC<{ data: CapData; y?: number; hide?: [number, number][]; accentKeys?: boolean }> = ({ data, y = 1430, hide = [], accentKeys = false }) => {
  const f = useCurrentFrame();
  const c = visible(data, f, hide);
  if (!c) return null;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, width: 1080, top: y, translate: "0 -50%", display: "flex", flexDirection: "column", alignItems: "center",
        fontFamily: FONT.base, fontWeight: 900, fontSize: c.size, lineHeight: 1, textTransform: "uppercase" }}>
        {c.lines.map((line, li) => (
          <div key={li} style={{ display: "flex", justifyContent: "center", whiteSpace: "nowrap", paddingTop: li ? "0.06em" : 0 }}>
            {line.map((w, wi) => (
              <span key={wi} style={{
                display: "inline-block", margin: "0 0.13em", color: accentKeys && w.key ? C.accent : C.white,
                WebkitTextStroke: "13px #000", paintOrder: "stroke fill", textShadow: "0px 5px 14px rgba(0,0,0,0.55)",
                opacity: interpolate(f, [w.s - 1, w.s + 1], [0, 1], clamp),
                scale: interpolate(f, [w.s - 1, w.s + 3], [0.93, 1], { ...clamp, easing: Easing.bezier(0.2, 0.9, 0.3, 1) }),
              }}>{w.t}</span>
            ))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const WordCaptions: React.FC<{ data: CapData; y?: number; hide?: [number, number][]; font?: string }> = ({ data, y = 1330, hide = [], font = FONT.head }) => {
  const f = useCurrentFrame();
  const c = visible(data, f, hide);
  if (!c) return null;
  const words = c.lines.flat();
  const size = c.size;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 60, width: 840, top: y, translate: "0 -50%", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline",
        columnGap: size * 0.22, fontFamily: font, fontSize: size, lineHeight: 1.08 }}>
        {words.map((w, i) => {
          const on = f >= w.s - 1;
          const sc = w.key ? pop(f, w.s - 1, 0.5) : interpolate(f, [w.s - 1, w.s + 3], [0.86, 1], clamp);
          return (
            <span key={i} style={{ display: "inline-block", color: w.key ? C.accent : C.white, opacity: on ? 1 : 0, scale: on ? sc : 1,
              WebkitTextStroke: `${Math.round(size * 0.07)}px #000`, paintOrder: "stroke fill", textShadow: "0 8px 22px rgba(0,0,0,0.6)" }}>{w.t}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

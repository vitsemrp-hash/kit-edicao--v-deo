// Alternância tela cheia ↔ split (card arredondado em cima 40% + pessoa embaixo 60%).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp } from "./theme";

export const PANEL_H = 768; // 40% de 1920
export const CARD = { x: 48, y: 48, w: 984, h: 668, r: 44 }; // card arredondado sobre preto (margem 48, raio 44)

/** quanto de split no frame f (0 = tela cheia, 1 = split). ranges: [início, fim] de cada trecho em split */
export const splitAmount = (f: number, ranges: [number, number][], soft = 0) => {
  for (const [a, b] of ranges) {
    if (f >= a && f < b) {
      if (!soft) return 1;
      return Math.min(interpolate(f, [a, a + soft], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) }), 1);
    }
  }
  return 0;
};

/** imagem dentro do card, com push-in lento (nunca parada) */
export const ImageCard: React.FC<{ src: string; dur: number; z?: [number, number] }> = ({ src, dur, z = [1, 1.06] }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Img src={staticFile(src)} style={{ width: CARD.w, height: CARD.h, objectFit: "cover", scale: interpolate(f, [0, dur - 1], z, clamp) }} />
    </AbsoluteFill>
  );
};

export type CardSlot = { src: string; from: number; to: number; z?: [number, number] };

/**
 * Envolve o vídeo da pessoa: em split ela desce para os 60% de baixo (com `offset` para subir o rosto)
 * e o card arredondado ocupa o topo; as transições são cortes secos (ou `soft` frames de deslize).
 */
export const SplitLayout: React.FC<{ split: number; cards: CardSlot[]; offset?: number; children: React.ReactNode }> = ({ split, cards, offset = 330, children }) => {
  const top = split * PANEL_H;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div style={{ position: "absolute", left: 0, top, width: 1080, height: 1920 - top, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, translate: `0 ${-offset * split}px` }}>{children}</div>
        {split > 0.001 ? <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 150, opacity: split, background: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.75) 30%, rgba(0,0,0,0) 100%)" }} /> : null}
      </div>
      {split > 0.001 ? (
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: CARD.r, overflow: "hidden", backgroundColor: "#000", translate: `0 ${(split - 1) * (PANEL_H + 20)}px` }}>
          {cards.map((c) => (
            <Sequence key={c.src + c.from} from={c.from} durationInFrames={c.to - c.from} layout="absolute-fill">
              <ImageCard src={c.src} dur={c.to - c.from} z={c.z} />
            </Sequence>
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

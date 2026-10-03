// Loop perfeito: nos últimos frames, mostra o MESMO quadro do frame 0 (mesmo trecho da gravação,
// mesma escala), com um zoom que termina exatamente na escala do frame 0. Ao reiniciar, não há salto.
import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp } from "./theme";

export const LoopBridge: React.FC<{
  from: number; // frame global em que a ponte começa (ex.: duração - 15)
  to: number; // duração total
  src: string; // vídeo da gravação
  srcStart: number; // segundo da gravação mostrado no frame 0 (src_in do 1º clipe)
  fps: number;
  scale0: number; // escala da câmera no frame 0
  zoomFrom?: number; // escala no começo da ponte (ex.: 1.35 x scale0)
  origin?: string;
}> = ({ from, to, src, srcStart, fps, scale0, zoomFrom, origin = "50% 35%" }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const n = to - from;
  // termina 1 frame ANTES do frame 0 da gravação, para o próximo frame (0) ser a continuação natural
  const start = Math.max(0, Math.round(srcStart * fps) - n);
  const s = interpolate(f, [from, to - 1], [zoomFrom ?? scale0 * 1.35, scale0], { ...clamp, easing: Easing.bezier(0.5, 0, 0.75, 0) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={{ scale: s, transformOrigin: origin }}>
        <Sequence from={from} layout="absolute-fill">
          <OffthreadVideo src={staticFile(src)} trimBefore={start} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Vídeo cortado pelo EDL: cada clipe é um trecho [src_in, src_out] da gravação, colado no anterior.
// O áudio da gravação fica mudo aqui: use a voz já cortada e tratada (voice.wav / master.wav).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Edl } from "./edl";

export type CamFn = (f: number) => { scale: number; x?: number; y?: number; rot?: number; origin?: string };

export const CutVideo: React.FC<{ edl: Edl; src: string; cam?: CamFn; style?: React.CSSProperties; lastFrame?: number }> = ({ edl, src, cam, style, lastFrame }) => {
  const f = useCurrentFrame();
  const c = cam ? cam(f) : { scale: 1 };
  const end = lastFrame ?? edl.durationInFrames;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          scale: c.scale,
          translate: `${c.x ?? 0}px ${c.y ?? 0}px`,
          rotate: `${c.rot ?? 0}deg`,
          transformOrigin: c.origin ?? "50% 35%",
          ...style,
        }}
      >
        {edl.clips.map((clip, i) => {
          const next = i + 1 < edl.clips.length ? edl.clips[i + 1].cutFrame : end;
          const dur = Math.max(1, next - clip.cutFrame);
          return (
            <Sequence key={i} from={clip.cutFrame} durationInFrames={dur} layout="absolute-fill">
              <OffthreadVideo src={staticFile(src)} trimBefore={Math.round(clip.src_in * edl.fps)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

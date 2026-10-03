// Entradas de cena (use dentro de <Sequence>; o frame é local). Varie entre vídeos!
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "./theme";

export type Tr = "cut" | "punch" | "blur" | "wipe" | "whip" | "iris" | "rise";
const EIO = Easing.bezier(0.42, 0, 0.58, 1);

export const Enter: React.FC<{ tr: Tr; children: React.ReactNode }> = ({ tr, children }) => {
  const t = useCurrentFrame();
  let st: React.CSSProperties = {};
  if (tr === "punch") st = { scale: interpolate(t, [0, 7], [1.22, 1], { ...clamp, easing: Easing.out(Easing.cubic) }), filter: `blur(${interpolate(t, [0, 5], [10, 0], clamp)}px)` };
  if (tr === "blur") st = { opacity: interpolate(t, [0, 5], [0, 1], clamp), filter: `blur(${interpolate(t, [0, 6], [18, 0], clamp)}px)` };
  if (tr === "wipe") {
    const x = -340 + interpolate(t, [0, 8], [0, 1], { ...clamp, easing: EIO }) * 1760;
    st = { clipPath: `polygon(0 0, ${x + 340}px 0, ${x}px 1920px, 0 1920px)` };
  }
  if (tr === "whip") st = { translate: `${interpolate(t, [0, 6], [760, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px 0`, filter: `blur(${interpolate(t, [0, 6], [14, 0], clamp)}px)` };
  if (tr === "iris") st = { clipPath: `circle(${interpolate(t, [0, 9], [0, 1300], { ...clamp, easing: Easing.in(Easing.quad) })}px at 540px 820px)` };
  if (tr === "rise") st = { translate: `0 ${interpolate(t, [0, 7], [700, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px` };
  return <AbsoluteFill style={st}>{children}</AbsoluteFill>;
};

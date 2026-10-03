// Peças de interface: ícones (pata, check), pílula, contador.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, clamp, pop } from "./theme";

export const Paw: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({ size, color = C.accent, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <ellipse cx="50" cy="66" rx="24" ry="20" fill={color} />
    <ellipse cx="24" cy="40" rx="10" ry="13" fill={color} transform="rotate(-20 24 40)" />
    <ellipse cx="41" cy="26" rx="10" ry="13" fill={color} transform="rotate(-6 41 26)" />
    <ellipse cx="59" cy="26" rx="10" ry="13" fill={color} transform="rotate(6 59 26)" />
    <ellipse cx="76" cy="40" rx="10" ry="13" fill={color} transform="rotate(20 76 40)" />
  </svg>
);

/** check redondo; draw 0→1 desenha o traço */
export const Check: React.FC<{ size: number; color?: string; bg?: string; draw?: number }> = ({ size, color = C.bg, bg = C.accent, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill={bg} />
    <path d="M28 52 L44 67 L73 35" fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
  </svg>
);

export const Pill: React.FC<{ text: string; bg?: string; fg?: string; size?: number; paw?: boolean; font?: string; style?: React.CSSProperties }> = ({
  text, bg = C.panel, fg = C.white, size = 44, paw = false, font = FONT.sans, style,
}) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.35, background: bg, color: fg, borderRadius: 999, padding: `${size * 0.32}px ${size * 0.62}px`,
    fontFamily: font, fontWeight: font === FONT.sans ? 800 : 400, fontSize: size, lineHeight: 1, whiteSpace: "nowrap", boxShadow: "0 10px 30px rgba(0,0,0,0.45)", ...style }}>
    {paw ? <Paw size={size * 0.95} color={bg === C.accent ? C.bg : C.accent} /> : null}
    <span>{text}</span>
  </div>
);

/** pílula que entra com pop no frame `at` e sai em corte seco no `to` */
export const PillPop: React.FC<{ at: number; to: number; x?: number; y: number; text: string; accent?: boolean; size?: number }> = ({ at, to, x, y, text, accent, size = 50 }) => {
  const f = useCurrentFrame();
  if (f < at || f >= to) return null;
  return (
    <div style={{ position: "absolute", top: y, left: x ?? 0, width: x === undefined ? 1080 : undefined, display: "flex", justifyContent: "center", translate: "0 -50%", scale: pop(f, at, 0.6) }}>
      <Pill text={text} size={size} paw bg={accent ? C.accent : C.panel} fg={accent ? C.bg : C.white} font={FONT.head} />
    </div>
  );
};

/**
 * Contador: cada passo {at, value} conta do valor anterior até o novo em `roll` frames, com "bump".
 * Use para placares (Shorts) ou passos 01/03 (Reels).
 */
export const Counter: React.FC<{ steps: { at: number; value: number }[]; from: number; to: number; label: string; y?: number; pad?: number; chip?: string }> = ({
  steps, from, to, label, y = 300, pad = 0, chip,
}) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  let v = 0, prev = 0, hit = -99;
  for (const s of steps) {
    if (f >= s.at) {
      v = Math.round(interpolate(f, [s.at, s.at + 12], [prev, s.value], { ...clamp, easing: Easing.out(Easing.quad) }));
      hit = s.at + 12;
    }
    if (f >= s.at + 12) prev = s.value;
  }
  const bump = interpolate(f - hit, [0, 3, 8], [1.25, 0.95, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 540, top: y, translate: "-50% -50%", scale: pop(f, from, 0.6), height: 190, padding: "0 46px", background: "#0E0E12", borderRadius: 34,
      border: `6px solid ${C.accent}`, display: "flex", alignItems: "center", gap: 26, boxShadow: "0 14px 40px rgba(0,0,0,0.6)" }}>
      {chip ? <div style={{ background: C.accent, color: C.bg, fontFamily: FONT.head, fontSize: 56, lineHeight: 1, padding: "12px 20px", borderRadius: 16, rotate: "-4deg" }}>{chip}</div> : null}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontFamily: FONT.head, fontSize: 112, color: C.data, lineHeight: 0.95, scale: bump, transformOrigin: "0 50%" }}>{String(v).padStart(pad, "0")}</span>
        <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 28, color: C.white, letterSpacing: 2 }}>{label}</span>
      </div>
    </div>
  );
};

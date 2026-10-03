/**
 * Composição de EXEMPLO — mostra todos os blocos do kit num vídeo de 13,7 s.
 * Tudo é ancorado nos frames do EDL (edl.json), gerado pelos scripts de áudio:
 *   detect_cuts.py → transcribe.py → build_edl.py → make_captions.py
 * Para um vídeo novo: copie esta pasta, troque os JSONs e a mídia, e reescreva o roteiro visual (timeline abaixo).
 */
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  BarReveal, BaseCaptions, C, CapData, Checklist, Counter, CutVideo, Edl, EndCard, Grade, LoopBridge, MotionScene,
  PillPop, Signature, SlamCard, SplitLayout, WordCaptions, cameraScale, clamp, cutFrames, splitAmount, wordFrame,
} from "../kit";
import edlJson from "./edl.json";
import capBase from "./captions_base.json";
import capWords from "./captions_words.json";

const edl = edlJson as Edl;
const VIDEO = "exemplo/gravacao_exemplo.mp4";
const CUTS = cutFrames(edl); // [0, 66, 153, 225, 283]
const w = (t: string, n = 0) => wordFrame(edl, t, n);

// ---------- roteiro visual (frames globais) ----------
export const END_AT = 395; // card final sai
export const DURATION = END_AT + 15; // + ponte de loop (15 frames)
const SPLIT: [number, number][] = [[CUTS[1], CUTS[2]]]; // trecho em split com card
const MOTION: [number, number] = [CUTS[3], CUTS[4]]; // cena só de motion
const WORDCAPS: [number, number] = [CUTS[2], CUTS[3]]; // trecho com legenda palavra a palavra

const BASE: [number, number, number, number][] = [
  [0, CUTS[1], 1.0, 1.05],
  [CUTS[1], CUTS[2], 1.08, 1.1],
  [CUTS[2], CUTS[3], 1.0, 1.04],
  [CUTS[3], CUTS[4], 1.1, 1.12],
  [CUTS[4], DURATION, 1.0, 1.06],
];
const PUNCHES = [
  { at: w("exemplo"), amount: 0.1, hold: 8 },
  { at: w("exatamente"), amount: 0.12, hold: 10 },
  { at: w("palavra"), amount: 0.1, hold: 8 },
  { at: w("cortes"), amount: 0.08, hold: 8 },
];
const cam = (f: number) => ({ scale: cameraScale(f, BASE, PUNCHES, CUTS.slice(1)) });

export const Exemplo: React.FC = () => {
  const f = useCurrentFrame();
  const split = splitAmount(f, SPLIT);
  const flash = interpolate(f, [0, 1, 4], [0.35, 0.35, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* 1. vídeo cortado na fala + split alternado com card arredondado */}
      <SplitLayout split={split} cards={[{ src: "exemplo/card_exemplo.jpg", from: CUTS[1], to: CUTS[2] }]}>
        <CutVideo edl={edl} src={VIDEO} cam={cam} lastFrame={END_AT} />
      </SplitLayout>
      <Grade />

      {/* 2. gancho no frame 0: card que bate na tela */}
      <SlamCard from={0} to={22} at={0} lines={["CORTE", "NA FALA"]} y={900} size={120} />
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />

      {/* 3. destaque editorial (sem contorno) */}
      <BarReveal from={w("kit")} to={CUTS[1]} at={w("kit")} text="KIT DE EDIÇÃO" y={760} size={96} />

      {/* 4. legendas: base fora dos destaques; palavra a palavra no trecho WORDCAPS */}
      <BaseCaptions data={capBase as CapData} hide={[[0, 22], [WORDCAPS[0], DURATION]]} />
      <WordCaptions data={capWords as CapData} hide={[[0, WORDCAPS[0]], [WORDCAPS[1], DURATION]]} />

      {/* 5. pílula + contador */}
      <PillPop at={w("corte")} to={CUTS[2]} y={640} text="CORTE NA FALA" accent />
      <Counter from={CUTS[2]} to={CUTS[3]} label="CORTES ATÉ AQUI" steps={[{ at: CUTS[2] + 2, value: 2 }]} y={300} />

      {/* 6. cena só de motion (íris) */}
      <MotionScene from={MOTION[0]} to={MOTION[1]}>
        <Checklist title="O KIT FAZ" titleAt={MOTION[0] + 2} items={[
          { t: "CORTE", at: w("destaques") },
          { t: "LEGENDA", at: w("entram") },
          { t: "MOVIMENTO", at: w("movimento") },
        ]} />
      </MotionScene>

      {/* 7. card final: pergunta para comentário + SEGUIR */}
      <EndCard
        from={CUTS[4]}
        words={[
          { t: "QUANTOS", at: w("quantos") },
          { t: "CORTES", at: w("cortes"), accent: true },
          { t: "VOCÊ", at: w("voce") },
          { t: "CONTOU?", at: w("contou") },
        ]}
        heartAt={w("comenta")}
        followAt={340}
        tapAt={372}
        exitAt={END_AT - 9}
        handle="@seucanal"
      />
      <Signature name="EDIT KIT" accent={C.accent} until={60} />

      {/* 8. loop perfeito: os últimos 15 frames mostram o que vem logo antes do frame 0 */}
      <LoopBridge from={END_AT} to={DURATION} src={VIDEO} srcStart={edl.clips[0].src_in} fps={edl.fps} scale0={cam(0).scale} />

      <Audio src={staticFile("exemplo/master.wav")} />
    </AbsoluteFill>
  );
};

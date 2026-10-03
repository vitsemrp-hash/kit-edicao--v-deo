// Tipos e utilidades do EDL gerado por scripts/build_edl.py (cortes exatos na fala).
export type Clip = { i: number; src_in: number; src_out: number; T: number; dur: number; cutFrame: number };
export type Word = { clip: number; text: string; s: number; e: number };
export type Edl = { fps: number; durationInFrames: number; total_s: number; source?: string; clips: Clip[]; words: Word[] };

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

/** frame de início da n-ésima ocorrência (0 = primeira) de uma palavra; lança erro se não achar */
export const wordFrame = (edl: Edl, text: string, nth = 0): number => {
  const hits = edl.words.filter((w) => norm(w.text) === norm(text));
  if (!hits[nth]) throw new Error(`palavra não encontrada no EDL: "${text}" (#${nth})`);
  return Math.floor(hits[nth].s);
};
/** frames onde cada clipe começa (= cortes) */
export const cutFrames = (edl: Edl) => edl.clips.map((c) => c.cutFrame);
/** índice do clipe ativo no frame f */
export const clipAt = (edl: Edl, f: number) => {
  let k = 0;
  for (let i = 0; i < edl.clips.length; i++) if (edl.clips[i].cutFrame <= f) k = i;
  return k;
};

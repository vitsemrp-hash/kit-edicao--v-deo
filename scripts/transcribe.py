#!/usr/bin/env python3
"""Transcreve com timestamps por palavra (faster-whisper).

Uso:
  python scripts/transcribe.py gravacao.mp4 -o transcript.json --cuts cuts.json   (recomendado)
  python scripts/transcribe.py gravacao.mp4 -o transcript.json                    (arquivo inteiro)
  Com --cuts, cada trecho do cuts.json é transcrito separadamente (com 0,3 s de folga): os
  timestamps ficam precisos mesmo com silêncios longos, e o texto de cada trecho é gravado no
  próprio cuts.json para você escolher os takes.
  opções: --model large-v3 (melhor) | medium | small (mais rápido)   --lang pt   --device cpu|cuda

Saída (JSON):
  {"language": "pt", "duration": 63.2,
   "segments": [{"s": 1.02, "e": 3.9, "text": "...", "words": [0,1,2,...]}],
   "words": [{"w": "Ser", "s": 1.02, "e": 1.18, "p": 0.98}, ...]}
"""
import argparse, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from _common import load_audio, write_json, read_json

ap = argparse.ArgumentParser()
ap.add_argument("media")
ap.add_argument("-o", "--out", required=True)
ap.add_argument("--model", default="large-v3")
ap.add_argument("--lang", default="pt")
ap.add_argument("--device", default="cpu")
ap.add_argument("--cuts", help="cuts.json do detect_cuts.py")
ap.add_argument("--threads", type=int, default=os.cpu_count() or 4)
a = ap.parse_args()

import numpy as np
from faster_whisper import WhisperModel  # pip install faster-whisper

x = load_audio(a.media, sr=16000).astype("float32")
m = WhisperModel(a.model, device=a.device, compute_type="int8" if a.device == "cpu" else "float16", cpu_threads=a.threads)
SR = 16000
def run(audio, off=0.0, lo=None, hi=None):
    segs, info = m.transcribe(audio, language=a.lang, word_timestamps=True, beam_size=5, temperature=0.0, vad_filter=False, condition_on_previous_text=False)
    out = []
    for s in segs:
        ws = []
        for w in s.words or []:
            st, en = w.start + off, w.end + off
            if lo is not None: st, en = max(lo, min(st, hi)), max(lo, min(en, hi))
            ws.append(dict(w=w.word.strip(), s=round(st, 3), e=round(en, 3), p=round(w.probability, 3)))
        if ws: out.append((s.text.strip(), ws))
    return out
words, segments = [], []
def add(res):
    for text, ws in res:
        idx = list(range(len(words), len(words) + len(ws))); words.extend(ws)
        segments.append(dict(s=ws[0]["s"], e=ws[-1]["e"], text=text, words=idx))
if a.cuts:
    C = read_json(a.cuts); PAD = 0.3
    for c in C["clips"]:
        seg = np.concatenate([np.zeros(int(PAD * SR), np.float32), x[int(c["src_in"] * SR):int(c["src_out"] * SR)], np.zeros(int(PAD * SR), np.float32)])
        res = run(seg, c["src_in"] - PAD, c["src_in"], c["src_out"])
        c["text"] = " ".join(t for t, _ in res); add(res)
    write_json(a.cuts, C)
else:
    add(run(x))
write_json(a.out, dict(language=a.lang, duration=round(len(x) / 16000, 3), segments=segments, words=words))
print(f"{len(words)} palavras, {len(segments)} segmentos -> {a.out}")
for s in segments:
    print(f"[{s['s']:7.2f}-{s['e']:7.2f}] {s['text']}")

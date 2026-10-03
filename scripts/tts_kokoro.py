#!/usr/bin/env python3
"""Narração por TTS (Kokoro-82M, licença Apache-2.0) para Shorts narrados.

Roteiro: arquivo .txt, uma fala por linha. Uma linha em branco = pausa maior (0,45 s).
Pausas internas longas são comprimidas para no máximo 120 ms (ritmo de Shorts).

Uso:
  python scripts/tts_kokoro.py roteiro.txt -o voice_raw.wav [--voice pm_alex] [--speed 1.15]
  vozes pt-BR: pm_alex (masc.), pm_santa (masc.), pf_dora (fem.)
Depois:
  python scripts/transcribe.py voice_raw.wav -o transcript.json          (timestamps por palavra)
  python scripts/voice_chain.py voice_raw.wav - -o voice.wav --denoise none
  e para o edl sem cortes: python scripts/detect_cuts.py voice_raw.wav transcript.json -o cuts.json --gap 9

Instalação: pip install kokoro soundfile   (+ espeak-ng no sistema: apt/brew/choco install espeak-ng)
Ouça SEMPRE o resultado: TTS pode gerar artefatos no fim das frases (corte à mão se precisar).
"""
import argparse, json
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("script"); ap.add_argument("-o", "--out", required=True)
ap.add_argument("--voice", default="pm_alex"); ap.add_argument("--speed", type=float, default=1.15)
ap.add_argument("--gap", type=float, default=0.15); ap.add_argument("--long-gap", type=float, default=0.45)
a = ap.parse_args()

import soundfile as sf
from kokoro import KPipeline

SR = 24000
pipe = KPipeline(lang_code="p", repo_id="hexgrad/Kokoro-82M")

def squeeze(x, max_pause=0.12):
    w = int(0.01 * SR)
    e = np.array([np.sqrt(np.mean(x[i:i + w] ** 2)) for i in range(0, len(x) - w, w)])
    sil = 20 * np.log10(e + 1e-9) < -40
    keep = np.ones(len(x), bool); i = 0; half = int(max_pause / 0.02)
    while i < len(sil):
        if sil[i]:
            j = i
            while j < len(sil) and sil[j]: j += 1
            if j - i > 2 * half: keep[(i + half) * w:(j - half) * w] = False
            i = j
        else:
            i += 1
    return x[keep]

def trim(x, thr=-45):
    w = int(0.005 * SR)
    e = 20 * np.log10(np.array([np.sqrt(np.mean(x[i:i + w] ** 2)) for i in range(0, len(x) - w, w)]) + 1e-9)
    idx = np.where(e > thr)[0]
    return x[max(0, idx[0] * w - w):(idx[-1] + 2) * w] if len(idx) else x

lines = open(a.script, encoding="utf-8").read().split("\n")
out, parts, t, pending = [], [], 0.0, 0.0
for ln in lines:
    if not ln.strip():
        pending = a.long_gap; continue
    if parts:
        g = max(pending, a.gap); out.append(np.zeros(int(g * SR))); t += g
    pending = 0.0
    x = np.concatenate([r.audio.numpy() for r in pipe(ln.strip(), voice=a.voice, speed=a.speed)])
    x = squeeze(trim(x))
    parts.append(dict(text=ln.strip(), s=round(t, 3), e=round(t + len(x) / SR, 3)))
    out.append(x); t += len(x) / SR
v = np.concatenate(out)
sf.write(a.out, v, SR)
json.dump(dict(voice=a.voice, speed=a.speed, parts=parts, dur=round(t, 3)), open(a.out.rsplit(".", 1)[0] + "_parts.json", "w"), ensure_ascii=False, indent=1)
print(f"{len(parts)} falas, {t:.2f} s -> {a.out}")

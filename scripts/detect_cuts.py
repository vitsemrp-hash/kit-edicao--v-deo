#!/usr/bin/env python3
"""Detecta os cortes exatamente no início e no fim da fala (zero silêncio entre frases).

Analisa o envelope da voz (janelas de 5 ms, após highpass 80 Hz):
  limiar = referência da fala (percentil 95) - 35 dB
  trecho de fala = envelope acima do limiar; pausas menores que --gap ficam DENTRO do trecho,
  pausas maiores viram corte; 25 ms de pré-roll e 15 ms de pós-roll.
Gera cuts.json, uma lista de trechos [src_in, src_out] (segundos da gravação).

Depois rode transcribe.py com --cuts cuts.json: ele transcreve cada trecho (timestamps precisos)
e escreve o texto de cada trecho no cuts.json. Aí EDITE o cuts.json à mão: apague takes ruins,
repetidos ou gaguejados, reordene, junte. Por fim build_edl.py.

Uso:
  python scripts/detect_cuts.py gravacao.mp4 -o cuts.json [--gap 0.25] [--pre 0.025] [--post 0.015] [--rel 35]
"""
import argparse, sys, os
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from _common import load_audio, envelope_db, write_json

ap = argparse.ArgumentParser()
ap.add_argument("media"); ap.add_argument("-o", "--out", required=True)
ap.add_argument("--gap", type=float, default=0.25, help="pausa (s) que vira corte")
ap.add_argument("--pre", type=float, default=0.025); ap.add_argument("--post", type=float, default=0.015)
ap.add_argument("--rel", type=float, default=35.0, help="limiar = referência - REL dB")
ap.add_argument("--min-clip", type=float, default=0.30, help="descarta ruídos/trechos mais curtos que isso (s)")
a = ap.parse_args()

HOP = 0.005
x = load_audio(a.media, af="highpass=f=80")
env = envelope_db(x, hop=HOP)
ref = float(np.percentile(env[env > env.max() - 50], 95))
thr = ref - a.rel
act = env > thr
# fecha pausas curtas
i, n = 0, len(act)
while i < n:
    if not act[i]:
        j = i
        while j < n and not act[j]: j += 1
        if 0 < i and j < n and (j - i) * HOP < a.gap: act[i:j] = True
        i = j
    else:
        i += 1
clips, i = [], 0
while i < n:
    if act[i]:
        j = i
        while j < n and act[j]: j += 1
        s, e = i * HOP, j * HOP
        if e - s >= a.min_clip:
            clips.append(dict(src_in=round(max(0.0, s - a.pre), 3), src_out=round(min(len(x) / 48000, e + a.post), 3), text=""))
        i = j
    else:
        i += 1
write_json(a.out, dict(source=os.path.basename(a.media), ref_db=round(ref, 1), thr_db=round(thr, 1), clips=clips))
tot = sum(c["src_out"] - c["src_in"] for c in clips)
print(f"{len(clips)} trechos, {tot:.2f} s de fala (de {len(x)/48000:.2f} s); limiar {thr:.1f} dB -> {a.out}")
for k, c in enumerate(clips):
    print(f"{k:2d} {c['src_in']:8.3f}-{c['src_out']:8.3f}")

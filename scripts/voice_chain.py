#!/usr/bin/env python3
"""Cadeia de voz: highpass -> redução de ruído -> cortes (cuts.json) com crossfade de 12 ms
-> de-esser -> EQ -> compressor -> limiter. Gera a voz final já cortada (voice.wav, 48 kHz estéreo).

Uso:
  python scripts/voice_chain.py gravacao.mp4 cuts.json -o voice.wav [--denoise dfn|afftdn|none]
  (sem cuts: passe "-" no lugar de cuts.json, útil para voz de TTS)

--denoise dfn usa DeepFilterNet3 (pip install deepfilternet; melhor qualidade, atenuação limitada a 24 dB).
--denoise afftdn usa o filtro do ffmpeg (sem instalar nada).
Nível por trecho: cada trecho é igualado à mediana (±3 dB) para os cortes não "pularem".
"""
import argparse, subprocess as sp, sys, os, tempfile
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from _common import SR, load_audio, write_wav, read_json, loudness

ap = argparse.ArgumentParser()
ap.add_argument("media"); ap.add_argument("cuts")
ap.add_argument("-o", "--out", required=True)
ap.add_argument("--denoise", default="afftdn", choices=["dfn", "afftdn", "none"])
ap.add_argument("--xfade", type=float, default=0.012)
a = ap.parse_args()

tmp = tempfile.mkdtemp()
pre = os.path.join(tmp, "pre.wav")
if a.denoise == "dfn":
    import torch
    from df.enhance import enhance, init_df
    model, state, _ = init_df()
    x = load_audio(a.media, sr=state.sr(), af="highpass=f=80:poles=2").astype(np.float32)
    y = enhance(model, state, torch.from_numpy(x)[None], atten_lim_db=24).squeeze(0).numpy()
    sp.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(state.sr()), "-ac", "1", "-i", "-", "-ar", str(SR), pre], input=y.tobytes(), check=True)
    src = load_audio(pre)
elif a.denoise == "afftdn":
    src = load_audio(a.media, af="highpass=f=80:poles=2,afftdn=nr=12:nf=-40:tn=1")
else:
    src = load_audio(a.media, af="highpass=f=80:poles=2")

def act_db(seg):
    h = 480; n = len(seg) // h
    if n == 0: return -60.0
    d = 20 * np.log10(np.sqrt((seg[: n * h].reshape(n, h) ** 2).mean(1)) + 1e-9)
    d = d[d > -35]
    return float(10 * np.log10(np.mean(10 ** (d / 10)))) if len(d) else -60.0

if a.cuts == "-":
    out = src
else:
    clips = read_json(a.cuts)["clips"]
    L = [act_db(src[int(c["src_in"] * SR): int(c["src_out"] * SR)]) for c in clips]
    med = float(np.median(L)); G = [float(np.clip(med - l, -3, 3)) for l in L]
    k = int(a.xfade * SR); h = a.xfade / 2
    ramp = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, k))
    total = sum(c["src_out"] - c["src_in"] for c in clips)
    out = np.zeros(int(total * SR) + SR); T = 0.0
    for c, g in zip(clips, G):
        i0 = int(round((c["src_in"] - h) * SR)); i1 = int(round((c["src_out"] + h) * SR))
        seg = src[max(0, i0):i1] * 10 ** (g / 20)
        seg[:k] *= ramp; seg[-k:] *= ramp[::-1]
        o = int(round((T - h) * SR))
        if o < 0: seg = seg[-o:]; o = 0
        out[o:o + len(seg)] += seg[: len(out) - o]
        T += c["src_out"] - c["src_in"]
    out = out[: int(round(T * SR))]
cut = os.path.join(tmp, "cut.wav"); write_wav(cut, out)
CHAIN = ("deesser=i=0.35:m=0.5:f=0.55:s=o,equalizer=f=320:t=q:w=1.0:g=-3,equalizer=f=4200:t=q:w=1.2:g=1.5,"
         "treble=g=1.5:f=10000:t=s,acompressor=threshold=-26dB:ratio=3:attack=8:release=140:knee=4:makeup=5dB,"
         "alimiter=limit=0.708:attack=3:release=60:level=disabled")
sp.run(["ffmpeg", "-v", "error", "-y", "-i", cut, "-af", CHAIN, "-ar", str(SR), "-ac", "2", a.out], check=True)
I, tp = loudness(a.out)
print(f"voz -> {a.out}  {len(out)/SR:.2f} s  {I:.1f} LUFS  TP {tp:.1f}")

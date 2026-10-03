#!/usr/bin/env python3
"""Mixagem final: voz + SFX -> master.wav em -14 LUFS integrado, true peak <= -1 dBTP.

Uso: python scripts/master.py voice.wav sfx.wav -o master.wav [--target -14]
"""
import argparse, subprocess as sp, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from _common import loudness

ap = argparse.ArgumentParser()
ap.add_argument("voice"); ap.add_argument("sfx"); ap.add_argument("-o", "--out", required=True)
ap.add_argument("--target", type=float, default=-14.0)
a = ap.parse_args()
raw = a.out + ".raw.wav"
sp.run(["ffmpeg", "-v", "error", "-y", "-i", a.voice, "-i", a.sfx, "-filter_complex",
        "[0][1]amix=inputs=2:normalize=0:duration=longest", "-c:a", "pcm_f32le", raw], check=True)
I, tp = loudness(raw); g = a.target - I
for it in range(5):
    sp.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af",
            f"volume={g:.2f}dB,alimiter=limit=0.80:attack=3:release=60:level=disabled,aresample=48000",
            "-c:a", "pcm_s24le", a.out], check=True)
    I2, tp2 = loudness(a.out)
    print(f"passo {it}: ganho {g:+.2f} dB -> {I2:.1f} LUFS, TP {tp2:.1f}")
    if abs(I2 - a.target) < 0.15: break
    g += a.target - I2
os.remove(raw)
if tp2 > -1.0: print("ATENÇÃO: true peak acima de -1 dBTP; reduza picos dos SFX")

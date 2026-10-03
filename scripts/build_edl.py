#!/usr/bin/env python3
"""cuts.json + transcript.json -> edl.json usado pelo template Remotion (src/kit/edl.ts).

Cada trecho vira um clipe colado no anterior (sem silêncio). As palavras são remapeadas para frames
de saída, para legendas e zooms caírem exatamente na fala.

Uso: python scripts/build_edl.py cuts.json transcript.json -o template/src/exemplo/edl.json [--fps 30]
"""
import argparse, math, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from _common import read_json, write_json

ap = argparse.ArgumentParser()
ap.add_argument("cuts"); ap.add_argument("transcript")
ap.add_argument("-o", "--out", required=True)
ap.add_argument("--fps", type=int, default=30)
a = ap.parse_args()
C = read_json(a.cuts); T = read_json(a.transcript); FPS = a.fps
clips, t = [], 0.0
for i, c in enumerate(C["clips"]):
    d = c["src_out"] - c["src_in"]
    clips.append(dict(i=i, src_in=c["src_in"], src_out=c["src_out"], T=round(t, 4), dur=round(d, 4), cutFrame=math.ceil(t * FPS - 1e-9)))
    t += d
NF = int(round(t * FPS))
words = []
for c in clips:
    for w in T["words"]:
        mid = (w["s"] + w["e"]) / 2
        if c["src_in"] <= mid <= c["src_out"]:
            s = max(w["s"], c["src_in"]) - c["src_in"] + c["T"]
            e = min(w["e"], c["src_out"]) - c["src_in"] + c["T"]
            words.append(dict(clip=c["i"], text=w["w"], s=round(max(s * FPS, c["cutFrame"]), 2), e=round(e * FPS, 2)))
words.sort(key=lambda w: w["s"])
write_json(a.out, dict(fps=FPS, durationInFrames=NF, total_s=round(t, 3), source=C.get("source"), clips=clips, words=words))
print(f"{len(clips)} clipes, {len(words)} palavras, {NF} frames ({t:.2f} s) -> {a.out}")

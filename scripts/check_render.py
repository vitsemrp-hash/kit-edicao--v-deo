#!/usr/bin/env python3
"""Confere o arquivo final: 1080x1920, 30 fps, duração (e < 60 s com --short), loudness -14 LUFS, TP <= -1.
Uso: python scripts/check_render.py saida/video.mp4 [--short]
"""
import argparse, json, subprocess as sp, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from _common import loudness
ap = argparse.ArgumentParser(); ap.add_argument("video"); ap.add_argument("--short", action="store_true"); a = ap.parse_args()
p = json.loads(sp.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", a.video], capture_output=True, text=True).stdout)
v = next(s for s in p["streams"] if s["codec_type"] == "video")
dur = float(p["format"]["duration"]); ok = True
def chk(cond, msg):
    global ok
    print(("OK   " if cond else "FALHA") + " " + msg); ok &= bool(cond)
chk(v["width"] == 1080 and v["height"] == 1920, f"resolução {v['width']}x{v['height']}")
chk(v["r_frame_rate"] in ("30/1", "30000/1000"), f"fps {v['r_frame_rate']}")
chk(not a.short or dur < 60, f"duração {dur:.2f} s" + (" (Short: < 60 s)" if a.short else ""))
if any(s["codec_type"] == "audio" for s in p["streams"]):
    I, tp = loudness(a.video)
    chk(abs(I + 14) <= 0.5, f"loudness {I:.1f} LUFS (alvo -14)")
    chk(tp <= -1.0, f"true peak {tp:.1f} dBTP (<= -1)")
else:
    chk(False, "sem faixa de áudio")
sys.exit(0 if ok else 1)

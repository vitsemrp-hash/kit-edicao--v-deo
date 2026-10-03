#!/usr/bin/env python3
"""Folha de contato (grade de frames) para revisar um render sem assistir tudo.
Uso: python scripts/contact_sheet.py video.mp4 folha.jpg [--frames 0,30,60,...] [--every 30] [--cols 8] [--w 216]
"""
import argparse, json, subprocess as sp, tempfile, os
ap = argparse.ArgumentParser(); ap.add_argument("video"); ap.add_argument("out")
ap.add_argument("--frames", default=""); ap.add_argument("--every", type=int, default=30)
ap.add_argument("--cols", type=int, default=8); ap.add_argument("--w", type=int, default=216)
a = ap.parse_args()
p = json.loads(sp.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", a.video], capture_output=True, text=True).stdout)
dur = float(p["format"]["duration"]); fps = 30
fr = [int(x) for x in a.frames.split(",") if x.strip()] or list(range(0, int(dur * fps), a.every))
d = tempfile.mkdtemp(); files = []
for i, f in enumerate(fr):
    o = os.path.join(d, f"{i:04d}.png")
    sp.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", f"{f/fps:.3f}", "-i", a.video, "-frames:v", "1", "-vf",
            f"scale={a.w}:-2,drawtext=text='{f}':x=6:y=6:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.6", o], check=True)
    files.append(o)
rows = (len(files) + a.cols - 1) // a.cols
inp = sum((["-i", f] for f in files), [])
lay = "|".join(f"{'+'.join(['w0']*(i % a.cols)) or '0'}_{'+'.join(['h0']*(i // a.cols)) or '0'}" for i in range(len(files)))
sp.run(["ffmpeg", "-nostdin", "-v", "error", "-y"] + inp + ["-filter_complex", f"xstack=inputs={len(files)}:layout={lay}:fill=black", a.out], check=True)
print(f"{len(files)} frames -> {a.out}")

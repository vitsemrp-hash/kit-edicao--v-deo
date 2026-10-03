#!/usr/bin/env python3
"""Monta a trilha de SFX (+ trilha de fundo opcional) a partir de uma lista de eventos.

events.json = lista de eventos:
  [{"frame": 0, "file": "sfx/cc0/bsb_1801_whoosh8.mp3", "label": "corte 1 – whoosh",
    "peak_db": -18, "align": "peak", "pre": 0.3, "post": 0.4,
    "ss": 0, "dur": null, "filter": "highpass=f=120", "fade_in": 0.0, "fade_out": 0.08}, ...]
  align "peak": o pico do som cai exatamente no frame (bom para impactos/whooshes);
  align "start": o som começa no frame.

Regras do kit (verificadas aqui):
  - nenhum arquivo usado mais de 2 vezes no mesmo vídeo (falha se passar);
  - barramento de SFX ≈ 11 LU abaixo da voz; trilha de fundo ≈ 21 LU abaixo e com ducking na fala.
Gera sfx.wav e imprime as linhas para colar no usage_log.md.

Uso:
  python scripts/sfx_mix.py events.json --voice voice.wav --frames 1425 -o sfx.wav [--bed sfx/synth/bed.wav] [--fps 30] [--under 11]
"""
import argparse, collections, sys, os
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from _common import SR, load_audio, write_wav, read_json, lufs_array

ap = argparse.ArgumentParser()
ap.add_argument("events"); ap.add_argument("-o", "--out", required=True)
ap.add_argument("--voice", required=True); ap.add_argument("--frames", type=int, required=True)
ap.add_argument("--fps", type=int, default=30); ap.add_argument("--bed")
ap.add_argument("--under", type=float, default=11.0); ap.add_argument("--bed-under", type=float, default=21.0)
ap.add_argument("--max-uses", type=int, default=2)
a = ap.parse_args()
EV = read_json(a.events)
cnt = collections.Counter(e["file"] for e in EV)
bad = {k: v for k, v in cnt.items() if v > a.max_uses}
if bad: sys.exit(f"ERRO: arquivos usados mais de {a.max_uses}x: {bad}  (crie variações ou troque o som)")
N = int(round(a.frames / a.fps * SR))
voice = load_audio(a.voice, mono=False)[:N]
voice = np.vstack([voice, np.zeros((max(0, N - len(voice)), 2))])
bus = np.zeros((N, 2)); rows = []
for e in EV:
    x = load_audio(e["file"], mono=False, ss=e.get("ss", 0), t=e.get("dur"), af=e.get("filter"))
    if len(x) < 10 or np.abs(x).max() < 1e-4: sys.exit(f"ERRO: arquivo vazio/silencioso {e['file']}")
    if e.get("align", "peak") == "peak":
        env = np.convolve(np.abs(x).mean(1), np.ones(240) / 240, "same"); p = int(np.argmax(env))
        a0 = max(0, p - int(e.get("pre", 0.3) * SR)); x = x[a0:p + int(e.get("post", 0.6) * SR)]; p -= a0
    else:
        p = 0
    n = len(x); g = np.ones(n)
    fi, fo = e.get("fade_in", 0), e.get("fade_out", 0.05)
    if fi: k = min(n, int(fi * SR)); g[:k] = np.linspace(0, 1, k) ** 1.5
    if fo: k = min(n, int(fo * SR)); g[-k:] *= np.linspace(1, 0, k) ** 1.5
    x = x * g[:, None]; x = x * 10 ** (e.get("peak_db", -18) / 20) / np.abs(x).max()
    i = int(round(e["frame"] / a.fps * SR)) - p
    j0, j1 = max(0, i), min(N, i + n)
    if j1 > j0: bus[j0:j1] += x[j0 - i:j1 - i]
    rows.append(f"| {e['frame']} ({e['frame']/a.fps:.2f}s) | `{e['file']}` | {cnt[e['file']]} | {e.get('label','')} |")
vl = lufs_array(voice)
g = 1.0
if np.abs(bus).max() > 0:
    for _ in range(4): g *= 10 ** ((vl - a.under - lufs_array(bus * g)) / 20)
mix = bus * g
if a.bed:
    bed = load_audio(a.bed, mono=False)[:N]; bed = np.vstack([bed, np.zeros((max(0, N - len(bed)), 2))])
    venv = np.sqrt(np.convolve(voice.mean(1) ** 2, np.ones(2400) / 2400, "same"))
    act = np.convolve((20 * np.log10(venv + 1e-9) > -35).astype(float), np.ones(4800) / 4800, "same")
    bed = bed * (1 - 0.35 * act)[:, None]
    bed *= 10 ** ((vl - a.bed_under - lufs_array(bed)) / 20)
    mix = mix + bed
write_wav(a.out, mix)
print(f"voz {vl:.1f} LUFS | SFX {lufs_array(bus*g):.1f} LUFS | eventos {len(EV)} -> {a.out}")
print("\n| Frame | Arquivo | Usos | Momento |\n|---|---|---|---|\n" + "\n".join(rows))

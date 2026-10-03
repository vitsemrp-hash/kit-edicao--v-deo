#!/usr/bin/env python3
"""edl.json -> captions.json (blocos de legenda) para os componentes BaseCaptions e WordCaptions.

--style base  : legenda base (até 2 linhas, ~16 caracteres por linha, quebra na pontuação)
--style words : palavra a palavra estilo Shorts (até 3 palavras / 13 caracteres por bloco)
--keys "graça,Deus,energia" : palavras de destaque (cor de acento) — escolha editorial, poucas por vídeo
--hide 120-180,400-460 : faixas de frames sem legenda (ex.: onde entra um destaque ou cena motion)

Uso: python scripts/make_captions.py edl.json -o captions.json --style words --keys "corte,legenda"
"""
import argparse, re, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from _common import read_json, write_json

ap = argparse.ArgumentParser()
ap.add_argument("edl"); ap.add_argument("-o", "--out", required=True)
ap.add_argument("--style", default="base", choices=["base", "words"])
ap.add_argument("--keys", default="")
ap.add_argument("--hide", default="")
ap.add_argument("--upper", action="store_true", default=True)
a = ap.parse_args()
E = read_json(a.edl)
norm = lambda s: re.sub(r"[^\wÀ-ÿ]", "", s.lower())
keys = {norm(k) for k in a.keys.split(",") if k.strip()}
hide = [tuple(map(int, r.split("-"))) for r in a.hide.split(",") if r.strip()]
W = [dict(t=w["text"].upper() if a.upper else w["text"], s=int(w["s"]), e=int(round(w["e"])), key=norm(w["text"]) in keys, clip=w["clip"]) for w in E["words"]]
MAXW, MAXC = (3, 13) if a.style == "words" else (6, 32)
chunks, cur = [], []
for i, w in enumerate(W):
    cur.append(w)
    nxt = W[i + 1] if i + 1 < len(W) else None
    chars = sum(len(x["t"]) for x in cur) + len(cur) - 1
    end = re.search(r"[,.:;?!]$", w["t"]) or nxt is None or nxt["clip"] != w["clip"]
    if end or len(cur) >= MAXW or (nxt and chars + 1 + len(nxt["t"]) > MAXC):
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
out = []
for k, c in enumerate(chunks):
    start = c[0]["s"]
    end = chunks[k + 1][0]["s"] if k + 1 < len(chunks) else c[-1]["e"] + 10
    end = min(end, c[-1]["e"] + 12)
    if any(start < b and end > a_ for a_, b in hide):
        continue
    words = [dict(t=re.sub(r"[,.;:]$", "", w["t"]), s=w["s"], key=w["key"]) for w in c]
    if a.style == "base":
        # 2 linhas equilibradas
        total = sum(len(w["t"]) for w in words); acc = 0; lines = [[], []]
        for w in words:
            (lines[0] if acc < total / 2 or not lines[0] else lines[1]).append(w); acc += len(w["t"])
        lines = [l for l in lines if l]
        longest = max(sum(len(w["t"]) for w in l) + len(l) - 1 for l in lines)
        size = 120 if longest <= 9 else 108 if longest <= 13 else 92
    else:
        lines = [words]
        n = sum(len(w["t"]) for w in words) + len(words) - 1
        size = 150 if n <= 9 else 132 if n <= 13 else 116
    out.append(dict(start=start, end=end, size=size, lines=lines))
write_json(a.out, dict(style=a.style, chunks=out))
print(f"{len(out)} blocos ({a.style}) -> {a.out}")
for c in out: print(c["start"], c["end"], " / ".join(" ".join(("*" if w["key"] else "") + w["t"] for w in l) for l in c["lines"]))

"""Funções comuns dos scripts do kit (somente numpy + ffmpeg no PATH)."""
import json, re, subprocess as sp, wave
import numpy as np

SR = 48000


def load_audio(path, sr=SR, mono=True, ss=0.0, t=None, af=None):
    """Lê qualquer arquivo de áudio/vídeo via ffmpeg -> float64 (n,) ou (n,2)."""
    cmd = ["ffmpeg", "-v", "error", "-ss", str(ss)] + (["-t", str(t)] if t else []) + ["-i", str(path)]
    if af:
        cmd += ["-af", af]
    cmd += ["-ac", "1" if mono else "2", "-ar", str(sr), "-f", "f32le", "-"]
    out = sp.run(cmd, capture_output=True, check=True).stdout
    x = np.frombuffer(out, np.float32).astype(float)
    return x if mono else x.reshape(-1, 2)


def write_wav(path, x, sr=SR):
    """Grava WAV 16-bit (mono ou estéreo)."""
    x = np.asarray(x, float)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    w = wave.open(str(path), "wb")
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(sr)
    w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())
    w.close()


def loudness(path):
    """Retorna (LUFS integrado, true peak dBTP) com o filtro ebur128 do ffmpeg."""
    o = sp.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"],
               capture_output=True, text=True).stderr
    I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1])
    tp = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", o)[-1])
    return I, tp


def lufs_array(x, tmp="/tmp/_kit_lufs.wav"):
    write_wav(tmp, x)
    return loudness(tmp)[0]


def envelope_db(x, sr=SR, hop=0.01):
    """Envelope RMS em dB, janelas de `hop` segundos."""
    h = int(hop * sr)
    n = len(x) // h
    r = np.sqrt((x[: n * h].reshape(n, h) ** 2).mean(1))
    return 20 * np.log10(r + 1e-9)


def read_json(p):
    return json.load(open(p, encoding="utf-8"))


def write_json(p, d):
    json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

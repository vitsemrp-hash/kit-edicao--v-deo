#!/usr/bin/env bash
# Junta o vídeo renderizado (mudo) com o master.wav, sem recomprimir o vídeo.
# Nunca sobrescreve: se o arquivo de saída já existir, para com erro (crie uma nova versão).
# Uso: bash scripts/mux.sh render_mudo.mp4 master.wav saida/nome_v1_AAAA-MM-DD.mp4
set -euo pipefail
RAW="$1"; WAV="$2"; OUT="$3"
if [ -e "$OUT" ]; then echo "ERRO: $OUT já existe. Use um novo nome de versão (v2, v3...)."; exit 1; fi
mkdir -p "$(dirname "$OUT")"
ffmpeg -nostdin -v error -i "$RAW" -i "$WAV" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 \
  -map_metadata -1 -map_chapters -1 -movflags +faststart -shortest "$OUT"
echo "ok -> $OUT"
python3 "$(dirname "$0")/check_render.py" "$OUT"

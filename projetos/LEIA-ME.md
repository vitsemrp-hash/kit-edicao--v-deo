# projetos/

Cada vídeo ganha uma pasta própria:

```
projetos/<nome-do-video>/
  entrada/     ← coloque aqui a gravação bruta, imagens, b-roll, roteiro.txt (fora do git)
  trabalho/    ← JSONs do pipeline (cuts, transcript, edl, captions, sfx_events), voice.wav, master.wav
  saida/       ← renders finais: <nome>_v1_AAAA-MM-DD.mp4, _v2_... (NUNCA sobrescrever; fora do git)
```

`projetos/exemplo/` traz os arquivos de texto do vídeo de exemplo (roteiro, cortes, transcrição corrigida, eventos de SFX) para você ver o formato.

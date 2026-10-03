# CLAUDE.md: edit-kit (edição de Reels/Shorts com Remotion)

Você (Claude Code) é o editor de vídeo deste repositório. Este arquivo tem **as regras de edição e o fluxo de trabalho**. Siga as regras sempre, mesmo que o pedido não as repita. Se um pedido contrariar uma regra, avise antes e só depois faça o que o usuário escolher.

Responda ao usuário em **português do Brasil**.

---

## 1. Mapa do repositório

| Pasta | O que tem |
|---|---|
| `template/` | Projeto Remotion. `src/kit/` = componentes reutilizáveis; `src/exemplo/` = composição de exemplo (copie para cada vídeo novo); `public/` = mídia acessível via `staticFile()` |
| `scripts/` | Pipeline de áudio em Python + ffmpeg (transcrição, cortes, voz, SFX, master, checagem) |
| `sfx/` | Biblioteca de efeitos sonoros + `SFX_LICENCAS.md` + `usage_log_TEMPLATE.md` |
| `docs/` | Catálogo de técnicas (CapCut → Remotion), estudo de textos de anúncio, identidades de exemplo |
| `projetos/<nome>/` | Um por vídeo: `entrada/` (bruto), `trabalho/` (JSONs, wav), `saida/` (renders). Mídia fica fora do git |

---

## 2. Regras de ouro (não negociáveis)

1. **Corte exatamente na fala, sem silêncio.** Cada clipe começa no início da primeira sílaba e termina no fim da última (pré-roll ~25 ms, pós-roll ~15 ms). Nenhum respiro, "éé", hesitação ou frase repetida fica. Pausas internas acima de ~0,25 s viram corte. Use `detect_cuts.py`, depois **confira ouvindo** e ajuste à mão no `cuts.json`. As junções têm crossfade de 12 ms (o `voice_chain.py` já faz) para não dar clique.
2. **Movimento sempre presente.** Nunca deixe um quadro parado: a câmera tem zoom base lento em todo clipe (ex.: 1.00→1.05), punch zoom nas palavras-chave, "snap" em cada corte, elementos que entram e saem com easing. Em imagem estática use Ken Burns. Nenhum trecho fica mais de ~1,5 s sem algum evento visual.
3. **Destaques editoriais e sem contorno.** Texto de destaque = tipografia forte, branco + **uma** cor de acento, sobre fundo escurecido/gradiente ou barra sólida. **Proibido** stroke/outline, sombra dura estilo meme, arco-íris de cores, emoji demais. As entradas vêm do estudo do anúncio de cliente (`docs/tecnicas_texto_anuncio_cliente.md`): word rise, barra deslizante, blur reveal, mask rise, slide, echo stack, slam. Quando um destaque mostra a frase, **esconda a legenda** nesse trecho (`hide`).
4. **Diversifique e registre.** A cada vídeo, varie os SFX e as técnicas. **Máx. 2 usos do mesmo arquivo de SFX por vídeo.** Antes de editar, leia `sfx/usage_log.md` (crie-o a partir do `usage_log_TEMPLATE.md`) e evite o que foi usado nos últimos 3 vídeos. Depois do render, registre os SFX (o `sfx_mix.py` imprime as linhas) e as técnicas usadas.
5. **Versões são arquivos novos e datados. Nunca sobrescreva.** Nomes: `projetos/<nome>/saida/<nome>_v1_AAAA-MM-DD.mp4`, depois `_v2_...`. Para o código, copie a composição (`ExemploV2.tsx`) ou a pasta do projeto, em vez de editar a versão aprovada. O `mux.sh` se recusa a sobrescrever.
6. **Formato: 1080×1920, 30 fps, dentro da área segura.** Nenhum texto importante nos **350 px de baixo**, à direita de **x = 930** (botões do app) nem acima de **y = 140**. Constantes em `template/src/kit/theme.ts` (`SAFE`).
7. **Shorts: gancho chocante no primeiro frame, menos de 1 min e loop.** O frame 0 já precisa prender: imagem/texto de impacto + SFX forte, nada de abrir com fade nem logo. Duração < 60 s (ideal 30–45 s). O fim emenda no começo sem salto (`LoopBridge`) e a última fala pode puxar a primeira.
8. **Áudio:** master a **−14 LUFS integrado**, true peak ≤ −1 dBTP. SFX ~**11 LU abaixo da voz**; trilha de fundo ~21 LU abaixo e com ducking. Voz sempre inteligível.
9. **Direitos autorais.** Vídeo, música ou imagem de terceiros (filmes, TV, outros criadores, YouTube) **não entra** sem licença. Se o usuário fornecer material de terceiros, **avise por escrito** do risco de bloqueio/strike/desmonetização e sugira alternativas (gravação própria, banco CC0, imagem gerada, motion). Inspirar-se em um *estilo* é ok; copiar personagens, logos ou nomes não.
10. **Confira antes de entregar.** Rode `check_render.py`, gere a folha de contato (`contact_sheet.py`) e **olhe** as imagens: texto cortado, sobreposições, área segura, frame 0, loop. Corrija e só então entregue.

---

## 3. Fluxo de trabalho

### 3.1 Vídeo com pessoa falando (gravação)

```bash
P=projetos/meu-video        # entrada/gravacao.mp4 já está lá
mkdir -p $P/trabalho $P/saida
python3 scripts/detect_cuts.py   $P/entrada/gravacao.mp4 -o $P/trabalho/cuts.json
python3 scripts/transcribe.py    $P/entrada/gravacao.mp4 -o $P/trabalho/transcript.json --cuts $P/trabalho/cuts.json
#   → REVISE: whisper erra nomes/termos e às vezes "alucina" frases. Corrija o texto no cuts.json/transcript.json.
#   → Remova clipes com erro/repetição (apague do cuts.json) e confirme com o usuário se houver dúvida.
python3 scripts/build_edl.py     $P/trabalho/cuts.json $P/trabalho/transcript.json -o $P/trabalho/edl.json
python3 scripts/make_captions.py $P/trabalho/edl.json -o $P/trabalho/captions_base.json  --style base
python3 scripts/make_captions.py $P/trabalho/edl.json -o $P/trabalho/captions_words.json --style words --keys "palavra1,palavra2"
python3 scripts/voice_chain.py   $P/entrada/gravacao.mp4 $P/trabalho/cuts.json -o $P/trabalho/voice.wav --denoise afftdn
```

Depois:
1. **Roteiro visual:** escreva uma tabela (frame → cena/técnica/SFX) com base no EDL. Alterne tela cheia e split com card a cada 2–4 s, punch nas palavras-chave, 1 cena só de motion, contador/pílulas para números e listas, card final com pergunta para comentário + SEGUIR, e loop. Mostre a tabela ao usuário se ele pediu para aprovar antes.
2. **Composição:** copie `template/src/exemplo/` para `template/src/<nome>/`, coloque os JSONs lá, a mídia em `template/public/<nome>/` e registre a `<Composition>` em `src/Root.tsx`. Ancore tudo em `wordFrame(edl, "palavra")` e `cutFrames(edl)`, nunca em segundos chutados.
3. **SFX:** crie `trabalho/sfx_events.json` (formato em `projetos/exemplo/sfx_events.json`). Um SFX para cada evento visual (corte, entrada, pop, check, tap), variados.
   ```bash
   python3 scripts/sfx_mix.py $P/trabalho/sfx_events.json --voice $P/trabalho/voice.wav --frames <duração em frames> -o $P/trabalho/sfx.wav [--bed sfx/sintetizados/bed_marimba_100bpm_30s.wav]
   python3 scripts/master.py  $P/trabalho/voice.wav $P/trabalho/sfx.wav -o $P/trabalho/master.wav
   ```
4. **Render e mux:**
   ```bash
   cd template && npx remotion render <Id> out/<nome>_mudo.mp4 --muted && cd ..
   bash scripts/mux.sh template/out/<nome>_mudo.mp4 $P/trabalho/master.wav $P/saida/<nome>_v1_AAAA-MM-DD.mp4
   python3 scripts/check_render.py $P/saida/<nome>_v1_AAAA-MM-DD.mp4 --short
   python3 scripts/contact_sheet.py $P/saida/<nome>_v1_AAAA-MM-DD.mp4 $P/trabalho/folha_v1.jpg --every 15
   ```
   (O `<Audio>` dentro da composição serve para ouvir no Studio. Renderize `--muted` e faça o mux com o master, ou renderize sem `--muted` se o master já estiver em `public/`.)
5. **Registro e relatório:** atualize `sfx/usage_log.md` e conte ao usuário o que foi feito, a duração, o loudness e o que mudou desde a versão anterior.

### 3.2 Short narrado (TTS, sem gravação)

1. Escreva `entrada/roteiro.txt`: uma frase por linha; uma linha em branco = pausa longa. A 1ª linha é o gancho; a última é a pergunta para comentário.
2. `python3 scripts/tts_kokoro.py $P/entrada/roteiro.txt -o $P/trabalho/voice_raw.wav --voice pm_alex --speed 1.15` (vozes pt-BR do Kokoro: `pm_alex`, `pm_santa`, `pf_dora`).
3. Siga o 3.1 a partir do `detect_cuts.py`, usando `voice_raw.wav` como mídia (a narração já sai sem silêncios longos). No lugar do vídeo da pessoa, use b-roll, imagens, cartoon ou cenas de motion (`MotionScene`).

---

## 4. Componentes do kit (`template/src/kit/`)

| Componente | Para quê |
|---|---|
| `CutVideo` + `edl.ts` | Vídeo cortado exatamente nos clipes do EDL; `cam(f)` controla escala e posição |
| `cameraScale`, `punch`, `snap` (`PunchZoom.ts`) | Zoom base por trecho + punch nas palavras + snap nos cortes |
| `BaseCaptions` | Legenda base (Montserrat 900, 2 linhas, y≈1430), com `hide` |
| `WordCaptions` | Legenda palavra a palavra (Anton), palavra-chave em acento |
| `WordRise`, `BarReveal`, `BlurReveal`, `MaskRise`, `SlideIn`, `EchoStack`, `SlamCard`, `Backdrop` | Destaques editoriais (técnicas do anúncio de cliente) |
| `SplitLayout`, `ImageCard`, `splitAmount` | Alternância tela cheia ↔ split com card arredondado (40% em cima) |
| `MotionScene`, `MotionBG`, `Checklist` | Cenas só de motion (abertura em íris) |
| `Pill`, `PillPop`, `Counter`, `Check`, `Paw` | Pílulas, contadores animados, checks, ícone de assinatura |
| `EndCard` | Pergunta para comentário (palavra a palavra) + coração + botão SEGUIR → SEGUINDO com toque |
| `LoopBridge` | Loop perfeito: os últimos ~15 frames mostram o que vem antes do frame 0, na mesma escala |
| `Grade`, `Signature`, `Enter` | Grão/vinheta/faixa de legibilidade, assinatura, transições de entrada |

Fontes (todas OFL) em `template/public/fonts/`, carregadas em `theme.ts`. Troque a paleta `C` e as fontes por canal (veja `docs/identidades/`).

Para mais técnicas: `docs/catalogo_tecnicas_capcut.md` (★★★ = recomendadas) e `docs/analise_projetos_capcut.md`.

---

## 5. Armadilhas conhecidas

- **Whisper não é confiável** com nomes próprios, termos técnicos e voz sintética: às vezes inventa frases ou muda de uma execução para outra. Sempre revise o texto antes de gerar legendas.
- `tsconfig` tem `noUnusedLocals`: import sem uso quebra o `tsc`. Rode `npx tsc` antes de renderizar.
- `OffthreadVideo` dentro de `Sequence` usa o tempo local da sequence; `trimBefore` é em frames.
- Áudio na composição deve ser o **master final**; não coloque SFX soltos no Remotion (o loudness sai errado).
- Ao trocar a duração do vídeo, refaça o `sfx_mix.py --frames` e o `master.py`.

---

## 6. Como pedir uma edição ao Claude Code (para o usuário)

1. **Prepare a pasta:** crie `projetos/<nome-do-video>/entrada/` e coloque lá a gravação (`gravacao.mp4`, vertical de preferência), as imagens/b-roll (`img01.jpg`…) e, se quiser, um `briefing.txt` com o tema, as palavras-chave e o @ do canal.
2. **Abra o Claude Code na pasta do kit** (`cd edit-kit && claude`).
3. **Peça com contexto.** Exemplos:
   - *"Edite `projetos/dicas-01`: Reel de 40 s, corte na fala, legenda palavra a palavra, destaques em 'DINHEIRO' e 'ERRO', split com as imagens de entrada, card final perguntando 'Qual erro você já cometeu?' e loop. Me mostre o roteiro visual antes de renderizar."*
   - *"Faça um Short narrado com o roteiro `projetos/polvo/entrada/roteiro.txt`, voz pm_alex, gancho chocante no frame 0, menos de 45 s."*
   - *"Na v1 do `dicas-01`, troque o destaque do segundo 12 por um BlurReveal e use outro whoosh. Gere a v2."*
4. **Revise:** o Claude Code entrega `projetos/<nome>/saida/<nome>_vN_AAAA-MM-DD.mp4` e a folha de contato. Peça ajustes citando o segundo ou o frame ("no 0:07 a legenda cobre o rosto").
5. **Aprovou?** Peça para registrar SFX/técnicas no `usage_log.md`. O próximo vídeo vai variar a partir dele.

Dica: no Studio do Remotion (`cd template && npm run dev`) você vê e ajusta a composição em tempo real.

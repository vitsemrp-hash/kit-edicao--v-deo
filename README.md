# edit-kit: Reels e Shorts editados pelo Claude Code

Um kit pronto para editar vídeos verticais (1080×1920, 30 fps) com **Remotion** e **Claude Code**: cortes exatamente na fala, legendas (base e palavra a palavra), destaques editoriais animados, punch zooms, split com card, cenas de motion, contadores, card final com SEGUIR e loop perfeito. Também traz um pipeline de áudio (transcrição, voz tratada, SFX e master a −14 LUFS), uma biblioteca de SFX e narração TTS opcional para Shorts.

Todas as regras de edição estão em [`CLAUDE.md`](CLAUDE.md), e o Claude Code as lê sozinho.

## Pré-requisitos

| Ferramenta | Versão | Instalação |
|---|---|---|
| Node.js | 20 LTS ou mais novo | https://nodejs.org (ou `brew install node` / `winget install OpenJS.NodeJS.LTS`) |
| ffmpeg + ffprobe | 6 ou mais novo | `brew install ffmpeg` / `sudo apt install ffmpeg` / `winget install Gyan.FFmpeg` |
| Python | 3.10 ou mais novo | https://python.org (ou `brew install python`) |
| Claude Code | atual | https://docs.claude.com/claude-code |
| espeak-ng (só p/ TTS) | qualquer | `brew install espeak-ng` / `sudo apt install espeak-ng` |

## Início rápido

```bash
# 1. Remotion
cd template
npm install
npx remotion render Exemplo out/exemplo.mp4      # renderiza o vídeo de exemplo (~1 min)
npm run dev                                       # abre o Studio para ver/editar
cd ..

# 2. Pipeline de áudio
python3 -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r scripts/requirements.txt
python3 scripts/check_render.py template/out/exemplo.mp4 --short

# 3. Editar um vídeo
mkdir -p projetos/meu-video/entrada     # coloque a gravação aqui
claude                                   # e peça: "Edite projetos/meu-video seguindo o CLAUDE.md"
```

No Windows, os comandos `bash` (como `scripts/mux.sh`) rodam no Git Bash ou no WSL.

## Estrutura

```
CLAUDE.md        regras + fluxo de trabalho (pt-BR)
template/        projeto Remotion (src/kit = componentes, src/exemplo = composição de exemplo)
scripts/         pipeline de áudio e checagens (Python + ffmpeg)
sfx/             efeitos sonoros + SFX_LICENCAS.md + modelo de usage_log
docs/            catálogo de técnicas, estudo de textos de anúncio, identidades de exemplo
projetos/        um diretório por vídeo (mídia fica fora do git)
```

## Licenças

- Código do kit: uso livre.
- Fontes: SIL OFL (`template/public/fonts/LICENCAS_FONTES.md`).
- SFX: veja `sfx/SFX_LICENCAS.md`.
- O vídeo de exemplo usa mídia gerada (gradiente + narração Kokoro TTS, Apache-2.0).

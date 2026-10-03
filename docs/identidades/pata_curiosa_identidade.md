# A Pata Curiosa – identidade visual e sonora (exemplo)

> **Nota (pt-BR):** esta é uma **identidade de exemplo** (canal de curiosidades "A Pata Curiosa"). Use como modelo e adapte cores, fontes, assinatura, personagens e @ ao seu canal — não copie o nome nem o @.

Channel: YouTube Shorts curiosities (@apatacuriosa): deep sea, space, brain, history, animals. Shorts ≤ ~40 s, 1080×1920, 30 fps.
Reference implementation in this kit: `template/src/kit/theme.ts` (tokens), `UI.tsx` (Paw / Check / Pill / Counter), `Captions.tsx`, `EndCard.tsx`.

## Cores
| Token | Hex | Use |
|---|---|---|
| bg | `#0A0A0C` | near-black background for every motion-graphics scene |
| panel | `#141418` | pills, cards, tiles |
| **yellow** | `#FFD21F` | curiosity yellow: key words, paw mark, highlights, drawn circles, main pills |
| white | `#FFFFFF` | all other text |
| **cyan** | `#3FE0FF` | **only** for scientific numbers or data (%, mg, µSv, isotope labels, counters, data lines). Never for decoration or words. |
| grey | `#9A9AA2` / dim `#2A2A30` | secondary labels, inactive tiles |

Never use the Catholic palette (violet `#5B4BFF`) here.

## Tipografia
- Headlines and captions: **Anton** (OFL, `assets/fonts/Anton-Regular.ttf`), uppercase.
- Support text, labels and pills: **Inter** 600–700 (variable).
- Numbers use tabular numerals (`font-variant-numeric: tabular-nums`) so counters don't jitter.

## Legendas (palavra a palavra)
- Chunks of 1–3 words (≤ ~13 characters), broken at punctuation. Each word appears on its spoken frame.
- Size 150 / 132 / 116 px for short / medium / long chunks. White, with a 7 %-of-size black stroke (`paint-order: stroke`) and a soft shadow.
- **Key word in yellow with an elastic pop** (B1: 0.01 → 1.15 → 0.92 → 1 over 12 frames). Other words do a quick 0.86 → 1 settle.
- Position: centred on y = 1330, block x 60–900 (clear of the right-side buttons and the bottom ~350 px). Global dark band behind y ≈ 1000–1700.
- Hide the caption when a motion scene shows the same words as a headline (e.g. MENTIRA? / VERDADE / RADIOATIVA).

## Assinatura: pegada
- Small yellow paw + "A PATA **CURIOSA**" (Anton 44) top-left (x 70, y 150) during the hook (first ~3.5 s).
- Large paw (elastic pop + ripple ring) + "A PATA CURIOSA" + @apatacuriosa in the end card, then a SEGUIR → SEGUINDO ✓ button with cursor click.
- Also used as the bullet in pills/lists (black paw on yellow pills, yellow paw on dark pills). Max 1–2 times in the middle of a video.

## Ritmo e estrutura
- **Hook in the first second:** punch-in on the first shot + a yellow hook pill (here "☢ RADIOATIVO?") at frame 2 + a deep sub boom.
- Scene change every **0.7–1.8 s**. Alternate full-screen b-roll with full-screen motion scenes (about 50/50).
- Entry transitions (rotate them, don't repeat back to back): punch-in, blur-pulse dissolve (C6), diagonal split-mask wipe (C1), whip-pan, circle iris (C2), rise. Each scene keeps rendering 8 frames under the next one so wipes and irises reveal over the previous shot.
- Motion vocabulary (from `docs/catalogo_tecnicas_capcut.md`): elastic pop B1, word rise A1, staggered pills B2, counters B4, ripple B7, crosshair B8, cursor click B9, hand-drawn circle B12, orbit rings B6, scale-comparison bars, map pins, ghost word A15, 1-frame stutter C7, decaying shake D6, punch zoom.

## Correção de cor (b-roll)
1. Crop to 9:16 around the subject, scale to 1080×1920 (Lanczos).
2. `curves=all='0/0 0.07/0.035 0.5/0.49 0.92/0.9 1/0.96', eq=contrast=1.05:saturation=0.88, colorbalance=rs=-0.02:bs=0.02:rh=0.03:bh=-0.03` (slightly crushed blacks, warm highlights, cool shadows, a little less saturation).
3. Per-clip gamma so the mean luma lands near 0.36 (backgrounds for motion scenes ≈ 0.30). Clips on black stay black.
4. In Remotion: soft vignette, dark caption band, 7 % film grain (overlay).

## Som
- Narration: the same cut rules and chain as the Catholic videos (DeepFilterNet3 → tight EDL with zero dead air → de-esser / EQ / compressor). Master at −14 LUFS, true peak ≤ −1 dBTP, AAC 48 kHz.
- SFX stem ≈ 11 LU under the voice. Map: cuts → a different whoosh each time; reveals/punchlines → sub boom or tonal hit (+ a bright glitch layer for phone speakers); pills/pins → pops/plinks; counters/data → digital data chatter + a short beep; science moments → synthesized Geiger clicks.
- Music bed: an original synthesized suspense bed (A-minor drone + low heartbeat pulse + plucked ostinato from ~3.6 s), ≈ 21 LU under the voice and ducked under speech. No copyrighted songs.
- Rotation: no file more than twice per video. Log every pick under "A Pata Curiosa" in `sfx/usage_log.md` (modelo em `sfx/usage_log_TEMPLATE.md`).

## Área segura (Shorts)
Keep text out of the bottom 350 px and the right ~150 px (x > 930), and below y ≈ 140 at the top.

## Variante cartoon animada
- Characters and sets follow `character_style.md`: ink `#1B1416` outlines, flat fills, one hard cel shade, googly eyes, line boil on threes. The cast is in `characters/cast_sheet.png`.
- Character scenes use mid-dark "night" sets so the ink stays readable. Motion-graphics scenes stay on near-black `#0A0A0C`.
- Cyan is still for data only (the K badge, K bubbles, dosimeter readout, counters).
- Keep faces above y ≈ 1150 so the word-by-word captions (y 1330) sit over bodies, not faces. Keep all text out of the bottom 350 px and the right 150 px.

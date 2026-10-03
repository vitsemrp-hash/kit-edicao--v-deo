# Estilo de personagens – cartoons d'A Pata Curiosa (exemplo)

> **Nota (pt-BR):** esta é uma **identidade de exemplo** (canal de curiosidades "A Pata Curiosa"). Use como modelo e adapte cores, fontes, assinatura, personagens e @ ao seu canal — não copie o nome nem o @.

> Estilo de personagens cartoon (olhos grandes, traço simples) usado nos Shorts animados de exemplo. Inspirar-se em um *estilo* é ok; nunca copie personagens, nomes ou desenhos de outro criador.

The brief asked for "the style of Instagram @ascronicasdewesley", meaning the style only. We do **not** use any of its characters, names or designs (Wesley, Leandro, Laíz, Deathcornius, the capybaras, the "carinhas felizes", the parchment-scroll logo).

## Como a referência foi estudada
- **Instagram:** WebFetch of the profile only returned the page title. Instaloader got **HTTP 429** (rate-limited) on the first request, and I did not retry it, so I couldn't download posts or reels from Instagram.
- **Public artwork found:** two official illustrations of the series, plus text about the comic. Saved locally for reference only (not used in the video) in `pata_curiosa/style_ref/`:
  - `inspi.jpg`: a 2024 illustration of two characters on a red sofa sharing a pizza, from the inspi.com.br article "Ilustrador faz sucesso na internet com tirinhas sobre o cotidiano".
  - `cat_apoc.jpg`: the banner for the "O Apocalipse das Capivaras" Catarse campaign, showing a hero with a sword and a capybara in a mech, in a ruined orange city.
  - `cat_yt.jpg`: the scroll logo (typography reference only, not reused).
- **Text sources:** Agenda Arte e Cultura (2019), Guia dos Quadrinhos, Catarse ×2, inspi (2024). These describe daily-life humour webcomics drawn on a tablet since 2013 (600+ strips) by a Bahia-born designer, with animation as a long-term goal.
- **Not studied:** I could not inspect any actual reels, so the motion notes below are inferred from the drawing style plus standard limited-animation practice. They are not observed from the account.

## Traços visuais observados
| Aspect | What the reference does | How we apply it |
|---|---|---|
| Line | Dark brown-black ink, fairly **thick and even** (≈ 0.6–0.8 % of image width), round joins, slightly hand-wobbly. Outlines every shape, including the background props. | `OL #1B1416`, `SW = 7 px` at 1:1 rig scale (≈ 8–13 px on screen). Every part goes through `<Part>`, which draws fill → cel shade → ink outline. A global "line boil" displacement filter (re-seeded every 3 frames) gives the hand-drawn wobble. |
| Shapes | Soft, rounded, chunky. Big round heads, simple torsos, mitten-like hands with a thumb, ears as plain "C" shapes. | Heads are superellipse-like blobs. Limbs are rubber-hose tubes. Hands are mittens with a thumb. |
| Proportions | Heads about **1/3 of the body** (≈ 2.5–3 heads tall); faces wide with low-set features. | Pipo is ~2.4 heads tall, Íris ~3. Eyes are set wide and sit low-to-middle on the head. |
| Eyes | The signature trait: **large white oval "googly" eyes, set far apart**, sometimes bulging past the head outline, with small solid black pupils that look sideways/off-model for comedy. Eyebrows are rare or tiny. | Big white ovals with an ink outline, small round pupils (we add a tiny catch-light) and short thick brow strokes. Pupils drive the comedy (glancing at the banana, tiny pupils for shock). |
| Mouth / nose | Small **D-shaped open mouths** with a dark-red inside and a pink tongue, often set off-centre. The nose is a tiny hook or absent. | `Mouth` = D-shape `#4B1519` with tongue `#E8707C`, a closed smile line, and an "O" for surprise. Pipo has a dog nose; Íris has a small hook nose. |
| Colour | **Flat, saturated** fills (red sofa, green hoodie, pink top), warm skin tones. The epic pieces use a warm orange/peach atmospheric glow. | Flat fills. The palette is pushed toward the channel identity: yellow `#FFD21F` hoodie and banana, near-black studio. Night/dusk sets (navy kitchen, teal lab, dusk plantation) keep the near-black identity while the ink stays readable. |
| Shading | **One hard-edged cel-shade tone** per material (a darker same-hue shape on one side), plus a few **lighter highlight strokes** on clothes and hair. No soft gradients on the characters. | `Part` draws the shade colour, then the base shifted by `off` (typically −12…−18 px), so a hard shade rim appears on the lower-right. Highlight strokes are white at about 50 %. |
| Texture | A light **paper/noise grain** over the whole image. | A global film-grain overlay (7 %) in the grade layer. |
| Backgrounds | Simplified but outlined and cel-shaded (sofa, wall stripes, ruined buildings). Depth comes from lighter, hazier far layers and warm glow. | Sets: kitchen at night, spotlit stage, dusk plantation (3 parallax layers + sun glow), lab, market stall. Everything is outlined in the same ink. |

## Linguagem de movimento (para os rigs)
- Pose-to-pose limited animation: key poses eased in and out with `kf`/`kp` keyframes, plus small continuous secondary motion (head bob, tail wag, ear swing, sway).
- **Mouths on twos**: the mouth opening follows the narration's loudness envelope (`mouth.json`). It is snapped to 4 mouth poses and held 2 frames each, so it reads as hand-made, not a smooth audio meter.
- **Blinks**: 4-frame lid close every ~2.8–3.6 s, de-synced per character.
- **Squash & stretch** on landings, jumps, hits and "shock" (0.8 → 1.1 → 0.97 → 1).
- **Expression swaps** are instant (neutral → shock, happy → joy) with a little squash. Brows and pupils do most of the acting.
- **Line boil** on threes (see Line).
- Camera: slow push-ins, punch zooms and whip/wipe/iris entries from the identity spec. Hard cuts every 1–2 s.

## Elenco (original, A Pata Curiosa)
| Character | Design | Why it is not a copy |
|---|---|---|
| **Pipo** (host) | Curious cream pup with brown floppy ears, a brown patch around one eye, black nose, yellow `#FFD21F` hoodie with a black paw print on the chest, navy pants, white sneakers, tail. | An animal host. The reference's leads are humans and capybaras. The paw-hoodie ties to the channel's paw logo. |
| **Bana** | A walking banana: yellow body with ridge line, brown stem and tip, black stick limbs, white mitten hands, brown shoes. Can glow (radioactive) and show a cyan "K" badge. | An object character made for this topic. |
| **Dra. Íris** | Scientist: brown skin, dark curly bun, orange-strapped goggles pushed up on the forehead, white lab coat over a teal shirt, pens in the pocket. Props: dosimeter, pointer, banana. | Generic scientist archetype with its own palette and accessories. |
| **Maçã, Laranja** (extras) | Apple and orange buddies with the same face kit and stick limbs. | Generic fruit mascots. |

The rigs live in `remotion/short01_v2/src/Toon.tsx`: `Pipo`, `PipoXray`, `Bana`, `Iris`, `Buddy`, plus the props `BananaProp`, `Peel` and `Dosimeter`. Sets are in `Sets.tsx`. The cast sheet is `characters/cast_sheet.png`.

Rig parameters: `expr`, `look`, `mouth`, `o`, `lid`, `hands` (IK targets for L/R), `holdL`/`holdR` (props), `tilt`, `bob`, `sq` (squash), `ear`, `tail`, `cheeks`, `sweat`, `feet` (walk), `glow`, `badge`, `muscles`.

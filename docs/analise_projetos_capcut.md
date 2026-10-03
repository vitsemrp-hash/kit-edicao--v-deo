# Análise de projetos CapCut: "EditAssets - Ferramentas" (e mais 16)

> **Resumo (pt-BR):** análise quadro a quadro dos projetos CapCut de referência: formato do arquivo, look, momentos de texto, itens nativos do CapCut e como recriar cada um no Remotion. Os projetos de origem NÃO acompanham o kit (são de terceiros); fica só o estudo. "Dark identity" = adaptação para a identidade de exemplo *grace* (Reels católicos).

Source: a shared folder of 17 CapCut reference projects (not included). Sections 1-5 cover the first project ("Ferramentas"). **Update 2026-09-30:** the folder now holds 17 zips; the 16 new projects are analysed in section 6 onward, and the reusable techniques are in `technique_catalog.md`.
- The zip is kept at `capcut_projects/EditAssets - Ferramentas.zip` and was unzipped next to it.
- Project root: `EditAssets - Ferramentas/PROJETO/EditAssets - Ferramentas/`.
- Extractor: `_extract/dump.py`. Its outputs are `_extract/tree.txt` (the timeline tree), `_extract/extract.json` (texts, animations, effects, keyframes, shapes) and `_extract/sheets/*.jpg` (contact sheets).
- No video was edited.

## 1. Formato do arquivo e legibilidade
- **`draft_info.json`** (1.85 MB) is plain, readable JSON and **not encrypted**.
  - Written by CapCut Desktop: `version` 360000, `new_version` 189.0.0.
  - Canvas: 1080x1920 at 30 fps. Duration: 13.2 s. Draft name "0926".
  - `template-2.tmp` and the `.bak` are identical copies.
- **`subdraft/*/draft_content.json`** (74 files) are readable. They are wrapper drafts. The real content of all 55 compound clips is embedded in `draft_info.json` under `materials.drafts[].draft`.
  - Nested compounds are referenced by id through the root `materials.drafts` list, which is a global index.
- **Encrypted-looking files:** only `draft.extra` (77 KB of binary/base64) and `crypto_key_store.dat`. They are not needed for the analysis.
- **Bundled resources:**
  - Fonts: Degular Light, Regular, Medium and Semibold (commercial, OH no Type Co.), BricolageGrotesque-Medium (OFL), and `en.ttf` (CapCut's system font).
  - Images: PNG icons 1-20, `cursor.png`, 2 ChatGPT images, and a pink background jpeg.
  - Audio: `trilha.MP3` (13.19 s music bed).
  - Reference: `SnapInsta-Ai_…mp4` (41 s, 720x1280). This is a screen recording of the reference reel being edited, a light-grey SaaS promo for a brand called "Open". The project copies its language: bubble icons, "Várias ferramentas", "ERP", "CRM inteligente", "Funil", the "acessos" counter, cursor clicks.
- **`Resources/videoAlg/`** holds 11 mp4s plus 11 `.alpha.mp4` files. These are CapCut's pre-rendered caches of compound clips on black with a separate alpha matte, and they are the only "previews" in the project.
  - Some caches are stale. Example: the "Para vender" cache shows a green pill with an arrow icon, while the current JSON has other colours.
  - There is no full-project export in the zip.

## 2. Look geral
- **Background:** a full-frame rect shape `#E3E1DF` (light warm grey).
- **Accent blue:** `#017BB9`, with variants `#0D87BE`, `#0171C8`, `#0179BC` and `#0091D7` (ERP).
- **Other colours:** red `#B8112F` ("Várias ferramentas"), grey `#62615C` / `#86847F`, black, white.
- **Circle decor:** `#C7D4BE` and `#BFCACF`.
- **Text style constants:**
  - `text_size` 15 in all texts; the visual size comes from segment scale.
  - letter_spacing -0.05 (tight), line_spacing 0.02, center aligned.
  - The paragraph uses line_spacing -0.28.
- **Totals:** 74 text segments (including per-frame swaps and repeats), 10 built-in animations, 4 video effects, 905 keyframe tracks, 238 shapes, 0 transitions.
  - Every cut is a hard cut. The motion comes from keyframes on compound clips.
- **Keyframe vocabulary:** curves are Line, CurveIn, CurveOut, CurveInOut and FreeCurve (bezier with control points).
  - **Signature "elastic pop":** scale 0.01→1.15→0.90→1.00, one step every 8 frames (0.267 s), 0.8 s in total. Variants: 0.01→1.1→0.95→1.0, or →2.4→2.1→2.25→2.2 for large logos.
  - The pop is often paired with rotation -35→5→-2→0 and an alpha 0→1 over 0.33 s.
- **Global overlays:** two ellipse ripples at 1.73 s and 2.90 s, scaleX 0.01→7 with alpha 1→0 over 1.03 s.

## 3. Momentos de texto (timeline raiz, segundos)
| # | Time (s) | Text | Font / colour | Animation / effect | Remotion |
|---|---|---|---|---|---|
| 1 | 0.00-0.93 | "Sua" / "ainda" / "usa.." (small, next to a briefcase icon) | Degular Semibold, grey `#86847F`, letter_spacing -0.05 | Words stagger in at 0.00 / 0.13 / 0.20. The briefcase icon pops with overshoot (0.01→1.1→0.95→1; rotation -35→5→-2→0). The cursor PNG flies in with rotation 55→-35. The clip starts at scale 3→1 (0.5 s), x slides 0.26→0→1.39, and a Blur effect ramps 0→0.25. | Fully |
| 2 | 0.93-1.83 | "Várias" + "ferramentas" | Degular Semibold, red `#B8112F`, scales 5 / 3 | "Várias" slides x -0.46→0 with alpha 0→0.45 and scale 2.3→5. "ferramentas" starts 0.067 s later, from x -0.65, alpha 0→1 over 0.33 s, scale 1.2→3. The clip enters from x -0.93 at scale 1.85→1 with rotation -50→0. Behind: concentric thin circles, and app icons (Docs, Sheets, Meet, WhatsApp, Drive) orbiting/flying in with motion blur; mask wipe. | Fully (the motion blur is approximate) |
| 3 | 1.83-3.07 | "Para vender" | Degular Semibold, white, on a rounded-rect pill | The pill and an arrow-circle icon elastic-pop (0.01→1.15→0.9→1.0 over 0.8 s). The rect width grows with overshoot. Icon 9.png rotates -90→0 (the arrow turns ↑→→). Exit: scale 0.8→2, rotation -15, alpha →0.2. | Fully |
| 4 | 2.47-3.07 | "Gerenciar" (with a gear icon and an arrow circle) | Degular Semibold, blue `#0D87BE` | Same elastic pop. The pill background fades out, leaving icon + text. The clip moves in from the right, scale 0.8→1.8, rotation 15. | Fully |
| 5 | 2.97-3.77 | "Clientes" + two "$" coins ("Dollar bounce" sub-clips) | Degular Semibold, blue `#017BB9`; "$" in Bricolage Grotesque Medium | A radial burst of 7 user-avatar bubbles (scale 0.01→~1, flying outward with rotation, with motion blur). The main avatar pops, and the cursor clicks. From 3.40 s the clip is re-cut into six 1-frame slices (3.40, 3.47, 3.53, 3.60, 3.67, 3.73), a stutter/strobe hold. | Fully |
| 6 | 3.77-5.20 | Paragraph "EditAssets não é apenas uma biblioteca de projetos. É acesso…" + "EditAssets" (from 4.10) | Paragraph: Degular Light, black, line_spacing -0.28. "EditAssets": Degular Semibold, black, scale 1.45 | Paragraph: CapCut in-animation **"Type 1"** (typewriter, 1.43 s). "EditAssets": **"Bounce Left"** (1.00 s). The whole clip has **"Heartbeat Gacha"** (1.43 s). Behind: a large dark "&" logo glyph with expanding/rotating thin ring arcs (scale 0.01→5, alpha fade). | Typewriter fully; Bounce Left and Heartbeat Gacha approximately |
| 7 | 5.20-7.37 | Card cluster: "Um" + "ERP" + "Completo" + pills "Orçamentos", "Inteligência artificial" ×2, "CRM"; a second "ERP" at 5.53-6.20 | ERP / Um: blue `#0091D7`, Degular Semibold / Regular. Pills: white text on blue pills; "Inteligência artificial" in `en.ttf` | Staggered elastic pops, each with an alpha ramp, starting 5.20 / 5.23 / 5.27 / 5.30 / 5.37. The "ERP" letters build in (E, then R, then P, with a blurred ghost). The pills then drift/rotate outward ("Orçamentos" tilts to vertical) and fade. A curved arrow draws in; rotating masks. | Fully |
| 8 | 6.00-7.37 | "CRM" / "inteligente" (from 6.17) | Degular Medium, white, scales 5 / 3.2, on a tilted full-width blue card | Rise y -0.52→-0.27 with alpha 0→1 over 0.33 s; "inteligente" is delayed 0.167 s. The card slides up at a tilt. A link icon and the hand cursor move in; an arrow icon rotates. Exit: the card drifts down. | Fully |
| 9 | 7.20-9.23 | "EditAssets" ×2 layered (echo, second layer +0.067 s) | Degular Medium, black | Elastic pop scale 0.01→2.4→2.1→2.25→2.2; the echo layer goes to alpha 0.25. The "&" app-icon logo (12.png) pops. Orbit rings with dots expand and spin around it. | Fully |
| 10 | 9.23-9.60 | "Leads" | Degular Medium, blue `#0171C8` | The clip zoom-spins in (scale 0.01→1, rotation 55→0 over 0.33 s). "Leads" then shrinks out. A mascot (blue smiley with a cap) morphs into a pill. | Fully |
| 11 | 9.70-10.47 | "Widgets" + live counter "103 acessos" → … → "907 acessos" | Degular Medium, white | "Widgets": **"Bounce Left"** (0.77 s), then fades. The counter is 24 separate text segments, one per frame (1/30 s each): 103, 138, 172 … 868, 903, 907. That is a hand-made number ticker. A toggle switch gets clicked by the cursor. The pill grows into a card. | Fully (the counter is trivial with `interpolate`); Bounce Left approximately |
| 12 | 10.50-11.23 | "Formulários" + "Enviar" (10.57) + "dados" (10.63) | "Formulários": Degular Semibold, white. "Enviar dados": grey `#62615C` | "Formulários": **"Bounce Left"** (1.0 s). "Enviar"/"dados" elastic-pop with a y move. Rounded-rect form fields grow in (roundness keyframes 105→62). The card colour animates blue `#0183D3`→`#E1DFDD`, so the card dissolves into the background. **Fisheye** effect from 9.43 to 11.23 (distortion 0.30→0.35). The clip scales out at the end. | Mostly; the fisheye is approximate |
| 13 | 11.23-13.17 | "Funil" + pills "completamente" / "visual" (from 11.30) | "Funil": Degular Medium, blue `#0179BC`, scale 4.4. Pills: white text on blue rect pills tilted 6° / -3° | "Funil": **"Bounce Left"** (1.0 s). The pills elastic-pop (0.01→1.1→0.95→1.0). The 20.png image has **"Heartbeat Gacha"**. Masks rotate. The clip starts at scale 3.05→1 and exits flying to x 1.65 with rotation 30. | Mostly (the built-ins are approximate) |

Audio: `trilha.MP3` plays over the whole timeline (0-13.19 s).

## 4. Itens nativos do CapCut (só nomes; as curvas não vêm no arquivo)
- **Text in-animation "Type 1":** a typewriter reveal, 1.43 s. Recreate with a per-character reveal.
- **Text in-animation "Bounce Left":** 0.77 s and 1.0 s. It enters from the left with an overshoot bounce. Approximate it with a spring (damping about 10-12) on translateX from -100% plus an opacity ramp.
- **Clip/sticker in-animation "Heartbeat Gacha":** 1.43 s. A pulse scale (1→1.12→0.96→1.04→1). Approximate.
- **Effects:**
  - **Blur:** 0→0.25 during moment 1. Maps to CSS `filter: blur()`.
  - **Fisheye:** distortion 0.30→0.35 during moments 11-12. Needs an SVG `feDisplacementMap` or a WebGL shader; approximate.
- **No transitions and no stickers from the CapCut library.** Every graphic is a bundled PNG or a native shape.

## 5. Como recriar no Remotion (paleta `#5B4BFF` / preto / branco)
- **Fully recreatable:** all keyframed transforms (position, scale, rotation, alpha), including the elastic pop and FreeCurve eases (reproduce with cubic-bezier `Easing.bezier` or explicit multi-step `interpolate`). Also:
  - Staggered pops and slides
  - Rect/pill growth with roundness keyframes
  - Colour tweens
  - Masks and wipes
  - Ripple and orbit rings
  - 1-frame stutter repeats
  - The per-frame counter
  - The typewriter
  - The cursor-click choreography
  - Motion blur (approximated with `@remotion/motion-blur` or trail layers)
- **Approximate:** "Bounce Left" and "Heartbeat Gacha" (the exact curves live in CapCut's effect library), and Fisheye (shader or SVG displacement).
- **Not recreatable 1:1:** nothing essential.
- **Assets:**
  - Degular is commercial; use it only if you hold a licence, otherwise substitute Bricolage Grotesque (OFL, bundled) or Inter.
  - The Google-app icons and the ChatGPT images are third-party.
- **Style adaptation:** the project is a flat, bright SaaS look (light grey `#E3E1DF` background, corporate blue). The example *grace* identity (v11) is moody black and white with `#5B4BFF`.
  - Map: background → black.
  - Blue accent → `#5B4BFF`.
  - Red → white or `#5B4BFF`.
  - Black text → white.
  - Grey `#62615C` → `#8A8A8A`.
  - The motion grammar (elastic pops, stutter holds, counters, pills) transfers directly.

---

# 6. Lote 2: mais 16 projetos "EditAssets"

**How they were fetched.** Downloaded from a publicly shared link (not included in the kit).
- Zips and unzipped folders sit next to this file: `EditAssets - <Name>.zip` and `EditAssets - <Name>/PROJETO/EditAssets - <Name>/`.
- **Extractor (generic, read-only):** `_extract/dump2.py <project dir> <out dir>`, then `_extract/digest.py` for the human-readable digest, then `_extract/sheets2.py` for contact sheets.
- **Per-project output:** `_extract/projects/<Name>/`, containing:
  - `tree.txt`: the full timeline tree with keyframes.
  - `extract.json`: texts, animations, effects, masks, transitions, speeds, keyframes, detected elastic pops, resources.
  - `digest.txt`: merged text moments, with 1-frame number runs collapsed into "COUNTER" entries.
  - `sheet_caches.jpg`: CapCut `videoAlg` compound caches (3 frames each).
  - `sheet_refN.jpg`: the bundled reference, export or overlay videos (12 frames each); `sheets_index.txt` maps N to the file.
- **Overview images:** `_extract/projects/covers.jpg` (all `draft_cover.jpg`) and `pngs_noncache.jpg` (PNG props of the projects without caches).
- No video was edited and nothing was uploaded.

## 6.1 Legibilidade
- **All 16 are readable.** `draft_info.json` is plain JSON, CapCut Desktop `version` 360000, `new_version` 181-189. Canvas 1080x1920, 30 fps.
- Compound clips are embedded under `materials.drafts[].draft`, the same as in Ferramentas.
- Only `draft.extra` / `crypto_key_store.dat` are opaque, and they aren't needed.
- The `subdraft/` wrappers (11-75 per project) are readable but redundant.
- **One damaged file:** a `Resources/combination/*_video.mp4` in Glitch, Scale and Quadro has no moov atom (an unfinished CapCut cache). Its `.alpha.mp4` is fine. It isn't needed.
- **Author and brand:** every project is a promo for the "EditAssets / EditClass" template store, by the same author as Ferramentas.
- `RefJoão*.mp4` files are the external reference reels each edit copies. Some projects also bundle **finished exports of sibling projects**, which serve as the only full-render previews:
  - `EditAssets - Glitch.mp4` (inside Nokia and Profissional)
  - `EditAssets - Econimziar.mp4` (inside Profissional)
  - `EditAssets - Celular.mp4`, `- Mind.mp4`, `- Gmail.mp4`, `- UseAssets.mp4`

## 6.2 Estatísticas
Counts are raw segments, including 1-frame swaps. "pops" are auto-detected elastic scale keyframes (0.01 → overshoot → settle).

| Project | dur s | texts | anims | effects | kf tracks | pops | masks | transitions | speed changes | caches | fonts |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Absorb | 13.1 | 38 | 0 | 1 | 113 | 2 | 1 | 0 | 0 | 6 | Degular-Bold, Degular-Medium, Degular-Regular, Degular-Semibold |
| Ads | 16.6 | 51 | 0 | 4 | 257 | 7 | 7 | 0 | 1 | 15 | Degular-Regular, Degular-Semibold |
| Attention | 8.4 | 24 | 7 | 7 | 96 | 11 | 4 | 0 | 0 | 6 | Degular-Bold, Degular-Light, Degular-Regular, Degular-Semibold, Degular-ThinItalic, TuskerGrotesk-3500Medium |
| Clock | 20.1 | 216 | 4 | 5 | 207 | 8 | 35 | 0 | 3 | 19 | Orbitron-Medium, Orbitron-Regular |
| Computer | 17.5 | 12 | 9 | 5 | 92 | 18 | 4 | 0 | 2 | 1 | BebasNeue Bold, Cute Cat, Degular-Medium, Degular-Semibold, PlayfairDisplay-MediumItalic |
| Creators | 14.1 | 385 | 15 | 2 | 259 | 24 | 10 | 0 | 0 | 10 | Degular-Bold, Degular-Light, Degular-Medium, Degular-MediumItalic, Degular-Regular, Degular-Semibold, Degular-Thin |
| E-commerce | 16.2 | 320 | 8 | 9 | 276 | 4 | 11 | 0 | 3 | 9 | Degular-Medium, Degular-Regular, Degular-Semibold |
| Economizar | 9.5 | 67 | 1 | 2 | 218 | 15 | 24 | 3 | 2 | 3 | Degular-Bold, Degular-Medium, Degular-Regular, Degular-Semibold, TuskerGrotesk-3500Medium, TuskerGrotesk-5500Medium |
| Gerenic | 15.4 | 51 | 2 | 7 | 204 | 8 | 19 | 0 | 0 | 0 | Degular-Bold, Degular-Medium, Degular-Semibold |
| Glitch | 16.4 | 40 | 6 | 6 | 94 | 0 | 7 | 0 | 5 | 12 | Degular-Medium, Degular-Regular |
| Nokia | 10.8 | 24 | 6 | 5 | 80 | 0 | 4 | 0 | 0 | 0 | Degular-Bold, Degular-Regular |
| Perfeccionismo | 13.7 | 29 | 3 | 3 | 86 | 0 | 3 | 0 | 1 | 0 | Degular-Light, Degular-Regular, PlayfairDisplay-Bold, PlayfairDisplay-Regular, PlayfairDisplay-SemiBold, TuskerGrotesk-1600Semibold, TuskerGrotesk-3500Medium |
| Profissional | 15.5 | 91 | 3 | 1 | 267 | 29 | 13 | 0 | 0 | 0 | BricolageGrotesque-Medium-BF648bd578394c9, Degular-Semibold, Sora-Light, Sora-Medium, Sora-Regular, Sora-SemiBold |
| Quadro | 21.0 | 61 | 3 | 10 | 171 | 0 | 14 | 0 | 1 | 0 | Cute Cat, Degular-Bold, Degular-Semibold, TuskerGrotesk-3500Medium |
| Scale | 14.1 | 41 | 11 | 8 | 199 | 4 | 25 | 0 | 0 | 0 | Degular-Regular, Degular-Semibold, PlayfairDisplay-BlackItalic, PlayfairDisplay-Bold, PlayfairDisplay-BoldItalic, PlayfairDisplay-Italic, PlayfairDisplay-Regular |
| Solucao | 11.4 | 29 | 3 | 5 | 201 | 7 | 34 | 4 | 5 | 1 | Orbitron-Bold, Orbitron-ExtraBold, Orbitron-Regular, Orbitron-SemiBold |

**Shared grammar across all 17 projects:**
- **Keyframe timing:** steps every 8 frames (0.267 s).
- **Word stagger:** each word starts 2-3 frames (0.067-0.10 s) after the previous one.
- **Word rise with overshoot:**
  - PositionY −0.156 → +0.008 → −0.003 → 0 (canvas half-units) at 0 / 0.267 / 0.533 / 0.8 s.
  - Alpha 0 → 1 over 0.267 s.
  - Curves: CurveIn, then CurveInOut, then CurveOut.
- **Elastic pop:** 0.01 → 1.05-1.25× → 0.9-0.97× → 1.0 over 0.8 s.
- **Two-weight lockup:** small Regular/Light words mixed with big Medium/Bold keywords at 1.8-3× scale.
- **Motion tracking to an invisible pink photo:** used as parenting.
- **Everything else:** hard cuts, except the 7 "Mix" dissolves in Economizar and Solução.

## 6.3 Notas por projeto
Times are root-timeline seconds. **R** = Remotion recreatability. **Dark identity** = how it adapts to the *grace* black / white / `#5B4BFF`, editorial-premium, no-outline style.

### Absorb (13.1 s): "getting good at editing … it's about how you absorb … implementing it in your own ideas"
- **Look:** black background. Cut-out B&W photos (CCTV cameras, an Earth disc, film characters on a red circle, an astronaut, a man on a concrete pillar) with a red `#B8112F`-style disc behind the subject. White Degular.
- **Moments:**
  - 0.00-1.47 "getting / good / at / editing": 2-frame stagger. Small Regular (sc 1.4) plus big Medium (sc 2.85).
  - 1.47 "SKILL": black Semibold sc 5 behind the white "it's not about the skills".
  - 3.03 "it's about how / you absorb": inverted Circle mask (feather 0.25) opens the Earth.
  - 10.50 "implementing": sc 7 ghost word behind the subject (a giant background word), plus "in your own ideas".
- **Effects:** only a global "4K" sharpen filter. **No CapCut built-ins.**
- Word rise keyframes exactly as in 6.2.
- **R: fully.** **Dark identity:** direct fit. Swap red for `#5B4BFF`; use sacred art or your own cut-outs.

### Ads (16.6 s): "Você sente que está pagando caro para ser ignorado nas grandes redes de anúncio?…"
- **Look:** navy `#071E3F` / `#04123F` grid with white Degular.
- **Moments:**
  - 3.40: an "ADS" phone card pops (0.01→1.45→1.25→1.30).
  - 6.83-9.13 "Onde a CONVERSA REAL acontece": navy text on white, with a Filmstrip mask (feather 0.7).
  - 13.60-15.23: four chat notification cards ("Cliente / Opa, tenho interesse no seu serviço") stack in at 0.1 s steps.
  - 15.23 "gerando familiaridade": double Circle mask (feather 0.3).
- **Effects:**
  - Glow 2 (luminance 0.05-0.5, size 0.5-0.7) on three ranges, plus an Enhance filter.
  - Split-mask wipes at 0.5 s and 12.6 s (feather 0.2-0.35).
  - A speed ramp of 2.45× (2.0-2.77 s).
- **R: fully.** Glow is approximated by a blurred additive copy. **Dark identity:** notification-card stack becomes "prayer intentions / messages" cards.

### Attention (8.4 s): "Attention is the new CURRENT. And most people ARE BROKE…"
- **Look:** black with gold `#9D8963`. A B&W marble bust in a gold circle, crack/branch lines, a dollar bill, a falling man in a gilded picture frame, a phone mockup.
- **Moments:**
  - 0.00: "Attention" Bold, then "is the new" in **Degular Thin Italic**, then the white "CURRENT" tag on a gold bar.
  - 1.87: "ARE BROKE" in Tusker Grotesk condensed, white on a gold disc.
  - 3.07: six paragraph lines, each with **Text Fade In 0.5 s**, staggered 0.1 s.
  - 4.07 "IT EARN" → 4.63 "LOSE IT": word swap.
  - 4.07: **Type 2** on a 3-line paragraph.
  - 7.00 "Adquira agora!" inside a rounded Rectangle mask (round 0.245, feather 0.25).
- **Effects:**
  - Global **B&W Comic 2** (0.45) plus Enhance.
  - **Sunset 1** (background animation 0.55) from 4.07 s.
  - **Blur pulses on every cut:** Blur 0→0.5→0 over 0.333 s (Line) centred on the cuts at 1.63 / 3.07 / 4.07 / 5.47.
- **Elastic pops:** 0.01→1.95→1.75→1.8 on the logo discs.
- **R:** mostly. B&W Comic 2 and Sunset are approximated (desaturate + contrast + grain; warm gradient).
- **Dark identity:** the strongest editorial match of the batch. Gold becomes `#5B4BFF` or stays white. A marble bust or saint icon in a circle; thin-italic "is the new" typography.

### Clock (20.1 s): "It has never been easier… Commissions hit instantly… Partner Program"
- **Look:** black with blue `#2490FD` / `#0F7EFB`, Orbitron (techy) font, 3D gold "$" coins, a white arrow, green check, red X swarm, alarm clock.
- **Moments:**
  - 0.00-1.20: **clock-time ticker** "09:00 AM → 05:00 AM", 36 one-frame text swaps.
  - 2.53-4.60: "Dashboard / Current balance" with a **money counter** "$ 3.157,00 → $ 4.768,00" (57 frames).
  - 4.60: a **day counter** 1→14→20 in a glowing card.
  - 10.43: "EditClass / EditAssets / EditAfter" list, **Bounce Left 1.0 s** each, speed 0.656, with pops 0.01→0.45→0.38→0.40.
  - 14.50: **progress 0%→100%** (14 frames).
  - 21 Circle masks (feather 0.3) frame each scene like a spotlight/vignette.
- **Effects:** Player 3 ×4 (rotate 0.15-1.0), Glow 2.
- **R: fully.** Counters are trivial; Player 3 is approximated.
- **Dark identity:** counters map to "dias", "Ave-Marias", "% da Quaresma" etc. Replace Orbitron with Inter Tight / Archivo.

### Computer (17.5 s): "What if the next Computer Revolution… It isn't just another gadget… Scripts / Strategy / Posting / Analytics all handled"
- **Look:** a retro-classroom collage: chalkboard, cork board, retro PC, theatre curtain, a hand-drawn white ellipse (`.mov` overlay), Playfair Medium Italic.
- **Moments:**
  - 0.00: **Typewriter 1.17 s** on the serif italic.
  - 3.27: **Type 1** on the handwritten "Cute Cat" font.
  - 8.60: four grey labels with **Text Fade In** at 0.2-0.3 s stagger, under **Shake** (speed/intensity 0.03).
  - 12.00: BebasNeue red `#DF302F` "EditAssets" with a 0.01 black stroke.
- **Effects:**
  - Global **Wide Angle 0.1**, **FPS Lag 0.13**, **B&W Comic 2 0.35**, Enhance.
  - Curved speed 0.72 on 5.8-8.6 s.
- **R:** mostly. FPS Lag = hold every 2nd-3rd frame (exact). Wide Angle = barrel displacement (approx).
- **Dark identity:** only the hand-drawn circle / underline overlay and the typewriter serif fit. The collage props are too playful.

### Creators (14.1 s): "Sua campanha… 42 M → 243 M Criadores… Realmente faz sentido… +Velocidade −Custo +Resultado"
- **Look:** white, then black caches. Degular in seven weights. Blue `#0088FA`, a gold/pink/purple gradient.
- **Moments:**
  - 0.10-0.60 "campanha": **font-weight cycling**. The same word swaps font every 3 frames: Semibold → Light → MediumItalic → Thin → MediumItalic → Semibold.
  - 1.00-2.63: **"Criadores" in three colour copies** (`#F4C766`, `#E449AB`, `#AC45E7`) with **Wave in 1.0 / 1.2 s**. Staggered = a chromatic echo.
  - 1.00-4.00: **audience counter "42 M → 243 M"** (48 frames).
  - 3.97-4.90: **profile stats counters** (posts 1→14, followers 8,1 K→21 K, following 1.024→1.968), all in parallel.
  - 2.63-3.13: six avatar photos pop in a ring (0.01→0.45→0.38→0.40, 0.1 s stagger), then orbit with a cursor click.
  - Checklist "+Velocidade / −Custo / +Resultado" ticks.
  - "sentido" with a swoosh underline.
  - 10.40: **Type 2** ×3.
- **Effects:** Shake (1.57-2.23), Blur (3.8-4.13). Filmstrip / Circle / Split masks.
- **R: fully.** Wave in is approximated as a per-letter sine rise.
- **Dark identity:** font-weight cycling on one key word (Playfair ↔ Inter Tight) and counters are excellent. Avoid the rainbow gradient.

### E-commerce (16.2 s): "Dono de E-commerce… Você usa influenciadores… Parabéns… Você tá perdendo dinheiro… R$ −973,79 … Dias e dias … Encontrar … E é por isso que você tem dúvidas"
- **Look:** white/black, blue `#0085FE`, red `#CD0A1A`.
- **Moments:**
  - 0.63 "E-commerce": **Random Typewriter** 0.3 / 0.5 s.
  - 1.93: "influenciadores" in three colour copies with **Wave in 0.8 s**.
  - 4.20 "Parabéns": sc 8.5 double layer (black + blue), with speed 3.07 / 3.15 whip.
  - 4.80 "Você tá perdendo dinheiro": **Type 1** with Circle masks and the **3D Rotation** effect.
  - 6.40-8.27: **loss counter "R$ −5,02 → R$ −973,79"** (56 frames) over a money-rain greenscreen with **Player 3** ×7.
  - 11.17-12.03: **date ticker 11/12/2025 → 23/12/2025**, one day every 2 frames, under "Dias e dias".
  - 12.03 "Encontrar": Bounce Left 0.5 s, magnifier.
  - 12.83: a double pulse pop 0.01→1.2→0.9→1.0 (hold) →0.9→1.0.
  - 14.30-16.17: word-by-word caption. **Each new word gets a 1-frame blue `#1DA1FF` duplicate flash** ("isso", "você", "dúvidas") while the whole clip scales 3→0.01 over 1.87 s.
- **R:** mostly. 3D Rotation is doable with CSS 3D; Player 3 is approximated.
- **Dark identity:**
  - **Date ticker:** use it for "dias sem confessar", liturgical dates, novena days.
  - **1-frame accent flash on keywords:** in `#5B4BFF`.

### Economizar (9.5 s): "É que você pode ECONOMIZAR ATÉ 90% NESSAS ASSINATURAS… 100% PRIVADA… TUDO QUE QUISER… Sem precisar pagar PREÇOS… Você recebe Garantia / Suporte"
- **Look:** light grid, then an acid-green `#82FF00` flash, purple `#B74AFA`, black. Tusker Grotesk condensed plus Degular. Greenscreen spinning 3D "$", streaming-app icons.
- **Moments:**
  - 0.47-1.10 "ECONOMIZAR": 10 alternating 1-frame colour swaps (black ↔ green `#27E68E`), a **colour strobe**.
  - 1.17 "ATÉ": sc 10 (full width).
  - 1.63-1.90: **counter 10%→80%**, then 90% with a green neon stroke version.
  - 3.33-3.83: "67% PRIVADA → 99% PRIVADA" (15 frames), then "100% PRIVADA" inside a neon outline.
  - 6.37 "PREÇOS": **Flicker 0.8 s**.
  - 7.97: checklist "Garantia / Suporte" in a rounded card.
- **Transitions:** 3 **Mix** dissolves (0.467 s). Speeds 3.0× / 0.69×.
- **Effect:** Glow 2 (3.33-7.1).
- **R: fully.** The greenscreen needs a chroma key (possible with a canvas shader) or a PNG sequence instead.
- **Dark identity:** counters and the colour strobe on one word (white ↔ `#5B4BFF`, 1-frame). Skip the neon outlines, which break the no-outline rule.

### Gerenic (15.4 s): "NOT A GENERIC VERSION OF IT… WHAT YOU GET ISN'T A MOCKUP OR A DEMO… IT'S A REAL WORKING APP… FROM IDEA… THE ONLY THING STANDING BETWEEN YOU… A CUSTOM BUSINESS APP NOW… EditAssets link na bio"
- **Look:** dark grid, white Degular Semibold caps, blue `#3B6AFF` / `#1EB1FE` keywords, a brain PNG, phone mockups, brand logos. Copied from `RefJoão12.mp4`.
- **Moments:**
  - 0.00-0.60: caps words with 2-frame stagger, each word popping 0.01→1.05→0.98→1.0 plus a small secondary element 0.01→0.48→0.44→0.45.
  - 1.80-3.87: two-layer black-on-white caption (x2) with "A MOCKUP" in light blue sc 2.95.
  - 10.80-12.30: **single-word replacement** captions "A / CUSTOM / BUSINESS / APP / NOW", one word on screen at a time at 0.17-0.37 s each.
  - 12.30: **Manifest 1.0 s** logo text, then "link na bio" with **Bounce Left 0.9 s**.
- **Effects:**
  - Glow 2 on three compounds (size 0.7, luminance 0.1).
  - Global Wide Angle 0.15, B&W Comic 2 0.5, FPS Lag 0.12, Enhance.
  - 13 Split masks as bar wipes (2.13 / 2.47 / 2.8 s).
- **R:** mostly (the global stylisers are approximate).
- **Dark identity:** very close already (dark, caps, one blue keyword). Replace blue with `#5B4BFF`; the brain becomes a heart / Sacred Heart line-art.

### Glitch (16.4 s): "Things can get… endless message… What if you could… One question is all you need. EditAssets. Adquira agora!"
- **Look:** black → sky/phone → white → black. The finished export is bundled.
- **Moments:**
  - 0.00: "Things can get" with **Flicker (out) 0.2-0.5 s** and **Glitch Block** (0.5, 1.23 s).
  - 1.47-2.90: **Chrome Blur** (horizontal chromatic 0.52-0.55, blur 0.1-0.7) plus Blur 0.75.
  - A photo-collage ring spins in.
  - 2.83-4.93: speed 1.618 with 1-frame repeated slices (stutter).
  - 4.93-6.47: a **cloud of chat bubbles** ("Wyd today gng?" …) pops in at 1-frame steps.
  - 6.47: "What if you cold": 3-frame stagger, then **thin crosshair lines**. Four 1-px lines grow from 0.01 to full length over 1.33 s and frame the "&" logo like a registration mark.
  - 7.87-9.23: **Shake** (intensity 0.2→0, speed 0.15→0 over 0.93 s).
  - 10.63-13.23 "One question / is / all / you / need.": serif-free minimal black on white, words land one by one.
  - 13.13-13.33: three one-frame Rectangle-mask slices (a hard glitch), then "EditAssets" tiny (sc 0.01 growing).
  - 15.13 "Adquira agora!": white on black with glow.
- **R:** mostly. Glitch Block and Chrome Blur are approximated (RGB split + slice offsets); everything else is exact.
- **Dark identity:** **the crosshair/registration lines and the white-on-black minimal word landing are exactly "editorial premium"**. Skip the chat slang.

### Nokia (10.8 s): "So Ask Yourself AT WHAT POINT DOES A COMPANY STOP BEING A BUSINESS and Start becoming a machine… FOR THIS VIDEO YOU'LL FIND IT AT. EDITASSETS.COM"
- **Look:** green felt desk, wood and denim textures, props (Nokia phone, alarm clock, magnifier, handbag), white Bold caps with a drop shadow, yellow `#F2C801`.
- **Moments:**
  - 0.00: "So Ask Yourself" sc 4.25, 0.1 s stagger.
  - 1.20: six caps words at 2-frame stagger.
  - 4.27: **Typewriter 0.77 s**.
  - 4.87: **Misaligned Glitch** 0.33 s.
  - 8.63: **Type 1 0.5 s** in yellow.
  - 9.60: "EDITASSETS.COM" ×3 layers with **Manifest 1.0 s**.
  - Rounded Rectangle masks (round 0.15).
- **Effects:** global **B&W Comic 2 0.6**, **FPS Lag 0.12**, 4K.
- **R:** mostly. There are no caches or export for Nokia itself; the only preview is the cover.
- **Dark identity:** B&W comic look + FPS lag gives a "printed / stop-motion" texture. Use it sparingly on sacred-art inserts.

### Perfeccionismo (13.7 s): "Você já parou para PENSAR… PERFECCIONISMO… CÂNCER… Não destrói só sua CRIATIVIDADE mas também sua chance de Chegar onde você quer… PERFECCIONISMO parece nobre, mas na prática, ele só te atrasa"
- **Look:** white/stone. B&W classical sculpture cut-outs (The Thinker, an Ionic column, a Zeus bust, **Michelangelo's Creation-of-Adam hands**, Medusa, Friedrich's *Wanderer above the Sea of Fog*, a clock, a pocket watch). Black **Playfair Display** serif mixed with Degular Light and **Tusker Grotesk** condensed.
  - Music: "Violin solo song echoing in the church".
- **Moments:**
  - 0.00: "Você já" in Playfair sc 2.4 + "parou para" in Degular Light sc 0.9 + "PENSAR" in Playfair SemiBold sc 2.8, 2-frame stagger.
  - 1.60 "PERFEC" + 2.20 "CIONISMO": the word is **split across two lines/fonts**, revealed through Split masks, with Type 1 0.5 / 0.6 s.
  - 3.50 "CÂNCER": Playfair sc 3.05 at speed 1.5.
  - 6.80-9.67: one-word-at-a-time Playfair Bold captions ("mas também" / "sua chance" / "de" / "Chegar").
  - 9.67: "PERFECCIONISMO" with **Bounce Left 1.3 s**, and **Distorted** on the statue compound (9.67-13.7).
- **Effects:** global **B&W Comic 2 0.55** + **FPS Lag 0.12**.
- **R:** mostly (Distorted and B&W Comic are approximate).
- **Dark identity:** **the closest to the *grace* Catholic editorial look.** Classical art, serif + sans lockups, church violin. Invert to black background with white Playfair and one `#5B4BFF` word.

### Profissional (15.5 s): "Tá precisando Criativos? Pix enviado R$0→R$103… Então você chegou no lugar certo… Com edição Profissional / Dinâmico / Extrema qualidade… Tudo no estilo Apple… Efeitos sonoros exclusivos… e narração já inclusa… Profissional"
- **Look:** white/grey, **Sora** (Apple-like) font, greys `#898988`, `#3F3F3F`. Bundles the Glitch / Economizar / Gmail / UseAssets exports as screen content.
- **Moments:**
  - 0.70: "Criativos" ×3 **1-frame-offset echo** (sc 2.4 / 2.1 / 0.01), a zoom-through.
  - 1.27-2.33: **Pix receipt card** ("Pix enviado / Sobre a transação / Data do pagamento / Sábado, 20/09/2025 / 15:45"), a value counter R$0→R$103, and four "$" glyphs popping 0.01→1.25→0.9→1.05→1.0.
  - 3.87 "Criativos": **Wave in 1.0 s**.
  - 6.63-8.93: three rounded-rect cards (Rectangle masks round 0.25) holding the sibling videos.
  - 13.07: **Bounce Left 0.9 / 1.0 s**.
  - 14.67-15.43 "Profissional": a **stacked echo**. Five copies at sc 2.5 / 2.25 / 1.65 / 1.0 in greys `#B0B0B0` / `#888888` / white, staggered by 2 frames.
  - The card swings in: X −1.389→0 with rotation −40→15→−5→0 (FreeCurveInOut, 8-frame steps), and a moving Split mask sweeps across.
- **Effects:** Blur 0.5 (5.33-6.17).
- **R: fully.**
- **Dark identity:** the stacked grey echo and the swing-in rotation elastic suit title cards. The Pix receipt maps to an "intenção / oração" card.

### Quadro (21.0 s): "Capcut é 'Brinquedo de iniciante'… Não dá pra ganhar dinheiro com isso… Tá bom… ENTÃO PORQUE VOCÊ ACABOU DE PARAR NESSE VÍDEO… Fechei contrato com gente que paga alto… SÓ COM O CELULAR… Link na bio. Vem pro EditClass"
- **Look:** a classroom chalkboard with a pinned "wanted" paper and a CRT computer. Stock footage: a woman praying silhouette, a man in misty forest, a beach run, a spotlight silhouette, a red stop button. Light-leak and "punch hole" overlays, money rain, a hand-drawn arrow `.mov`. Cute Cat handwriting + Tusker caps in dark red `#650504`.
- **Moments:**
  - 0.00-4.30: a chalk-style "Classe: Brinquedo / Software: CapCut" label.
  - 4.83-7.40: Tusker caps lines at 0.33-0.5 s steps.
  - 8.80-10.13: **"Brinquedo de iniciante" ×3 layers with Gradual Reveal 1.1 s**, under a **punch-in combo**: **Fisheye 0.7 + Radial Blur 2 (size 0.42, intensity 0.7) + Chrome Blur (chromatic 0.52)**.
  - 10.13-14.43: speed 0.806 slow-mo with a long handwritten caption.
  - 17.67 / 18.67: "Link na bio" / "Vem pro EditClass" at 0.1-0.17 s stagger.
- **Effects:**
  - Filters: Bokeh throughout.
  - B&W Comic 2 at 0.5 / 0.25 / 0.55 by section.
  - Vignette (texture 1.0) on 0-4.3 and 10.1-17.7.
- **R:** mostly. The Fisheye / Radial / Chrome combo is approximated (SVG displacement + zoom-blur copies + RGB split).
- **Dark identity:**
  - The **silhouette-praying / misty-forest stock plus a vignette** fits Catholic reels well.
  - The punch-in distortion combo works once per video, at the "turn" line.
  - Avoid the chalkboard gag.

### Scale (14.1 s): "a lot of people Want no Difficulty… You Wish… and I've looked to see it… Don't Change your business… All businesses are SCALABLE… How hard is it to SCALE?"
- **Look:** charcoal with **glowing mint-green `#30D784` / `#61FFB8` Playfair Bold / Black Italic** serif, white Degular body lines, chains PNG, a line chart, sparkle stars, blurred green X shapes. Copied from `RefJoão14.mp4`.
- **Moments:**
  - 0.00-4.37: hierarchy lockup (Playfair Bold "Difficulty" sc 3.7 + small words + four tiny sc 0.4 body lines at 0.17-0.33 s steps).
  - 0.83 / 1.00: **giant ghost words** "You" (sc 10) and "Wish" (sc 4.25) in dark `#303C3B` Playfair Italic drift across (X +1.94→+0.44 and −1.57→−0.54 over 3.4-3.5 s, alpha 0→1 in 0.33 s), with **Type 2 0.7 s**.
  - 4.37: **Inhale 0.8 / 1.0 s** on the serif words, **Flicker 1.0 s** on "EditAssets".
  - 9.53 "SCALABLE": **Bounce Left 1.5 s**, a chart line drawing.
  - 11.43: three huge "?" (sc 9 / 6 / 6) behind "How hard is it to SCALE".
- **Effects:**
  - Glow 2 on every scene (luminance 0.15-0.6, size 0.7-0.81).
  - Global Wide Angle 0.4, Vignette, B&W Comic 2 0.45, plus Blur 0.25 at the end.
  - 22 Split masks (feathered wipes 0.45-0.49).
- **R:** mostly (the glow and stylisers are approximate).
- **Dark identity:** **ghost serif words drifting behind the caption** plus serif/sans lockups are premium. Glow must be subtle and `#5B4BFF` / white instead of mint.

### Solução (11.4 s): "O Problema É que o Mercado Não enxerga Real valor… Solução… Não Entende… Mas… Não Converte… Estratégia / Execução… Escalar sua operação… Desempenho"
- **Look:** dark navy/blue neon with a red `#FB0339` "Mas…" state, Orbitron ExtraBold, icon pills (gear, check), a person icon crossed out. Copied from `RefJoão2.mp4`.
- **Moments:**
  - 0.00: "O Problema": two layers with **Player 3** (rotate 0.25).
  - 1.17 "Não enxerga": ×3 layers.
  - 2.13 "Real valor" / 2.93 "Solução": Player 3 (rotate 0.36).
  - 6.00 "Mas…": red.
  - 7.53 "Estratégia / Execução" pills with **Random Typewriter 0.5 / 0.7 s**.
  - 9.23 "Escalar sua operação": a staircase layout.
- **Transitions:** 4 **Mix** dissolves (0.467 / 0.133 s). Glow 2 over the whole video. 23 Split + 10 Circle masks.
- **R:** mostly (Player 3 is approximated).
- **Dark identity:** the problem/solution colour-state switch (white → one alert colour → back) and the icon pills. Replace Orbitron.

## 6.4 Itens nativos do CapCut usados nos 17 projetos (só nomes)
- **Text animations:** Type 1, Type 2, Typewriter, Random Typewriter, Text Fade In, Bounce Left, Wave in, Manifest, Flicker (in/out), Inhale, Gradual Reveal.
- **Video effects:** Blur, Glow 2, Player 3, B&W Comic 2, FPS Lag, Wide Angle, Shake, Vignette, Fisheye, Radial Blur 2, Chrome Blur, Glitch Block, Misaligned Glitch, Sunset 1, 3D Rotation, Distorted.
- **Filters:** Enhance, 4K, Bokeh.
- **Transitions:** only "Mix" (cross-dissolve).
- **Masks:** Split, Circle, Filmstrip, Rectangle (with feather, round-corner, invert, and animated position / size / rotation).
- **Recreatability of the built-ins:**
  - **Exact:** every keyframed transform, counters, tickers, 1-frame swaps, stagger, masks, Mix, Blur, FPS Lag, Vignette, Shake (seeded noise).
  - **Approximate:** Bounce Left, Wave in, Manifest, Inhale, Gradual Reveal, Flicker, Glow 2, B&W Comic 2, Wide Angle / Fisheye, Radial Blur, Chrome Blur, Glitch Block, Player 3, 3D Rotation, Sunset, Distorted.
  - **Not recreatable 1:1:** none. The unknown parts are only exact CapCut curves or shader looks.

## 6.5 Licenças e cuidado com assets
- **Fonts:**
  - Degular and Tusker Grotesk are commercial (OH no Type Co.). Cute Cat and Bebas Neue have mixed licences.
  - Playfair Display, Sora, Orbitron and Bricolage are OFL.
  - The example *grace* identity (v11) already uses OFL Playfair / Inter Tight / Archivo.
- **Media:** stock (Vecteezy, pindown.io, green-screen YouTube rips), film/TV stills (Zootopia, Breaking Bad), brand logos (Nike, Pepsi, Starbucks, McDonald's, Netflix, HBO), and songs (Tame Impala "Loser", "doja.mp3") are third-party. Use them as reference only, never as assets.

# Anúncio de cliente — técnicas de texto (estudo frame a frame)

> **Resumo (pt-BR):** estudo frame a frame das entradas de texto de um anúncio de referência (a base dos destaques do kit: `WordRise`, `BarReveal`, `BlurReveal`, `MaskRise`, `SlideIn`, `EchoStack`, `SlamCard` em `template/src/kit/Highlights.tsx`). O vídeo de referência não acompanha o kit.

Source: `client_ad_ref.mp4` (2160x3840, 30 fps, 92 s) + `client_ad_ref_720.mp4` proxy. Studied on 2026-09-27 by pulling every frame (30 fps) around each text moment
(working strips in `footage/work/v11/ref/`). Frame numbers = proxy frame index (t*30). Pixel sizes are for a 1080x1920 canvas.

## 0. Look geral
- **Canvas**: text almost always sits on **solid black** or on footage that has been **darkened / faded into a black gradient** right where the text is. There are no text boxes, drop shadows or outlines (except the HOJE bar).
- **B-roll framing**: often a **rounded-rect card** (about 88% width, corner radius about 4% of width, so about 40-48 px at 1080) floating on solid black. Words hide behind and emerge from the card's edges.
- **Cuts**: hard cuts only. No glitches, light leaks, flashes or zoom blurs between shots. Text layers also end on a **hard cut** (no exit animation); on longer holds they keep drifting until the cut.
- **Grade**: moody, contrasty, slightly desaturated, deep crushed blacks, highlights intact, skin natural. No visible grain.
- **Colour logic**: white for the main words, **one accent colour** (yellow in his ad) for 1 anchor word per phrase. Red appears only on the DIFERENTE streak.
- **Continuous life**: almost every text block slowly scales up (about +3-6% per second) or drifts after its entrance. It is never frozen.

## 1. Tipografia
| Role | Look | Offline match |
|---|---|---|
| Keyword caps (A ROUPA, PESQUISA, NOVA FORMA, NO CONTROLE) | extended, very heavy geometric caps, tracking about 0 to +2% | **Archivo wdth 125 wght 900** (or Montserrat Black) |
| Grotesk phrases (Quase Tudo, Na Palma, se explicar, por você) | Helvetica/Neue-Haas-like, bold to heavy, **mixed/lowercase**, tight tracking (-3%), **leading 0.8-0.85** | **Inter Tight 700-800** |
| Small secondary line (na sua vida, de sua mão!, para ninguém, Sem alguém decidindo) | same grotesk at 500-600, **30-40% of the main size**, sits tight under/over the main word, often in accent colour | Inter Tight 500-600 |
| Rounded friendly (Posso te ajudar?) | geometric rounded sans, semibold, mixed case | Montserrat/Poppins 600 |
| Elegant (Vai / Morar) | "Vai" = calligraphic italic script; "Morar" = high-contrast display serif, lowercase; a tiny caps sans kicker "A ONDE" above | Great Vibes / Pinyon (script) + Playfair Display (serif) |

Sizes: 1-3 words per screen. Main word cap height about 120-190 px (words span 60-85% of the width). The secondary line is about 40-60 px.

## 2. Entradas, frame a frame

### A. Word-by-word caption rise (0:00-0:03)
- Each word: opacity 30% -> 100% and y +8-10 px -> 0 over **4 frames**, ease-out (cubic). The next word starts as the previous one lands.
- Whole-line horizontal slide ("A ROUPA", "QUE VAI VESTIR"): the line enters from off-screen right to its rest position in **8-10 frames**, strong ease-out (expo), no blur.

### B. Solid bar sliding in behind the word — "HOJE" (frames 150-173)
- f150 is black. **f151-155**: a solid accent bar (yellow) grows rightward from a left anchor, ease-out. Its height is about 1.15x the cap height.
- **From f156**: black heavy caps "HOJE" are revealed left to right, **masked by the bar's advancing right edge**. The text is knocked out of the bar colour (black text on the accent colour).
- The bar keeps extending past the text with a decelerating ease until about f173. Left padding is about 75 px (4K) before the text. **Hard cut** at f174.
- Total: about 5 frames to reach text, about 22 frames to settle.
- SFX: a soft swish/slide.

### C. Gradient blur reveal — "Quase / Tudo" (174-190), "Na / Palma / de sua mão!" (236-282), "Vai Morar" (2519-2552)
- Per word: **gaussian blur 12-20 px -> 0 and opacity 0.4 -> 1 over 10-15 frames**, ease-out. The second word is staggered **2 frames** (for "Morar", letters stagger left to right, about 1-2 frames per letter).
- **Persistent horizontal gradient fill**: white at each word's left, fading to about 40% grey at its right end. It stays after the reveal.
- The stack uses very tight leading with the second word offset to the right (staircase).
- A small lowercase line wipes in **left to right with a soft-edged mask** (feather about 20% of the width) over **15-25 frames**.
- The block keeps slowly scaling up and drifting. The footage above is faded to black behind it.
- Kicker "A ONDE": small caps fade in over about 5 frames before the script word.

### D. Emerge from behind a card edge — "PESQUISA" (294-299), "COMPARA" (326-329), "VOCÊ" (1569-1576), "NO CONTROLE" (1585-1592)
- The word is **masked by the rounded card's top edge** and rises up out from behind it (or drops down from behind the bottom edge) with **vertical motion blur**. It takes **3-6 frames**, ease-out, then creeps a few px more.
- Accent colour or white extended caps.

### E. Curved motion-blur swoop — "Posso / te / ajudar?" (1013-1043)
- On black. Each word flies in along a **curved arc**, arriving **rotated about 15-20°** and straightening. It has heavy **directional motion blur** (streaks along the path) and lands in **2-3 frames** (f1013-1015; "te" at 1026-1027; "ajudar?" at 1033-1034).
- After landing, the whole composition slowly zooms and drifts.
- SFX: a broadband whoosh peaking at the landing frame (spectrogram: noise swell of about 0.25 s at 34.0 s).

### F. Mask rise from a baseline — "se explicar / para ninguém" (1406-1433)
- The main word rises from below an invisible horizontal mask line in **about 4 frames** (1406-1410), ease-out, and keeps scaling up slowly.
- The accent secondary line rises from its own mask about 15 frames later (1421-1425).

### G. Light-streak strike — "DIFERENTE" (≈1509-1545)
- On black. The accent heavy caps start at **scale about 0.4 and grow continuously** (ease-out) through the shot.
- A **soft glowing red streak** (a blurred line at x-height middle, about 8% of the cap height, with a glow) **travels left to right across the letters** in about 20 frames. The letters get a pale shine where the streak passes.
- It is a moving strike-through light, not a static line.

### H. Grey-to-white fill — "Sem alguém decidindo / por você" (2059-2111)
- Small accent words appear one per 3-4 frames (opacity 20% -> 100% over 4 frames).
- The big lowercase heavy "por você" appears at f2074 as **dark grey (about 15% luminance)** and **fills to pure white over about 12 frames** (2074-2086), linear to ease-out. The circumflex "^" drops in separately (2081-2087) with a small overshoot.
- The block drifts slowly left. It hard cuts at f2111.
- Note: the earlier "outline that fills with white" description matches this moment. On inspection it is a luminance fill, with no visible stroke. An outline-to-fill (a thin white stroke whose interior fills with white) is the stylised version of the same idea.

### I. Hard pop stack — "NOVA / FORMA / DE / COMPRAR / IMÓVEIS" (2555-2640)
- Each word **appears instantly (0 frames, no easing)** on its beat, stacked centred, alternating white / accent.
- The footage is darkened. The ending "AGUARDEM..." is an accent italic.
- SFX: clicks/ticks on each pop (spectrogram shows sharp transients at 7.3, 7.55 and 7.85 s under pop-ins).

## 3. Saídas
- Almost always a **hard cut** with the shot. Nothing fades out.

## 4. SFX combinando
- Whoosh = swoop/fly-ins. Short click/tick = hard pops and small words. Soft swish = bars/slides. Riser or impact under hero moments.
- Every visual event has a sound, sitting well under the voice.

## 5. Checklist de reuso
1. One idea on screen at a time, 1-3 words, huge. Hide the running caption while it shows.
2. Pick the entrance by meaning: bar = "today/now" emphasis, blur reveal = soft/emotional, swoop = question/invitation, streak = contrast/negation, fill = revelation, serif = sacred/elegant, pop = list/rhythm.
3. Darken or black-gradient behind the text instead of outlines.
4. Keep the text alive (slow scale/drift), then end on a hard cut.
5. Pair every entrance with an SFX at the landing frame.

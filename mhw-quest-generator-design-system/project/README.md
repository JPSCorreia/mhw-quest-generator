# MHW Quest Generator — Design System

A design system for the **Monster Hunter: World Quest Generator** — a small hobby app that rolls a random monster + weapon pairing for players who've finished all MHW content and want a fresh hunt. The original tool is functional but visually bare; this system recasts it in the ceremonial, heraldic, quest-board aesthetic that Monster Hunter: World is known for.

## Sources

- **Codebase:** [JPSCorreia/mhw-quest-generator](https://github.com/JPSCorreia/mhw-quest-generator) (imported 2026-04 @ `main`) — React 18 + MobX + Vite. Checked-in assets: 14 weapon icons (PNG), 73 monster portraits (WebP), `mhw.svg` crest, and two purple-banner background images (`background.jpg`, `background2.jpg`, `versus.png`).
- **Live demo:** https://jpscorreia.github.io/mhw-quest-generator
- **Brand inspiration (fair-use reference only):** Capcom's *Monster Hunter: World* (2018) in-game UI — quest board, research commission crest, Astera palette.

This design system amplifies the existing visual DNA present in the game's assets (the dark-violet banner stage, the silver heraldic crest with an emerald gemstone, the grim monster bestiary portraits) and applies it consistently across the generator app.

---

## Product surface

There is **one product**: a single-page hobby app.

1. **Quest Generator** — picks a random weapon + monster from user-filterable pools. Sidebar of weapon checkboxes, sidebar of monster-tier toggles, big `Generate Quest` button, last-20 history panel.

---

## Index

| File | What's in it |
| --- | --- |
| `README.md` | This file — high-level context, fundamentals, iconography |
| `colors_and_type.css` | All design tokens: colors, type scale, spacing, radii, shadows, motion |
| `SKILL.md` | Claude Skill manifest — lets this system be invoked as a skill |
| `assets/` | Logos, backgrounds, monster portraits, weapon icons, versus mark |
| `assets/monsters/` | 73 WebP monster portraits (lifted directly from the repo) |
| `assets/weapons/` | 14 PNG weapon-type icons |
| `assets/mhw-logo.svg` | The Research Commission crest |
| `assets/backgrounds/` | `background.jpg` (purple banners), `background2.jpg` (dark crest) |
| `preview/` | Design-system cards (type, color, components, etc.) |
| `ui_kits/quest_generator/` | Hi-fi interactive recreation of the app |

---

## CONTENT FUNDAMENTALS

The original code copy is sparse and blunt (button labels, checkbox labels, an `alert()` here and there). The system's voice elevates that without becoming purple-prose RPG-speak. Write like a **Research Commission notice board** — official, a little ceremonial, economical.

### Voice

- **Second person, active, imperative** for player-facing calls to action. "Accept this commission." "Sharpen your blade." Not "you will be hunting…".
- **Third-person formal** for flavor and framing. "A summons has been issued." "The quarry has been sighted in the Ancient Forest."
- **Plainspoken UI** for settings, controls, toggles. "Include Low Rank Monsters". Sentence-case fragments, no period. Match existing code conventions (e.g. `Prevent Weapon Repeat`, `Reduce Bowgun Frequency`).

### Tone

| Context | Tone | Example |
| --- | --- | --- |
| Primary CTA | Summoning, imperative | **Generate Quest** → **Post Commission** (flavor variant) |
| Section headers | Ceremonial | `Weapons`, `Monsters`, `Options` → **Armory**, **Bestiary**, **Commission Terms** |
| Empty state | Dry, helpful | "No quests issued yet. The board is empty." |
| Error / validation | Firm, not cute | "Select at least one weapon to post a commission." |
| Result / flavor | Punchy | "Rathalos sighted. Bow authorized." |

### Casing

- **Display type (h1, h2):** ALL-CAPS with wide tracking (~0.16em). Matches the engraved feel of the in-game crest.
- **Buttons:** Title Case OR All Caps with tracking — never sentence case.
- **Checkbox labels, inline UI:** Title Case, short. ("Prevent Weapon Repeat")
- **Body / flavor:** Sentence case. Full sentences with periods.

### Specific rules

- **No emoji.** The brand uses heraldic ornaments and engraved glyphs, not emoji. A 💀 next to "danger" would instantly break the tone.
- **Never shorten** "Monster Hunter: World" to "MH:W" in display type; only "MHW" in metadata / file paths.
- Prefer **"hunter"** over "player", **"quarry"** or **"monster"** over "enemy", **"commission"** or **"quest"** over "task".
- Numbers: use numerals for ranks (`Rank 5`), spell out for flavor (`the twelve blades`).
- Avoid exclamation marks except in the single dramatic context of a new quest posting.

### Examples

> *Eyebrow:* RESEARCH COMMISSION № 047
> *Title:* A SKYWARD CALAMITY
> *Body:* The Rathalos has reclaimed its roost above the Ancient Forest. Armory recommends piercing damage. Return with its ruby, or do not return.
> *Button:* ACCEPT COMMISSION

> *Empty state:* No quests issued yet. The board is empty.

> *Validation:* Select at least one weapon to post a commission.

---

## VISUAL FOUNDATIONS

### Colors

The palette has three families:

- **Ink** (`--ink-800` #140d1f → `--ink-500` #3b2d57) — deep violet-black, the gathering-hall night. This is the app's default background. Not pure black: always has a faint purple cast.
- **Parchment** (`--parch-100` #f4e8cf → `--parch-500` #6b5432) — the scroll / quest-board surface. Used for foreground cards and printed information.
- **Metallic** (`--gold-300` #d9b24e / `--silver-200` #d6d4ce) — the heraldic crest and frame hairlines. Always paired with a subtle glow, never a flat color.

Accents:

- **Emerald glow** (`--emerald-500` #21c94a) — the signature green gemstone in the Commission crest. Use sparingly: active selections, primary CTA, live indicators.
- **Crimson** (`--crimson-500` #e0473a) — danger / destructive actions / elder-dragon rarity.
- **Tier colors** (green / amber / ember / violet) for monster rank.

### Type

Four families:

1. **Cinzel** (display, Roman-engraved caps) — h1/h2/h3, buttons, crest text
2. **Marcellus** (serif body) — parchment content, quest descriptions
3. **Inter** (UI sans) — checkboxes, small labels, settings
4. **JetBrains Mono** (mono) — stat numbers, IDs, counters

> ⚠️ **Font substitution notice:** The original repo ships no custom fonts (uses browser defaults). Cinzel + Marcellus are the closest **Google Fonts** match to the game's proprietary engraved-Roman and serif faces. Please provide the licensed Capcom font files to replace.

Display type is always **uppercase with wide tracking** (`--track-wider` 0.16em / `--track-widest` 0.28em). Body serif is **never tracked**.

### Spacing & rhythm

4/8/12/16/24/32/48/64 scale (`--space-1` through `--space-8`). Cards sit on an 8px grid. Hit targets ≥ 44px. Quest board elements (chips, ornaments) break the grid intentionally — they aren't aligned to the 8px baseline, they hang like banners.

### Backgrounds

- **Default app bg:** Deep violet gradient (`--ink-800` → `--ink-700`) with a subtle SVG-noise grain overlay.
- **Hero / menu:** Full-bleed `assets/backgrounds/background.jpg` (the five guild banners) with a 40% dark-violet multiply layer over it.
- **Section bg:** `background2.jpg` (silver crest on black) used as a watermark centered and low-opacity.
- Textures: fine film grain via inline SVG turbulence — never rasterized PNG noise. Avoid gradients that shift hue; keep all gradients monochrome-within-family (purple → purple, gold → gold).

### Illustration & imagery

- Monster portraits (`assets/monsters/*.webp`) — stylized flat illustration with texture, triangular spiky silhouettes, muted earth tones with one high-saturation accent (Nergigante's pink fangs, Anjanath's orange). Always shown square, no border.
- Weapon icons (`assets/weapons/*.png`) — black line-art on transparent, off-white fill. Used small (32-64px) for chips, large (160px+) on the commission card.
- Color vibe of all imagery: **warm-grit over cool-dark**. Warm ochres / rusts foreground on cold violet background. Never saturated cartoon colors.

### Borders & frames

- **Hairline borders:** 1px gold at 35% opacity (`--border`). Used everywhere for framing.
- **Strong frames:** 2px `--gold-500` for primary surfaces (quest card, hero crest).
- **Parchment edges:** 1px `--parch-500` at 45% opacity for paper-on-dark contrast.
- Where possible, **clip-path corners** (`--cut-corner`, 14px diagonal cuts) replace rounded corners on ceremonial surfaces. Chamfered, never rounded.

### Corner radii

- Ceremonial surfaces (quest cards, hero, main panels): **clip-path chamfer**, NOT border-radius.
- UI chrome (buttons, chips, inputs): `--radius-sm` (4px) for sharp, `--radius-md` (6px) default.
- Pill (rare, for count badges): `--radius-pill`.
- Avoid `--radius-xl` — the brand doesn't have soft/friendly surfaces.

### Cards

A default "quest card" is:

- Background: `--parch-200` parchment on dark, OR `--ink-600` raised ink
- Border: 2px `--gold-500` with inset shadow `--shadow-inset` for the engraved feel
- Corners: chamfered via `--cut-corner`
- Shadow: `--shadow-lg` (offset down-and-inward, heavy)
- Optional: gold filigree ornament in the top corners (SVG), emerald gem for status

### Shadows

- `--shadow-sm/md/lg` for depth (standard offset-blur)
- `--shadow-inset` adds a subtle inner highlight + inner shadow — THE signature effect for engraved metal frames
- Glow shadows: `--glow-emerald`, `--glow-gold`, `--glow-danger` — always outer-glow only (0 0 N), never directional

### Transparency & blur

- Modal backdrops: `rgba(11,7,18,.75)` + `backdrop-filter: blur(8px)`
- Tooltips / floating chips: `rgba(20,13,31,.92)` with 1px gold hairline
- Almost nothing else is transparent — surfaces are opaque, light comes from *glow*, not from translucency.

### Animation

- **Easing:** `--ease-out` (gentle out) is default. `--ease-spring` only on the dramatic CTA (the dice-roll "Generate Quest" reveal).
- **Duration:** 120ms (micro), 260ms (standard), 480ms (dramatic reveal).
- **No bounces** on hovers. One spring per primary action, max.
- **Subtle ambient:** the emerald gem in the crest has a slow 3s opacity pulse (0.8 → 1.0 → 0.8). Ornaments never spin.
- **Reveal:** dice-roll on quest generation — 3 rapid name swaps over ~500ms, then settle with emerald-glow pulse.
- **Crossfades** only; never slide-from-edge. Feels like parchment turning.

### Hover / press / focus

- **Hover:** +4% brightness OR 1px emerald glow outline, never scale
- **Press:** translateY(1px) + brightness -6%. Buttons feel *pressed into stone*.
- **Focus:** 2px emerald outline at 2px offset — matches brand accent.
- **Active selection** (checkboxes, chips): filled parchment with dark ink text, 1px gold border, tiny emerald dot in the corner

### Layout rules

- Max content width: 1280px (original MH:W UI was 16:9 locked).
- Three-column layout on desktop: options (30%) • stage (40%) • history (30%) — matches the existing app.
- Below 840px: history collapses, stage goes full-width, options stack above.
- **Fixed elements:** top header (the research-commission masthead) with the crest watermark. No fixed footer.
- Crest watermarks (low-opacity `background2.jpg`) sit behind major sections, never over text.

---

## ICONOGRAPHY

The brand has two parallel icon languages — **portrait icons** (representational) and **UI glyphs** (symbolic).

### Portrait icons (bitmaps)

- **Monsters:** `assets/monsters/*.webp` — 73 pre-rendered stylized portraits lifted directly from the codebase. Spiky, textured, ~500×500. Always shown square, never cropped to a circle.
- **Weapons:** `assets/weapons/*.png` — 14 silhouette marks, monochrome on transparent. Used at any size from 24px (chip) to 200px (hero).

These are **the canonical icons**. Do not recreate them in SVG, do not substitute with emoji or stock icons. Always reference the file directly.

### UI glyphs

The original codebase uses **no icon library** — just bare HTML checkboxes and text buttons. For the elevated design system we ship a **Lucide** (lucide.dev) CDN subset as the UI glyph system (dice, refresh, chevron, x, check, filter, shield, sword). Lucide's 1.5px stroke, squared line-caps match the sharp silhouette vocabulary of the MHW portraits.

> ⚠️ **Substitution notice:** Lucide is not from the original source. If Capcom's proprietary UI glyphs become available, swap them in. Document overrides here.

Usage rules:

- UI glyphs are always **stroke, never fill**. 1.5px stroke. Color: `var(--fg-muted)` default, `var(--emerald-400)` when active.
- Never mix portrait icons and UI glyphs in the same visual slot (e.g. don't put a Lucide `sword` next to a weapon portrait — pick one).
- No emoji anywhere. Not for status, not for flavor, not for loading.
- No unicode-char icons (★ ◆ ●) as meaningful symbols. They can appear decoratively in display type (e.g. a ◆ in a divider) but never carry state.

### Logo / crest

`assets/mhw-logo.svg` is the Research Commission crest — a silver heraldic shield with a central emerald gem. Used:

- As favicon + browser title bar
- As a watermark behind hero sections (8-12% opacity)
- As the masthead brand mark, ~48-64px with the app title set next to it in Cinzel 900 caps

The emerald gem in the center can be **animated** — slow 3s opacity pulse — when it represents a "live" or "active" state.

---

## Caveats & notes

- Fonts are Google-Fonts approximations. Swap in licensed Capcom faces if available.
- The "Unknown" monster portrait is a decoy used for mystery-tier quests (see UI kit).
- All monster/weapon images are © Capcom, included here only for design-system reference — not for redistribution.

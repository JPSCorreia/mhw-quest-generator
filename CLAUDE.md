# MHW Quest Generator

Hunt-randomizer for Monster Hunter World: Iceborne. Picks a weapon + monster (or a real in-game quest) and shows it as a "commission".

## Stack
- React 18 + Vite 5, MobX 6, bun
- All state in [src/stores/questStore.js](src/stores/questStore.js), persisted to localStorage on every mutation
- Quest data scraped from Kiranico into [src/data/quests.json](src/data/quests.json) by [scripts/scrape_kiranico.mjs](scripts/scrape_kiranico.mjs)

## Layout
- 3-column grid in [src/App.jsx](src/App.jsx): Armory + Bestiary | Stage (commission) | QuestOptions + Field Log
- Right column uses `align-self: stretch; contain: size` so history length doesn't inflate the grid row — Field Log scrolls internally
- Styles: [src/styles/kit.css](src/styles/kit.css) (component styles, scoped under `.qg-root`), [src/styles/tokens.css](src/styles/tokens.css) (CSS vars)

## Domain model ([src/lib/data.js](src/lib/data.js))
- Tiers `LOW_TIER` / `MID_TIER` / `HIGH_TIER` are *roll buckets*, not game ranks
- `SUPER` = Iceborne special threats (Master 6★); `BASE_SPECIAL` = base-game special threats incl. AT variants and Extreme Behemoth (High 9★)
- `VANILLA_MONSTERS` = base-game-only monsters gated by "Include Base Game Only Monsters"
- Temper system: `temperStates(monster)` → roll via `rollTemper()`. Velkhana/Namielle always `archtempered`; SPECIAL_ONLY (Fatalis/Alatreon/Kulve Taroth/Raging Brachydios/Leshen/Ancient Leshen/Behemoth) always `special`; AT-prefixed names → `archtempered`; Extreme Behemoth → `tempered`
- `baseMonster(name)` strips "Arch-Tempered " / "Extreme " prefix — use it before reapplying `TEMPER_LABEL[temperKey]` so prefixes don't double up
- `rankFor(monster)` returns `{name, stars, rank}`. Computes from `MONSTER_MIN_RANK` (built from quests where the monster appears in `q.objective` text — avoids Assigned-quest false positives like "Complete the assignment")

## Star rendering
- Low: 1-5 blue (`#1ddcfa`), High: 6-9 red (`var(--crimson-600)`), Master: 1-6 gold (`#f9d235`)
- Apply `stars stars-{low|high|master}` class on the `<span>`; outline is `-webkit-text-stroke: 0.6px #7f593b`

## Conventions
- Don't mock TEMPER_LABEL onto already-prefixed names — always pass through `baseMonster()` first
- Field Log entries: weapon icon (22px, inline-block) + monster name on line 1; rank/quest name on meta line 2 — no temper-prefix in name (color carries it)
- Special threats: single "Special Threats" header with "Base Game" / "Iceborne" subheaders; chips show `baseMonster(name)`, color via `temperStates(name)[0]` (no border tint)
- Quest mode uses raw `quest.stars` (already correct for the system above); non-quest mode uses `rank.stars`

## Known gaps
- Per-quest tempered/arch-tempered state isn't in Kiranico or any public dataset. The game's `.mib` quest binaries hold it (`temperedFlag` byte + quest-level `ATFlag`); see [AsteriskAmpersand/QuestDataDump](https://github.com/AsteriskAmpersand/QuestDataDump). Quest mode currently sets `temper: 'normal'` for all
- Kiranico's "Assigned" quests have placeholder objectives ("Complete the assignment") so they're filtered out of `QUESTS` but still feed `MONSTER_MIN_RANK` via objective-substring match only

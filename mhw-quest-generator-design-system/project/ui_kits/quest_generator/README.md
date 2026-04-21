# Quest Generator — UI Kit

An interactive, hi-fi recreation of the MHW Random Quest Generator, styled against the full design system.

## Files

- `index.html` — the runnable app (React + Babel inline)
- `QuestGenerator.jsx` — the main composed screen
- `CommissionCard.jsx` — the central parchment result card
- `Armory.jsx` — weapon selector sidebar
- `Bestiary.jsx` — monster tier + super-endgame selector sidebar
- `HistoryScroll.jsx` — last-20 quests rolled scroll
- `Crest.jsx` — the masthead with live emerald pulse
- `MonsterChip.jsx`, `WeaponChip.jsx`, `Check.jsx`, `Btn.jsx` — primitives

## Interactive bits
- Toggle weapons and monster tiers
- Press **POST COMMISSION** → name-roll animation, then a commission card reveal with gold-flash + emerald glow
- **CLEAR BOARD** wipes the history and current quest
- Local-storage persistence mirrors the original app

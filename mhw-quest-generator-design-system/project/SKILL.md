---
name: mhw-quest-generator-design
description: Use this skill to generate well-branded interfaces and assets for the Monster Hunter: World Quest Generator, either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping in a heraldic, ceremonial, quest-board aesthetic.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Key entry points:
- `README.md` — brand context, content fundamentals, visual foundations, iconography
- `colors_and_type.css` — design tokens (CSS vars for color / type / spacing / shadows / motion)
- `assets/` — monster portraits, weapon icons, Research Commission crest, backgrounds
- `ui_kits/quest_generator/` — hi-fi interactive recreation of the app
- `preview/` — individual component and token preview cards

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out of `assets/` into your own project and create static HTML files for the user to view. Link `colors_and_type.css` for the full token palette. If working on production code, read the rules in README.md to become an expert in designing with this brand.

Voice rules in short: ceremonial second-person imperative for CTAs, plainspoken for UI, no emoji, uppercase Cinzel for display type, chamfered corners over rounded. The signature move is the emerald-gem glow from the Research Commission crest — use it sparingly for primary CTAs and active states.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask a few focused questions (audience, surface, fidelity), and act as an expert designer who outputs HTML artifacts or production code depending on the need.

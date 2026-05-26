# Codex Notes

- Always verify the game in both landscape and portrait browser viewports before shipping visual changes.
- Required viewport checks:
  - Desktop landscape: `1672x941`
  - Mobile portrait: `390x844`
- After deployment, verify the public GitHub Pages URL, not only localhost.
- Public deployment checks must confirm:
  - No `404` responses for `assets/generated/*`
  - Background, hero, enemy, and attack effect images are visible
  - Start flow works on the public URL
- The prompt card must never be covered by character sprites, enemy sprites, effects, HUD, keyboard, or hand guide.
- Generated image assets live under `public/assets/generated/`; inspect cutouts after chroma-key removal before wiring them into Phaser.
- Enemy names, HP, sprite keys, and scale must stay connected through `src/game/content/enemies.ts`.
- Run `npm test` and `npm run build` before pushing.

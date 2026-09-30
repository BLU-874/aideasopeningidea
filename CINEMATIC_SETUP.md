# aiDEAS — cinematic landing

Existing Vite + React project in:
`C:\Users\srajal\Downloads\aideas-website-main\aideas-website-main\new-app`

## Bring your 30 frames

1. Extract your ZIP.
2. Copy the ~30 images into:

  public/ai-sequence/

  Any mix of `.png .jpg .jpeg .webp .avif` works.

3. Run:

  npm run dev

That is it. `predev` / `prebuild` auto-run:

  node scripts/generate-frame-manifest.mjs

which natural-sorts the files (`frame2` before `frame10`) and writes:

  src/generated/frameManifest.json

If the folder is missing or empty the site still renders — first
available frame (or logo) shows instantly, no loader, no crash.

## What was integrated

- `scripts/generate-frame-manifest.mjs` — auto discovery, natural sort
- `src/components/AISequence.tsx` — 360vh canvas scrub, DPR cap,
  rAF lerp, nearest-loaded-frame fallback, reduced-motion support
- `src/components/Editorial.tsx` + `Sections.tsx` — statement,
  about, humans×machines, projects, events, people, join
- `src/pages/HomePage.tsx` — cinematic story first, existing
  zigzag/stats/testimonials preserved below
- `src/components/Navbar.tsx` — thin transparent top, dark blur
  after scroll, anchors: About / Projects / Events / Team / Contact
- No loading screen anywhere.

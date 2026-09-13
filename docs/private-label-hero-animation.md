# Private label hero assets

## Source and runtime

- Editable scene: `output/bottle-animation/Basenote Bottle Animation.blend`. It contains separate `Hero Callouts` and `Hero Background` collections and packed fonts. Keep the adjacent Source Serif 4 and Lexend Deca font licences.
- Preview: the adjacent MP4 and PNG show the complete scene. Website frames omit the rendered background and labels so CSS/SVG can adapt them to each viewport.
- `data/private-label-hero-motion.json` stores projected anchors for 121 poses. Labels, mobile positions, asset paths and sprite geometry live in `privateLabel.hero` in `data/site-content.ts`.
- `components/private-label/PrivateLabelHero.tsx` coordinates canvas painting, SVG leaders, responsive cropping and scroll behavior. `lib/hero-frame-sequence.ts` loads the sprite and nearby detail frames.
- Deliverables are in `public/media/private-label/hero/`: 121 desktop and mobile WebPs, closed/open stills, and `scrub-preview.webp`. Sprite tiles are 320×180 in 11 columns; keep encoder geometry and content configuration aligned.

Scroll position selects the nearest original pose; the bottle, anchors and crop use that same pose. Preserve whole-frame rendering without blending or delayed settling. Repeated updates within a pose should skip painting, and canvas resolution should not exceed the source.

A single preview sprite makes all poses available first. Two background loaders fetch nearby detail and retain at most eight decoded detail frames. The preview remains usable if detail loading fails; an exploded still covers unavailable frames. Cancel downloads, decoding callbacks and animation work on teardown.

Desktop pins while scrubbing; mobile scrubs without pinning. Reduced motion displays the exploded still. The four leaders identify lid/atomizer, fragrance oil, bottle/packaging, and branding/marketing. The background remains CSS in the private-label palette.

## Regenerate from the edited scene

Run from the repository root with Blender available:

```sh
blender --background --disable-autoexec \
  "output/bottle-animation/Basenote Bottle Animation.blend" \
  --python scripts/prepare-private-label-hero.py -- --mode frames
node scripts/encode-private-label-hero.mjs
```

The renderer writes numbered PNGs to `/private/tmp/basenote-bottle-work/frames/`. The encoder requires exactly 121 frames and creates the web deliverables. It also accepts an alternate input directory as its positional argument.

Use `--mode preview` to render the complete scene with labels/background, or `--mode draft` for three representative poses. These images go to `/private/tmp/basenote-bottle-work/preview/`.

`--mode build` is for the original supplied scene, not for re-rendering the edited scene. It expects `SourceSerif4.ttf` and `LexendDeca.ttf` in the scratch directory, saves an edited copy under `output/bottle-animation/`, and writes the motion metadata. The edited scene can be rendered without those external font files.

To rebuild only the sprite from committed desktop WebPs:

```sh
node scripts/encode-private-label-hero.mjs --preview-only
```

## Checks after asset changes

Run lint/build and the focused cases in `lib/hero-frame-sequence.test.ts` (compile the TypeScript files before running the Node test runner). Verify that the server actually serves the generated frames, then check forward/reverse scrubbing, crop/leader alignment, cold loading, blocked detail requests, fallback stills, desktop pin release, mobile layout, and initial/live reduced motion. Retain original-pose behavior when optimizing loading or rendering.

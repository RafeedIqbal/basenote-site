# Private label hero animation

The hero uses the supplied bottle scene, with animated leaders for **Lid and atomizer**, **Fragrance oil**, **Bottle and packaging**, and **Branding and marketing**. Its orange gradients use the page's Canyon Red and Desert Varnish palette. Existing hero copy and contact links are retained.

- Editable scene: `output/bottle-animation/Basenote Bottle Animation.blend`.
- Video preview: `output/bottle-animation/Basenote Bottle Animation.mp4` (includes a two-second hold at the end).
- The Blender scene has separate `Hero Callouts` and `Hero Background` collections. Fonts are packed; missing source textures were replaced with editable label lettering. Invalid imported material indices were corrected.
- 121 frames retain the supplied camera and bottle movement, resampled across the original frame range 2–60. `data/private-label-hero-motion.json` records the projected anchor positions for each frame.
- Website labels and their layout live in `data/site-content.ts`. SVG leaders follow the displayed frame. The web background stays in CSS so it fills any screen size.
- Desktop pins while scrubbing; mobile scrubs without pinning. Reduced motion shows an exploded still. Pending work is cancelled when the component is removed or its motion preference changes.
- A 340 KiB preview sprite makes all 121 poses available through one native image preload/decode. Two background workers fetch detail near the current pose, retaining at most eight decoded detail frames. The preview may appear softer briefly on a cold connection; it stays interactive if detail images fail. If both preview and required detail are unavailable, the hero falls back to the exploded still.
- Scroll position selects the nearest original frame. The bottle, SVG anchors, and mobile crop use that same pose throughout scrolling and at rest. There is no frame blending or delayed settling animation. Repeated scroll updates within a pose skip repainting. The canvas stays within the source resolution, and animated updates avoid forced layout reads.

To render the existing edited scene again, run Blender with `--background --disable-autoexec`, the edited `.blend` path, and `--python scripts/prepare-private-label-hero.py -- --mode frames`. Then run `node scripts/encode-private-label-hero.mjs`. Render intermediates go to `/private/tmp/basenote-bottle-work/`; deliverable frames go to `public/media/private-label/hero/`. `--mode preview` renders the full scene with its background and labels.

The `--mode build` operation is for the original supplied scene and requires Source Serif 4 and Lexend Deca TTFs in the scratch directory. It saves an edited copy and does not overwrite the supplied file. The final `.blend` can be rendered without those external font files.

The encoder also builds `scrub-preview.webp`. To rebuild only that sprite from the committed desktop WebPs, run `node scripts/encode-private-label-hero.mjs --preview-only`.

Local validation passed ESLint, the production build, and 30 Chromium checks covering forward/reverse scrubbing, original-frame rendering, mobile layout, navigation, contact preselection, hash entry, pin resizing and release, initial/live reduced motion, failed frames, and no JavaScript. Responsive checks covered widths from 320 to 1920 pixels. Physical devices and other browser engines were not tested.

Final local captures are retained in the ignored browser output directory: [desktop introduction](../output/playwright/private-label-hero/desktop-start.png), [desktop callouts](../output/playwright/private-label-hero/desktop-scrub.png), [mobile callouts](../output/playwright/private-label-hero/mobile-scrub.png), and [reduced motion](../output/playwright/private-label-hero/reduced-live.png).

Six `node:test` cases cover immediate preview availability, stale downloads, whole-frame selection in both directions, skipped duplicate paints, bounded caching, failures, and teardown. Earlier layout captures are retained for reference: [desktop](../output/playwright/private-label-hero-performance/momentum-desktop.png), [mobile](../output/playwright/private-label-hero-performance/mobile.png), and [resting desktop](../output/playwright/private-label-hero-performance/settled-desktop.png).

Original-frame rendering was verified against source frame 065 with zero differing color channels. All 29 recorded paints during scrolling and its momentum tail used a single source tile at full opacity. Startup requested five nearby detail frames, and the preview remained usable with detail requests blocked. Current captures: [desktop](../output/playwright/private-label-hero-performance/original-frames-desktop.png) and [mobile](../output/playwright/private-label-hero-performance/original-frames-mobile.png).

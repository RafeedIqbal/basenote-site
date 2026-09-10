# Private label hero animation

The hero uses the supplied bottle scene, with animated leaders for **Lid and atomizer**, **Fragrance oil**, **Bottle and packaging**, and **Branding and marketing**. Its orange gradients use the page's Canyon Red and Desert Varnish palette. Existing hero copy and contact links are retained.

- Editable scene: `output/bottle-animation/Basenote Bottle Animation.blend`.
- Video preview: `output/bottle-animation/Basenote Bottle Animation.mp4` (includes a two-second hold at the end).
- The Blender scene has separate `Hero Callouts` and `Hero Background` collections. Fonts are packed; missing source textures were replaced with editable label lettering. Invalid imported material indices were corrected.
- 121 frames retain the supplied camera and bottle movement, resampled across the original frame range 2–60. `data/private-label-hero-motion.json` records the projected anchor positions for each frame.
- Website labels and their layout live in `data/site-content.ts`. SVG leaders follow the displayed frame. The web background stays in CSS so it fills any screen size.
- Desktop pins while scrubbing; mobile scrubs without pinning. Reduced motion and failed frame requests show an exploded still. Only eight decoded frames are retained; pending work is cancelled when the component is removed or its motion preference changes.

To render the existing edited scene again, run Blender with `--background --disable-autoexec`, the edited `.blend` path, and `--python scripts/prepare-private-label-hero.py -- --mode frames`. Then run `node scripts/encode-private-label-hero.mjs`. Render intermediates go to `/private/tmp/basenote-bottle-work/`; deliverable frames go to `public/media/private-label/hero/`. `--mode preview` renders the full scene with its background and labels.

The `--mode build` operation is for the original supplied scene and requires Source Serif 4 and Lexend Deca TTFs in the scratch directory. It saves an edited copy and does not overwrite the supplied file. The final `.blend` can be rendered without those external font files.

Local validation passed ESLint, the production build, and 32 Chromium checks covering forward/reverse scrubbing, mobile layout, navigation, contact preselection, hash entry, pin resizing and release, initial/live reduced motion, failed frames, and no JavaScript. Short laptop viewports were also checked for visible hero actions. Physical devices and other browser engines were not tested.

Final local captures are retained in the ignored browser output directory: [desktop introduction](../output/playwright/private-label-hero/desktop-start.png), [desktop callouts](../output/playwright/private-label-hero/desktop-scrub.png), [mobile callouts](../output/playwright/private-label-hero/mobile-scrub.png), and [reduced motion](../output/playwright/private-label-hero/reduced-live.png).

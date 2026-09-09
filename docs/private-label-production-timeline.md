# Production timeline recreation

The six steps in `/private-label/guide#get-production-ready` now adapt the default vertical [Progress Timeline reference](https://progresstimeline.framer.website/). `GuideProductionTimeline.tsx` and its CSS Module provide the component; `PrivateLabelGuidePage.tsx` integrates it into chapter 05.

Each row enters with a short upward reveal, followed by a copper connector drawing toward the next step. The first connector fades in from its starting node and the last ends in a fading tail. Hover and keyboard focus highlight the numbered node. Tab reaches each step and then the next-chapter link; focusing a pending step reveals it immediately. Revealed steps stay visible when scrolling back.

All six titles, paragraphs, lists and qualifications remain sourced from `data/site-content.ts`, including the minimum-order note and 50% production deposit. The shared canvas, Source Serif 4, Lexend Deca, Space Mono and private-label colours are retained. Concurrent card-drawer, fragrance-timeline and catalogue work was preserved.

The public reference was inspected in Chromium at 1440 × 900, 768 × 1024 and 390 × 844, with a device scale factor of 1. Its default layout uses 44px markers, a 24px marker-to-copy gap and 32px row spacing. Observed transitions include a 22px entrance offset, a 550ms reveal, a 700ms connector fill and a 1.08 node scale on hover/focus. The implementation uses those desktop dimensions and approximate motion, with the guide's existing 38px markers and 18px gap below 860px. Guide typography and the longer six-step content are intentional adaptations. The demo settings toolbar, optional glow/hover-reveal modes, horizontal mode and platform badge are omitted.

The implementation uses the existing GSAP integration. Animation contexts, scroll triggers and the focus listener are disposed on teardown. Reduced motion shows the complete static timeline, including after a live preference change. Restoring motion preserves the focused/visible step. Without JavaScript, every step is visible. No new dependencies, remote assets, Framer bundles or preview routes were added.

## Validation — 9 September 2026

- `npm run lint`: passed with zero warnings.
- `npm run build`: passed, including TypeScript and static route generation. The first sandboxed attempt could not fetch Google Fonts; rerunning with network access passed without font substitutions.
- `git diff --check`: passed.
- Production browser checks used `http://127.0.0.1:3104`; early development checks used the existing server on port 3000.
- Normal-motion desktop, tablet and mobile scroll entry, intermediate reveal, final step and reverse scrolling passed. At an intermediate desktop sample, the entering third row had opacity 0.3224 and a 14.9px vertical offset; every row settled at opacity 1 with no offset.
- No horizontal overflow or clipped timeline content at 1440, 768, 390 or 320px. The 320px check used a 740px-tall viewport and reduced motion.
- All six steps received visible keyboard focus; Tab then reached `#make-it-real`. Initial reduced motion, live teardown/restoration, retained focus and the JavaScript-disabled mobile fallback passed.
- Chapter links and direct hash loading passed. The mobile menu locked scrolling, closed with Escape and restored toggle focus. The consultation link opened Contact with “Private Label” selected. No enquiry was submitted.
- The existing client-journey pin initialized on desktop, released when resizing below 860px, returned on desktop and released after scrolling past its end. Returning to the guide left zero pin wrappers and all six production connectors present.

Screenshots were visually inspected and compared with reference captures. No numerical similarity score was calculated. Physical touch devices, Safari and Firefox were not tested.

## Local screenshots

- [Desktop chapter](../output/playwright/production-timeline/guide-desktop.png)
- [Desktop timeline](../output/playwright/production-timeline/guide-desktop-timeline.png)
- [Desktop entering state](../output/playwright/production-timeline/guide-desktop-entering.png)
- [Tablet](../output/playwright/production-timeline/guide-tablet.png)
- [Mobile](../output/playwright/production-timeline/guide-mobile.png)
- [Mobile middle steps](../output/playwright/production-timeline/guide-mobile-middle.png)
- [Reference desktop](../output/playwright/production-timeline/reference-desktop.png)
- [Reference mobile](../output/playwright/production-timeline/reference-mobile.png)

Captures are retained under the repository's ignored `output/playwright/production-timeline/` directory. The existing floating chat control is visible in some captures. No temporary application harness requires removal. Verification is local; this task did not publish or deploy the site.

# Guide card drawers

Implemented on 9 September 2026 in `/private-label/guide#start-here`.

The Packaging, Bottle & cap, and Fragrance cards now open modal drawers using the interaction observed at [card-drawer.framer.website](https://card-drawer.framer.website/). `GuideElementCards.tsx` and its CSS Module own the cards and drawers; the existing element copy remains in `data/site-content.ts`.

The reference was inspected in Chrome at 1440×900, 768×1024, and 390×844, including closed, opening, and open states. Its drawer uses a 600px maximum width, 90vh height, 32px corners, a 60% black backdrop, and a fade/scale transition. The desktop panel measured 600×810px; mobile measured 350×759.6px. The implementation retains these drawer proportions, with an approximately 450ms CSS transition.

Intentional adaptations:

- Existing Basenote fonts, colours, card copy, and three-column/stacked card layout are retained. The cards have rounded corners and a hover treatment.
- A numbered cover replaces the demo photograph. No Framer images, fonts, runtime, analytics, or dependencies were added.
- Native dialogs provide modal focus containment. Enter/Space opens each card; Escape, the close button, and a backdrop click dismiss it. Focus returns to the originating card.
- The 44px close control stays available while long content scrolls. Reopening resets the drawer to the top. Background scroll and Lenis are locked and restored, including on route changes.
- Reduced motion removes the panel and backdrop transitions immediately, including when the preference changes while a drawer is open.

Validation:

- `npm run lint`, `npm run build`, and `git diff --check` passed.
- Chrome 152.0.7977.84, DPR 1: desktop, tablet, and mobile checks at the reference sizes, plus 320×568 and the 1100/1101px card-layout boundary. No horizontal overflow was found.
- All three cards, keyboard opening, focus containment/return, all dismissal methods, long-content scrolling, reopening, background position/dimensions, and initial/live reduced motion passed browser checks.
- Desktop/mobile navigation, chapter hash and focus changes, Private Label contact preselection, and client navigation with an open drawer passed. No enquiry was submitted.
- The private label wheel and journey released/restored their pins at 859/860px and on live reduced-motion changes. Leaving that route removed its pin spacers.
- Production-server checks confirmed opening motion, centering, drawer height, and focus return. Screenshots were visually inspected. No pixel-similarity score was calculated because the typography and artwork are intentional adaptations.

Final production captures are retained locally under the ignored `output/playwright/guide-card-drawer/` directory:

- [Desktop cards](../output/playwright/guide-card-drawer/final-desktop-closed.png)
- [Desktop drawer](../output/playwright/guide-card-drawer/final-desktop-open.png)
- [Tablet drawer](../output/playwright/guide-card-drawer/final-tablet-open.png)
- [Mobile cards](../output/playwright/guide-card-drawer/final-mobile-closed.png)
- [Mobile drawer](../output/playwright/guide-card-drawer/final-mobile-open.png)

Reference captures and additional interaction captures are in the same directory. No temporary application route or test harness was introduced. Existing cover edits and concurrent catalogue/timeline work were preserved.

The shared production preview briefly lost CSS/JS assets when a concurrent build replaced `.next`. Final captures use an isolated copy of a completed production build. The temporary preview copy was removed after verification.

These are local browser and build checks; Safari, Firefox, physical mobile devices, and hosted deployment were not tested. The isolated production console reported unused CSS preload warnings, with no application errors observed.

Closing-motion correction (9 September 2026): centering now belongs to the base dialog rule so it remains active after the native `open` attribute is removed and throughout the exit transition. Previously, closing at 1440×900 shifted the panel 400px left and 25px up before it faded away. Frame-by-frame checks of all three cards at 1440×900 and 390×844 found less than 0.001px of center movement after the correction. Close-button, Escape, and backdrop dismissal preserved page position and returned focus; initial and live reduced-motion checks also passed. These regression checks used the local development server. Mid-close captures: [desktop](../output/playwright/guide-card-drawer/close-fixed-1440.png) and [mobile](../output/playwright/guide-card-drawer/close-fixed-390.png).

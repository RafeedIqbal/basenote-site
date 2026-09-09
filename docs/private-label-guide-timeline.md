# Private label guide: fragrance timeline

The “From idea to approved formula” timeline at `/private-label/guide#fragrance-timeline-title` adapts the [Framer reference](https://clever-diversity-565244.framer.app/) into a vertical timeline at every screen size.

`GuideTimeline.tsx` and its CSS Module provide the connecting rail, enlarged active marker, subtle pulse, brighter active text, and line progression. Scrolling advances the reading position; hovering, clicking, or focusing a step highlights it. Native buttons support Tab, Enter, Space, Up/Down, Home, and End. The ordered list and all six descriptions remain available throughout. The timeline stays in normal document flow.

The integration is limited to the fragrance timeline. Its original titles and descriptions, Basenote fonts, and private label colours are preserved. Existing production steps and other concurrent guide changes are retained. No dependencies, assets, Framer runtime, tracking, or preview routes were added.

## Reference and adaptations

The reference was observed in Chromium at 1440×900, 768×1024, and 390×844. Its desktop layout is horizontal with five evenly spaced markers, a 3px line, and hover emphasis: the marker grows from 24px to 36px and the text brightens. Smaller layouts use a vertical line with scroll reveals. The reference uses blue accents, Bayon, and Cambay.

The implementation deliberately keeps the guide vertical on desktop, substitutes the existing warm palette and Source Serif 4 / Lexend Deca / Space Mono fonts, and uses the existing “Step” label instead of dates. Descriptions remain readable in inactive states, including without animation. Keyboard access and immediate reduced-motion support are additions to the observed reference. This is an adapted visual comparison; no pixel-similarity score was calculated.

## Validation

- `npm run lint`: passed with zero warnings.
- `npm run build`: passed, including TypeScript and route generation.
- `git diff --check`: passed.
- Browser checks covered 1440×900 desktop, 768×1024 tablet, 390×844 mobile, and 320×740 narrow mobile. No document overflow was found. At 320px every timeline row also fit its content width.
- Tablet measurements confirmed all five connecting segments meet the next marker centre, with zero measured horizontal or vertical displacement.
- Checked scroll progression through the final step, hover, click, keyboard focus, Up/Down and Home/End navigation, direct timeline hashes, and chapter links. The final step activated with all five preceding rail segments filled.
- Checked reduced motion on initial load and a live toggle. Pulsing and transitions stop immediately, the scroll effect is cleaned up, and normal-motion behaviour is restored when the preference changes. All descriptions stay visible.
- Mobile menu open / Escape close returned focus to the menu toggle. Chapter navigation focused the destination section. The consultation link opened Contact with “Private Label” selected; no enquiry was submitted.
- Existing private-label pins were removed at 859px and recreated at 860px. The journey released into normal flow at the page end. Returning to the guide left no pin spacers.
- Standard build validation used the shared checkout. Browser work used the existing development server and a temporary production snapshot, because concurrent work was changing the shared build directory. The snapshot also passed `npm run build -- --webpack`; the two timeline files were verified to match the checkout byte for byte.
- The development session logged one ScrollTrigger refresh error while the checkout was receiving concurrent updates. It did not recur in the production snapshot across scrolling, route changes, pin resizing, or live motion toggles; production console checks were clear.

Browser verification used Chromium with emulated viewport sizes. Physical touch devices and other browser engines were not tested. Captures are JPEGs and the browser provider can scale their pixel dimensions; the viewport measurements above are CSS pixels.

## Screenshots

Retained local artifacts are under `output/playwright/guide-framer-timeline/` (ignored by Git):

- [Desktop](../output/playwright/guide-framer-timeline/desktop.jpg)
- [Final step](../output/playwright/guide-framer-timeline/desktop-final-step.jpg)
- [Keyboard focus](../output/playwright/guide-framer-timeline/desktop-keyboard.jpg)
- [Reduced motion](../output/playwright/guide-framer-timeline/desktop-reduced-motion.jpg)
- [Tablet](../output/playwright/guide-framer-timeline/tablet.jpg)
- [Mobile](../output/playwright/guide-framer-timeline/mobile-start.jpg)
- [320px mobile](../output/playwright/guide-framer-timeline/mobile-320.jpg)
- Reference captures: `reference-desktop.jpg`, `reference-tablet.jpg`, and `reference-mobile.jpg` in the same directory.

The existing guide route is the preview. The temporary production server was stopped and its snapshot removed after verification; the existing development server was left running. No temporary application route needs removal. This records local validation only; no publishing, push, or deployment was performed.

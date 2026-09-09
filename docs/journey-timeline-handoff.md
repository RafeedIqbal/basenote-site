# Private label journey timeline

The “From idea to market” section at `/private-label#client-journey` now adapts the [Timeline Milestones reference](https://timelinemilestones.framer.website/) as a horizontal journey.

## Result

- Ten large, rounded information cards retain the existing stage names, order and approved descriptions.
- A connecting line, milestone dots and stage numbers use the private label palette. Cards contain no links, buttons, click handlers or flip interactions.
- On viewports at least 860px wide and 700px tall, with normal motion, the section pins while vertical scrolling advances through stages 01–10. The viewport travels right along the timeline, implemented by translating the card strip left. Scrolling upward reverses the movement.
- The large, centred Canyon Red CTA sits directly beneath the cards inside the section. It fades in once a quarter of the final card enters the viewport, then leaves with the timeline when the pin releases. It links to `/contact?interest=Private%20Label`.
- The gap below the cards is 32px on pinned desktop and 24px on compact pinned layouts. The previous separate CTA section and its large vertical gap have been removed.
- Smaller or shorter viewports and reduced motion retain an unpinned horizontal scroller. Native horizontal scrolling and Left/Right/Home/End keyboard controls expose every stage. Tab proceeds to the CTA.
- On unpinned layouts the CTA remains visible in the normal page flow. Keyboard focus reveals it immediately at any timeline stage. Live motion changes preserve focus on either the journey or its CTA, and resizing preserves the reading position. Animation contexts, observers, scroll/focus listeners and scheduled frames are cleaned up on unmount.

Implementation: `components/private-label/ClientJourney.tsx`, its CSS Module, and journey navigation labels in `data/site-content.ts`. Existing unrelated checkout edits were preserved.

## Reference and adaptations

The reference was inspected in a real Chromium browser at 1440×900, 768×1024 and 390×844. The first desktop information face measured 420×380px with a 16px corner radius. Its dark surfaces, accented connecting line and glowing nodes informed the new treatment.

The requested horizontal layout, existing site typography, ten project stages and private label colours are intentional adaptations. At 1440×900, the implemented cards measure 560×396px. Source Serif 4, Lexend Deca and Space Mono are retained. No third-party media, Framer runtime, component bundles, dependencies or new routes were added. The reference’s photos, card controls and platform badge are omitted.

This is a visual and interaction review, not a pixel-identical comparison; no numerical similarity score was used. Browser captures are JPEGs and may be scaled by the capture provider; viewport and layout measurements are CSS pixels.

## Validation

- `npm run lint`: passed, zero warnings.
- `npm run build`: passed, including TypeScript and route generation.
- `git diff --check`: passed.
- Browser checks used the local production server on port 3101. The existing development preview initially rendered without client scroll effects, so interaction acceptance was performed on the production build.
- Checked 1440×900 desktop start, intermediate progress, final stage, reverse movement and release. The CTA was hidden at 75% progress, visible at 94% while the section was still fixed, and remained 32px below the cards after release.
- The CTA spacing update was checked at 1355×1200, 1440×900, 1440×700, 860×700, 390×844 and 320×740. The compact pinned layout keeps the complete CTA within a 700px-tall viewport. All ten cards had unclipped content and no overlapping number/copy blocks; no document-level horizontal overflow was found.
- Resizing initially exposed a reading-position jump. Refresh handling now restores the measured progress, verified across desktop height and width changes. A pointer-blurred journey remains unfocused after resizing. Initial reduced motion and live restoration of the focused CTA were also checked.
- Checked 320×740 and 390×844 mobile, 768×1024 tablet, 859×900 below the pin threshold, 860×700 at the threshold, and 1440×650 short desktop. All ten cards had unclipped content and there was no document-level horizontal overflow.
- Checked normal motion, reduced motion on initial load, live teardown/restoration, resizing across pin thresholds, native horizontal scrolling, arrow/Home/End keys, CTA focus, hash navigation and route changes.
- The CTA opened Contact with “Private Label” selected. No enquiry was submitted. Leaving the route removed the timeline pin; the mobile menu opened, closed with Escape and returned focus to its toggle.

Physical touch devices and other browser engines were not tested. The available browser does not support synthetic touch events; mobile horizontal movement was verified with native horizontal scrolling and keyboard input.

## Output cleanup

Generated screenshots and detailed browser records were removed during Playwright output cleanup on 9 September 2026. The validation results and resize fix are summarized above.

The existing production route is the preview; no temporary application harness or preview route needs removal. This handoff records local verification.

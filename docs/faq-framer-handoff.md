# Private-label FAQ recreation

The FAQ at `/private-label#faq` uses a 960px layout directly on the site's black canvas, with no grey frame, row fill, or icon circles. Opening a question rotates its plus icon through a half-turn while the vertical stroke folds and fades into a minus. All twelve existing Basenote questions and answers are retained.

## Implementation

- `components/site/shared.tsx`: the existing exclusive `FaqList` now uses decorative animated plus/minus icons and functional state updates. It preserves labelled buttons, `aria-expanded`, linked answer regions, hidden/inert collapsed content, and Escape to close. A cleaned-up motion-preference listener refreshes scroll geometry after instant height changes.
- `components/site/shared.module.css`: transparent rows, larger bare plus/minus glyphs, animated answer height/fade, and a 600ms icon rotation with a small overshoot. CSS handles intrinsic answer heights, interrupted transitions, and responsive reflow. Reduced motion removes all FAQ transitions, including after a live preference change. Answer lines are capped at 80ch for readability.
- `components/private-label/PrivateLabel.module.css`: sets a 960px maximum width with 24px viewport gutters on narrow screens and lets the heading use the full section width.

The default `FaqList` still uses native multi-open disclosures on the home page. The new treatment applies to the existing exclusive mode. No content, assets, application dependencies, public routes, or hosting configuration were added or replaced. Other ongoing changes in the checkout were preserved.

## Reference evidence and adaptations

The original [Framer FAQ component](https://faq-component.framer.website/) was inspected in Chrome at 1440×900, 768×1024, and 390×844, at device scale factor 1. Initial closed, first-answer open, second-answer open, and responsive wrapping were observed. The reference begins with every answer closed and closes the previous answer when another question opens. The subsequent user revision intentionally widens the layout, removes its grey decoration, and gives the icons a more pronounced rotation.

| Detail | Observed reference | Implementation |
| --- | --- | --- |
| Maximum width | 600px | 960px; 342px at a 390px viewport |
| Frame / row backgrounds | Grey frame and dark rounded cards | Transparent |
| Question padding / answer gap | 24px / 16px | 26px vertical, no horizontal inset / 16px |
| Closed single-line row height | 76px | 80px |
| Icon / line | 28px circle / 12×1px | No circle; 28px glyph area / 16×1.5px |
| Question type | Inter, 18px, 500, 1.4 line height | Existing Lexend Deca, 18px, 400, 1.4 line height |
| Answer type | Inter, 16px, 1.4 line height | Existing Lexend Deca, 16px, 1.4 line height |

The site's black canvas, serif FAQ heading, and approved copy are intentional adaptations. The reference has six short demonstration questions; Basenote has twelve, with longer commercial qualifications. Their wrapping and total section height therefore differ. No third-party fonts or media were added.

The answer uses a 550ms eased height transition and fade/translation. The icon rotates 180 degrees over 600ms, with a 250ms fade of its vertical stroke. Closing reverses the motion, including when toggled before the animation finishes. This is an independent interpretation of the reference, revised to the user's requested rotation effect. The full question is a named keyboard-accessible button; answer text can be selected without closing it. Keyboard focus retains the existing Basenote accent outline.

Reference and candidate screenshots were visually inspected at matching viewport sizes. Geometry was compared through DOM measurements. No numerical image-similarity score or masked comparison is claimed because the content, fonts, and surrounding page intentionally differ.

## Validation

- `npm run lint`: passed with zero warnings.
- `npm run build`: passed, including TypeScript and all public page generation.
- 65 browser checks passed on the local production build with no page runtime errors recorded during the successful checks.
- FAQ checks cover all twelve answers, exclusive switching, closing, rapid changes, answer clipping, linked accessibility state, visible focus, Enter/Space/Tab/Escape, initial and live reduced motion, and 320px wrapping.
- Integration checks cover desktop/mobile route changes, FAQ and journey hash navigation, 859px/860px pin release/recreation, mobile menu focus/escape/resize cleanup, contact preselection and guard fields, native home-page multi-open FAQs, touch tapping, and motion-preference changes after the FAQ unmounts. No real enquiries were sent.
- The visual revision also checks transparent frame/rows/icons, 960px desktop width, intermediate icon angles in both directions, the final minus, and correct icon states after interrupted toggles.

Navigation checks wait for fonts and the two desktop pin spacers to initialize. An immediate anchor click during initial route setup landed before the journey; the same check passed once that existing page setup settled. This initialization timing was observed outside the FAQ changes and was not modified.

Browser coverage is Chromium, including an emulated mobile touch context. Physical iOS Safari and Firefox were not tested. Build and browser checks are local; this work was not published or deployed.

## Output cleanup

Generated screenshots and detailed browser records were removed during Playwright output cleanup on 9 September 2026. The validation results are summarized above.

The actual production route was used throughout. No preview route or harness was added. Final checks use an isolated copy of the successful build under `/tmp/basenote-faq/production-preview` because concurrent rebuilds of the shared `.next` directory invalidated preview chunks during an earlier check. Temporary scripts and the build snapshot remain under `/tmp/basenote-faq`; there are no application preview files to remove. The local production preview runs at `http://localhost:3001/private-label#faq`.

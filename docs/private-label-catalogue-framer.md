# Bottle and cap card decks

Implemented on `/private-label/guide`, in the “Choose your bottle & cap” chapter, on 9 September 2026.

The two catalogues now use overlapping cards inspired by [Card Deck Spread](https://particular-grocery-189981.framer.app/). `GuideCatalogue.tsx` is shared by caps and bottles, with its styles isolated in `GuideCatalogue.module.css`.

## Reference and adaptation

- Observed the public reference at 1440 × 900, 768 × 1024, and 390 × 844 in Chrome. Its desktop deck has nine 210 × 290 px cards, a 60 px horizontal step, and 20 px corners. Hovering raises and enlarges a card, blurs its neighbours, and reveals a caption. Clicking and scrolling did not produce a separate expanded layout during inspection.
- Retained that desktop geometry, overlapping order, staggered entrance, and hover treatment. Outgoing cards now sweep to the right as the next deck enters from the left, using the same 600 ms easing and a reversed 35 ms stagger. The preview lift is slightly restrained for the guide. The guide’s existing canvas, typography, colours, commercial copy, product images, and reference codes remain in use.
- The catalogue shows nine references at a time. Previous/next buttons move between decks; the dropdown can reach any reference directly. A selected card stays in front after the pointer leaves. Hover previews reveal a card without changing the selected reference until it is clicked.
- Shifted the images in the covered cards so their exposed edges show the product rather than empty photographic background. A card’s image returns to its original centred framing when brought to the front. No source image files were changed.
- Unlike the reference’s clipped 390 px layout, the guide’s narrow deck scrolls horizontally. The full selected card is revealed after keyboard navigation, a reference jump, or resizing, without scrolling the surrounding page vertically.
- Cards are native buttons with one tab stop per deck, visible focus, selection announcements, and Left/Right, Home/End, and Page Up/Page Down navigation. Reduced motion removes the spread animation, lift, blur, and transitions immediately, including after a live preference change.
- All 92 cap and 76 bottle references remain available. The source references `PC-28` and `PB50-` are preserved exactly, along with the existing bottle catalogue note.

The implementation uses React, CSS Modules, and `next/image`. It adds no application dependencies or remote assets and does not include Framer runtime code, badges, tracking, or reference photographs. Existing project fonts replace the reference typography.

## Verification

- `npm run lint`: passed with zero warnings.
- `npm run build`: passed, including TypeScript and route generation.
- One later sandboxed build could not fetch the existing Google Fonts; the final build passed when rerun with network access. A separate concurrent build briefly held Next.js’s build lock; no other process or checkout work was interrupted.
- Checked every reference through deck pagination, the final partial decks, first/last disabled controls, dropdown selection, both source anomalies, tab order, keyboard selection, and focus across deck boundaries.
- Checked layouts at 320, 390, 768, 859, 860, and 1440 px widths. No page-level horizontal overflow was found; selected cards remained inside their scroll viewport after resizing and reference jumps.
- Checked normal hover/click, initial reduced motion, live reduced-motion activation, and restoration of motion.
- Checked overlapping entrance/exit animations, rapid next/previous clicks, keyboard focus across decks, cleanup of outgoing cards, and immediate cancellation on a live reduced-motion change. Outgoing copies are inert and hidden from assistive technology; only the current nine cards are interactive. At 390 px, verified exits from a partial four-card bottle deck and a horizontally scrolled deck without a position jump or page overflow.
- Chrome touch emulation at 390 × 844 verified horizontal swiping, stable vertical position during a swipe, tapping the last card, and advancing to the next deck.
- Ran the production build locally and checked desktop/mobile chapter links and focus, direct hash navigation, mobile menu opening and Escape focus restoration, Private Label contact preselection, desktop wheel/journey pin creation, release below 860 px, reduced-motion teardown/restoration, and cleanup when returning to the guide. No enquiry was submitted and no runtime browser errors were observed.

These are local Chrome checks, including touch emulation, rather than testing on physical mobile devices or Safari/Firefox. Visual comparison was by inspected screenshots and measured geometry; no numerical similarity score was calculated because the product images, page context, fonts, and mobile behaviour are intentional adaptations.

## Screenshots

Local captures are retained in the ignored `output/playwright/guide-catalogue-framer/` folder:

- [Guide context, desktop](../output/playwright/guide-catalogue-framer/guide-desktop-final.png)
- [Caps, desktop](../output/playwright/guide-catalogue-framer/caps-1440-final.png)
- [Bottles, desktop](../output/playwright/guide-catalogue-framer/bottles-1440-final.png)
- [Cap hover](../output/playwright/guide-catalogue-framer/caps-hover-final.png)
- [Bottle hover](../output/playwright/guide-catalogue-framer/bottles-hover-final.png)
- [Caps, tablet](../output/playwright/guide-catalogue-framer/caps-768-final.png)
- [Bottles, tablet](../output/playwright/guide-catalogue-framer/bottles-768-final.png)
- [Caps, mobile](../output/playwright/guide-catalogue-framer/caps-390-final.png)
- [Bottles, mobile](../output/playwright/guide-catalogue-framer/bottles-390-final.png)

Reference captures and intermediate comparisons are in the same folder. No preview route or application harness was added. Separate guide cover, element-card, timeline, and drawer work in the shared checkout was preserved.

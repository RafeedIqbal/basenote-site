# We work with cards

The private label audience cards follow the layout interaction in Arizmi's
`components/home/BuildCategories.tsx`: one selected card spans two columns and
two rows, and the other cards pack around it with a 520 ms layout animation.
The 12 September 2026 hierarchy update uses the supplied frosted-card reference:
collapsed cards show their number, headline, and expand control. Opening a card
reveals the existing expanded paragraph immediately below the headline, followed
by a smaller "Best for" label and supporting line (or the contact link).
The introductory descriptions remain in `data/site-content.ts` but are no longer
rendered in the cards or included as button descriptions.

Cards have 26 px rounded corners and 12 px gutters. The background combines
Canyon Red (#943F2D), pink-orange blooms, and a soft diagonal light streak.
A 28 px blur and an elliptical transparency mask fade every edge of this layer
before its rectangular bounds, including beside the cards on wide screens.
The selected card uses a translucent cream-to-pink gradient around #F1BAA7,
22 px backdrop blur with 115% saturation, a soft upper-left highlight, a 50%
white border, subtle inset highlights, and a soft shadow. Its text is #070707.
Decorative layers do not intercept pointer events. An opaque warm gradient is
provided for browsers without backdrop-filter support.
Source Serif 4 headlines, Lexend Deca body copy, Space Mono labels, existing
expanded copy, contact destinations, and the shared page canvas are retained.

The grid uses three columns from 1024 px, two from 640 px, and a stacked
disclosure below 640 px. The final desktop card reserves the lower-right 2x2
area to prevent an empty row. Desktop rows start at 168 px and grow to fit longer
copy. The old fixed summary height has been removed so expanded copy sits close
to its headline.
Whole-card buttons support Enter, Space, and Escape. The contact link inside the
last card remains independently operable. Resize and reduced-motion changes
cancel active layout animations, and downstream scroll triggers refresh after
the grid settles.

## Validation on 12 September 2026

- `npm run lint`: passed with zero warnings.
- `npm run build`: passed; all public routes generated.
- Local production Chromium checks covered the collapsed state and all six
  selections at 320, 390, 639, 640, 768, 860, 1023, 1024, 1440, 1920, and 2560 px.
  No horizontal overflow, clipped copy, or settled card overlaps were found.
- All six desktop selections also passed with motion enabled. Enter, Space,
  Escape from the detail link, visible focus, focus restoration, and exclusion
  of hidden details from keyboard navigation passed.
- Initial reduced motion and live toggles on desktop and mobile stopped
  animations. Restoring motion re-enabled the layout animation. Resizing during
  animation through tablet and mobile layouts and rapid selections passed.
- Desktop/mobile navigation, mobile menu focus trapping and Escape, guide
  navigation, journey hash navigation, route return, and the last card's contact
  link passed. The contact form preselected `Private Label`.
- Opening a desktop card increased both the audience section height and the
  capability pin start by 180 px. The Branding selection reached its refreshed
  scroll destination. Wheel/journey pinning, release, removal on mobile resize,
  and recreation on desktop resize passed.
- No browser JavaScript errors were recorded. Chromium logged unused CSS
  preload warnings during route navigation and repeated reloads.

## Screenshots and local evidence

- [Desktop glass](../output/playwright/audience-glass-refined/desktop-expanded-viewport.png)
- [Desktop collapsed and background fade](../output/playwright/audience-glass-refined/desktop-collapsed-viewport.png)
- [Keyboard focus](../output/playwright/audience-glass-refined/desktop-keyboard-focus.png)
- [Mobile glass](../output/playwright/audience-glass-refined/mobile-expanded-card.png)
- [Mobile viewport](../output/playwright/audience-glass-refined/mobile-viewport.png)

The final glass refinement passed a fresh lint and production build, the
eleven-width responsive matrix, keyboard and reduced-motion checks, and the
scroll/pin checks. The viewport screenshots also show the feathered background
beyond the card grid, with no rectangular cutoff. Text
background samples for all six open cards at 320, 390, 640, 1024, 1440, and
2560 px measured at least 4.55:1 contrast for the small black copy. These samples
temporarily hide the text and keep fixed UI outside the captured card so that
the underlying rendered glass is measured; see `contrast-results.json`.

Browser scripts and result logs are in `output/playwright/audience-glass-refined/`;
earlier evidence remains in `output/playwright/audience-glass/` and
`output/playwright/audience-hierarchy/`.
These output directories are ignored by Git; keep them for local design review.

No enquiries were submitted. Validation used local production builds; hosted
deployment, physical devices, and other browser engines were not checked.

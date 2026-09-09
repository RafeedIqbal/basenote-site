# We work with card resizing

The private label audience cards follow the layout interaction in Arizmi's
`components/home/BuildCategories.tsx`: one selected card spans two columns and
two rows, and the other cards pack around it with a 520 ms layout animation.
Basenote's audience copy, square cards, colours, and contact links are preserved.

The grid uses three columns from 1024 px, two from 640 px, and a stacked
disclosure below 640 px. The final desktop card reserves the lower-right 2x2
area to prevent an empty row. Row heights can grow to fit Basenote's longer copy.
Whole-card buttons support Enter, Space, and Escape. The contact link inside the
last card remains independently operable. Resize and reduced-motion changes
cancel active layout animations, and downstream scroll triggers refresh after
the grid settles.

## Validation inventory

- Desktop: all six selections, switching, closing, compact packing, unchanged summaries.
- Animation: intermediate frame, rapid repeated selection, settled layout without overlaps.
- Responsive: 320, 390, 639, 640, 768, 860, 1023, 1024, 1440, and 1920 px; no horizontal overflow or clipped copy.
- Keyboard: Enter, Space, Escape, visible focus, focus retention, hidden details excluded from Tab order.
- Reduced motion: initial preference, live toggle during animation, restoration.
- Navigation: desktop/mobile menu, hash destinations, guide route, contact preselection.
- Scrolling: downstream wheel/journey pin positions, resize and release.
- Exploratory: switch while animating; resize an expanded card across both layout breakpoints.

## Results

- `npm run lint`: passed with zero warnings.
- `npm run build`: passed; all public routes generated.
- Local production browser checks passed in Chromium. All six open states were
  checked at each of the ten widths above, with one card expanded at a time,
  no settled overlaps, no clipped copy, and no horizontal overflow.
- Desktop motion, rapid selection, Enter/Space activation, Escape from the
  detail link, restored focus, and closed-detail Tab exclusion passed. Initial
  reduced motion skipped animation; live toggles stopped it on desktop and
  mobile, and restoring motion re-enabled it.
- Resizing an animating card from desktop to tablet cancelled its transforms;
  resizing again to mobile restored the stacked layout. Touch emulation at
  390 x 844 px opened and closed a card successfully.
- Desktop/mobile navigation, menu Escape and focus return, guide navigation,
  the journey hash link, and the last card's contact link passed. The contact
  form preselected `Private Label`.
- Opening a desktop card moved the capability pin start by the expected 249 px.
  Its Branding selection landed within 1 px of the refreshed scroll position.
  Wheel and journey pin/release checks passed, as did removal on mobile resize
  and recreation on desktop resize. No browser console errors were reported.

## Output cleanup

Generated screenshots and browser session logs were removed during Playwright
output cleanup on 9 September 2026. The validation results are summarized above.

No enquiries were submitted. Validation used the local production build; hosted
deployment, physical devices, and other browser engines were not checked.

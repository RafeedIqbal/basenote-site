# Private Label design review — 8 September 2026

Compared the implementation with the [live design document](https://docs.google.com/document/d/13H5NsVSMfoAbBtyvBDrBNLr3TYnbaEHGp6q7LkMjOYQ/edit), fetched on 7 September, and its supplied PDF/DOCX copies. The documents were treated as design references, not authorization to contact contributors or publish. Approved headlines, audience descriptions, ten journey stages, commercial qualifications and twelve FAQs match and remain unchanged.

## Changes

- Added visible boundaries to the black audience panels and increased description and detail text to 16px. Expanded panels retain Canyon Red. Escape returns focus to the panel trigger before closing, including when focus was on the sixth panel's contact link.
- Corrected the portfolio pointer lifecycle: dragging releases capture and clears gesture state, the following click is suppressed, and a fresh tap or keyboard activation still selects a project. Offscreen wraparound slides no longer flash across the visible slides. The existing liquid displacement and Canyon Red edge remain.
- Replaced the capability wheel's blue geometric symbol with the existing white BN monogram, matching the current design brief. Keyboard arrows move focus with selection, and switching to reduced motion stops an active wheel tween.
- Wheel and journey pins now require a viewport at least 860px wide and 700px high. Shorter screens use the unpinned wheel and vertical journey so content cannot remain trapped below the viewport during a pin.
- The mobile menu scrolls in landscape, exposes dialog semantics, and closes/releases the background scroll lock when resized to desktop.
- Removed the generic film incorrectly presented as ALPAC footage. `privateLabel.featured.video` is nullable and currently `null`; the supplied ALPAC artwork is displayed in its full square aspect ratio. The explicit-play video implementation remains ready for the genuine project film.
- Guide chapter links account for the reserved header space in both directions, with and without reduced motion. Links back to parent-page sections use document navigation to avoid duplicate fragments when revisiting a cached Next route, and leave scrolling to the destination page instead of attempting to scroll to absent guide targets.

## Validation

- `npm run lint`: passed with zero warnings.
- `npm run build`: passed, including TypeScript and all eleven public routes. A sandboxed retry could not download the existing Google Fonts; the final build passed with network access. Fonts and dependencies were unchanged.
- `git diff --check`: passed.
- Local browser checks: desktop 1440×900, mobile 375×812, landscape menu 844×390; no horizontal page overflow at widths 320, 375, 768, 860, 1280 or 1920.
- Audience expansion, exclusive state and Escape focus restoration; carousel drag → immediate click → keyboard selection; wheel arrow-key focus and selection; FAQ exclusive expansion and Escape; mobile menu Escape and desktop resize release passed.
- Two intended desktop pins recreated at 700px height and were removed at 699px. The final journey card was fully visible before release at desktop size. Fresh-load reduced motion and live toggling removed pins, Lenis and animated CTA rendering; restoring motion recreated the intended effects. Live reduced motion during mobile wheel selection reset the orbit immediately.
- Hero process anchor, guide chapter offsets in both directions, guide-to-parent section navigation and route cleanup were checked. Leaving the page removed its pin spacers and canvas.
- “Book a call” opened the contact page with Private Label selected. The submitted-at timestamp was populated; the honeypot remained hidden and excluded from tab order. No enquiry was submitted.

Screenshots are from the actual local browser, with its development indicator. They are viewport captures, so longer sections continue below the frame.

- [Desktop audience panels](../output/playwright/private-label-review/audience-desktop.png)
- [Mobile expanded audience panel](../output/playwright/private-label-review/audience-mobile.png)
- [Mobile hero](../output/playwright/private-label-review/hero-mobile.png)
- [Mobile portfolio](../output/playwright/private-label-review/portfolio-mobile.png)
- [BN capability wheel](../output/playwright/private-label-review/wheel-desktop.png)
- [Final journey card](../output/playwright/private-label-review/journey-desktop.png)
- [ALPAC artwork](../output/playwright/private-label-review/alpac-desktop.png)
- [Guide anchor below the header](../output/playwright/private-label-review/guide-anchor-desktop.png)
- [Landscape menu scrolled to the contact link](../output/playwright/private-label-review/menu-landscape.png)

## Remaining asset and review limits

The isolated hero bottle artwork/backup video, final capability icons, journey imagery and genuine ALPAC film still await supply. The existing hero image and capability icons remain documented stand-ins. Guide prose and metadata remain draft copy as documented in the original handoff. The perfume builder remains excluded.

Browser validation used the in-app browser and mouse/pointer gestures at mobile widths. Physical touch events were not available through that browser's automation interface; no physical-device, screen-reader or Safari/Firefox testing is claimed. Genuine ALPAC playback cannot be verified until its film is supplied. No push or deployment was performed.

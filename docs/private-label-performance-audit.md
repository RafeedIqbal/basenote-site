# Private Label performance and functionality audit

Date: 9 September 2026

Audited `/private-label` and `/private-label/guide`. Changes preserve the existing layout, typography, colours, imagery, copy, catalogue references, and animation timing. The only CSS edit raises the existing keyboard skip link above the fixed header when focused.

## Fixes

- **Portfolio carousel:** pause autoplay during keyboard focus and pointer gestures; unregister the autoplay ticker while offscreen, hidden, reduced-motion, or otherwise paused; avoid repeated writes of unchanged accessibility and visibility attributes. Cleanup cannot restart animation after pointer capture is released.
- **Touch controls:** retain the initiating pointer identity in gallery and capability-wheel gestures so a second touch cannot advance or cancel the first gesture. Carousel and wheel keyboard handlers leave modified arrow keys available to the browser.
- **Guide scroll tracking:** cache chapter and fragrance-step positions when layout refreshes instead of measuring each item on every scroll update. Chapter navigation state now updates only its rail rather than rerendering the full guide. Resize observers and scheduled refreshes are cleaned up.
- **Anchor navigation:** share offset and pin calculations between chapter links, the hero process link, and initial/subsequent URL fragments. Preserve modified clicks and tolerate malformed fragment escapes. Disable the competing Lenis anchor handler while retaining smooth wheel scrolling.
- **Keyboard navigation:** return mobile-menu focus before the panel becomes inert, expose its current-page link, and make the skip-link and journey destinations focusable.
- **WebGL:** recreate background rendering resources after the browser restores a lost context; retain the existing static fallback and reduced-motion behavior.

## Validation

- `npm run lint`: passed with zero warnings.
- `npm run build`: passed, including TypeScript and static generation for both pages. The initial sandboxed build could not download the existing Google Fonts; the build with network access passed without changing fonts.
- `git diff --check`: passed.
- Local production browser checks: both routes return HTTP 200; desktop and mobile screenshots inspected; no horizontal overflow, page errors, console warnings, or failed local requests in the production smoke pass.
- Guide checks at 320, 375, 768, 860, and 1440px: chapter focus and active state, reference selection, last-item access, Home and Page Down navigation, and overflow. Chapter links align at the existing 104px combined padding/margin on desktop.
- Instrumented guide scrolling: **zero chapter/step `getBoundingClientRect()` calls during 16 ordinary scroll updates**. Resize and live reduced-motion checks confirm that cached positions are refreshed.
- Main-page browser suite: **31 passing checks** covering carousel keyboard/drag/pause/resume and offscreen suspension, wheel controls, 859px/desktop pin release and recreation, journey progression and focus, live reduced-motion changes, WebGL loss/restoration, and actual client-side route cleanup.
- Shared navigation: mobile current-route and modified clicks, focus trapping, Escape, desktop resize, skip-link visibility/focus, malformed hashes, direct chapter fragments, and reduced-motion toggles while a menu is open.
- Guide gallery/catalogue/drawer: pointer isolation, wrapping and reset, keyboard and batch navigation, rapid navigation cleanup, drawer Escape focus, and body scroll/padding restoration.
- Form validation used **37 mocked server checks and four isolated browser submissions** for draft/timestamp retention and error/success focus. No real enquiry was sent. Production contact links retain the Private Label preselection.
- FAQ exclusivity and Escape dismissal passed on the production build.

## Local evidence

Screenshots and diagnostic scripts are local, ignored artifacts under `output/playwright/private-label-performance-audit/`:

- [Private Label desktop](../output/playwright/private-label-performance-audit/main-production-1440.png)
- [Private Label mobile](../output/playwright/private-label-performance-audit/main-production-375.png)
- [Guide desktop](../output/playwright/private-label-performance-audit/guide-production-1440.png)
- [Guide mobile](../output/playwright/private-label-performance-audit/guide-production-375.png)
- [Catalogue desktop](../output/playwright/private-label-performance-audit/guide-catalogue-1440.png)
- [Catalogue mobile](../output/playwright/private-label-performance-audit/guide-catalogue-375.png)
- [Main interaction checks](../output/playwright/private-label-performance-audit/main-components-results.json)
- [Hero anchor checks](../output/playwright/private-label-performance-audit/main-anchor-results.json)
- [Offscreen and route cleanup checks](../output/playwright/private-label-performance-audit/main-cleanup-results.json)

Validation used local Chromium, including a local production server. Live email delivery, hosted deployment, and other browser engines were not tested. No publishing or deployment was performed. Existing commercial-copy qualifications and protected secondary-hosting files/dependencies are unchanged.

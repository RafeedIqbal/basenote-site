# Capability wheel reference update

## Supplied icons and heading update — 12 September 2026

The wheel now uses all eight original PNGs from the [supplied Drive folder](https://drive.google.com/drive/folders/1KFQXvx95hTAeOSh8hmVyCGNRIDLU35tL). They are stored in `public/media/private-label/capabilities/`, with each label and matching icon paired in `privateLabel.capabilities.items` in `data/site-content.ts`. The original image bytes and transparency are preserved; only the `_transparent` filename suffix was removed. `next/image` provides responsive delivery at the existing dial sizes.

The supplied artwork includes the full medallion, so each image fills its dial. Following the requested border cleanup, the dial wrapper is transparent, with no border, background or shadow in either selection state. The selected icon remains brighter. The obsolete inline SVG stand-ins were removed. The “Private Label” tags above “One partner. Every stage.” and the following “From idea to market” heading were removed, along with their heading margins.

Validation used an isolated snapshot of the checkout to preserve the running preview servers. `npm run lint` and `npm run build` passed in that snapshot; `git diff --check` passed in the working checkout. The initial checkout lint encountered two warnings in another task's ignored `output/playwright/audience-hierarchy/` scripts, which were left untouched. Working-source lint passed with `npm run lint -- --ignore-pattern 'output/playwright/**'`. The temporary build config only expanded Turbopack's root to resolve the linked dependencies; no repository build configuration changed. The four edited component/style files and capability content were compared with the tested snapshot before its removal.

- Local production Chromium: all eight capability selections and image mappings, arrow-key wrapping, Home/End, focus, and a touch-emulated tap passed.
- No horizontal overflow at 320, 390, 859, 860, and 1440 pixels. Wheel and journey pins release below 860 pixels and return at the desktop breakpoint. Scrolling releases the wheel normally.
- Initial reduced motion and live toggles passed, including removal and restoration of pins.
- Desktop/mobile navigation, mobile menu Escape/focus restoration, journey keyboard navigation, exact `/private-label#client-journey` navigation after a route change, and Private Label contact preselection passed. No enquiry was submitted.
- No browser errors were observed. Chromium emitted non-blocking Next.js CSS-preload warnings. This was local Chromium/emulation verification; no hosted deployment or physical-device check was performed.

Screenshots: [wheel desktop](../output/playwright/wheel-icons-2026-09-12/wheel-desktop.png), [wheel mobile](../output/playwright/wheel-icons-2026-09-12/wheel-mobile.png), [journey desktop](../output/playwright/wheel-icons-2026-09-12/journey-desktop.png), [journey mobile](../output/playwright/wheel-icons-2026-09-12/journey-mobile.png). Asset hashes are retained in `output/playwright/wheel-icons-2026-09-12/asset-manifest.json`.

Border cleanup previews: [desktop](../output/playwright/wheel-icons-2026-09-12/wheel-no-container-desktop.png), [detail](../output/playwright/wheel-icons-2026-09-12/wheel-no-container-detail.png), [mobile](../output/playwright/wheel-icons-2026-09-12/wheel-no-container-mobile.png). The production build and source lint were repeated for the CSS cleanup.

## Original reference update — 9 September 2026

Updated `/private-label#why-basenote` ("One partner. Every stage.") in `components/private-label/CapabilityWheel.tsx` and its CSS Module.

The section now follows the composition of [the supplied Framer reference](https://just-cabbage-903205.framer.app/): a heading and description across the top, a broad cropped orbit below, and a central capsule connecting the Basenote logo to the selected capability. On smaller screens the copy stacks and the orbit crops horizontally.

Basenote's approved copy, Source Serif 4 / Lexend Deca / Space Mono fonts, existing logo, capability glyphs, and private label color tokens are retained. The warm glow uses CSS gradients and fades into the shared page canvas. The reference's vendor logos, typography, multicolor background animation, Framer runtime, and badges are not included. No dependencies or production routes were added.

## Interaction and accessibility

- All eight capabilities remain available through named buttons, with a visible selected label and `aria-pressed` state. Arrow keys wrap; Home and End select the endpoints. Focus stays on visible controls.
- A decorative duplicate of the icon sequence keeps the arc populated. It is hidden from assistive technology; the accessible capability controls appear once.
- Desktop scroll pinning remains at widths of at least 860px and heights of at least 700px. The layout contracts on shorter desktop viewports so controls stay visible.
- Touch swipes select capabilities, cancelled gestures leave the selection alone, and vertical touch scrolling remains available. Mobile controls clear the floating chat button at 390 x 844.
- Reduced motion disables pinning and makes selection immediate. Live preference changes and breakpoint changes clean up and recreate the GSAP effects.

## Validation

`npm run lint`, `npm run build`, and `git diff --check` passed. After concurrent work in the checkout replaced shared build assets during QA, browser verification used an isolated production build of the current source. The two changed wheel files were compared with that snapshot. Verification was local Chromium, not a deployment or a Safari/Firefox/device acceptance test.

- Reference captures: 1440 x 900, 768 x 1024, and 390 x 844.
- Candidate layout checks: 1440 x 900, 2560 x 843, 768 x 1024, 390 x 844, 320 x 720, 1440 x 700, and both sides of the 859/860px breakpoint. Desktop reduced motion was also captured. No horizontal overflow in these checks.
- 23 wheel behavior checks passed: every capability, keyboard focus/wrapping, scroll progression/release, fresh hash entry, live reduced motion, breakpoint resizing, and runtime errors.
- 15 touch checks passed in a fresh context with touch/mobile emulation: taps, horizontal swipes, cancellation, vertical scrolling, unobscured controls, and live reduced motion.
- Desktop/mobile navigation, menu focus/Escape, route cleanup, fresh hash entry, and contact interest preselection were checked. No form was submitted.

Comparison was visual inspection of actual screenshots. Final desktop screenshots were also checked in fresh headless Chromium at one and 2.5 seconds after the section aligned; both remained complete. The headed capture session intermittently omitted composited layers. The headless desktop capture has no scrollbar while the headed reference reserves 15px; both use a 1440 x 900 CSS viewport. No numerical fidelity score was produced because copy, fonts, colors, and assets intentionally differ from the reference. The glow is a static approximation; the existing scroll-driven interaction is retained rather than reproducing the reference's timing.

## Separate navigation finding

One shared navigation check did not fully pass: after entering the wheel using `#why-basenote`, visiting About, returning to Private Label, and choosing "Explore the process", the journey is reached, but the URL can become `#why-basenote#client-journey`. This is outside the two edited wheel files; the root cause was not established. A copied/reloaded compound fragment may not resolve to the journey. The next step is to inspect the shared route/anchor history behavior when returning to a page that previously had a fragment. This limitation remains documented here and is not counted as a successful check.

## Output cleanup

Generated screenshots and detailed browser records were removed during Playwright output cleanup on 9 September 2026. The validation results and known limitation are summarized above. The temporary source snapshot and its preview server were removed after verification. No preview route, copied reference runtime, commit, push, or deployment is retained.

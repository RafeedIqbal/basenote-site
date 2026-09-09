# Capability wheel reference update

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

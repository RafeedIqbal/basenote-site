# Private Label Guide — 8 September 2026

**Subsequent audit:** [Guide audit and improvements](private-label-guide-audit.md) records form guard/focus fixes, catalogue reference navigation, chapter/viewport refinements, source verification and the remaining rigid-packaging copy conflict.

Updated `/private-label/guide` to the [supplied design document](https://docs.google.com/document/d/1POnHMwxhE2u-1xX2zjPmrGs8CAZNbeXEDFqVfiEi4qo/edit). The user confirmed this route. This supersedes the eight-chapter guide and draft guide prose described in the earlier handoff. The main Private Label page keeps its existing design.

## Result

- Editorial cover, six numbered chapter links, sticky desktop contents with reading progress, in-flow mobile navigation, and Next links. Chapter navigation updates the URL and moves keyboard focus below the fixed header.
- Three native expandable cards for packaging, bottle & cap, and fragrance.
- Separate paper and rigid packaging sections with the requested 60/40 desktop split. The rigid selector defaults to Two Part Hard box, uses Canyon Red for the active choice, and resets its two-image gallery when switching. Gallery controls show one image and a 01/02 counter, without thumbnails or dots; horizontal pointer swipes work.
- Complete supplied PDF catalogues: **76 bottles and 92 caps**, in printed reading order, with exact product references. Native horizontal scrolling, previous/next controls, and Arrow/Home/End keyboard operation. Product images load lazily through `next/image`.
- Six coating selectors, each showing its supplied description and two genuine PDF examples, one at a time.
- Inspired by / Bespoke panels, six-stage fragrance and production timelines, and shared animated commercial statistics with accessible final values and live reduced-motion support.
- Final project form expands inline and collects the requested details and optional images. It uses the existing live contact action, honeypot, timestamp guard, SMTP configuration and inbox. Client/server limits allow three JPG/PNG/WebP images totalling up to 3 MiB; the server verifies their signatures and uses generated attachment names. Next's action envelope is 4 MiB. Invalid entries retain form values; success uses the supplied message.
- Copy and typed media references are exposed through `data/site-content.ts`; catalogue and options JSON files back those typed exports. No dependencies, route registrations, protected hosting files or main-page marketing copy were changed.

## Source assets and exceptions

`docs/private-label-guide-assets.json` records every catalogue image, PDF page, printed reference and original dimensions/hash. `docs/private-label-guide-pdf-assets.json` records packaging and coating source pages.

- Packaging: exact images from **Basenote Packaging Options.pdf**, pages 4, 8, 9, 10 and 11.
- Coatings: both examples of every finish from **Basenote Coating Options.pdf**, pages 3–14. Hidden repeated PDF resources were excluded. Images were extracted without slide headings/borders and encoded as WebP for delivery.
- Bottles: all product cards in **BOTTLE CATALOGUE.pdf**, pages 2–27. Original images are 908–1512 px square, replacing the smaller and differently numbered Drive collection.
- Caps: all product cards in **Cap Catalogue.pdf**, pages 2–17. The catalogue itself supplies mostly 311×303 px images. The wooden cap formerly named `34.jpg` in Drive is correctly **PC-15-36**. The PDF has no duplicate product references and no entry for cap 86.
- The bottle on page 23 is printed **PB50-**, with no complete suffix. That exact reference is retained, and the guide explains that the customer should include its image when choosing it. Cap page 6 prints **PC-28**; it is also retained exactly.
- The additional TAC coating guide and PGL packaging guideline confirm the same categories. The Aura project plan is client-specific reference material; none of its private project details or commercial terms were added to the public guide.
- The cover asset is marked TBC in the design document. The implemented cover uses a restrained colour treatment within the existing brand palette; no replacement product imagery was invented.

## Validation

- `npm run lint`: passed, zero warnings.
- `npm run build`: passed, including TypeScript and all public routes. The sandboxed attempt could not fetch the existing Google Fonts; the successful build used network access. Existing fonts were preserved.
- `git diff --check`: passed.
- 37 form validation checks passed against fresh bundled source with Nodemailer replaced before actions were imported. Covered field limits and choices, email/header input, hidden guard failures, no images, three real mixed-format images, oversized/fourth/invalid uploads, HTML escaping, attachment forwarding, ordinary contact compatibility and simulated SMTP failure. A forged high-bit WebP signature regression is rejected using exact byte comparisons. **No real enquiry was sent.** The repeatable temporary validation harness is `/tmp/basenote-project-form-validation.cjs`.
- Browser checks: desktop 1440×900 and mobile 375×812; no horizontal page overflow at 320, 375, 768, 860, 1280 or 1920 px. Chapter anchors land below the header, focus follows navigation, galleries reset and respond to buttons/drag, catalogue endpoints and Arrow/Home/End controls work, and coating keys wrap correctly.
- Checked initially reduced motion and live preference changes. Main-page pins/Lenis are removed under reduced motion and recreate on restoration; pins release at 699 px height and return at 700 px. Leaving the main page removes its pins and canvas. Final statistic values remain available.
- Checked mobile menu opening/Escape/route navigation, form keyboard focus, populated submission timestamp, hidden honeypot, and consultation navigation to the contact page with Private Label selected. No browser console errors in the final checks.
- Browser automation exercised mouse/pointer gestures at mobile widths. The in-app browser does not support synthetic `Input.dispatchTouchEvent`; native catalogue touch swiping, physical devices, screen readers and Safari/Firefox were not independently tested. SMTP delivery was mocked, not sent to the live inbox.

## Screenshots

Viewport screenshots; long sections continue below the captured frame. Development tools indicator may be visible.

- [Desktop cover](../output/playwright/private-label-guide/cover-desktop.png)
- [Mobile cover](../output/playwright/private-label-guide/cover-mobile.png)
- [Desktop packaging](../output/playwright/private-label-guide/packaging-desktop.png)
- [Mobile packaging gallery](../output/playwright/private-label-guide/packaging-mobile.png)
- [Caps with printed references](../output/playwright/private-label-guide/caps-desktop.png)
- [Higher-resolution bottles](../output/playwright/private-label-guide/bottles-desktop.png)
- [Coating selector](../output/playwright/private-label-guide/finishes-desktop.png)
- [Desktop project form](../output/playwright/private-label-guide/form-desktop.png)
- [Mobile project form](../output/playwright/private-label-guide/form-mobile.png)

Local implementation only. No commit, push, publishing or deployment was performed.

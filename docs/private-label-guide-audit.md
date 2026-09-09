# Private label guide audit — 8 September 2026

Audited the existing work in progress at `/private-label/guide` against the supplied `Private Label Guide.md` and all seven PDF references. Document instructions were treated as reference content, not authorization to contact anyone or publish. Existing unrelated changes and the protected secondary hosting files were preserved.

## Fixes and improvements

- The project form now mounts when its disclosure first opens. The two-hour guard window therefore begins when an enquiry starts, rather than when someone opens the guide. Closing and reopening preserves the draft.
- Removed `defaultValue` from the shared hidden timestamp input so React rerenders do not clear the value written by its mount effect. The honeypot and server guards remain in place.
- Form errors receive keyboard focus, including repeated identical errors. Success uses a persistent status region and focuses the confirmation after removing the form. Required fields are marked, and bottle/cap labels now say “reference” instead of “PN”. Empty image files are also rejected in the client.
- Added a native reference selector to each catalogue, allowing direct access to any of the 92 caps or 76 bottles. It stays synchronized with arrow controls and scrolling. Announcements include the current reference and position, and controls identify their track.
- Catalogue positioning now uses actual card spacing rather than assuming a fixed gap. Responsive image sizes match the cards, and cards fit even when their container is narrower than their usual width.
- Desktop contents can scroll within a short viewport; the final links remain reachable. Mobile navigation labels are larger.
- Chapter links calculate the shared scroll padding and chapter margin together. The guide's margin now overrides the global section rule, making native hash navigation and clicked links consistent. Programmatic scrolling refreshes Lenis dimensions first so an immediate jump after responsive reflow reaches the requested chapter.
- Restored the approved minimum-order qualification: typically 500 units **per fragrance**, varying with the product and components selected.

## Reference verification and open copy question

All 168 bottle/cap references match the printed catalogues, with no duplicates or missing assets. The audit checked the image resources and their association with the printed references: 134 images are byte-identical and 34 are pixel-identical to their sources. All 17 packaging/coating assets match the recorded source pages, allowing for WebP encoding. `PB50-` and `PC-28` are incomplete/unusual references in the source PDFs themselves and were correctly preserved. No private Aura project quantities, formula identifiers, blends or scent names were added to the public guide.

**Rigid packaging source conflict:** the supplied guide repeats “Fully Custom / Made-To-Measure” and “Foiling” for both packaging tiers. `Basenote Packaging Options.pdf`, page 7, and `PGL .pdf`, page 3, limit rigid shapes to the listed formats and specify “Foiling / Hot Stamp”. The guide wording is preserved because the newer source may be intentional. Confirm whether “Fully Custom” should describe size only for rigid boxes before changing that commercial claim.

## Validation

- `npm run lint`: passed with zero warnings.
- `npm run build`: passed, including TypeScript and all public routes. A sandboxed retry could not fetch the existing Google Fonts; the final successful build used network access without changing the fonts.
- `git diff --check`: passed.
- Rebuilt and ran the existing isolated server-action harness against current source: **37 checks passed**, with Nodemailer replaced before importing actions. No real enquiry was sent.
- An additional temporary browser harness bundled the actual form and guard components with an exclusive in-memory action replacement. Its build graph contained zero real action or SMTP dependencies; CSP blocked network connections and form submission. Verified repeated server-error focus, preserved input and timestamp through rerenders, and focused success confirmation in a persistent status region. Three submissions were simulated locally.
- Desktop/mobile browser checks: no horizontal overflow at 320, 375, 768, 860, 1440 or 1920px; contents remain accessible at 1440×480; catalogue jump, buttons, Home/End and Arrow controls; packaging/coating switching and gallery reset; form first-open mounting and draft preservation; chapter focus and immediate navigation after desktop-to-mobile resize; mobile menu opening/Escape focus restoration; and consultation navigation with Private Label preselected.
- Checked initial and live reduced motion, Lenis teardown/restoration, main-page pin release at 699px and recreation at 700px, and removal of the main-page pins/canvas after returning to the guide. No console errors were reported in the checked application session. The final catalogue and form were also inspected on the production build.

Browser tests used the in-app Chromium browser and simulated viewport sizes. Native touch gestures, physical devices, Safari/Firefox, screen-reader announcements and actual email delivery were not independently tested. The existing two-hour limit still applies once an enquiry has started; no draft persistence across reloads was added.

Temporary repeatable harnesses: `/tmp/basenote-project-form-validation.cjs` and `/tmp/basenote-guide-browser-validation/README.md`. Reference extraction and visual verification intermediates are in `/tmp/basenote-guide-reference-audit/`.

## Output cleanup

Generated screenshots were removed during Playwright output cleanup on 9 September 2026. The validation results are summarized above.

Local changes only. No commit, push or deployment was performed.

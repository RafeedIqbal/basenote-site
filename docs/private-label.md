# Private label implementation

`/private-label` is composed in `components/private-label/PrivateLabelPage.tsx`; `/private-label/guide` in `PrivateLabelGuidePage.tsx`. Most component styles are co-located CSS Modules. Keep copy, links, labels and media references in `data/site-content.ts`, through `privateLabel`, `privateLabelGuide`, and `privateLabelFaqs`.

## Content and assets

- Preserve commercial qualifications: typically 500 units **per fragrance**, indicative costs from around £20 per unit, and typical 8–12 week timing. Costs and timing depend on fragrance development, components, packaging, volume, shipping, delivery, and support. Formula ownership depends on the development/licensing arrangement. The production guide specifies a 50% deposit before manufacture.
- Guide prose, the guide teaser and both private-label metadata descriptions need editorial sign-off. The teaser and parent metadata currently carry `draft: true`; keep review notes out of the public interface.
- **Open packaging decision:** the guide says “Fully Custom / Made-To-Measure” and “Foiling” for rigid packaging. `Basenote Packaging Options.pdf` page 7 and `PGL .pdf` page 3 instead limit shapes to the listed formats and specify “Foiling / Hot Stamp”. Confirm whether customisation refers only to size before changing the claim.
- The [marketing brief](https://docs.google.com/document/d/13H5NsVSMfoAbBtyvBDrBNLr3TYnbaEHGp6q7LkMjOYQ/edit) and [guide brief](https://docs.google.com/document/d/1POnHMwxhE2u-1xX2zjPmrGs8CAZNbeXEDFqVfiEi4qo/edit) provide source context. The implemented copy lives in `data/site-content.ts`.
- The five portfolio PNGs in `public/media/private-label/portfolio/` are supplied artwork for Firmino, Rizla, Fashion TV, Ingrained Oil, and ALPAC. The [source folder](https://drive.google.com/drive/folders/1Ts-ShOA4vPBbldiNBEJCZoN5p7McssiS) has a second Firmino image that is intentionally excluded.
- The wheel uses eight flat SVGs in `public/media/private-label/capabilities/`. Each has an 80×80 canvas and 2.8-unit rounded strokes. Colors progress from pale yellow to orange and stay attached to the corresponding capability; Branding uses a pen nib. The PNGs from the [supplied artwork folder](https://drive.google.com/drive/folders/1KFQXvx95hTAeOSh8hmVyCGNRIDLU35tL) remain editable-reference assets.
- `privateLabel.featured.enabled` is false and `featured.video` is null. Keep `FeaturedProject` available to restore when the ALPAC project film is supplied. Playback must remain explicit, with a poster, native controls and offscreen pausing.
- The hero's Blender source, frame data, preview sprite and fallback images are described in [hero asset regeneration](private-label-hero-animation.md). Retain the editable scene and font licences.
- The final CTA and footer share a continuous cloud shader in `WebglBackground.tsx` and `private-label-shader.ts`. Keep the dark text overlay, static fallback, offscreen/hidden-tab pause, context restoration and render-size cap. `public/media/private-label/basenote-clouds-no-stars.html` is the standalone export.

## Main-page interactions

| Component | Behavior to preserve |
| --- | --- |
| `PortfolioCarousel` | Five-image continuous ribbon with transform-based desktop swelling. Drag/tap and keyboard selection remain available. Hover pauses autoplay; offscreen, hidden-tab and reduced-motion states suspend its ticker. Empty collections render nothing; one slide does not autoplay. |
| `AudiencePanels` | One expanded card at a time; Enter/Space toggles and Escape closes with focus return. Collapsed cards show the number and title; expanded copy and the final contact link remain distinct from the trigger. Three columns start at 1024px, two at 640px, then a stacked disclosure. Refresh downstream scroll geometry after layout settles. |
| `CapabilityWheel` | Eight named controls with selected state, arrow wrapping and Home/End; a decorative duplicate orbit is hidden from assistive technology. Swipe selection must preserve vertical touch scrolling. The BN positioning wrapper and icon dials have no decorative container; the central outer capsule remains. |
| `ClientJourney` | Ten informational stages in a horizontal strip, including on small screens and under reduced motion. Left/Right/Home/End expose every stage. The CTA is inside the section, reveals near the final card on pinned desktop, and remains available in normal flow otherwise. |
| `CommercialStats` | Shared semantic definition list on both routes. Assistive technology receives static full values; visual count-up values are hidden from it. Reduced motion restores final values immediately. |
| `FaqList` | Private Label opts into exclusive animated answers with Escape, linked regions and hidden/inert collapsed content. Default usage elsewhere retains native multi-open disclosures. |

Wheel and journey pins require at least 860px width and 700px height. Smaller or shorter screens and reduced motion are unpinned. Preserve focus and reading position across resize, preference changes and teardown. Keep private-label Canyon Red, Desert Varnish and Mojave Ochre scoped to these routes, using the shared fonts and page canvas.

## Guide structure

The guide has six chapters: Start here, Choose your packaging, Choose your bottle & cap, Create your fragrance, Get production-ready, and Make it real. Its cover contains the title and introduction. Chapter navigation is a sticky desktop rail and in-flow mobile list; chapter IDs are stable link targets.

- `GuideElementCards` uses native modal dialogs. Support keyboard opening, Escape/close/backdrop dismissal, focus return, internal scrolling, and background scroll locking. Keep centering in the base dialog rule so closing does not shift the drawer. Reduced motion removes panel/backdrop transitions immediately.
- `GuideProductSections` owns packaging, rigid-box and coating selectors and their image galleries. Switching an option resets the gallery; buttons, keyboard and horizontal swipes reveal each image.
- `GuideCatalogue` shows nine references per deck. Previous/next, the reference selector, and Left/Right/Home/End/Page Up/Page Down reach every product. Preserve one tab stop per deck, selection announcements, and horizontal scrolling on narrow screens without moving the page vertically. Departing decks must be hidden and inert, removed after animation, and cleared immediately under reduced motion.
- `GuideTimeline` keeps the fragrance timeline vertical at every width. All six descriptions stay readable; scroll, hover, click and keyboard focus update its emphasis.
- `GuideProductionTimeline` reveals six rows and their connectors. Focus reveals a pending step; reduced motion and no JavaScript expose the complete list.
- `--guide-subsection-space` and `--guide-divider-width` in `PrivateLabelGuide.module.css` control subsection rhythm and short centered dividers, including the guide statistics.

## Catalogue provenance

Runtime content imports `data/private-label-catalogue.json` and `data/private-label-options.json`. These provenance records support future replacements:

- [Catalogue asset manifest](private-label-guide-assets.json): 76 bottles from `BOTTLE CATALOGUE.pdf` pages 2–27 and 92 caps from `Cap Catalogue.pdf` pages 2–17, with printed references, extraction positions, dimensions and hashes.
- [Packaging/coating manifest](private-label-guide-pdf-assets.json): 17 source images from `Basenote Packaging Options.pdf` and `Basenote Coating Options.pdf`.

Keep printed reading order and exact references, including incomplete bottle `PB50-`, cap `PC-28`, and the catalogue's missing cap 86. The wooden cap is `PC-15-36`. When replacing assets, update runtime data and provenance together. Private client plans are not public guide content.

## Scroll and form contracts

`SmoothScroll.tsx` recreates Lenis on pathname changes using layout-effect cleanup, cancelling the old RAF before it can overwrite router scroll restoration. Next owns page navigation and history; `lib/scroll.ts` owns section offsets, focus and locks. Do not add a competing Lenis anchor handler.

`ChapterRail` caches chapter positions on refresh and selects the final chapter when guide progress reaches 100%, even when that short chapter is below the reading line. Upward scrolling resumes normal selection. Recheck this by crossing the guide's end and then scrolling through the footer.

The guide project form mounts on first disclosure opening and remains mounted when closed, preserving both the draft and timestamp. Share the live contact action, honeypot and submission-age guard. Allow at most three JPG/PNG/WebP images totalling 3 MiB; server validation checks signatures and generates attachment names. The server-action envelope is 4 MiB. Errors and success must receive appropriate focus and announcements. Never submit a real enquiry as a test.

For UI changes, exercise desktop/mobile navigation, moving-scroll route changes and Back/Forward, contact preselection, keyboard focus, exact hashes, pin resizing/release, and initial/live reduced motion. Check narrow layouts and the guide's final chapter in a tall viewport. Build and browser checks establish local behavior only.

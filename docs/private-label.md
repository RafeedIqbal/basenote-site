# Private label implementation

`/private-label` is composed in `components/private-label/PrivateLabelPage.tsx`; `/private-label/guide` in `PrivateLabelGuidePage.tsx`. Most component styles are co-located CSS Modules. Keep copy, links, labels and media references in `data/site-content.ts`, through `privateLabel`, `privateLabelGuide`, and `privateLabelFaqs`.

## Content and assets

- Preserve commercial qualifications: typically 500 units **per fragrance**, indicative costs from around £20 per unit, and typical 8–12 week timing. Costs and timing depend on fragrance development, components, packaging, volume, shipping, delivery, and support. Formula ownership depends on the development/licensing arrangement. The production guide specifies a 50% deposit before manufacture.
- Guide prose, the guide teaser and both private-label metadata descriptions need editorial sign-off. The teaser and parent metadata currently carry `draft: true`; keep review notes out of the public interface.
- **Open packaging decision:** the guide says “Fully Custom / Made-To-Measure” and “Foiling” for rigid packaging. `Basenote Packaging Options.pdf` page 7 and `PGL .pdf` page 3 instead limit shapes to the listed formats and specify “Foiling / Hot Stamp”. Confirm whether customisation refers only to size before changing the claim.
- The [marketing brief](https://docs.google.com/document/d/13H5NsVSMfoAbBtyvBDrBNLr3TYnbaEHGp6q7LkMjOYQ/edit) and [guide brief](https://docs.google.com/document/d/1POnHMwxhE2u-1xX2zjPmrGs8CAZNbeXEDFqVfiEi4qo/edit) provide source context. The implemented copy lives in `data/site-content.ts`.
- The five portfolio PNGs in `public/media/private-label/portfolio/` are supplied artwork for Firmino, Rizla, Fashion TV, Ingrained Oil, and ALPAC. The [source folder](https://drive.google.com/drive/folders/1Ts-ShOA4vPBbldiNBEJCZoN5p7McssiS) has a second Firmino image that is intentionally excluded.
- Portfolio headlines and stories use the supplied Private Label Dev amendment brief. The ribbon uses the supplied brand logos, with a text fallback for projects without artwork. Each project has a stable URL slug, image array and optional logo image in `data/site-content.ts`. Gallery controls appear only for multiple images.
- The wheel uses eight flat SVGs in `public/media/private-label/capabilities/`. Each has an 80×80 canvas and 2.8-unit rounded strokes. Colors progress from pale yellow to orange and stay attached to the corresponding capability; Branding uses a pen nib. The PNGs from the [supplied artwork folder](https://drive.google.com/drive/folders/1KFQXvx95hTAeOSh8hmVyCGNRIDLU35tL) remain editable-reference assets.
- `privateLabel.featured.enabled` is false and `featured.video` is null. Keep `FeaturedProject` available to restore when the ALPAC project film is supplied. Playback must remain explicit, with a poster, native controls and offscreen pausing.
- The hero's Blender source, frame data, preview sprite and fallback images are described in [hero asset regeneration](private-label-hero-animation.md). Retain the editable scene and font licences.
- The final CTA and footer share a continuous cloud shader in `WebglBackground.tsx` and `private-label-shader.ts`. Keep the dark text overlay, static fallback, offscreen/hidden-tab pause, context restoration and render-size cap. `public/media/private-label/basenote-clouds-no-stars.html` is the standalone export.

## Main-page interactions

| Component | Behavior to preserve |
| --- | --- |
| `PortfolioCarousel` | Full-width logo ribbon with uniform 36px artwork heights and 64px edge-to-edge gaps (28px / 48px below 860px). Slots follow each logo's natural proportions. Complete sets repeat as needed to fill the viewport and an offscreen wrapping slot; every visible copy links to its story, while only one set participates in keyboard and screen-reader navigation. Drag horizontally to move the continuous loop; vertical touch gestures remain page scrolling. A drag suppresses link activation, while Click/Enter/Space opens the native case-study dialog. Escape, close, and backdrop dismiss it and return focus. The hash is the selected story, including on direct arrival, reload and Back/Forward. Modified clicks retain native link behavior. Previous/next, arrow keys, and horizontal swipes move through projects with multiple images. There is no play/pause control; automatic scrolling pauses during pointer presses, hover, keyboard focus, modal reading, offscreen, and hidden-tab states. Reduced motion hides the repeats and exposes all projects in a static wrapping list with the same logo heights and horizontal gaps. Empty collections render nothing; one project does not autoplay. |
| `AudiencePanels` | One expanded card at a time; Enter/Space toggles and Escape closes with focus return. Collapsed cards show the number and title; expanded copy and the final contact link remain distinct from the trigger. Three columns start at 1024px, two at 640px, then a stacked disclosure. Refresh downstream scroll geometry after layout settles. |
| `CapabilityWheel` | Eight named controls with selected state, arrow wrapping and Home/End; a decorative duplicate orbit is hidden from assistive technology. Swipe selection must preserve vertical touch scrolling. The BN positioning wrapper and icon dials have no decorative container; the central outer capsule remains. |
| `ClientJourney` | Ten informational stages in a horizontal strip, including on small screens and under reduced motion. Left/Right/Home/End expose every stage. The CTA is inside the section, reveals near the final card on pinned desktop, and remains available in normal flow otherwise. |
| `CommercialStats` | Shared semantic definition list on both routes. Assistive technology receives static full values; visual count-up values are hidden from it. Reduced motion restores final values immediately. |
| `FaqList` | Private Label opts into exclusive animated answers with Escape, linked regions and hidden/inert collapsed content. Default usage elsewhere retains native multi-open disclosures. |

Wheel and journey pins require at least 860px width and 700px height. Smaller or shorter screens and reduced motion are unpinned. Preserve focus and reading position across resize, preference changes and teardown. Keep private-label Canyon Red, Desert Varnish and Mojave Ochre scoped to these routes, using the shared fonts and page canvas.

### Portfolio logos and shareable stories

The original PNGs from the [supplied brand-logo folder](https://drive.google.com/drive/folders/1xs7ycRtz3WNnSsPRNSvsSPKHtaQyzcEv) are copied unchanged into `public/media/private-label/portfolio/logos/`. The horizontal Firmino version is used in the ribbon; its original stacked alternative is retained as `firmino-original.png` (Drive ID `1B51cgZBz4Hrv0QQQTVta7uegpABQd0tf`). Rizla displays `rizla-transparent.png`, a transparent-background derivative created with the built-in image editor to remove the source's grey rectangle; the supplied `rizla.png` remains intact.

Logo dimensions and visible artwork bounds live alongside each source in `data/site-content.ts`. The ribbon clips transparent source margins in CSS and scales the visible bounds to its shared logo height, preserving the original PNGs and their proportions. Update these bounds when replacing a logo; the loop measures the resulting widths to keep spacing consistent through wrapping, resizing, and keyboard navigation.

| Brand / story URL | Source file / Drive ID | Local filename |
| --- | --- | --- |
| Firmino · `/private-label#firmino` | `firmino (1).png` / `1uR-AlTe0sMQIvlHWFliC9-V2MlHzr5U1` | `firmino.png` |
| Rizla · `/private-label#rizla` | `Rizla.png` / `1PSf2gzde0tnvElQ3BWYm2KgqivIWNaID` | `rizla.png` (source), `rizla-transparent.png` (display) |
| Fashion TV · `/private-label#fashion-tv` | `FTV.png` / `1hgXnec3Ffmxs1--PIZ9Rz1qIB91gWaoF` | `fashion-tv.png` |
| Ingrained Oil · `/private-label#ingrained-oil` | `Ingrained Oil.png` / `131Q_rONKv-bpxD_-7IzlRm7evBRYOfTM` | `ingrained-oil.png` |
| ALPAC London · `/private-label#alpac-london` | `alpac` / `16VfoTrjG-6rYiyi1_4bSATTtt_c0cFn-` | `alpac-london.png` |

`lib/portfolio-navigation.ts` preserves Next's history state and query parameters. Opening a logo adds a history entry; closing it returns to the previous entry, so Forward can reopen it. Closing a directly shared story removes only its hash and stays on this page. Unknown hashes are ignored by the portfolio; regular page anchors keep their existing behavior. Story slugs are URL state, not element IDs, so opening a modal does not scroll the background to a hidden target.

## Guide structure

The guide has six chapters: Start here, Choose your packaging, Choose your bottle & cap, Create your fragrance, Get production-ready, and Make it real. Its cover contains the title and introduction. Below 860px, chapter navigation appears in the cover and the article rail is hidden. Desktop retains the sticky rail; chapter IDs are stable link targets.

- `GuideElementCards` uses native modal dialogs. Support keyboard opening, Escape/close/backdrop dismissal, focus return, internal scrolling, and background scroll locking. Keep centering in the base dialog rule so closing does not shift the drawer. Reduced motion removes panel/backdrop transitions immediately.
- `GuideProductSections` owns packaging, rigid-box and coating selectors and their image galleries. Finish descriptions expand within their own rows, one at a time, with Matte initially open. Closing an open description keeps its image preview; selecting another finish resets the gallery. Buttons, keyboard and horizontal swipes reveal each image.
- `GuideChoiceCards` displays non-interactive Basic/Premium/Luxe cap cards and 30ml/50ml/100ml bottle cards. Catalogue decks are no longer rendered. The `GuideCatalogue` component, catalogue data, original images and provenance remain available for future catalogue work.
- `GuideTimeline` keeps the fragrance timeline vertical at every width. All six descriptions stay readable; scroll, hover, click and keyboard focus update its emphasis.
- `GuideProductionTimeline` reveals six rows and their connectors. Focus reveals a pending step; reduced motion and no JavaScript expose the complete list.
- `--guide-subsection-space` and `--guide-divider-width` in `PrivateLabelGuide.module.css` control subsection rhythm and short centered dividers, including the guide statistics.

## Catalogue provenance

Runtime content imports `data/private-label-options.json`; `data/private-label-catalogue.json` remains retained source data. These provenance records support future replacements:

- [Catalogue asset manifest](private-label-guide-assets.json): 76 bottles from `BOTTLE CATALOGUE.pdf` pages 2–27 and 92 caps from `Cap Catalogue.pdf` pages 2–17, with printed references, extraction positions, dimensions and hashes.
- [Packaging/coating manifest](private-label-guide-pdf-assets.json): 17 source images from `Basenote Packaging Options.pdf` and `Basenote Coating Options.pdf`.

Keep printed reading order and exact references, including incomplete bottle `PB50-`, cap `PC-28`, and the catalogue's missing cap 86. The wooden cap is `PC-15-36`. When replacing assets, update runtime data and provenance together. Private client plans are not public guide content.

### Component card illustrations

The six original PNG illustrations are copied unchanged from the [supplied component folder](https://drive.google.com/drive/folders/13Vm-7ncmAw9WAdnzfmDhc0DurmBtButs) into `public/media/private-label/guide/components/`. Numbered bottle files map in the approved brief's size order; the artwork is illustrative rather than a product reference or technical size drawing.

| Card | Source file / Drive ID | Local filename |
| --- | --- | --- |
| Basic | `Basic lid.png` / `1D3H-xqW1hcGNPI1GgqQRcotq0BB-s83e` | `cap-basic.png` |
| Premium | `Premium cap.png` / `1n_-VRVIuucyuvOkIJpZh12wfetFSx9eT` | `cap-premium.png` |
| Luxe | `Luxe cap.png` / `1zD-g_8nviiqXZeqwNDtjyj7U6--R6Z-m` | `cap-luxe.png` |
| 30ml | `bottle 1.png` / `17bij4RTBTFCxV2tasTZSQynjEGSaZCSt` | `bottle-30ml.png` |
| 50ml | `bottle2.png` / `1r8YP7RVllVW_q5xcwFOe8O8DsHwqPhTu` | `bottle-50ml.png` |
| 100ml | `bottle3.png` / `1S7PkyQbXC7_cYDUj1oziDo0_pwdug_KN` | `bottle-100ml.png` |

## Scroll and form contracts

`SmoothScroll.tsx` recreates Lenis on pathname changes using layout-effect cleanup, cancelling the old RAF before it can overwrite router scroll restoration. Next owns page navigation and history; `lib/scroll.ts` owns section offsets, focus and locks. Do not add a competing Lenis anchor handler.

`ChapterRail` caches chapter positions on refresh and selects the final chapter when guide progress reaches 100%, even when that short chapter is below the reading line. Upward scrolling resumes normal selection. Recheck this by crossing the guide's end and then scrolling through the footer.

The guide project form mounts on first disclosure opening and remains mounted when closed, preserving both the draft and timestamp. Both forms share the server-only submission service, honeypot, submission-age guard, and Turnstile verification. Allow at most three JPG/PNG images totalling 3 MiB; server validation checks signatures and generates attachment names. WebP is not accepted. The server-action envelope is 4 MiB. Valid enquiries independently reach Brevo email and Google Sheets; either destination succeeding accepts the enquiry. Complete project details are retained in the email and sheet message, while images are email attachments only. See the README for credentials, sheet headers, and partial-delivery limitations. Errors and success must receive appropriate focus and announcements. Never submit a real enquiry as a test.

Bottle and cap fields accept optional free-text sizes, tiers or catalogue references under the existing `bottle` and `cap` field names. The guide consultation link (`privateLabelGuide.final.consultationHref`), main-page closing “Book a call” CTA (`privateLabel.final.href`) and contact-page booking button (`contactDetails.booking.href`) share the supplied Calendly booking URL in the content data.

For UI changes, exercise desktop/mobile navigation, moving-scroll route changes and Back/Forward, contact preselection, keyboard focus, exact hashes, pin resizing/release, and initial/live reduced motion. Check narrow layouts and the guide's final chapter in a tall viewport. Build and browser checks establish local behavior only.

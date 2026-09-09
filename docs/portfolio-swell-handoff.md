# Portfolio swell carousel

Rebuilt the `/private-label#portfolio` carousel from the public [CMS Swell Carousel reference](https://cmsswellcarousel.framer.website/) on 9 September 2026. The existing five portfolio images now form a continuous ribbon that grows around the center and contracts at its edges. The section retains Basenote's dark canvas and square artwork.

## Changed files

- `components/private-label/PortfolioCarousel.tsx`: independent React/GSAP implementation, continuous looping, direct pointer/touch dragging, slide selection, hover-controlled autoplay, and keyboard navigation. Visible manual controls are removed.
- `components/private-label/PortfolioCarousel.module.css`: responsive geometry, image cropping, visible focus, and reduced-motion styles.
- `components/private-label/PrivateLabelPage.tsx`: passes the centralized portfolio content into the component.
- `data/site-content.ts`: removes unused manual-control labels. Existing project media and approved marketing copy are retained.

The reusable component accepts typed slides, labels, `initialIndex`, `imageAspectRatio`, `autoPlay`, `onActiveChange`, `id`, and `className`. Its default image aspect ratio is 1:1. Empty collections render nothing, and a single image does not autoplay.

Mouse hover is the only interaction that pauses autoplay. Moving the mouse outside the section resumes it, including during a captured drag or while a clicked image retains focus. Autoplay advances independently of drag and selection animations. Touch contact, swiping, tapping, and keyboard focus do not create a pause. Offscreen display, hidden browser tabs, and reduced motion still suspend automatic work; reduced motion makes selection changes instant. Animation callbacks, tweens, media listeners, and resize/intersection observers are cleaned up. Touch capture transfers from the image button to the viewport without cancelling the swipe.

## Validation

- `npm run lint`: passed with zero warnings.
- `npm run build`: passed, including TypeScript and static generation. Public routes and sitemap inputs are unchanged.
- All 32 current browser checks pass. They cover control removal, hover pause/resume, resuming after clicks, resuming during and after a captured drag, hover re-entry while dragging, keyboard wraparound/focus, uninterrupted touch contact, swipe/tap playback, vertical touch scrolling, initial and live reduced motion, pin release/recreation, hash navigation, desktop/mobile route changes, menu focus, contact preselection and guard fields, and detached-carousel cleanup. No real enquiries were submitted.
- Restoring the motion preference resets the page to the top through the existing smooth-scroll setup. The resumed-autoplay check therefore brings the carousel back into view before checking movement; offscreen suspension is expected.
- Final desktop (1440×900), tablet (768×1024), and mobile (390×844) captures have no horizontal page overflow. No browser runtime errors were recorded.
- No Framer runtime, source bundles, analytics, remote images, or new application dependencies were added.

## Original reference comparison

The original reconstruction comparison below predates the hover-only playback revision; the image geometry is unchanged. The source is a DOM image ribbon, with no canvas or video. Reference initial and drag states were captured with the pointer held to stop its continuous drift. The implementation was compared through a temporary harness using the reference's white background, fixed 560px image height, and 3:4 aspect ratio. This isolates the reconstructed geometry from the intentional production styling changes.

The final comparison masks photo interiors while retaining one-pixel edges and rounded corners. Both viewport captures omit their bottom 80px to exclude Framer branding. The comparison therefore measures layout fidelity in the harness; it does **not** claim that the dark production section matches the white reference pixel for pixel.

| Viewport | Initial | Drag |
| --- | ---: | ---: |
| Desktop | 0.9954 | 0.9945 |
| Tablet | 0.9911 | 0.9887 |
| Mobile | 0.9949 | 0.9911 |

Three candidate cycles were used. The final motion curve follows the measured center growth and horizontal displacement. The earlier rectangular masks retained a 10px band of unrelated photo content; the final masks exclude that photo interior while preserving edges and corner geometry. All six final comparisons exceed 0.95.

The temporary `app/portfolio-check/` harness was removed before the production build. No preview route remains to delete. Reference captures and comparison overlays were generated in `/tmp/basenote-framer.t8EY8J` during validation.

## Output cleanup and limits

Generated screenshots and detailed browser records were removed during Playwright output cleanup on 9 September 2026. The validation results are summarized above.

The dark background, square artwork, responsive mobile image size, hover pause, and drag settling are intentional adaptations. Visible previous/next and pause/play controls were removed at the user's request. Motion is inferred from observed frames; unsampled intermediate frames are not guaranteed to match the reference. Validation used Chromium with emulated mobile touch; physical iOS Safari was not tested. No known blocking issues remain in the tested states. No push or deployment was performed.

# Private Label implementation handoff

**Guide update:** [8 September guide redesign](private-label-guide-handoff.md) supersedes the guide architecture, draft prose and validation notes below with the supplied six-chapter design and PDF catalogues.

**Latest review:** [8 September 2026 design review](private-label-design-review.md) records subsequent fixes and screenshots. It supersedes the original notes below about the blue wheel logo, playable ALPAC stand-in, and width-only pin breakpoint. ALPAC now displays the full supplied artwork until genuine footage is available; pins require 860×700px or larger.

Implemented locally on `feat/private-label-page`. No push or deployment was performed. No runtime or development dependencies were added or removed.

## Delivered

- `/private-label`: all ten sections, exact supplied marketing copy and twelve FAQs, five actual Drive portfolio images, accessible carousel and audience panels, eight-position wheel, ten-stage horizontal journey, explicit-play ALPAC poster/player, animated commercial figures, guide teaser, exclusive FAQ, and the supplied WebGL2 final CTA.
- `/private-label/guide`: eight numbered chapters, sticky desktop contents rail with current chapter and reading progress, in-flow mobile contents, full-width colour dividers, parent anchors, shared FAQs, and contact links.
- Shared components are in `components/site/shared.tsx`. FAQ exclusivity is opt-in; other pages preserve native multi-open FAQ behavior. Both new routes retain the shared canvas and existing Source Serif 4, Lexend Deca, and Space Mono fonts.
- The two private label routes use a fixed header with reserved space, ScrollTrigger direction detection, focus/menu visibility, a logomark-only mobile header, and a floating contact link after the introduction leaves view. Lenis and reveal effects respond to live reduced-motion changes.
- The guide is registered in metadata, `PUBLIC_ROUTES`, the sitemap, and the Services footer group. “Book a call” opens `/contact?interest=Private%20Label` as requested.

## Local commit sequence

1. `b9c66cd` — Extract shared site components and adaptive navigation.
2. `551dfd4` — Build the private label marketing experience.
3. `7c24832` — Add the private label guide and chapter navigation.
4. `Clean up obsolete site files and document private label handoff` — cleanup, final interaction corrections, repository instructions, this inventory, and screenshots. Use `git log -4 --oneline` for its final hash.

## Assets and remaining stand-ins

| Section | Retained stand-in | Central reference / replacement point |
| --- | --- | --- |
| Hero | `public/media/basenote/private-label-hero.png` | `privateLabel.hero.image` and `imageAlt` in `data/site-content.ts` |
| ALPAC footage | `public/media/hero-background2.mp4` | `privateLabel.featured.video` in `data/site-content.ts` |
| Capability icons | `components/private-label/capability-icons.ts` | Single replaceable `capabilityIconPaths` inline SVG set |

The ALPAC poster is actual supplied artwork, not a stand-in. The wheel uses the specifically requested existing `/assets/logo-icon-3d.svg`; that repository asset currently depicts the existing blue geometric symbol.

Actual artwork was retrieved from the [supplied Drive portfolio folder](https://drive.google.com/drive/folders/1Ts-ShOA4vPBbldiNBEJCZoN5p7McssiS). All five are 1080×1080 PNGs. Drive image 2 (the second Firmino image) is excluded.

| Drive image | Project | Saved file | Drive file ID |
| --- | --- | --- | --- |
| 1 | Firmino | `public/media/private-label/portfolio/firmino.png` | `1gwfCT2IH7Xapjw4YSgQdROlf0Pp8rgpG` |
| 3 | Rizla | `public/media/private-label/portfolio/rizla.png` | `1eXlnFlNFwqVOBXHk7bpzXH_S-3KLQSP-` |
| 4 | Fashion TV | `public/media/private-label/portfolio/fashion-tv.png` | `1LuV0Y_c3WaZNj_C9zp7Te7PAvThYdiYp` |
| 5 | Ingrained Oil | `public/media/private-label/portfolio/ingrained-oil.png` | `1CCylHhPfcgHh7cLnrHnizaZ8DtXcaExo` |
| 6 | ALPAC | `public/media/private-label/portfolio/alpac.png` | `1wt1dUUn-iK97vVJaeVAhYJ9X-pA9Zz2M` |

The final CTA uses the supplied GLSL shader with a ten-second loop and `max(1, 0.5 * devicePixelRatio)` resolution scale. It does not ship the 14 MB background video or perfume-builder assets. Static fallbacks use Canyon Red `#943F2D`, Desert Varnish `#8B3A2A`, and Mojave Ochre `#A04535`, with a dark text-legibility overlay.

## Draft copy for review

The supplied marketing text, six audiences, ten journey stage descriptions, and twelve question/answer pairs are preserved in `data/site-content.ts`. These authored additions remain draft copy:

1. **The guide as a whole** (`privateLabelGuide`): introduction; chapter headings and explanatory paragraphs for chapters 01–06 and 08; all ten `stageNotes`; guide navigation, progress and CTA labels. Chapter 07 reuses the supplied FAQ verbatim. Audience and journey excerpts also reuse the supplied copy. Draft prose is limited to documented services and retains the qualifications on indicative pricing, typical timing, component suitability, and ownership.
2. **Guide teaser supporting sentence** (`privateLabel.guide.description`): “Explore the stages, practical considerations and support available as you shape your own fragrance.” Its link label is “Read the guide.”
3. **Parent metadata description** (`privateLabel.metadata.description`): “Launch your own fragrance with bespoke development, packaging, manufacturing and delivery, with support shaped around your project.”
4. **Guide metadata description** (`privateLabelGuide.metadata.description`): “Explore Basenote’s private label fragrance process, from the first idea and product development to production, delivery and launch.”
5. **Descriptive interface/accessibility copy**: hero alt text “Fragrance bottle with warm amber light”; carousel label “Private label portfolio”; “Previous project” / “Next project”; the five project-name + “fragrance project” alt texts; “Choose a capability”; logo alt “Basenote”; poster alt “ALPAC London Ewa fragrance”; play label “Play the ALPAC film”; failure message “The film could not play. Please try again.” These are centralized in `privateLabel`.

The guide draft is marked with `privateLabelGuide.draft`; the teaser and parent metadata have their own draft flags. The draft designation is a handoff note rather than an extra public-facing warning.

## Validation

Both pages passed `npm run lint` with zero warnings and `npm run build` before cleanup. Both commands were repeated successfully after cleanup. `git diff --check` passes. The production output includes all eleven public page routes.

Browser checks used the local Next.js development server at `http://127.0.0.1:3001`:

| Check | Result |
| --- | --- |
| Desktop and mobile layouts | Both pages inspected at 1440px and 375px; screenshots saved below. |
| Horizontal page overflow | Zero at 360, 375, 768, 860, 1440, and 1920px. |
| Header | Hides down, reveals up, and stays visible while a header control has focus; mobile wordmark hidden; menu locks background scrolling, Escape closes it and restores focus. |
| Floating contact link | Appears after hero/guide introduction, with Private Label contact preselection. |
| Portfolio | Buttons, adjacent slides, pointer drag at desktop/mobile widths, repeated arrow keys, focus and project announcements checked. Keyboard activation remains available after dragging. |
| Audience panels | Initially collapsed; exclusive expansion and Escape close checked. Panel 06 contact is outside its trigger. |
| Capability wheel | Desktop selection and pin checked; mobile tap/swipe and reduced-motion static selection checked. Seven 45° steps span all eight items over approximately 2.5 viewport heights. |
| Journey | First and final cards checked, final card fully visible before release; following CTA is outside pin. Resize while pinned to 1920px then 768px refreshed measurements and removed pin styles. |
| Video | Poster until explicit play; starts muted, native controls appear, no autoplay; pauses offscreen. |
| Figures and FAQs | Final accessible values preserved; exclusive FAQ behavior checked on both routes; reduced-motion values and height changes remain immediate. |
| Guide | Eight chapters, active chapter and progress, desktop sticky rail, mobile in-flow contents and chapter hash navigation checked. |
| Reduced motion | Fresh-load and live-toggle checks passed: no Lenis, no pins, readable vertical journey, final figures, and static CTA. Returning to normal motion recreates effects. |
| WebGL | Rendered shader visually checked; unavailable WebGL and simulated context-loss fallbacks checked. Offscreen rendering and a simulated hidden-tab event stop time updates. |
| Hashes and navigation | Direct journey/final-CTA hashes resolve after pin measurement. Page → guide leaves zero pin spacers and no canvas; returning recreates two intended pins. |
| Contact guard | Honeypot remains offscreen, aria-hidden and excluded from tab order; hidden submitted-at timestamp initializes. No enquiry was sent. |
| Sitemap | Eleven URLs including `/private-label/guide`. |
| Route smoke test | All eleven public routes load with their expected H1. Existing navigation links were followed; the two unlinked legal pages were opened directly. |
| Cleanup audit | No live imports of deleted sources or paths to deleted assets. Dynamic tone, eyebrow and service CSS variants included in audit. Protected files and package scripts/dependencies unchanged. |

## Screenshots

These captures show the actual local browser UI; the small Next.js development indicator is present. Desktop captures are 1440×1000 and mobile captures are 375×812.

- [Private Label desktop](private-label-qa/private-label-desktop.png)
- [Private Label mobile](private-label-qa/private-label-mobile.png)
- [Guide desktop, active chapter 04](private-label-qa/guide-desktop.png)
- [Guide mobile](private-label-qa/guide-mobile.png)
- [Journey, final card before release](private-label-qa/journey-desktop.png)
- [WebGL final CTA](private-label-qa/final-cta-desktop.png)

## Cleanup inventory

The exact inventory is also available as [JSON](private-label-cleanup-inventory.json).

Before deletion, import analysis and path searches found one live dependency: `FormGuardFields.tsx` imported `.guardField` from the old `ContactPage.module.css`. The rule was moved to `components/contact/FormGuardFields.module.css` and the import updated. A repeated audit then found no incoming live imports of the deletion group.

Removed **36 source files**:

- `components/HomePage.tsx`
- `components/home/AudiencesSection.module.css`
- `components/home/AudiencesSection.tsx`
- `components/home/BasenoteSymbol.tsx`
- `components/home/CtaBanner.module.css`
- `components/home/CtaBanner.tsx`
- `components/home/FaqSection.module.css`
- `components/home/FaqSection.tsx`
- `components/home/Footer.module.css`
- `components/home/Footer.tsx`
- `components/home/HeroSection.module.css`
- `components/home/HeroSection.tsx`
- `components/home/HomePage.module.css`
- `components/home/OpportunitySection.module.css`
- `components/home/OpportunitySection.tsx`
- `components/home/PortfolioSection.module.css`
- `components/home/PortfolioSection.tsx`
- `components/home/ProcessSection.module.css`
- `components/home/ProcessSection.tsx`
- `components/home/ServicesSection.module.css`
- `components/home/ServicesSection.tsx`
- `components/home/TechProductsSection.module.css`
- `components/home/TechProductsSection.tsx`
- `components/home/WhyBasenoteSection.module.css`
- `components/home/WhyBasenoteSection.tsx`
- `data/home-content.ts`
- `components/shared/PageFooter.module.css`
- `components/shared/PageFooter.tsx`
- `components/shared/SiteHeader.module.css`
- `components/shared/SiteHeader.tsx`
- `components/about/AboutPage.tsx`
- `components/about/AboutPage.module.css`
- `components/legal/LegalPage.tsx`
- `components/legal/LegalPage.module.css`
- `components/contact/ContactPage.tsx`
- `components/contact/ContactPage.module.css`

Removed **31 tracked assets** plus the ignored `public/.DS_Store` file. The old Basenote media folder contained sixteen PNGs: fifteen were removed and the hero stand-in was retained.

- `public/portfolio/aurum-bottle.svg`
- `public/portfolio/aurum-creator.svg`
- `public/portfolio/placeholder-1a.svg`
- `public/portfolio/placeholder-1b.svg`
- `public/portfolio/placeholder-2a.svg`
- `public/portfolio/placeholder-2b.svg`
- `public/portfolio/placeholder-3a.svg`
- `public/portfolio/placeholder-3b.svg`
- `public/portfolio/studio-bottle.svg`
- `public/portfolio/studio-founder.svg`
- `public/portfolio/velocity-athlete.svg`
- `public/portfolio/velocity-bottle.svg`
- `public/media/basenote/alchemy-demo.png`
- `public/media/basenote/alchemy-feature.png`
- `public/media/basenote/alchemy-hero.png`
- `public/media/basenote/blend-feature.png`
- `public/media/basenote/blend-hero.png`
- `public/media/basenote/contact-still.png`
- `public/media/basenote/editorial-ingredients.png`
- `public/media/basenote/editorial-lab.png`
- `public/media/basenote/editorial-notebook.png`
- `public/media/basenote/fragrance-shelves.png`
- `public/media/basenote/hero-perfume.png`
- `public/media/basenote/lab-closeup.png`
- `public/media/basenote/manufacturing-line.png`
- `public/media/basenote/private-label-bottle.png`
- `public/media/basenote/private-label-feature.png`
- `public/media/basenote-handoff/hero-spray.png`
- `public/media/basenote-handoff/product-2.png`
- `public/media/basenote-handoff/product-3.png`
- `public/assets/logo-text.svg`
- `public/.DS_Store`

Removed seven unused shared CSS classes and all 28 associated selector branches, including branches within grouped/media rules: `productHeroInner`, `productHero`, `labImage`, `productHeroArt`, `productHeroVeil`, `processGrid`, and `processList`. Preserved shared canvas pseudo-elements and dynamic `tone*`, `eyebrow*`, and `service*` variants. `SiteChrome.module.css` and `InquiryForm.module.css` have no unused classes in the audit.

Rewrote `AGENTS.md` and `CLAUDE.md` around the actual route list, architecture, fonts, content source, animation lifecycles, form guard, and validation commands.

Additional orphans retained outside this cleanup scope:

- `public/media/basenote-handoff/lab.png`
- `public/media/basenote-handoff/product-1.png`

## Protected secondary toolchain

Status: **possibly unused, needs confirmation**. All were preserved unchanged:

- `vite.config.ts`
- `sites-vite-plugin.ts`
- `worker/index.ts`
- `.openai/hosting.json`
- `package.json` script `build:sites`
- Development dependencies `vinext`, `vite`, `wrangler`, `@cloudflare/vite-plugin`, `@vitejs/plugin-react`, `@vitejs/plugin-rsc`, and `react-server-dom-webpack`

## Adaptations and remaining limits

- Desktop wheel pinning is the confirmed adaptation. The journey follows the written horizontal specification despite the reference currently showing vertical cards. Mobile/reduced-motion journey uses a vertical list.
- The perfume builder is excluded as requested. The three stand-ins above and draft copy need their eventual editorial/asset replacements; the actual portfolio does not.
- Swipe behavior was exercised through the shared pointer handler at mobile width. No physical phone, screen-reader session, or cross-browser device lab was used; those remain release QA rather than claimed tests.
- No other known implementation deviations remain. This handoff is local only; no push, deployment, or real enquiry submission was performed.

# Repository Guidelines

## Architecture and routes
Basenote Solutions is a Next.js 16 App Router marketing site using React 19 and strict TypeScript. The eleven public routes are `/`, `/private-label`, `/private-label/guide`, `/blend-engine`, `/alchemy-engine`, `/about`, `/blogs`, `/case-studies`, `/contact`, `/privacy-policy`, and `/terms`. Keep route registration in `lib/site.ts` (`PUBLIC_ROUTES`) aligned with page entrypoints and the generated sitemap.

`app/` contains route entrypoints, metadata, global styles, and the contact server action. Most page views live in `components/site/SitePages.tsx` with `SitePages.module.css`. Shared navigation and footer live in `components/site/`; `shared.tsx` exports `SiteFrame`, `Eyebrow`, `SectionDivider`, and `FaqList`. The private label page and guide use dedicated components and co-located CSS Modules in `components/private-label/`.

Keep marketing copy, navigation, FAQs, links, media references, audiences, stages, and guide chapters centralized in typed exports in `data/site-content.ts`. The private label exports are `privateLabel`, `privateLabelGuide`, and `privateLabelFaqs`. Preserve approved copy and its commercial qualifications. Guide prose, the guide teaser, and the two private label metadata descriptions are draft copy; see `docs/private-label-handoff.md`.

## Styling and media
Use CSS Modules for component styling and `app/globals.css` for global resets and tokens. Retain the shared page canvas. Fonts are Source Serif 4 (`--font-serif`), Lexend Deca (`--font-body`), and Space Mono (`--font-mono`), loaded in `app/layout.tsx`. Scope private label Canyon Red, Desert Varnish, and Mojave Ochre colours to those two pages.

Static media lives under `public/assets/` and `public/media/`. Actual private label portfolio artwork lives in `public/media/private-label/portfolio/`; the remaining hero, film, and icon stand-ins are documented in the handoff. Use `next/image` and responsive `sizes` for raster images; reserve priority loading for the private label hero on those routes.

## Interactions and accessibility
Import `gsap`, `ScrollTrigger`, and `useGSAP` from `@/lib/gsap`. Scope and clean up animations, triggers, observers, event listeners, RAF loops, and WebGL resources. `components/SmoothScroll.tsx` owns Lenis; `lib/scroll.ts` coordinates programmatic scrolling and menu locking. Respond immediately to changes in `prefers-reduced-motion`, including teardown and recreation of effects.

The private label header is fixed with reserved space and direction-based visibility; other routes retain their existing header behavior. Desktop wheel and journey pins start at 860px; smaller screens and reduced motion use unpinned interactions. Preserve keyboard operation, accessible final statistic values, explicit video playback, and static shader fallbacks. `FaqList` keeps native multi-open behavior by default and offers an opt-in exclusive animated mode.

`components/site/InquiryForm.tsx` uses the live `components/contact/FormGuardFields.tsx` and its dedicated stylesheet. Keep the honeypot hidden, the submitted-at field populated, and server checks in `lib/contact-form-guard.ts`. Do not send real enquiries during validation.

## Commands and validation
- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Next.js development server.
- `npm run lint`: required ESLint validation with zero warnings.
- `npm run build`: create the Next.js production build.
- `npm run start`: serve the production build locally.

No automated test framework is configured. Run lint and production build after changes. For UI changes, smoke test desktop and mobile navigation, focus, contact preselection, reduced motion both initially and after a live toggle, hash navigation, pinned section resizing/release, and route changes. Include screenshots and an honest validation note in handoffs. If adding tests, use `*.test.ts` or `*.test.tsx` and test meaningful behavior.

## Protected secondary hosting target
Preserve `vite.config.ts`, `sites-vite-plugin.ts`, `worker/index.ts`, `.openai/hosting.json`, the `build:sites` script, and its dependencies (`vinext`, `vite`, `wrangler`, `@cloudflare/vite-plugin`, `@vitejs/plugin-react`, `@vitejs/plugin-rsc`, and `react-server-dom-webpack`). Their status is **possibly unused, needs confirmation**; do not remove them as part of a Next.js cleanup.

## Code and commits
Use the `@/*` alias, functional React components, double quotes, and semicolons. Name components in PascalCase and content files in kebab-case. Keep edits scoped and preserve unrelated work. Use descriptive imperative commit subjects. PRs should explain the resulting behavior, relevant validation, and material limitations; add screenshots for UI changes. Publishing, pushing, and deployment require task authorization.

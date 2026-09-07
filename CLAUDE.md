# CLAUDE.md

## Project
Basenote Solutions is an eleven-route Next.js 16 App Router marketing site with React 19 and strict TypeScript. Read `AGENTS.md` for repository conventions and `docs/private-label-handoff.md` for the private label implementation, asset provenance, draft copy, and validation record.

Public routes: `/`, `/private-label`, `/private-label/guide`, `/blend-engine`, `/alchemy-engine`, `/about`, `/blogs`, `/case-studies`, `/contact`, `/privacy-policy`, `/terms`. `lib/site.ts` owns `PUBLIC_ROUTES`, shared metadata helpers, and the site origin; `app/sitemap.ts` derives its entries from that list.

## Architecture
- `app/`: route entrypoints, metadata, layout, global CSS, and `actions/contact.ts`.
- `components/site/SitePages.tsx`: main site page views, supported by its CSS Module, shared header/footer, and `InquiryForm`.
- `components/site/shared.tsx`: `SiteFrame`, `Eyebrow`, `SectionDivider`, and `FaqList`; exclusive animated FAQ behavior is opt-in.
- `components/private-label/`: ten-section private label marketing page, eight-chapter guide, carousel, capability wheel, horizontal journey, video, figures, and WebGL background, with co-located CSS Modules.
- `data/site-content.ts`: centralized typed copy, links, media, navigation, audiences, stages, and FAQs. New page content is in `privateLabel`, `privateLabelGuide`, and `privateLabelFaqs`. Retain documented pricing, timing, and ownership qualifications; the guide, teaser, and new metadata descriptions remain drafts.
- `components/contact/FormGuardFields.tsx` and its stylesheet: live hidden form guard used by `InquiryForm`; server checks are in `lib/contact-form-guard.ts`.
- `public/assets/` and `public/media/`: static assets. Private label project artwork is in `public/media/private-label/portfolio/`.

## Styling and animation
Fonts loaded through `next/font/google` in `app/layout.tsx` are Source Serif 4 (`--font-serif`), Lexend Deca (`--font-body`), and Space Mono (`--font-mono`). Preserve the shared canvas and scope the private label palette to its two routes. Use CSS Modules and `next/image` with responsive `sizes`.

Import GSAP, ScrollTrigger, and useGSAP from `@/lib/gsap`. `SmoothScroll.tsx` owns Lenis and responds to live reduced-motion changes; `lib/scroll.ts` coordinates scroll positioning and menu locks. Clean up effects and WebGL resources on route changes. Private label desktop pins use the 860px breakpoint; reduced motion and mobile layouts remain unpinned. Keep keyboard navigation, fixed-header focus/menu handling, explicit media playback, and static shader fallbacks functional.

## Commands and checks
```bash
npm install
npm run dev
npm run lint
npm run build
npm run start
```
ESLint allows zero warnings. No automated test framework is configured. Run lint and build, then smoke test responsive layouts, route links, mobile menu, focus, section hashes, pin release/resizing, live reduced-motion changes, and contact defaults. Check the form guard without submitting an enquiry. Capture screenshots for UI changes.

## Preserved hosting configuration
There is also a secondary Sites/Vinext/Cloudflare target. Preserve `vite.config.ts`, `sites-vite-plugin.ts`, `worker/index.ts`, `.openai/hosting.json`, `build:sites`, and dependencies `vinext`, `vite`, `wrangler`, `@cloudflare/vite-plugin`, `@vitejs/plugin-react`, `@vitejs/plugin-rsc`, and `react-server-dom-webpack`. Status: **possibly unused, needs confirmation**. Do not infer that the Next.js build makes them safe to delete.

Use descriptive commits, preserve unrelated changes, and do not push or deploy without task authorization.

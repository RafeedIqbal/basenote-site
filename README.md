# Basenote Solutions

Next.js 16 App Router marketing site with React 19 and TypeScript.

## Development

```sh
npm install
npm run dev
npm run lint
npm run build
npm run start
```

The contact action uses `GMAIL_USER`, `GMAIL_APP_PASSWORD`, and `DESTINATION_INBOX` from local or hosting environment configuration. Keep credentials out of Git. Do not send real enquiries during validation.

## Where to make changes

| Concern | Source |
| --- | --- |
| Public routes, site origin, shared metadata | `lib/site.ts`, `app/`, `app/sitemap.ts` |
| Favicons, social artwork, manifest and structured data | [Brand metadata workflow](docs/brand-metadata.md), `scripts/generate-brand-assets.mjs` |
| Marketing copy, navigation, links, media and FAQs | `data/site-content.ts` |
| Main page views | `components/site/SitePages.tsx` and its CSS Module |
| Shared header, footer, forms and FAQ behavior | `components/site/` |
| Private Label page and guide | `components/private-label/` |
| Fonts and global tokens | `app/layout.tsx`, `app/globals.css` |
| Scrolling, anchors and animation registration | `components/SmoothScroll.tsx`, `lib/scroll.ts`, `lib/gsap.ts` |
| Contact validation and image uploads | `app/actions/contact.ts`, `lib/contact-form-guard.ts`, `lib/private-label-project.ts` |

Read [repository guidelines](AGENTS.md), [private-label implementation context](docs/private-label.md), and [hero asset regeneration](docs/private-label-hero-animation.md) before changing those areas. Keep these documents about the current implementation, outstanding decisions, and repeatable workflows; keep task reports and screenshots outside the repository.

The secondary Sites/Vinext/Cloudflare target is **possibly unused, needs confirmation**. Preserve its configuration, `build:sites` script, and dependencies listed in [AGENTS.md](AGENTS.md).

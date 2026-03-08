# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Basenote Solutions marketing site — a single-page Next.js 16 app for a fragrance brand consultancy. Domain: basenotesolutions.com.

## Commands

```bash
npm run dev      # Start dev server (Next.js)
npm run build    # Production build
npm run lint     # ESLint with zero warnings allowed (--max-warnings=0)
```

No test framework is configured.

## Architecture

- **Next.js 16** with App Router, React 19, TypeScript (strict mode)
- **Single page**: `app/page.tsx` renders `components/HomePage.tsx` with content from `data/home-content.ts`
- **Content/view separation**: All copy, navigation items, portfolio projects, services, FAQ, etc. are typed and defined in `data/home-content.ts` (`HomePageContent` type), passed as props to section components
- **CSS Modules**: Each section component in `components/home/` has a co-located `.module.css` file. Global styles in `app/globals.css`
- **GSAP + ScrollTrigger**: Animations throughout. `lib/gsap.ts` is the single registration point — always import `gsap`, `ScrollTrigger`, and `useGSAP` from `@/lib/gsap`, not directly from packages
- **Lenis**: Smooth scrolling via `components/SmoothScroll.tsx`, mounted in root layout. Respects `prefers-reduced-motion`
- **Fonts**: Three Google Fonts loaded in `app/layout.tsx` as CSS variables: `--font-display` (Antonio), `--font-body` (Schibsted Grotesk), `--font-mono` (IBM Plex Mono)
- **Path aliases**: `@/*` maps to project root (e.g., `@/components/...`, `@/lib/...`, `@/data/...`)

## Key Patterns

- Section components receive the full `HomePageContent` object as `content` prop
- GSAP animations use `data-*` attributes as selectors (e.g., `data-hero-video`, `data-logo-symbol`)
- `"use client"` is used on components with animations or interactivity; page and layout are server components
- Images served via Next.js Image optimization (AVIF/WebP configured in `next.config.ts`)

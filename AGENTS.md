# Repository Guidelines

## Project Structure & Module Organization
This repository is a single-page Next.js 16 marketing site. App Router entrypoints and site metadata live in `app/` (`page.tsx`, `layout.tsx`, `robots.ts`, `sitemap.ts`), while reusable UI lives in `components/`. Home page sections are grouped under `components/home/` and pair each React component with a co-located CSS module, for example `components/home/HeroSection.tsx` and `components/home/HeroSection.module.css`. Keep marketing copy, navigation, FAQ items, and portfolio data centralized in `data/home-content.ts`. Shared animation setup belongs in `lib/gsap.ts`. Static media belongs in `public/assets/`, `public/media/`, or `public/portfolio/`.

## Build, Test, and Development Commands
- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the local Next.js dev server.
- `npm run build`: create a production build and catch build-time regressions.
- `npm run start`: serve the production build locally.
- `npm run lint`: run ESLint with `--max-warnings=0`; this is the required validation step.

## Coding Style & Naming Conventions
Use TypeScript with strict typing and the `@/*` path alias for imports. Follow the existing conventions: PascalCase for React component files, camelCase for variables and hooks, and kebab-case for content/data files like `home-content.ts`. Keep section-specific styling in CSS modules and reserve `app/globals.css` for tokens and global resets. Match the existing code style: double quotes, semicolons, and functional components. Import `gsap`, `ScrollTrigger`, and `useGSAP` from `@/lib/gsap` instead of registering plugins in individual components.

## Testing Guidelines
No automated test framework is configured today. Before opening a PR, run `npm run lint` and manually smoke test the site in `npm run dev`, including the mobile menu, smooth scrolling, reduced-motion behavior, and major GSAP-driven section transitions. If you add automated tests later, use `*.test.ts` or `*.test.tsx` naming and keep them near the feature or in a top-level `tests/` directory.

## Commit & Pull Request Guidelines
Recent git history uses placeholder commit messages such as `.`; contributors should not continue that pattern. Write short, imperative commit subjects that describe the change, such as `Refine hero animation timing` or `Update portfolio content`. Pull requests should include a concise summary, linked issue or context when available, screenshots or recordings for UI changes, and a short note on the manual checks performed.

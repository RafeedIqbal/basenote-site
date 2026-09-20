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

### Turnstile verification

Both enquiry forms use the existing Turnstile widget with action `contact`. The shared server guard verifies each token before reading image uploads or sending email, requiring a successful response, the exact action, and an explicitly allowed hostname. Verification failures block delivery. Existing honeypot and submission-age checks remain active.

Configure these in the ignored `.env` locally and the hosting platform's environment settings for each deployment:

| Variable | Production value |
| --- | --- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAAAAAE9tW5JmBtJJxvU3` |
| `TURNSTILE_SECRET_KEY` | The existing widget secret; server-only, never commit or print it |
| `TURNSTILE_ALLOWED_HOSTNAMES` | `www.basenotesolutions.com,basenotesolutions.com` |

Next.js embeds `NEXT_PUBLIC_TURNSTILE_SITE_KEY` during the build. Set it before building and rebuild after changing it. The secret and hostname allowlist are read by the server. Hostnames contain no scheme, port, path, or wildcard. Production must not allow `localhost` or `127.0.0.1`; preview deployments need their own explicit hostname configuration and a widget that accepts that hostname. Missing configuration fails closed.

Run `npm run test:contact` for isolated Node tests of verification and both real server actions. The runner compiles into a temporary directory and stubs every mail transport and Siteverify request; it sends no enquiries and never loads `.env`. Run `npm run lint` and `npm run build` afterward.

For local browser checks, explicitly override the public key with a [Cloudflare test sitekey](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) in the test process before building/starting the app. Never put test keys into production or automatically bypass verification in development. Test-key Siteverify responses use a synthetic action (`test`), so successful action tests must mock Siteverify with action `contact` and an explicitly configured test hostname rather than weakening the real action/hostname checks. Intercept browser submissions or stub the mail transport in an isolated server test harness; do not submit to the live enquiry endpoint.

Tokens are single-use. Each form disables submission until verified, clears verification on expiry/error, and resets its own widget after each server attempt. Closing the guide disclosure retains the draft; navigating away removes the widget. To validate the real widget/secret pairing, obtain a fresh real token on an allowed hostname and invoke the actual server action with only the mail transport stubbed; verify one acceptance and rejection of the same token on replay. A dummy-token secret probe or mocked test alone does not establish live end-to-end acceptance.

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

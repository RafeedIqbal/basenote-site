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

### Enquiry delivery

Both the contact page and private-label guide use the same server-only submission service. After validation and Turnstile verification, it independently sends a Brevo transactional email and appends a Google Sheets row. Keep credentials out of Git. Do not send real enquiries during validation.

Configure these in the ignored `.env` locally and in the hosting environment for each deployment:

| Variable | Purpose |
| --- | --- |
| `BREVO_API_KEY` | Brevo API key (not an SMTP key) |
| `BREVO_SENDER_EMAIL` | An active, verified Brevo sender |
| `DESTINATION_INBOX` | `marketing@basenotesolutions.com` |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | Service-account email with Editor access to the spreadsheet |
| `GOOGLE_SHEETS_PRIVATE_KEY` | Service-account PEM key; real line breaks and escaped `\n` are supported |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | `1KZ5Q0yGglYytCCHqyYVI9sXn1Xq97y3zpGlidHTMpDw` |

Enable the Google Sheets API in the service account's project. The integration uses the `spreadsheets` scope and writes only to `Sheet1`. Before using a different spreadsheet, initialize its blank `A1:I1` header row in this exact order: **Received at (UTC), Submission ID, Form, Full name, Email, Company / brand, Area of interest, Message / project details, Attachment filenames**. Existing headers are checked before each append; mismatches fail the Sheets destination without modifying cells. The app does not create tabs or overwrite headers. Appends use `RAW` values and `INSERT_ROWS`, so submitted text cannot become a spreadsheet formula.

Email uses the configured sender, the visitor as Reply-To, and the complete enquiry in HTML and plain text. Rows contain the server-generated UTC timestamp, submission ID, and form path. Guide choices, phone number, and notes remain together in the project-details cell. Up to three JPG/PNG files totalling 3 MiB are sent as email attachments with generated safe filenames; Sheets stores filenames only. WebP uploads are not accepted.

Both destinations are awaited, each with a 10-second network deadline (including Google authentication). A submission succeeds if either destination confirms receipt. If both fail, the forms retain their draft and offer a retry. Missing provider configuration only disables that destination. Failure logs contain the submission ID, destination, and sanitized category/status, never enquiry contents or credentials. Delivery writes are not automatically retried because timed-out requests may already have succeeded. There is no background retry or attachment storage: when only Sheets succeeds, the text is retained but the uploaded files are not. API acceptance does not establish inbox delivery.

### Turnstile verification

Both enquiry forms use the existing Turnstile widget with action `contact`. The shared server guard verifies each token before reading image uploads or contacting either delivery provider, requiring a successful response, the exact action, and an explicitly allowed hostname. Verification failures block delivery. Existing honeypot and submission-age checks remain active.

Configure these in the ignored `.env` locally and the hosting platform's environment settings for each deployment:

| Variable | Production value |
| --- | --- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAAAAAE9tW5JmBtJJxvU3` |
| `TURNSTILE_SECRET_KEY` | The existing widget secret; server-only, never commit or print it |
| `TURNSTILE_ALLOWED_HOSTNAMES` | `www.basenotesolutions.com,basenotesolutions.com` |

Next.js embeds `NEXT_PUBLIC_TURNSTILE_SITE_KEY` during the build. Set it before building and rebuild after changing it. The secret and hostname allowlist are read by the server. Hostnames contain no scheme, port, path, or wildcard. Production must not allow `localhost` or `127.0.0.1`; preview deployments need their own explicit hostname configuration and a widget that accepts that hostname. Missing configuration fails closed.

Run `npm run test:contact` for isolated Node tests of verification and both real server actions. The runner compiles into a temporary directory and stubs Google authentication and every Brevo, Sheets, and Siteverify request; it sends no enquiries and never loads `.env`. Tests cover both destinations, partial failures, timeouts, field mapping, uploads, and verification guards. Run `npm run lint` and `npm run build` afterward.

For local browser checks, explicitly override the public key with a [Cloudflare test sitekey](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) in the test process before building/starting the app. Never put test keys into production or automatically bypass verification in development. Test-key Siteverify responses use a synthetic action (`test`), so successful action tests must mock Siteverify with action `contact` and an explicitly configured test hostname rather than weakening the real action/hostname checks. Intercept browser submissions or stub Google authentication and both delivery providers in an isolated server test harness; do not submit to the live enquiry endpoint.

Tokens are single-use. Each form disables submission until verified, clears verification on expiry/error, and resets its own widget after each server attempt. Closing the guide disclosure retains the draft; navigating away removes the widget. To validate the real widget/secret pairing, obtain a fresh real token on an allowed hostname and invoke the actual server action with Google authentication and both delivery providers stubbed; verify one acceptance and rejection of the same token on replay. A dummy-token secret probe or mocked test alone does not establish live end-to-end acceptance.

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
| Contact validation, delivery and image uploads | `lib/contact-submission.ts`, `lib/contact-delivery.ts`, `lib/contact-form-guard.ts`, `lib/private-label-project.ts` |

Read [repository guidelines](AGENTS.md), [private-label implementation context](docs/private-label.md), and [hero asset regeneration](docs/private-label-hero-animation.md) before changing those areas. Keep these documents about the current implementation, outstanding decisions, and repeatable workflows; keep task reports and screenshots outside the repository.

The secondary Sites/Vinext/Cloudflare target is **possibly unused, needs confirmation**. Preserve its configuration, `build:sites` script, and dependencies listed in [AGENTS.md](AGENTS.md).

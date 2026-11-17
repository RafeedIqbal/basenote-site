# Brand assets and search metadata

The current identity uses the supplied Bn monogram in `public/media/basenote-handoff/logo-white.png`, the site's black canvas, Source Serif 4, and Lexend Deca. Keep the supplied artwork unchanged. Icon exports trim its transparent padding and center the complete mark.

`lib/site-brand.ts` supplies the site identity, canonical origin and default social image to both the site and the artwork generator. Every public page uses `createPageMetadata` in `lib/site.ts`. Private-label descriptions retain their editorial status in `data/site-content.ts` and `docs/private-label.md`.

## Regenerating assets

With Node 22.18+ and dependencies installed, run:

```sh
npm run generate:brand
```

`scripts/generate-brand-assets.mjs` generates these committed assets without network access:

- `app/favicon.ico`: 16, 32, and 48 px images of the Bn mark.
- `app/icon.png`: 96 px browser/search icon, discovered by Next.js.
- `app/apple-icon.png`: opaque 180 px Apple touch icon; the OS applies the corner mask.
- `public/icons/icon-192.png` and `icon-512.png`: manifest icons. The opaque 512 px version also supplies the structured-data logo, so the white mark remains visible on light surfaces.
- `public/icons/icon-maskable-512.png`: a separate export with the entire mark inside the maskable safe circle.
- `public/og.png`: the shared 1200 × 630 social card. It uses the current logo, fonts, homepage tagline, and shared description.

Open Graph and Twitter use the same explicit image descriptor, including dimensions and alt text. There is no competing `opengraph-image.tsx` route. Increment the image URL's `v` parameter in `SITE_SOCIAL_IMAGE` when publishing revised artwork so services can fetch a new cache key. The original `/og.png` path also serves the latest artwork.

Font files in `assets/brand-fonts/` are only inputs to the asset generator; website typography still uses `next/font`. Source Serif 4 Regular is from [Adobe's Source Serif distribution](https://github.com/adobe-fonts/source-serif/tree/release/OTF). Lexend Deca Regular is the static 400-weight TTF served by the [Google Fonts CSS API](https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@400), with its license from [Google Fonts](https://github.com/google/fonts/tree/main/ofl/lexenddeca). Keep static font files here because the image renderer does not support every variable-font table. Their SIL Open Font Licenses are retained beside the files.

## Metadata contracts

- Root viewport and manifest use the black brand color. The manifest keeps browser display mode.
- Canonicals, Open Graph URLs, robots sitemap URL, and structured data use `SITE_ORIGIN`.
- The homepage describes the organization and website. Journal records in `data/site-editorial.ts` supply each article's HTML, Open Graph and Twitter preview, Article or BlogPosting, and breadcrumb trail. Set the record's date to its first publication date. A rebuild uses the same date.
- ALPAC's case study has one URL under `/case-studies` and is also listed in the journal. The supplied portfolio photograph shows ẸWÀ. The accompanying [Drop 001 storefront](https://alpaclondon.com/drops/drop-001) capture is stored at `public/media/editorial/alpac-drop-001.webp`.
- The sitemap covers `PUBLIC_ROUTES`. Add `lastModified` only when an actual content modification date is available, rather than reporting every build as a content change.
- Validate the production HTML on all public routes, image responses/dimensions, favicon sizes, manifest icons, and JSON-LD after changes. Inspect social artwork and small icons visually. External crawlers and sharing services refresh after deployment on their own schedule.

## Measuring product search traffic

After publication, compare the first 28 days with the preceding 28 days in the verified site's [Search Console Performance report](https://support.google.com/webmasters/answer/7576553). Group queries around starting a fragrance brand, private label perfume manufacturing, retail perfume blending software, and fragrance factory ERP or formulation software. Compare impressions, clicks and average position within each group. For a new URL, use the Pages filter to follow its first impressions and the queries that brought visitors to it.

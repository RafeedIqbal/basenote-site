# Basenote CMS

Open **/admin** on the Basenote website. Every account is an administrator and can edit content, publish, restore revisions, and manage other accounts. Choose **Forgot password?** on the login screen to set or reset a password using the account email.

## Editing

- Under **Site pages**, open a page and search by section name or by the words currently on screen. Shared navigation and footer content have their own entry. Save a draft and use the preview button to open it on the site. **Publish changes** updates the public page, related links, and sitemap.
- Under **Articles and case studies**, choose the section, slug, cover, and publication date. Write each section with a heading and a unique anchor. Separate paragraphs with a blank line. The first publication fixes the URL. The **Versions** tab can restore an earlier revision.
- Under **Media**, reuse indexed site artwork or upload a JPEG, PNG, WebP or AVIF of up to 3 MiB. Give the image descriptive alt text. Upload replacements as new items so earlier revisions keep their artwork. New uploads go to a public Vercel Blob store, so anyone with a file URL can read the image. Draft page and article previews require an admin session.
- Edit the existing portfolio placements on the Private Label page. The same entries appear in Selected Work and the case studies index. Additional full case studies can be created in the articles collection.
- The Private Label Guide prose, guide teaser and private-label search descriptions require editorial sign-off before publication. Preserve the service qualifications and native guide chapter targets.

## Running the CMS

Use the Node 24 version in the repository’s .nvmrc. Vercel supplies DATABASE_URL and BLOB_READ_WRITE_TOKEN from its Neon and Blob integrations. Set a unique PAYLOAD_SECRET for each environment. The Resend sender and API key used by the site provide account recovery. Use a local environment file with isolated database and storage credentials for development.

Apply schema migrations before starting an application version that needs them. The initial seed requires CMS_BOOTSTRAP_EMAIL and CMS_BOOTSTRAP_PASSWORD on an empty database. Supply a generated credential privately. The seed skips existing accounts and records. A completion marker in Neon keeps later runs from reimporting deleted content or overwriting edits.

```sh
npm run cms -- migrate
npm run cms:seed
npm run dev
```

To change the schema, generate and review a migration with the Payload CLI, regenerate types and the admin import map, and commit those files. Run lint, both builds, and the mocked contact tests. Use npm run test:cms with a local server and isolated database to exercise publication, draft visibility, uploads, unpublishing and restoration. CMS_TEST_ORIGIN defaults to http://127.0.0.1:4317. The script uses the test admin credentials above.

Production runs on the primary Vercel deployment. The secondary Sites Worker renders marketing routes with published content from that deployment and directs CMS requests there. Public pages use the built-in content on local installations without a configured database.

For a release, apply additive migrations and run the seed before promoting the code. To recover from a code regression, restore the preceding Vercel deployment. Use Payload revision history to revert an editorial change. Database migration rollback is a separate operation that requires a verified backup.

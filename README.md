# GuideHollow Pick — Astro

Korean consumer buying-guide site built with Astro, isolated from the main GuideHollow property.

- Canonical domain: https://pick.guidehollow.com
- Repository: https://github.com/emfls/guidehollow-pick
- Existing https://guidehollow.com and its GitHub repository, workflows and DNS apex records **must not be changed**.

## Build

Use Node 24 (Astro 7 requires Node >=22.23.4).

```sh
npm ci
npm run check
npm run build
npm run verify
npm run dev
```

Pages is deployed via `.github/workflows/deploy.yml`, from `dist/` with GitHub Actions. Configure repository Settings > Pages > Source: **GitHub Actions**. Never use branch-root deploy for Astro.

## DNS

In the Gabia zone for guidehollow.com, set only:

```
CNAME  pick  emfls.github.io
```

Keep existing apex, www and unrelated DNS records unchanged. In Settings > Pages > Custom domain use `pick.guidehollow.com`; enable Enforce HTTPS after certificate validation. `public/CNAME` is copied to the build output.

## Content

- `src/content/guides/*.md`: Markdown guides and frontmatter.
- `src/content.config.ts`: article field validation.
- `src/pages/guides/[slug].astro`: article template with affiliate disclosure when `affiliate: true`.
- `src/pages/category/[category].astro`: category pages.
- `src/lib/guides.ts`: excludes draft/future articles from all public listings and routes.
- `src/config.ts`: **indexingEnabled is false**, so every page remains noindex until the site has independently verified public content.
- `src/pages/sitemap.xml.ts` and `robots.txt.ts`: generated static search resources.

Example `sample-draft.md` is a draft and is not publicly rendered. For each real article, verify facts, official sources, ad disclosures and product links before setting `draft: false`. Update `site.indexingEnabled` only after the site is ready for public search indexing. No Notion scheduling or affiliate credentials are configured yet.

GitHub Pages prohibits hosting websites whose primary purpose is facilitating commercial transactions. Review the GitHub Pages terms before running the property as a commercial affiliate site.

## Dedicated Notion queue (setup stage)

A separate database has been created: https://app.notion.com/p/f84bd960bef542dc8649881b7d4b839f

See `docs/notion-queue-setup.ko.md`. A manually triggered, **read-only** GitHub Actions workflow previews approved rows. It requires a Notion integration shared with the new database and a separate `NOTION_PICK_TOKEN` GitHub Actions secret. No automated publishing or cron is enabled yet.

## Product-first affiliate policy

Do not select products just to add commission links. See `docs/product-verification.ko.md` for the mandatory review and exact SKU match checklist. Curated product-level HTML `<a>` snippets are safely parsed (never raw-rendered); dynamic banners, scripts and iframes are rejected until replaced with a model-matched partner URL. CI runs `scripts/test-partner-code.mjs` and publication schema requires official model, independent evidence, recorded verification and disclosure.

Product evidence ledger (Notion): https://app.notion.com/p/9c19a9ce134b4c1189641d1c7d45cebf

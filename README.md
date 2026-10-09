# DjangoCloud documentation

The source of the docs at **https://two-trick-pony-nl.github.io/djangocloud-docs/** (later: docs.djangocloud.dev).
It is an [Astro Starlight](https://starlight.astro.build) site, published to GitHub Pages on every push to `main`.

## Edit a page

Every page is a markdown file in `src/content/docs/`, in the folder that becomes its URL:

```text
src/content/docs/getting-started/quickstart.md   ->   /getting-started/quickstart/
```

Each file starts with a front matter block; the `title` is the page's heading, so don't repeat it as a `#` heading:

```markdown
---
title: "Databases"
description: "One sentence for search results."
---
```

### Links

Link to other pages **relatively, with a trailing slash**, so they work under any base path:

```markdown
See [Build settings](../how-it-works/build-settings/) and [the CLI](../reference/cli/#start-a-new-project).
```

### Callouts

```markdown
:::note
Extra information.
:::

:::caution
Something to be careful about.
:::

:::danger
This can lose data.
:::
```

(`:::tip` also exists.) These replace GitBook's `{% hint %}` blocks.

### Adding a page to the sidebar

Create the file, then add it to `sidebar.json` (label and slug, where the slug is the path without `.md`).

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321/djangocloud-docs/
npm run build      # the same build GitHub runs, into dist/
```

## Publishing

`.github/workflows/deploy.yml` builds the site and deploys it with GitHub Pages. One-time setup in the repository:
**Settings > Pages > Build and deployment > Source: GitHub Actions**. (Pages from a private repository needs a paid
GitHub plan.)

### Custom domain (docs.djangocloud.dev)

1. DNS: add a `CNAME` record `docs` pointing to `two-trick-pony-nl.github.io`.
2. **Settings > Pages > Custom domain**: enter `docs.djangocloud.dev`, then tick **Enforce HTTPS** when it appears.
3. **Settings > Secrets and variables > Actions > Variables**: add `DOCS_SITE=https://docs.djangocloud.dev` and
   `DOCS_BASE=/`, then re-run the workflow.

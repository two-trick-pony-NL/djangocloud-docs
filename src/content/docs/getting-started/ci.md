---
title: "Deploy from CI"
description: "For GitHub Actions or any place without a browser, use an API token."
---

For GitHub Actions or any place without a browser, use an API token.

1. In the dashboard open **Settings → Developer**, find **Token for CI** and create a token. Copy it right away, it is shown once.
2. Save it as a repository secret named `DJANGOCLOUD_TOKEN`.
3. Deploy with `--no-input` so the CLI never prompts and never opens a browser.

```yaml
- run: pip install djangocloud-cli
- run: djangocloud --no-input deploy --project my-shop
  env:
    DJANGOCLOUD_TOKEN: ${{ secrets.DJANGOCLOUD_TOKEN }}
```

:::caution
`--no-input` goes **before** the command: `djangocloud --no-input deploy`. After it (`djangocloud deploy --no-input`) the CLI answers `unrecognized arguments`. To avoid the question of order, set `DJANGOCLOUD_NO_INPUT=1` in the job's environment instead, which works with the flag anywhere.
:::

## Tests in CI

If the project has `run_tests` switched on (see [Tests before deploys](../../how-it-works/tests-before-deploys/)), `djangocloud deploy` runs the tests first, on the CI machine, and stops if one fails. Install your test dependencies in the job before you deploy. A script or CI job is never asked whether to switch tests on: `--no-input` leaves the setting exactly as it is in `.djangocloud/config.json`.

If you already run the tests in an earlier step, pass `--skip-tests` to the deploy to avoid running them twice. The release is then recorded as "tests skipped", so a project that requires passing tests would refuse it.

## Keeping your secrets in your CI

If your secrets live in GitHub, push them to the project before each deploy. Name the variables to send with `--from-env`, and map each one from a secret. Empty ones are skipped and reported by name, so optional secrets can stay unset:

```yaml
- run: pip install djangocloud-cli
- run: >
    djangocloud --no-input env push --project my-shop
    --from-env DJANGO_SECRET_KEY DATABASE_URL STRIPE_SECRET_KEY
  env:
    DJANGOCLOUD_TOKEN: ${{ secrets.DJANGOCLOUD_TOKEN }}
    DJANGO_SECRET_KEY: ${{ secrets.DJANGO_SECRET_KEY }}
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
- run: djangocloud --no-input deploy --project my-shop
  env:
    DJANGOCLOUD_TOKEN: ${{ secrets.DJANGOCLOUD_TOKEN }}
```

Rotating a secret is then: change it in GitHub and re-run the workflow. `env push` only adds and overwrites, so it never deletes a variable you set in the dashboard. See [Environment variables](../../how-it-works/environment-variables/).

## Rolling back from CI

```bash
djangocloud --no-input rollback 3 --project my-shop
```

CI can't pick from a list, so give the release number. See [Releases and rollbacks](../../how-it-works/releases-and-rollbacks/).

## Creating a project from CI

Give it everything up front:

```bash
djangocloud --no-input deploy --name "My Shop" --size nano --own-cloud
```

## If the app module can't be detected

Pass it explicitly:

```bash
djangocloud --no-input deploy --project my-shop --asgi-module config.asgi:application
```

## Settings

| Variable | Purpose |
| --- | --- |
| `DJANGOCLOUD_TOKEN` | API token for CI. Takes precedence over a stored login. |
| `DJANGOCLOUD_NO_INPUT` | Same as `--no-input` (set it to `1`). |
| `DJANGOCLOUD_API` | API base URL. The default is `https://djangocloud.dev/api/v1`. |

Revoke a token any time under **Settings → Developer** in the dashboard.

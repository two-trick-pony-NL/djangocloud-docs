# Deploy from CI

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

{% hint style="warning" %}
`--no-input` goes **before** the command: `djangocloud --no-input deploy`. After it (`djangocloud deploy --no-input`) the CLI answers `unrecognized arguments`. To avoid the question of order, set `DJANGOCLOUD_NO_INPUT=1` in the job's environment instead, which works with the flag anywhere.
{% endhint %}

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

Rotating a secret is then: change it in GitHub and re-run the workflow. `env push` only adds and overwrites, so it never deletes a variable you set in the dashboard. See [Environment variables](../how-it-works/environment-variables.md).

## Rolling back from CI

```bash
djangocloud --no-input rollback 3 --project my-shop
```

CI can't pick from a list, so give the release number. See [Releases and rollbacks](../how-it-works/releases-and-rollbacks.md).

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

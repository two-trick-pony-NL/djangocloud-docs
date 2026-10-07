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

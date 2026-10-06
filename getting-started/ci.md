# Deploy from CI

For GitHub Actions or any place without a browser, use an API token.

1. In the dashboard open **Command line → Token for CI** and create a token. Copy it right away, it is shown once.
2. Save it as a repository secret named `DJANGOCLOUD_TOKEN`.
3. Deploy with `--no-input` so the CLI never prompts and never opens a browser:

```yaml
- run: pip install djangocloud-cli
- run: python manage.py djangocloud deploy --no-input --project my-shop
  env:
    DJANGOCLOUD_TOKEN: ${{ secrets.DJANGOCLOUD_TOKEN }}
```

## Creating a project from CI

Give it everything up front:

```bash
python manage.py djangocloud deploy --no-input --name "My Shop" --size nano
```

## If the app module can't be detected

Pass it explicitly:

```bash
python manage.py djangocloud deploy --no-input --asgi-module config.asgi:application
```

## Settings

| Variable | Purpose |
| --- | --- |
| `DJANGOCLOUD_TOKEN` | API token for CI. Takes precedence over a stored login. |
| `DJANGOCLOUD_NO_INPUT` | Same as `--no-input` (set it to `1`). |
| `DJANGOCLOUD_API` | API base URL. The default is `https://djangocloud.dev/api/v1`. |

Revoke a token any time under **Command line** in the dashboard.

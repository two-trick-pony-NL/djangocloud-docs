# Install the CLI and deploy

The CLI is a normal Python package:

```bash
pip install djangocloud-cli
djangocloud login
djangocloud deploy
```

There is nothing to change in your project. `djangocloud` works as soon as the package is installed, and still works when your settings won't load.

Prefer `python manage.py djangocloud ...`? Add `"djangocloud_cli"` to `INSTALLED_APPS` first, because Django only finds a management command in an installed app. See [CLI commands](../reference/cli.md).

## What a first deploy looks like

```text
$ djangocloud deploy
You're not signed in yet.
Open https://djangocloud.dev/dashboard/cli/?code=ABCD-EFGH and check that the code is ABCD-EFGH.
✓ Signed in as you@example.com
? Which project is this?  Create a new project
? Server size  Nano  0.25 vCPU, 0.5 GB RAM  ~$7/month on AWS
? AWS bills you about $7/month for this server, directly in your own AWS account. Continue? Yes
✓ Linked to my-shop (.djangocloud/config.json)
Deploying my-shop
✓ Wrote build settings to .djangocloud/config.json
  found wsgi_module = config.wsgi:application
  found asgi_module = config.asgi:application (started with uvicorn)
✓ Packed 148 files (212 KB). .env and .git are never uploaded.
✓ Uploaded. Release v1 started.
  Building v1
  v1 is live
✓ v1 is live.
```

What happens after the upload is described in [From code to a live URL](../how-it-works/overview.md), and exactly how your app is run is in [How your app is run](../how-it-works/how-your-app-runs.md).

## What gets uploaded

The folder is packed into one `.tar.gz`. In a git repository that is what git sees, so your `.gitignore` is respected. Whatever your `.gitignore` says, these are **never** uploaded:

* `.env` and `.env.*` (except `.env.example`)
* `.git`, virtualenvs and `node_modules`
* `*.sqlite3`, `*.pem` and `*.key`
* caches

The upload is limited to 100 MB. Set secrets as [environment variables](../how-it-works/environment-variables.md) in the dashboard, not in the upload.

## The `.djangocloud` folder

`.djangocloud/config.json` records which project the folder deploys to and holds your [build settings](../how-it-works/build-settings.md). It contains no secrets, so commit it: a CI checkout then knows its project (`djangocloud --no-input deploy` needs no flags), and if you [deploy from GitHub](github.md) the build can read your build settings. Versions up to 0.1.12 hid the folder with a `.gitignore` inside it; newer ones remove that file if the CLI wrote it.

## Signing in safely

Login uses a code you approve in the browser. The token is stored in `~/.config/djangocloud/credentials.json`, readable only by you. See and revoke tokens under **Settings → Developer** in the dashboard.

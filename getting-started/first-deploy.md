# Install the CLI and deploy

The CLI is a normal Python package. Everything runs through `manage.py`:

```bash
pip install djangocloud-cli
python manage.py djangocloud login
python manage.py djangocloud deploy
```

A standalone `djangocloud` command is installed too, with the same commands and no `manage.py`. Use it when your project's settings won't load.

## What a first deploy looks like

```text
$ python manage.py djangocloud deploy
✓ Signed in as you@example.com
? Which project is this?  Create a new project
? Server size  Nano  0.25 vCPU, 0.5 GB RAM  ~$7/month on AWS
✓ Linked to my-shop (.djangocloud/config.json)
✓ Wrote build settings to .djangocloud/config.json
  found wsgi_module = config.wsgi:application
  found asgi_module = config.asgi:application (started with uvicorn)
✓ Packed 148 files (212 KB). .env and .git are never uploaded.
✓ Uploaded. Release v1 started.
  Building v1
  v1 is live
```

## What gets uploaded

The folder is packed into one `.tar.gz`. In a git repository that is what git sees, so your `.gitignore` is respected. Whatever your `.gitignore` says, these are **never** uploaded:

* `.env` and `.env.*` (except `.env.example`)
* `.git`, virtualenvs and `node_modules`
* `*.sqlite3`, `*.pem` and `*.key`
* caches

The upload is limited to 100 MB. Set secrets as [environment variables](../how-it-works/environment-variables.md) in the dashboard, not in the upload.

## The `.djangocloud` folder

`.djangocloud/config.json` records which project the folder deploys to and holds your [build settings](../how-it-works/build-settings.md). It contains no secrets, and a `.gitignore` inside the folder keeps it out of your repository.

## Signing in safely

Login uses a code you approve in the browser. The token is stored in `~/.config/djangocloud/credentials.json`, readable only by you. See and revoke tokens under **Command line** in the dashboard.

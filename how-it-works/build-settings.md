# Build settings

DjangoCloud builds your app into a container image from a short list of settings. The first deploy detects your project and writes them to the `"build"` block of `.djangocloud/config.json`. That file is then the source of truth: edit it to change how your app is built, and commit it if you deploy from GitHub.

```json
{
  "build": {
    "asgi_module": "config.asgi:application",
    "wsgi_module": "config.wsgi:application",
    "server": "auto",
    "django_settings_module": "config.settings",
    "python_version": "3.13",
    "package_manager": "pip",
    "requirements_file": "requirements.txt",
    "system_packages": ["libpq-dev"],
    "collectstatic": true,
    "static_files": "auto",
    "release_command": "python manage.py migrate --noinput",
    "port": 8000,
    "workers": 2,
    "healthcheck_path": "/"
  }
}
```

## All settings

| Setting | Default | What it does |
| --- | --- | --- |
| `asgi_module` | `(none)` | Where your ASGI app lives, e.g. config.asgi:application. When it is set, the app is started with **uvicorn**. |
| `wsgi_module` | `(none)` | Where your WSGI app lives, e.g. config.wsgi:application (':application' is assumed if omitted). Used with **gunicorn** when there is no ASGI app. |
| `server` | `auto` | Which server starts your app. `auto`: uvicorn when `asgi_module` is set, otherwise gunicorn. One of: auto, uvicorn, gunicorn. |
| `django_settings_module` | `(none)` | Sets DJANGO_SETTINGS_MODULE, e.g. config.settings. Leave empty if manage.py already sets it. |
| `python_version` | `3.13` | Python version for the image. One of: 3.10, 3.11, 3.12, 3.13. |
| `package_manager` | `pip` | How dependencies are installed. One of: pip, uv. |
| `requirements_file` | `requirements.txt` | Requirements file for pip. Ignored with uv (which uses pyproject.toml and uv.lock). |
| `root` | `.` | Folder that holds manage.py, for projects that live in a subfolder. |
| `system_packages` | `(none)` | apt packages to install (e.g. libpq-dev, ffmpeg). |
| `collectstatic` | `true` | Run collectstatic during the build. |
| `static_files` | `auto` | `auto`: serve static files with WhiteNoise unless your settings already handle them (WhiteNoise, a CDN, S3). `off`: leave your settings alone. One of: auto, off. |
| `release_command` | `python manage.py migrate --noinput` | Runs before the app starts, **every time a container starts** (each deploy, restart and instance). Keep it safe to repeat. Empty to skip. |
| `start_command` | `(none)` | Override the start command. Empty starts uvicorn or gunicorn for you. |
| `run_tests` | `false` | Run your tests with the CLI before every deploy. A failing test stops the deploy. See [Tests before deploys](tests-before-deploys.md). |
| `test_command` | `python -m pytest -q` | The command that runs your tests. It must exit non-zero when they fail. Detected for you when you switch tests on. |
| `create_superuser` | `false` | Create an admin user when the app starts, after the release command, from the `DJANGO_SUPERUSER_*` variables that `djangocloud superuser` sets for your user model. An existing user is left alone, and a failure never stops the app from starting. See [Create an admin user](../guides/admin-user.md). |
| `workers` | `2` | Server worker processes (1-16). |
| `port` | `8000` | Port your app listens on (1-65535). |
| `healthcheck_path` | `/` | Path the platform requests to decide your app is healthy. |

The server checks every setting and lists all problems at once, so you can fix them in one go. The same list with defaults is available at `/api/v1/build-config`.

## Notes

* **How the build and start work, in full:** see [How your app is run](how-your-app-runs.md), which shows the generated Dockerfile, the start commands and what is added to your settings.
* **Python versions:** 3.10, 3.11, 3.12 and 3.13. The image is built on the official `python:<version>-slim` image.
* **pip or uv:** with `uv` the image uses `pyproject.toml` and `uv.lock` and installs with `uv sync --frozen --no-dev`. The server you use (uvicorn or gunicorn) is installed for you, so it does not need to be in your requirements file.
* **Static files:** `collectstatic` runs during the build with a throwaway secret key, so your settings must import without real secrets. With `static_files` on `auto`, WhiteNoise is added for you when nothing else serves your static files. Set it to `off` to keep your own setup untouched.
* **Release command:** runs before the app starts, every time a container starts. If it fails, the release is marked failed and the previous release keeps serving.
* **Health check:** the platform requests `healthcheck_path` every 10 seconds and expects a response from 200 to 399. Pick a path that answers quickly.
* **Which server:** every project made with `startproject` has both `asgi.py` and `wsgi.py`, so by default your app runs on **uvicorn** (ASGI: websockets, async views and Channels work). The CLI keeps **gunicorn** instead when your `wsgi.py` does more than `application = get_wsgi_application()`, for example wraps the app in WhiteNoise or Sentry, because ASGI would skip that wrapper. It tells you when it does. Set `server` to `gunicorn` or `uvicorn` to choose yourself.
* **Behind our load balancer:** uvicorn starts with `--proxy-headers --forwarded-allow-ips '*'`, and your app's settings are given `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")` when you haven't set it, so Django sees `https` requests correctly.
* **Custom start command:** `start_command` replaces the default command entirely, for example to run Daphne or Hypercorn. Its server must be in your requirements. See [Known limitations](../reference/limitations.md).

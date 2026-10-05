# Build settings

DjangoCloud builds your app into a container image from a short list of settings. The first deploy detects your project and writes them to the `"build"` block of `.djangocloud/config.json`. That file is then the source of truth: edit it to change how your app is built, and commit it if you deploy from GitHub.

```json
{
  "build": {
    "wsgi_module": "config.wsgi:application",
    "django_settings_module": "config.settings",
    "python_version": "3.13",
    "package_manager": "pip",
    "requirements_file": "requirements.txt",
    "system_packages": ["libpq-dev"],
    "collectstatic": true,
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
| `wsgi_module` | `(none)` | Where your WSGI app lives, e.g. config.wsgi:application (':application' is assumed if omitted). **Required.** |
| `django_settings_module` | `(none)` | Sets DJANGO_SETTINGS_MODULE, e.g. config.settings. Leave empty if manage.py already sets it. |
| `python_version` | `3.13` | Python version for the image. One of: 3.10, 3.11, 3.12, 3.13. |
| `package_manager` | `pip` | How dependencies are installed. One of: pip, uv. |
| `requirements_file` | `requirements.txt` | Requirements file for pip. Ignored with uv (which uses pyproject.toml and uv.lock). |
| `root` | `.` | Folder that holds manage.py, for projects that live in a subfolder. |
| `system_packages` | `none` | apt packages to install (e.g. libpq-dev, ffmpeg). |
| `collectstatic` | `True` | Run collectstatic during the build. |
| `release_command` | `python manage.py migrate --noinput` | Runs before the app starts on every deploy. Empty to skip. |
| `start_command` | `(none)` | Override the start command. Empty uses gunicorn with the settings below. |
| `workers` | `2` | Gunicorn workers (1-16). |
| `port` | `8000` | Port your app listens on (1-65535). |
| `healthcheck_path` | `/` | Path the platform requests to decide your app is healthy. |

The server checks every setting and lists all problems at once, so you can fix them in one go. The same list with defaults is available at `/api/v1/build-config`.

## Notes

* **Python versions:** 3.10, 3.11, 3.12 and 3.13. The image is built on the official `python:<version>-slim` image.
* **pip or uv:** with `uv` the image uses `pyproject.toml` and `uv.lock` and installs with `uv sync --frozen --no-dev`. With `pip`, gunicorn is installed for you, so it does not need to be in your requirements file.
* **Static files:** `collectstatic` runs during the build with a throwaway secret key, so your settings must import without real secrets. Serve static files from the app, for example with WhiteNoise, or from object storage.
* **Release command:** runs before the app starts on every deploy. If it fails, the release is marked failed and the previous release keeps serving.
* **Health check:** the platform requests `healthcheck_path` and expects a successful response. Make sure that path does not redirect to a login page.
* **Custom start command:** `start_command` replaces the default gunicorn command. If you need ASGI or websockets, set it yourself. See [Known limitations](../reference/limitations.md).

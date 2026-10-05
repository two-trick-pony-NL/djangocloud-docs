# Django production checklist

Settings your project needs to run well in a container behind HTTPS. None of this is specific to DjangoCloud, but a missing setting here is the most common reason a first deploy builds fine and then shows an error page.

## Read configuration from the environment

Set these as [environment variables](../how-it-works/environment-variables.md) and read them in `settings.py`:

```python
import os

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
DEBUG = os.environ.get("DEBUG", "False") == "True"
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")
```

`collectstatic` runs during the build with a throwaway secret key, so avoid code that fails on import when a real secret is missing. Use `os.environ.get` with a safe default for anything the build touches.

## Hosts and HTTPS

Your app is served over HTTPS by a load balancer in front of the container. The container itself receives plain HTTP, so tell Django to trust the forwarded protocol:

```python
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
CSRF_TRUSTED_ORIGINS = ["https://myapp.example.com"]
```

Without `SECURE_PROXY_SSL_HEADER`, Django thinks every request is insecure and login or CSRF checks can fail. Put your public URL in `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS`.

## Static files

Static files are collected during the build and baked into the image. Serve them from your app with WhiteNoise, or from object storage:

```python
MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")
STATIC_ROOT = BASE_DIR / "staticfiles"
```

## Database

SQLite is lost on every deploy because the [container is ephemeral](../how-it-works/ephemeral-container.md). Use Postgres and read the connection string from the environment. See [Databases](databases.md).

## Health check

The platform requests `healthcheck_path` (default `/`) and expects a successful response before it switches traffic. A page that redirects to a login screen, or needs a database that isn't reachable yet, will keep releases from becoming active. Point it at a lightweight view if needed.

## Quick checklist

* [ ] `DEBUG` is off in production
* [ ] `SECRET_KEY` comes from the environment
* [ ] `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` include your public URL
* [ ] `SECURE_PROXY_SSL_HEADER` is set
* [ ] Static files are served by WhiteNoise or object storage
* [ ] Uploads go to object storage, not local disk
* [ ] The database is Postgres, not SQLite

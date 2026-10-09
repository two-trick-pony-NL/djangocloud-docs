# Databases

Your app needs a database that survives deploys. The container's disk doesn't, so SQLite is not an option in production.

## A database DjangoCloud creates for you

When DjangoCloud creates the database, it is a managed Postgres database on Amazon Lightsail in your AWS account, and **we add the connection details to your deployment automatically**. You do not copy anything by hand. These environment variables are set for you:

* `DJANGOCLOUD_HOSTED_DB_NAME`, `_USER`, `_PASSWORD`, `_HOST`, `_PORT` and `_URL`
* `DATABASE_URL`, unless you already set your own. We never replace yours.

These variables only exist on DjangoCloud, so your settings need to use them there and still work on your computer. Add the Postgres driver to your requirements:

```text
psycopg[binary]>=3.1
```

Then put this in `settings.py`. On your computer it uses a local SQLite file. On DjangoCloud it switches to the Postgres database:

```python
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# On your computer: a local SQLite file, so manage.py works without any setup.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# On DjangoCloud: these variables only exist there, so only then do we switch to the Postgres database.
if "DJANGOCLOUD_HOSTED_DB_NAME" in os.environ:
    DATABASES["default"] = {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["DJANGOCLOUD_HOSTED_DB_NAME"],
        "USER": os.environ["DJANGOCLOUD_HOSTED_DB_USER"],
        "PASSWORD": os.environ["DJANGOCLOUD_HOSTED_DB_PASSWORD"],
        "HOST": os.environ["DJANGOCLOUD_HOSTED_DB_HOST"],
        "PORT": os.environ["DJANGOCLOUD_HOSTED_DB_PORT"],
        "CONN_MAX_AGE": 600,
        "OPTIONS": {"sslmode": "require"},
    }
```

Prefer a single `DATABASE_URL`? This does the same with `dj-database-url`:

```python
import os
from pathlib import Path

import dj_database_url  # pip install dj-database-url

BASE_DIR = Path(__file__).resolve().parent.parent

DATABASES = {
    "default": dj_database_url.config(
        env="DATABASE_URL",  # set for you on DjangoCloud, unless you already had your own DATABASE_URL
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",  # on your computer, where it is not set
        conn_max_age=600,
        ssl_require="DATABASE_URL" in os.environ,
    )
}
```

Your database page shows these snippets with the right variable names. It can also reveal the real values if you want to connect with another tool, and every reveal is written to your deployment log.

### Connecting from your own computer

A database DjangoCloud creates is reachable over the internet. It is protected by a generated password, and every connection must use TLS (`sslmode=require`). Your app connects the same way.

{% hint style="warning" %}
The database page has a **Lock** button that turns the public endpoint off. That cuts off every connection, **including your app's**. Do not lock a database your app is using.
{% endhint %}

Backups and restoring are covered in [Backups and restoring your database](backups-and-restore.md).

## Use any Postgres your app can reach

Create a Postgres database wherever you like, for example Amazon Lightsail's managed databases or Amazon RDS in the same AWS account, or an external provider. Then give your app its connection string as an [environment variable](../how-it-works/environment-variables.md):

```text
DATABASE_URL=postgres://user:password@host:5432/dbname
```

and read it in `settings.py`, for example with `dj-database-url`:

```python
import dj_database_url

DATABASES = {"default": dj_database_url.config(conn_max_age=60)}
```

## Your managed database from the CLI

If DjangoCloud runs a managed Postgres database for your deployment, you can look after it from the terminal:

```bash
djangocloud db status           # state, size, public access, endpoint, last snapshot
djangocloud db public           # is it open to the internet right now?
djangocloud db public on        # open it for one hour
djangocloud db public off       # lock it now
djangocloud db snapshot         # take a snapshot and wait until it is ready
```

* **Public access is temporary.** `db public on` opens the database's public endpoint for **one hour**, for example so you can connect from your laptop, and it locks again by itself. Nothing stays open.
* **Locking cuts off your app too.** `db public off` closes every public connection until you open it again, and the CLI asks you to confirm first (`-y` skips that).
* **Snapshots are kept** until you delete them, unlike the automatic backups, which reach back a week. Take one before a risky migration. Only one snapshot runs at a time.
* **Credentials are not shown** by the CLI. Find the connection details in the dashboard.

## Tips

* **Same region.** Keep the database in the region your app runs in. Cross-region latency is felt on every query.
* **Allow your app to connect.** Managed databases block outside traffic by default. Allow connections from your app, and keep the database off the public internet where your provider lets you.
* **Migrations.** The default release command runs `python manage.py migrate --noinput` before each new release starts. See [Build settings](../how-it-works/build-settings.md).
* **Rollbacks.** Migrations are not reversed when you roll back. See [Releases and rollbacks](../how-it-works/releases-and-rollbacks.md).
* **Backups.** For a database you bring yourself, turn on automatic backups with your database provider. DjangoCloud doesn't back it up. A database DjangoCloud creates has automatic backups; see [Backups and restoring your database](backups-and-restore.md).

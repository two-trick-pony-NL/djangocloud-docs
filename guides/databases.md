# Databases

Your app needs a database that survives deploys. The container's disk doesn't, so SQLite is not an option in production.

{% hint style="info" %}
DjangoCloud does not provision a database for Starter deployments yet. Managed Postgres is planned for the hosted plans (see [Pricing](../reference/pricing.md)).
{% endhint %}

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

## Tips

* **Same region.** Keep the database in the region your app runs in. Cross-region latency is felt on every query.
* **Allow your app to connect.** Managed databases block outside traffic by default. Allow connections from your app, and keep the database off the public internet where your provider lets you.
* **Migrations.** The default release command runs `python manage.py migrate --noinput` before each new release starts. See [Build settings](../how-it-works/build-settings.md).
* **Rollbacks.** Migrations are not reversed when you roll back. See [Releases and rollbacks](../how-it-works/releases-and-rollbacks.md).
* **Backups.** Turn on automatic backups with your database provider. DjangoCloud doesn't back up your data.

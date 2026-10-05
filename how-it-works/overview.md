# From code to a live URL

Every deploy, whether it starts from `djangocloud deploy` or a push to GitHub, goes through the same steps.

1. **Source.** Your code arrives as an upload from the CLI, or is fetched from GitHub with a short-lived read-only token.
2. **Release.** DjangoCloud creates a numbered release (v1, v2, ...) and snapshots your [build settings](build-settings.md) and [environment variables](environment-variables.md) into it.
3. **Build.** A container image is built from your settings. Builds are queued, and a build that runs too long is stopped (see [Known limitations](../reference/limitations.md)).
4. **Deploy.** The image is deployed to a Lightsail container service in your AWS account. Your release command, by default `python manage.py migrate --noinput`, runs before the app starts.
5. **Health check.** DjangoCloud waits until your app answers on its health check path, then marks the release **active** and the previous one **superseded**.
6. **Live.** Your app is served over HTTPS on its public URL.

If any step fails, the release is marked **failed** and the previous release keeps serving traffic.

## Where things run

* **Your app, and its servers,** run in your AWS account, in the region you chose.
* **DjangoCloud** handles builds, release history, the dashboard and billing.
* Your AWS access key is encrypted at rest and used only to create and update your deployments.

## What you can follow

The dashboard shows each deployment's overview, logs, releases and settings. The CLI streams a release's progress to your terminal while it builds.

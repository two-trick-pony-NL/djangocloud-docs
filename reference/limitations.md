# Known limitations

What to know before you build on DjangoCloud. We list these plainly so you aren't surprised later.

## The container is ephemeral

Files written to disk are lost on every restart and deploy. Use a managed database and object storage. See [Persistent files and the ephemeral container](../how-it-works/ephemeral-container.md).

## Apps are served by gunicorn (WSGI)

By default your app is started with gunicorn using the `wsgi_module` and `workers` from your [build settings](../how-it-works/build-settings.md). ASGI, websockets and long-lived connections aren't set up for you. You can replace the command with `start_command`, but that is your own responsibility to test.

## Build and source limits

* The source upload is limited to **100 MB**.
* A build that runs for around 9 to 10 minutes is stopped. Keep images lean, and avoid compiling large dependencies from source during the build.
* Python 3.10 to 3.13 are supported, with pip or uv.
* Only a folder with `manage.py` is deployed. If your project lives in a subfolder, set `root` in the build settings.

## The first build in a brand-new AWS account can take hours

A new AWS account starts with no build capacity. DjangoCloud asks AWS to enable it automatically, and the deployment page says so while it waits. This happens once per account.

## Rollbacks restore code, not data

A rollback does not reverse database migrations. DjangoCloud blocks a rollback that would run old code against a newer schema unless you confirm it. See [Releases and rollbacks](../how-it-works/releases-and-rollbacks.md).

## Releases kept

Images for the 10 most recent releases are kept. Older releases can't be rolled back to.

## Environment variables

* Up to 200 per deployment.
* Changes apply on the next deploy, not to the running release.

## Regions

You can deploy to the [regions listed here](regions.md), where Lightsail container services exist. A deployment stays in the region it was created in.

## Metrics and logs

Metrics are kept for 30 days. Log and metric collection is still being finished in early access, so some views may be empty.

## Starter plan: you run your own cloud

On Starter, your app runs in your AWS account. You pay AWS directly, you set up your own domain and certificate, and AWS limits and quotas on your account apply. Hosted Company and Enterprise plans are coming soon.

## Early access

DjangoCloud is early. Some CLI commands, such as `logs` and `status`, are still on the way. The [Slack community](../community/support.md) is the best place to ask what's ready.

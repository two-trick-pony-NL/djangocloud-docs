# Troubleshooting failed deploys

Find your release in the dashboard under **Releases**, or watch the CLI output. The log explains why a release failed. These are the common causes.

## "Account suspended for non-payment"

Your subscription is unpaid or canceled. Update your card under **Billing** and deploy again. See [Billing](../how-it-works/billing.md).

## Build settings problems

The server checks every [build setting](../how-it-works/build-settings.md) and lists all problems at once. Fix them in `.djangocloud/config.json` and deploy again. The most common are:

* `wsgi_module` is missing or wrong. It must point at your WSGI application, for example `config.wsgi:application`.
* `python_version` is not one of 3.10, 3.11, 3.12 or 3.13.
* Your project lives in a subfolder. Set `root` to the folder that contains `manage.py`.

## The build fails

* A package needs system libraries. Add them to `system_packages`, for example `libpq-dev`.
* `collectstatic` fails because settings need a secret at import time. See the [production checklist](../guides/django-checklist.md).
* The build takes too long. A build that runs around 9 to 10 minutes is stopped. Avoid compiling heavy packages from source.

## "This release has no source"

A release was created without code. Upload one with the CLI, or connect a repository in the dashboard.

## "No GitHub access token for this build"

The short-lived token that lets the build read your repository expires after an hour. Deploy again to get a new one.

## The release deploys but never becomes healthy

The platform requests your health check path and waits for a successful response. If it never gets one, the release fails and the previous release keeps serving.

* Make sure the path doesn't redirect to a login page.
* Check `ALLOWED_HOSTS`, because Django returns 400 for unknown hosts.
* Check the release command (migrations) isn't failing.
* Confirm `port` matches the port your app listens on.

## "This size hasn't been paid for yet"

Only relevant to hosted plans. Complete the payment for the new size, then deploy.

## Rollback refused

A rollback is refused if the release is older than migrations that are already applied, or if it never ran successfully or its image was pruned. See [Releases and rollbacks](../how-it-works/releases-and-rollbacks.md).

## Still stuck?

Ask in [Slack](../community/support.md) and include your project name, release number and the last lines of the log.

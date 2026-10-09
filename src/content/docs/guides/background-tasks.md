---
title: "Background tasks and scheduled jobs"
description: "Your deployment runs a web process: uvicorn (or gunicorn) serving your Django app."
---

Your deployment runs a web process: uvicorn (or gunicorn) serving your Django app. Anything that runs *inside* that process, such as a thread or a scheduler started at import time, stops when the container restarts and runs once per instance.

:::caution
DjangoCloud deploys one web service per project. Running a separate Celery worker or scheduler as part of the same project isn't something it sets up for you today.
:::

## What works today

* **Short work inside a request.** Anything that finishes while the user waits.
* **Work triggered from outside.** For example a scheduled GitHub Action, or an external cron service calling a protected URL in your app that does the work.
* **Work in another service.** Run your worker where you like, for example as a second Lightsail container service in your own AWS account, using the same image and the same `DATABASE_URL` and broker settings.

## Tips

* Make jobs **idempotent**. With more than one instance, or after a restart, the same job can be triggered twice.
* Don't rely on local disk to pass data between a request and a job. See [the ephemeral container](../../how-it-works/ephemeral-container/).
* Keep the broker (such as Redis) outside the container.

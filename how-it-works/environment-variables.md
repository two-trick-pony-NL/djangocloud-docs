# Environment variables

Set secrets and configuration in the dashboard, under your deployment's **Settings**. Your `.env` file is never uploaded.

## Adding variables

Paste a block of `KEY=value` lines. DjangoCloud checks the whole block first, and if any line is invalid it saves nothing and tells you which, so a typo can't half-apply. You can choose to replace all existing variables with the pasted block instead of adding to them.

* You can store up to 200 variables per deployment.
* Values are encrypted at rest and can't be read back from the dashboard once saved.

## When changes take effect

Environment variables are part of a release. A change applies to the **next** release you deploy, not to the one that's running. After editing variables, deploy again.

Because each release keeps the variables it was built with, a [rollback](releases-and-rollbacks.md) restores the values from that moment.

## Typical settings

```text
DJANGO_SECRET_KEY=...
DJANGO_ALLOWED_HOSTS=myapp.example.com
DATABASE_URL=postgres://...
```

Your settings module has to read these from the environment. The build step runs `collectstatic` with a throwaway secret key, so your settings must import without real secrets present.

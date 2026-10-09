---
title: "Create an admin user"
description: "A new deployment has an empty database, so nobody can sign in to the Django admin yet."
---

A new deployment has an empty database, so nobody can sign in to the Django admin yet. `djangocloud superuser` sets up the admin user for you: you answer a few questions once, and the user is created when your next release starts.

```bash
djangocloud superuser
```

## What it asks for

The CLI asks **your project** which fields its user model needs, so a custom user model works as well as Django's default one:

* **Default `User`:** username, email and a password.
* **A custom model**, for example one that signs in with an email address and requires a first name: email, first name and a password. Whatever your model has as `USERNAME_FIELD` and `REQUIRED_FIELDS` is what you are asked for.

To find out, the CLI loads your project on your own machine, in your project's environment (`.venv`, `uv run` or `poetry run` if you use them). If it can't load the project, for example because its dependencies aren't installed there, it says so and assumes Django's default fields. Check the model it prints before you continue.

## What happens

1. You type the fields and the password (twice). The password is never shown.
2. The CLI saves them as encrypted [environment variables](../../how-it-works/environment-variables/), named the way Django expects: `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_EMAIL`, `DJANGO_SUPERUSER_PASSWORD`, or for a custom model `DJANGO_SUPERUSER_<FIELD>` for each field.
3. It switches on the `create_superuser` [build setting](../../how-it-works/build-settings/) in `.djangocloud/config.json`, and offers to deploy right away.
4. When the release starts, it runs your migrations and then `python manage.py createsuperuser --noinput`. The user is created in your database.
5. **Once that deploy is live, the CLI removes `DJANGO_SUPERUSER_PASSWORD` from your variables and switches `create_superuser` off again.** The password is not kept, and nothing keeps running.

An admin user that already exists is left alone: the command only ever creates a user. It never changes an existing password. A failure never stops your app from starting; the reason is in the release log.

## Things to know

* **It works with the managed database and with your own.** It runs inside your app, so it uses whatever database your settings point at.
* **Deploying from GitHub?** The setting is read from the committed `.djangocloud/config.json`. Commit it after running `djangocloud superuser`, and remove the password yourself after the deploy with `djangocloud env remove DJANGO_SUPERUSER_PASSWORD`. The CLI only cleans up for deploys it uploaded.
* **A required relation can't be set this way.** If your user model requires a foreign key or many-to-many field, it can't be passed through an environment variable. The CLI explains this and stops; create the user by hand with `python manage.py createsuperuser`.
* **Can't log in afterwards?** Read the release log of the deploy (`djangocloud logs --source release`). The line from `createsuperuser` says why, for example a validation error.
* **Forgot the password later?** Run `djangocloud superuser` again with a new user, or use Django's `changepassword` command. DjangoCloud never has your password after the deploy.

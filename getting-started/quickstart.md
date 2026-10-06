# Quickstart

From an existing Django project to a live URL in five steps.

1. **Create your account** at [djangocloud.dev](https://djangocloud.dev) and add a card. The Starter plan covers the tooling; AWS bills you separately for the servers you run.
2. **[Connect your AWS account](connect-aws.md).** Create a limited IAM user and paste its access key into the dashboard.
3. **Install the CLI** in your project's environment:

   ```bash
   pip install djangocloud-cli
   ```

4. **Sign in** from your terminal. The CLI shows a short code that you approve in the browser, so no password is typed into the terminal:

   ```bash
   python manage.py djangocloud login
   ```

5. **Deploy:**

   ```bash
   python manage.py djangocloud deploy
   ```

   On the first run the CLI asks which project this folder deploys to, or creates one, and shows the monthly AWS price of the server size before it continues. Nothing is created until you confirm.

When the release is live the CLI prints its URL. Every later `deploy` skips the questions.

## What you need

* Python 3.10 or newer and Django 4.2 or newer.
* An ASGI or WSGI application, for example `config.asgi:application` or `config.wsgi:application`. The CLI detects it, and you can [change it in the build settings](../how-it-works/build-settings.md).
* Your dependencies in `requirements.txt`, or in `pyproject.toml` and `uv.lock` if you use uv.

## Next

* Set [environment variables](../how-it-works/environment-variables.md) in the dashboard. Your `.env` file is never uploaded.
* Read about the [ephemeral container](../how-it-works/ephemeral-container.md) before you store uploads on disk.
* Connect [GitHub](github.md) to deploy on every push.

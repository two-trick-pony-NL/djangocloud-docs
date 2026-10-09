# Welcome

DjangoCloud deploys your Django project to AWS with one command. You skip the Dockerfiles, load balancers, certificates and server setup, and keep every release saved so you can roll back.

```bash
pip install djangocloud-cli
djangocloud login
djangocloud deploy
```

The CLI is [`djangocloud-cli` on PyPI](https://pypi.org/project/djangocloud-cli/). Nothing to change in your project. Your static files, HTTPS and database migrations are taken care of.

## Where to start

* **New here?** Follow the [Quickstart](getting-started/quickstart.md).
* **Curious how your app is run?** Read [How your app is run](how-it-works/how-your-app-runs.md): uvicorn or gunicorn, static files, health checks and what we add to your settings.
* **Want deploys on every push?** [Connect GitHub](getting-started/github.md).
* **Wondering what is and isn't supported?** Read the [known limitations](reference/limitations.md) before you build on it.
* **What does it cost?** See [Pricing](reference/pricing.md).
* **Stuck?** Come to [Slack](community-and-support/support.md).

{% hint style="info" %}
DjangoCloud is in early access. Some features are still being finished, and the pages say so where it matters.
{% endhint %}

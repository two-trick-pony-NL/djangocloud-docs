# Deploy by pushing to GitHub

Connect a repository and every push to a branch creates a new release, with no CI pipeline to write.

## Connect a repository

1. Open your deployment in the dashboard and go to **Settings**.
2. Install the DjangoCloud GitHub App on your account or organisation, and choose which repositories it may read.
3. Back in the dashboard, pick the repository and the branch (the default branch is suggested).

From then on, a push to that branch queues a release, builds it and deploys it. Each push to the branch creates one release, and if GitHub delivers the same push twice only one release is made.

## What the app can do

* It gets **read-only** access to the repositories you choose, to fetch the code to build.
* Each build uses a short-lived token for that single repository.
* It reports build status back to the commit on GitHub.

## Good to know

* Only pushes to the **connected branch** deploy. Other branches are ignored.
* If your account is suspended for non-payment, pushes are ignored and the log says so.
* If you uninstall the GitHub App, the project is disconnected from the repository. Existing deployments keep running.
* Build settings are read from `.djangocloud/config.json` in the repository, so commit that file. See [Build settings](../how-it-works/build-settings.md).

{% hint style="info" %}
You can still deploy from your laptop at any time. `djangocloud deploy --github` deploys the linked repository's latest commit instead of your local folder.
{% endhint %}

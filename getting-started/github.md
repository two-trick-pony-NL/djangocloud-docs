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

## Tests, the admin user and GitHub deploys

A few CLI features work a little differently when a push deploys, because the CLI isn't involved:

* **Tests before deploys.** `run_tests` only applies to deploys made with the CLI, which runs your tests first on your machine. A push to GitHub doesn't run them. Run your tests in your own CI before merging, for example with a GitHub Actions workflow, so a failing test never reaches the connected branch. If the project **requires passing tests** (`djangocloud tests --require on`), deploys from GitHub are refused, because they can't report a test run. See [Tests before deploys](../how-it-works/tests-before-deploys.md).
* **The admin user.** `djangocloud superuser` stores the user's details as environment variables and switches on `create_superuser` in `.djangocloud/config.json`. For a GitHub deploy that file is read from the repository, so **commit and push it** after running the command; the next push creates the user. The CLI only removes the password variable by itself after a deploy it uploaded, so afterwards remove it yourself with `djangocloud env remove DJANGO_SUPERUSER_PASSWORD`, and set `create_superuser` back to `false` in the file. See [Create an admin user](../guides/admin-user.md).
* **Environment variables** are stored on the project, not in the repository, so they apply to GitHub deploys exactly as they do to CLI deploys. See [Environment variables](../how-it-works/environment-variables.md).

{% hint style="info" %}
You can still deploy from your laptop at any time. `djangocloud deploy --github` deploys the linked repository's latest commit instead of your local folder.
{% endhint %}

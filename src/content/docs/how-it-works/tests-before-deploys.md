---
title: "Tests before deploys"
description: "The CLI can run your tests before it uploads anything. If a test fails, nothing is deployed."
---

The CLI can run your tests before it uploads anything. If a test fails, nothing is deployed. The result is recorded on the release, so you can see which releases were tested.

The tests run **on your machine** (or on your CI runner), with your own environment, so you see the output straight away and can fix things quickly. DjangoCloud does not run your tests for you.

## Switching it on

The first time you deploy from a terminal, the CLI looks at your project and, if it finds tests, offers to run them before every deploy:

```text
Tests
  Found pytest + pytest-django + pytest-xdist, 14 test files.
  Command   python -m pytest -q -n auto
  · pytest-xdist is installed, so the tests run in parallel (-n auto)
Run your tests before every deploy? (a failing test stops the deploy) [Y/n]
```

Your answer, yes or no, is written to `.djangocloud/config.json` and you are not asked again. Scripts and CI (`--yes`, `--no-input`, or no terminal) are never asked, and nothing is written for them. You can change it at any time:

```bash
djangocloud tests                  # what is set, and whether the project requires passing tests
djangocloud tests on               # run the tests before every deploy (the command is detected)
djangocloud tests off
djangocloud tests --detect         # work out the command from the project again
djangocloud tests --command "make check"
djangocloud test                   # run the tests now, the way a deploy would
djangocloud test -- -k login       # with extra arguments
```

or edit the two [build settings](../build-settings/) yourself:

```json
{
  "build": {
    "run_tests": true,
    "test_command": "python -m pytest -q -n auto"
  }
}
```

## How the command is chosen

The CLI reads your project's files. It never runs your code to find out.

| It looks for | And then |
| --- | --- |
| **pytest**: `pytest` in your dependencies, a `pytest.ini`, `[tool.pytest]` in `pyproject.toml`, or a `conftest.py` | Uses `python -m pytest -q`. |
| **Django's test runner**: `manage.py` and tests, without pytest | Uses `python manage.py test`. |
| **pytest-xdist** | Adds `-n auto`, so the tests run in parallel. |
| Django's runner on a machine with more than one CPU | Adds `--parallel`. Remove it if your tests share state. |
| **uv**, **Poetry** or **Pipenv** (`uv.lock`, `poetry.lock`, `Pipfile`) | Runs the command inside it: `uv run pytest -q`, `poetry run pytest -q`, `pipenv run pytest -q`. |
| A test settings module next to your settings: `settings_test.py`, `settings/test.py`, `testing.py`, ... | Adds `--ds=<module>` for pytest, or `--settings=<module>` for Django's runner. Skipped if your pytest settings already name one. |

It ignores virtual environments, `node_modules` and `site-packages`, so a library's own tests are never taken for yours. If it finds tox or nox, it says so but does not use them: set `test_command` if you want that.

It also warns about what usually goes wrong:

* **pytest without pytest-django.** Django tests normally need it.
* **Settings that need a database server.** If your settings use PostgreSQL or MySQL, the tests need that server on your machine, or a test settings module that uses SQLite.

## What happens on a deploy

1. `djangocloud deploy` runs the test command in your project folder and shows its output.
2. If it exits with an error, the deploy stops with the exit code. **Nothing is uploaded.**
3. If it passes, the upload carries the result: that the tests passed, the command, and how many seconds they took.

To deploy anyway, for example to ship a fix while a test is being repaired:

```bash
djangocloud deploy --skip-tests
```

The release is then recorded as **skipped**.

:::note
A deploy of a GitHub commit (`djangocloud deploy --github`, or a push to your branch) does not run your tests, because the CLI isn't looking at that code. Run them in your own CI before you push, or use [Deploy from CI](../../getting-started/ci/).
:::

## Where you see the result

* The **Releases** tab has a **Tests** column: passed, skipped, or a dash for a release made without tests.
* The deployment's **log** has an event for it, for example "Tests passed before the deploy (python -m pytest -q, 12s)", or "Tests were skipped for this deploy."
* `djangocloud tests` shows the last release that reported a result.

## Requiring passing tests

For a team, you can make the project **refuse** any deploy whose tests did not pass:

```bash
djangocloud tests --require on
djangocloud tests --require off
```

You can also switch it in the dashboard: open the deployment, go to **Settings**, and use **Tests before deploys** under *Optional extras*. It shows whether tests are required and the last result a deploy reported. Whether the CLI runs tests for a given folder is the `run_tests` setting in that folder's `.djangocloud/config.json`, so that part is changed with `djangocloud tests on|off`, not in the dashboard.

With this on, a deploy with `--skip-tests`, without tests switched on, or from GitHub is refused with "This project only accepts deploys whose tests passed". If this folder doesn't run tests, the CLI warns you when you turn the requirement on, so you don't lock yourself out.

:::caution
The test result is **reported by the CLI**. Someone with an API token could send "passed" without running anything. Requiring passing tests protects you from mistakes, such as deploying in a hurry or with a failing test. It is not a security control.
:::

## In CI

`djangocloud deploy` runs the tests on the CI runner when `run_tests` is on, so install your test dependencies in the job first. If an earlier step has already run them, add `--skip-tests` to avoid doing it twice. See [Deploy from CI](../../getting-started/ci/).

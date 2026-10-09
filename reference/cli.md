# CLI commands

Install with `pip install djangocloud-cli`.

## Two ways to run it

```bash
djangocloud <command>
```

Works as soon as the package is installed. There is nothing to add to your project, and it still works when your settings won't load. This is the form these docs use.

```bash
python manage.py djangocloud <command>
```

Does the same thing from inside your project, but Django only finds a management command in an installed app. Add the app first, or you will see `Unknown command: 'djangocloud'`:

```python
INSTALLED_APPS = [
    ...,
    "djangocloud_cli",
]
```

Run either form with no arguments to see the menu of commands. `help` prints every command with all of its options, and `help <command>` the options of one. A command that has subcommands, such as `db` or `env`, prints its own menu when you give it none.

## Commands

| Command | What it does |
| --- | --- |
| `new <name>` | Create a new Django project that is ready to deploy. See [Start a new project](#start-a-new-project). |
| `login` | Sign in by approving a code in your browser. |
| `logout` | Forget the stored token. |
| `whoami` | Show who you're signed in as, and which project this folder deploys to. |
| `link` | Pick or create the project this folder deploys to. |
| `unlink` | Detach this folder from its project. |
| `deploy` | Link the folder if needed, pack and upload it, and stream the release until it is live. |
| `status` | Is it live and answering? Shows the URL, size and latest releases. |
| `logs` | Show a project's logs. See [Logs and metrics](../how-it-works/logs-and-metrics.md). |
| `setup` | Guided first run: create your account, add a card, choose hosted or your own AWS, connect your AWS keys. |
| `rollback [version]` | Go back to an earlier release. See [Releases and rollbacks](../how-it-works/releases-and-rollbacks.md). |
| `scale` | Change the server size and the number of instances. See [Size and scaling](../how-it-works/size-and-scaling.md). |
| `env push`, `env list` | Set a project's environment variables from a file or from CI, or list their names. See [Environment variables](../how-it-works/environment-variables.md). |
| `autoscale` | Show autoscaling, or turn it on with a minimum and maximum, or off. See [Size and scaling](../how-it-works/size-and-scaling.md). |
| `alerts` | Show the usage alerts, or change the CPU and memory limits and the downtime email. See [Size and scaling](../how-it-works/size-and-scaling.md). |
| `metrics` | The server's CPU and memory load as a small chart. See [Logs and metrics](../how-it-works/logs-and-metrics.md). |
| `db status`, `db public`, `db snapshot` | Your managed database: its state, who can reach it, and a snapshot on demand. See [Databases](../guides/databases.md). |
| `tests`, `test` | Run your tests before every deploy, and see or change that setting. See [Tests before deploys](../how-it-works/tests-before-deploys.md). |
| `teardown` | Delete a project and what it created in AWS. You type its name to confirm. |
| `help [command]` | Every command with all of its options, or the help for one command. |

## Start a new project

```bash
djangocloud new my-shop
cd my-shop
djangocloud deploy
```

`new` takes one argument, the project's name, and creates a folder of that name. It looks up the **latest Django LTS** release, then runs Django's own `django-admin startproject` for it. Django is installed just for that, away from your environment, so your own packages are never changed. This needs a network connection. When a new LTS comes out, `new` uses it without a CLI update.

Three things differ from a plain `startproject`:

* **`DATABASES`.** On your computer it is a local SQLite file, so `manage.py runserver` works straight away. On DjangoCloud, once you select and connect a database, the `DJANGOCLOUD_HOSTED_DB_*` variables exist and the settings switch to that Postgres database. See [Databases](../guides/databases.md).
* **The CLI is installed in the project.** `djangocloud_cli` is added to `INSTALLED_APPS` and `djangocloud-cli` to `requirements.txt`, so `python manage.py djangocloud <command>` works as well as `djangocloud <command>`.

* **An empty `.env`.** It is kept out of git and never uploaded with your code. Add `KEY=value` lines and send them with `djangocloud env push .env`; see [Environment variables](../how-it-works/environment-variables.md).

Everything else a deployed app needs, such as static files and allowed hosts, DjangoCloud adds when it builds the image.

The name can use letters, digits, `-` and `_`, and it must not clash with a Python or Django module (`test`, `django`, ...). An existing folder with files in it is never touched. Inside an existing project (a folder with `manage.py` or a linked `.djangocloud` folder, or any folder below one), `new` is not listed in the help and refuses to run.

## Flags for `deploy` and `link`

| Flag | Purpose |
| --- | --- |
| `--project <slug>` | Use an existing project without asking. |
| `--name <name>` | Create a project with this name without asking. |
| `--size <size>` | Server size for a new project, for example `nano`. |
| `--hosted` | New project: we run it for you (Company and Enterprise plans). |
| `--own-cloud` | New project: it runs in your own AWS account. |
| `-y`, `--yes` | Don't ask for confirmation. |

`deploy` also takes:

| Flag | Purpose |
| --- | --- |
| `--github` | Deploy the latest commit of the project's linked GitHub repository instead of uploading this folder. |
| `--asgi-module <module>` | Your ASGI app, for example `config.asgi:application`, when it can't be detected. It is started with uvicorn. |
| `--wsgi-module <module>` | Your WSGI app, for example `config.wsgi:application`, when it can't be detected. |
| `--skip-tests` | Deploy without running the tests this project normally runs first. The release is recorded as "tests skipped". See [Tests before deploys](../how-it-works/tests-before-deploys.md). |

## Flags for `status` and `logs`

| Command | Flag | Purpose |
| --- | --- | --- |
| both | `--project <slug>` | A project other than the one this folder is linked to. |
| `status` | `--json` | Print the raw details as JSON, for scripts. |
| `logs` | `-f`, `--follow` | Keep streaming new lines. Ctrl-C to stop. |
| `logs` | `-n`, `--lines <n>` | How many of the latest lines to show (default 100). |
| `logs` | `--source` | Only `app`, `build` or `release` lines. |
| `logs` | `--since <duration>` | Only lines newer than this: `90s`, `30m`, `2h` or `7d`. |

## Flags for `rollback`

| Flag | Purpose |
| --- | --- |
| `<version>` | The release number to go back to. Leave it out to pick from a list (needs a terminal). |
| `--project <slug>` | A project other than the one this folder is linked to. |
| `-y`, `--yes` | Don't ask for confirmation. |
| `--no-wait` | Return as soon as the rollback is queued. |

## Flags for `scale`

| Flag | Purpose |
| --- | --- |
| `--size <size>` | The server size, for example `small`. |
| `--instances <n>` | How many instances to run (1 to 20). |
| `--project <slug>` | A project other than the one this folder is linked to. |
| `-y`, `--yes` | Don't ask for confirmation. |
| `--no-wait` | Return as soon as the change is queued. |

## Flags for `autoscale` and `alerts`

| Command | Flag | Purpose |
| --- | --- | --- |
| both | `on` or `off` | Turn it on or off. Leave it out to show the current settings. |
| `autoscale` | `--min <n>`, `--max <n>` | The fewest and most instances (1 to 20). Turning autoscaling on needs both. |
| `alerts` | `--cpu <percent>`, `--memory <percent>` | Email when the average stays above this (1 to 100). |
| `alerts` | `--downtime` / `--no-downtime` | Also email when the server stops answering. |
| both | `--project <slug>` | A project other than the one this folder is linked to. |

## Flags for `metrics`

| Flag | Purpose |
| --- | --- |
| `--since <duration>` | How far back: `30m`, `6h` or `7d` (default `1h`, at most 30 days). |
| `--json` | Print the raw samples as JSON, for scripts. |
| `--project <slug>` | A project other than the one this folder is linked to. |

## `db` commands

| Command | What it does |
| --- | --- |
| `db status` | The database's state, size, public access, endpoint, last snapshot and how far back it can be restored. `--json` for scripts. |
| `db public [on\|off]` | Open the database to the internet for one hour, or lock it now. Without `on` or `off` it shows the current state. `-y` skips the confirmation. |
| `db snapshot` | Take a snapshot now and wait until it is ready. `--no-wait` returns as soon as it is queued. |

All three take `--project <slug>` for a project other than the one this folder is linked to.

## Flags for `tests` and `test`

| Command | Flag | Purpose |
| --- | --- | --- |
| `tests` | `on` or `off` | Run the tests before every deploy, or stop. Leave it out to show the settings. |
| `tests` | `--detect` | Work out the test command from your project again. |
| `tests` | `--command <cmd>` | Set the test command yourself. |
| `tests` | `--require on\|off` | Make the project refuse deploys unless their tests passed. |
| `test` | `-- <args>` | Extra arguments for the test command, for example `djangocloud test -- -k login`. |

## Keeping the CLI up to date

Every answer from DjangoCloud tells the CLI whether it is current. After a command you may see:

* **A notice** from us, for example about a change that is coming and how to prepare for it.
* **A newer version** is available, with the command to upgrade.
* **Upgrade needed**, when your version is older than the minimum the service supports. The command stops and says how to upgrade. Nothing is deployed or changed.

Upgrade with either of these, depending on how you installed it:

```bash
pip install -U djangocloud-cli
uv tool upgrade djangocloud-cli
```

In CI, pin the version you test with and raise it deliberately.

## Flags for `env push` and `env list`

| Command | Flag | Purpose |
| --- | --- | --- |
| `env push` | `<file>` | A `.env` file to read. Use `-` for standard input. |
| `env push` | `--from-env <NAME> ...` | Read these variables from the current environment instead of a file. For CI. |
| `env push` | `--prune` | Also remove the project's variables you did not send. Asks first. |
| `env push` | `--dry-run` | Show which names are new and which are overwritten, and change nothing. |
| `env push` | `-y`, `--yes` | Don't ask when removing. |
| both | `--project <slug>` | A project other than the one this folder is linked to. |

## `--no-input` goes before the command

`--no-input` is a flag of `djangocloud` itself, not of one command, so it comes **first**:

```bash
djangocloud --no-input deploy --project my-shop      # works
djangocloud deploy --no-input --project my-shop      # error: unrecognized arguments
```

It makes the CLI never prompt and never open a browser, and fail with a clear message if something is missing. Setting `DJANGOCLOUD_NO_INPUT=1` does the same and works anywhere in the command, which is often easier in CI. See [Deploy from CI](../getting-started/ci.md).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DJANGOCLOUD_TOKEN` | API token for CI. Takes precedence over a stored login. |
| `DJANGOCLOUD_NO_INPUT` | Same as `--no-input` (set to `1`). |
| `DJANGOCLOUD_API` | API base URL. The default is `https://djangocloud.dev/api/v1`. |

## Requirements

Python 3.10 or newer and Django 4.2 or newer.

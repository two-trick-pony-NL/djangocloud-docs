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

Run either form with no arguments, or `help`, to list the commands.

## Commands

| Command | What it does |
| --- | --- |
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
| `teardown` | Delete a project and what it created in AWS. You type its name to confirm. |
| `help [command]` | Every command with all of its options, or the help for one command. |

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

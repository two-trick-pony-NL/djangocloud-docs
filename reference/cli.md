# CLI commands

Install with `pip install djangocloud-cli`. Everything runs through `manage.py`:

```bash
python manage.py djangocloud <command>
```

Run it with no arguments, or `help`, to list the commands. A standalone `djangocloud` command is installed too, with the same commands and no `manage.py`.

| Command | What it does |
| --- | --- |
| `login` | Sign in by approving a code in your browser. |
| `logout` | Forget the stored token. |
| `whoami` | Show who you're signed in as, and which project this folder deploys to. |
| `link` | Pick or create the project this folder deploys to. |
| `unlink` | Detach this folder from its project. |
| `deploy` | Link the folder if needed, pack and upload it, and stream the release until it is live. |
| `logs` | Show a project's logs. *Coming.* |
| `status` | Show the current release and its state. *Coming.* |
| `help [command]` | Help for everything, or for one command. |

## Useful flags for `deploy`

| Flag | Purpose |
| --- | --- |
| `--github` | Deploy the linked repository's latest commit instead of your local folder. |
| `--no-input` | Never prompt and never open a browser. Fails with a clear message if something is missing. |
| `--project <slug>` | Choose the project without asking. |
| `--name`, `--size` | Create a project with these values (for CI). |
| `--asgi-module <module>` | Set the ASGI app when it can't be detected. It is started with uvicorn. |
| `--wsgi-module <module>` | Set the WSGI app when it can't be detected. |

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DJANGOCLOUD_TOKEN` | API token for CI. Takes precedence over a stored login. |
| `DJANGOCLOUD_NO_INPUT` | Same as `--no-input` (set to `1`). |
| `DJANGOCLOUD_API` | API base URL. |

## Requirements

Python 3.10 or newer and Django 4.2 or newer.

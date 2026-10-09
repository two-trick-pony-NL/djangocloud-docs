# API

The CLI talks to a small HTTP API. Most people only use the CLI, but the endpoints are available if you want to script deploys yourself.

* **Base URL:** `https://djangocloud.dev/api/v1`
* **Authentication:** send an API token as `Authorization: Bearer <token>`. Create one under **Settings → Developer → Token for CI** in the dashboard.

| Method and path | What it does |
| --- | --- |
| `POST /auth/device` | Start a browser-approved login (used by `djangocloud login`). |
| `POST /auth/token` | Exchange an approved code for a token. |
| `GET /me` | The signed-in user. |
| `GET` / `POST /projects` | List your projects, or create one with a `name` and a size. |
| `GET /sizes` | The available server sizes. |
| `GET /build-config` | Every [build setting](../how-it-works/build-settings.md) with its default and description. |
| `GET /projects/<id>` | A project, whether it is live and answering, and its latest releases. |
| `GET /projects/<id>/logs` | Log lines, oldest first. Filter with `source` (`app`, `build` or `release`) and `since` (for example `2h`). Pass `after=<cursor>` to get only newer lines, which is how `logs -f` follows. |
| `POST /projects/<id>/releases` | Upload source (a `.tar.gz` in the multipart field `source`) and start a release. Answers 202 with the release. |
| `POST /projects/<id>/rollback` | Redeploy an older release's image as a new release. JSON body `{"version": N}`. Answers 202 with the new release. |
| `GET /projects/<id>/env` | The names of the project's [environment variables](../how-it-works/environment-variables.md), never their values. |
| `PUT /projects/<id>/env` | Set variables. JSON body `{"variables": {"KEY": "value"}, "replace": false}`. Encrypted, all or nothing, and applied from the next deploy. With `replace` the other variables are removed, except the ones DjangoCloud manages. Answers `{"created": [], "updated": [], "removed": []}` (names only). |
| `GET` / `PUT /projects/<id>/autoscale` | Read or set [autoscaling](../how-it-works/size-and-scaling.md). `{"enabled": true, "min": 2, "max": 6}`. Turning it off keeps the range. |
| `GET` / `PUT /projects/<id>/alerts` | Read or set the usage alerts. `{"enabled": true, "cpu": 80, "memory": 85, "downtime": true}`; leave a field out to keep it. |
| `GET /projects/<id>/metrics` | CPU and memory in percent of the server size, oldest first. `?since=6h` (at most 30 days), thinned to at most 500 points. |
| `GET /projects/<id>/database` | The managed database: state, size, public access, endpoint, last snapshot. Never includes credentials. |
| `POST /projects/<id>/database/network` | `{"public": true}` opens the database for one hour, `{"public": false}` locks it now. Answers 202. |
| `POST /projects/<id>/database/snapshot` | Take a manual snapshot. Answers 202; `snapshot_pending` stays true until it is done. One at a time. |
| `GET` / `PUT /projects/<id>/tests` | Read or set whether the project refuses deploys unless their [tests passed](../how-it-works/tests-before-deploys.md). `{"require": true}`. |
| `GET /releases/<id>` | The state of a release and the log lines since `?after=<cursor>`. The CLI polls it until the release is done. |

## Report your tests with a release

`POST /projects/<id>/releases` also accepts the form fields `tests` (`passed`, `skipped` or `none`), `tests_command` and `tests_seconds`. The release stores them and shows them in the dashboard. A project that requires passing tests answers **422** `tests_required` for anything but `passed`. The report is made by the caller, so it guards against mistakes, not against someone who sends `passed` without running anything.

## Old CLI versions

When the service has a minimum CLI version, a CLI below it gets **426** `upgrade_required` with the version and the upgrade command. Answers to the CLI can also carry the headers `X-DjangoCloud-Notice`, `X-DjangoCloud-Latest-Version` and `X-DjangoCloud-Upgrade-Command`. Other clients are never affected.

{% hint style="info" %}
The API is early and may change. Pin your CLI version in CI if you depend on its behaviour.
{% endhint %}

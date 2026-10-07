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
| `GET /releases/<id>` | The state of a release and the log lines since `?after=<cursor>`. The CLI polls it until the release is done. |

{% hint style="info" %}
The API is early and may change. Pin your CLI version in CI if you depend on its behaviour.
{% endhint %}

# API

The CLI talks to a small HTTP API. Most people only use the CLI, but the endpoints are available if you want to script deploys yourself.

* **Base URL:** `https://djangocloud.dev/api/v1`
* **Authentication:** send an API token as `Authorization: Bearer <token>`. Create one under **Command line → Token for CI** in the dashboard.

| Method and path | What it does |
| --- | --- |
| `POST /auth/device` | Start a browser-approved login (used by `djangocloud login`). |
| `POST /auth/token` | Exchange an approved code for a token. |
| `GET /me` | The signed-in user. |
| `GET` / `POST /projects` | List your projects, or create one with a `name` and a size. |
| `GET /sizes` | The available server sizes. |
| `GET /build-config` | Every [build setting](../how-it-works/build-settings.md) with its default and description. |
| `POST /projects/<id>/releases` | Upload source and start a release. |
| `GET /releases/<id>` | The state of a release, used to stream progress. |

{% hint style="info" %}
The API is early and may change. Pin your CLI version in CI if you depend on its behaviour.
{% endhint %}

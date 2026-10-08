# Releases and rollbacks

Every deploy creates a **release**: a numbered, immutable record of the image that was built plus the settings and environment variables it ships with.

| Status | Meaning |
| --- | --- |
| Queued | Waiting for a build slot. |
| Building | The image is being built. |
| Deploying | The image is being rolled out. |
| Active | This release is serving your traffic. |
| Superseded | A newer release replaced it. It can still be rolled back to. |
| Failed | The build or deploy failed. It never served traffic. |

## Rolling back

A rollback redeploys an older release's image as a **new** release, so your history stays a straight line. The rollback also restores the environment variables that release had, exactly as they were.

You can roll back to any release that ran successfully (active or superseded) and still has its image.

In the dashboard open **Releases** and press **Roll back** on the release you want. Nothing is rebuilt: the old image is deployed again as a new release, and it is live in a minute or two. A release whose image has been deleted shows no button.

### From the command line

```bash
djangocloud rollback          # pick a release from a list
djangocloud rollback 3        # go back to release 3
```

The CLI shows what it is about to do, asks to confirm (`-y` skips that), and then streams the new release until it is live, exactly like a deploy. `--no-wait` returns as soon as it is queued. In [CI](../getting-started/ci.md) give the number, with `--no-input` in front: `djangocloud --no-input rollback 3`. If the release can't be rolled back to, for example because it is already live or its image is gone, the message says why. The API has a matching endpoint, listed under [API](../reference/api.md).

### Code rolls back, data does not

A rollback never reverses database migrations. If the release you pick is older than migrations that are already applied, DjangoCloud refuses by default and lists the migrations that would be left behind, because the old code would run against a newer schema. You can override this once you have checked it is safe.

{% hint style="warning" %}
Before relying on rollbacks, make your migrations backwards compatible: add columns before using them, and remove them in a later release.
{% endhint %}

## How many releases are kept

The newest 3 releases keep their image and uploaded source (Enterprise keeps 10), so you can roll back to them. Older ones are deleted automatically after a new release goes live, and can no longer be rolled back to. The live release is never deleted, and nothing is deleted while a build or deploy is running.

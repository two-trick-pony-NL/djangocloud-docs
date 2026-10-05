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

### Code rolls back, data does not

A rollback never reverses database migrations. If the release you pick is older than migrations that are already applied, DjangoCloud refuses by default and lists the migrations that would be left behind, because the old code would run against a newer schema. You can override this once you have checked it is safe.

{% hint style="warning" %}
Before relying on rollbacks, make your migrations backwards compatible: add columns before using them, and remove them in a later release.
{% endhint %}

## How many releases are kept

DjangoCloud keeps the images of your 10 most recent releases. Older images are deleted to save space, and a release whose image was deleted cannot be rolled back to. The active release is never deleted.

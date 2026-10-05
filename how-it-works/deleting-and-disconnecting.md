# Deleting a deployment and disconnecting AWS

## Delete a deployment

You can delete a deployment from the dashboard. This removes it from DjangoCloud, together with its release history and settings, and then deletes what it left in AWS:

* its **container service** and **images**, so nothing keeps running or billing,
* its **database**, if it has one, after we save a **final snapshot** of it in your AWS account (named `final-<database name>-<date>`),
* the **source uploads** we stored for it.

{% hint style="warning" %}
Deleting is final. The database snapshot is the only thing kept, and it stays in your AWS account until you delete it there. Snapshots are billed by AWS at storage prices.
{% endhint %}

Removal runs in the background. If your AWS account is disconnected or its environment was already removed, we delete only what we hold ourselves.

## Disconnect your AWS account

Under **AWS** in the dashboard you can disconnect your account. DjangoCloud forgets your access key. **Existing deployments keep running on AWS**, but you can no longer deploy new releases until you connect again.

To fully revoke access, also delete or deactivate the access key for the IAM user in the AWS console.

## Revoke CLI tokens

Tokens for the CLI and CI are listed under **Command line**. Revoke any you no longer use.

## Delete your DjangoCloud account

To close your account and have your data removed, ask in the [Slack community](../community/support.md).

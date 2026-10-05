# Deleting a deployment and disconnecting AWS

## Delete a deployment

You can delete a deployment from the dashboard. This removes it from DjangoCloud, together with its release history and settings.

{% hint style="warning" %}
At the time of writing, deleting a deployment does not remove the resources in your AWS account. After deleting, open the **Lightsail** console in the same region and delete the container service named `dc-<your-slug>`. Until you do, AWS keeps billing you for it.
{% endhint %}

## Disconnect your AWS account

Under **AWS** in the dashboard you can disconnect your account. DjangoCloud forgets your access key. **Existing deployments keep running on AWS**, but you can no longer deploy new releases until you connect again.

To fully revoke access, also delete or deactivate the access key for the IAM user in the AWS console.

## Revoke CLI tokens

Tokens for the CLI and CI are listed under **Command line**. Revoke any you no longer use.

## Delete your DjangoCloud account

To close your account and have your data removed, ask in the [Slack community](../community/support.md).

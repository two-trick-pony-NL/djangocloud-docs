# Security

## Your AWS access key

* It belongs to a dedicated IAM user that you create, limited by the policy in [Connect your AWS account](../getting-started/connect-aws.md).
* The secret is encrypted at rest, never shown again after you save it, and used only to create and update your deployments.
* Revoke it in IAM, or disconnect your account in the dashboard, at any time.

## Your environment variables

Values are encrypted at rest and can't be read back from the dashboard. They are decrypted only when a release is handed to AWS.

## Your code

* Your `.env` files, `.git`, virtualenvs and key files are **never uploaded** by the CLI.
* With GitHub, the app has read-only access to the repositories you choose, and each build uses a short-lived token scoped to one repository.

## Sign-in

* The CLI logs in with a short code you approve in the browser, so no password is typed into a terminal.
* Tokens are stored in a file readable only by you, and you can revoke any of them in the dashboard.

## Your app

* Traffic to your app is served over HTTPS.
* Your app runs in your own AWS account, so your AWS security tools and logging apply.

## Reporting a problem

If you think you've found a security issue, tell us privately in the [Slack community](../community/support.md) by sending a direct message to the team, rather than posting it in a public channel.

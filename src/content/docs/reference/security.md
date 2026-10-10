---
title: "Security"
description: "Values are encrypted at rest and can't be read back from the dashboard. They are decrypted only when a release is handed to AWS."
---

## Your AWS access

Plain-language version: [Is my AWS account safe?](../is-my-aws-account-safe/). The mechanism, permissions and limits: [AWS access: the security model](../aws-access-security/).

* **IAM role (recommended):** you create a role that trusts DjangoCloud only with your own ExternalId, limited by the policy in [Connect your AWS account](../../getting-started/connect-aws/). DjangoCloud assumes it for one-hour sessions and stores no secret. Delete the role to revoke access at once.
* **Access key (fallback):** a dedicated IAM user's key. The secret is encrypted at rest, never shown again after you save it, and used only to create and update your deployments. Revoke it in IAM at any time.
* Either way you can also disconnect your account in the dashboard.

## Your environment variables

Values are encrypted at rest and can't be read back from the dashboard. They are decrypted only when a release is handed to AWS.

## Your code

* Your `.env` files, `.git`, virtualenvs and key files are **never uploaded** by the CLI.
* With GitHub, the app has read-only access to the repositories you choose, and each build uses a short-lived token scoped to one repository.

## Sign-in

* **Two-step sign-in.** Your password, then a 6-digit code mailed to you, on every sign-in. Codes expire after 10 minutes and sending them is rate limited. Passwords are stored only as a salted hash.
* The CLI logs in with a short code you approve in the browser, so no password is typed into a terminal.
* API tokens are stored on our side only as a hash, so a database leak cannot replay them. On your machine the token sits in a file readable only by you. You can revoke any token in the dashboard and it stops working immediately.

## Your app

* Traffic to your app is served over HTTPS, and the dashboard and API are HTTPS only.
* On **Self-hosted** your app runs in your own AWS account, so your AWS security tools and logging apply.
* On **Fully managed** your app runs in a dedicated AWS account that we look after. Accounts are kept apart by the AWS account boundary, but we have full access to the account we run, so treat us as a party you trust with your deployment.

## What we do not offer

SSO/SAML and audit-log export are not available. If your organisation requires them, DjangoCloud is not the right fit today.

## Reporting a problem

Our security contact is published in the standard place, `/.well-known/security.txt` on the DjangoCloud website. If you think you've found a security issue, email that address, or tell us privately in the [Slack community](../../community-and-support/support/) by sending a direct message to the team, rather than posting it in a public channel.

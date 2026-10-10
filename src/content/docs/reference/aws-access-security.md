---
title: "AWS access: the security model"
description: "How DjangoCloud reaches a Self-hosted AWS account: cross-account IAM role with sts:AssumeRole and ExternalId, one-hour STS sessions, least-privilege policy, CloudTrail audit, no stored long-lived credentials. Including what the model does not protect against."
---

This page is for security reviews and engineers who want the mechanism. For a plain-language version read [Is my AWS account safe?](../is-my-aws-account-safe/). To set it up, see [Connect your AWS account](../../getting-started/connect-aws/).

## Summary

* **Cross-account IAM role** in your account, assumed with `sts:AssumeRole`. No long-lived credential of yours is stored by DjangoCloud.
* **Trust policy** names a single principal and requires `sts:ExternalId` (a per-customer, 128-bit random value). This is the standard guard against the *confused deputy* problem.
* **Short-lived STS credentials.** Sessions last at most 3,600 seconds (the role's `MaxSessionDuration` is also 3,600).
* **Least privilege.** Lightsail, Service Quotas, KMS grants, and a build environment scoped to resources named `djangocloud-build*`. Full policy on [Connect your AWS account](../../getting-started/connect-aws/).
* **Auditable.** Every assumption and API call is recorded in *your* CloudTrail.
* **Revocable.** Delete the role or the CloudFormation stack and the next `AssumeRole` is refused.
* **Fallback:** an IAM user's access key, stored encrypted (symmetric, application-level) and never displayed again.

## The connection

1. You create the role from a CloudFormation template, or by hand. The role must be named `djangocloud-deployer`; the control plane's own IAM policy only allows it to assume roles with that name.
2. The trust policy has one principal, the DjangoCloud control-plane identity `arn:aws:iam::710023142180:user/server`, and a condition `StringEquals` on `sts:ExternalId` with your ExternalId.
3. When the stack finishes, a custom resource publishes the role ARN and your ExternalId to an SNS topic of ours (`djangocloud-connect`, one per supported region). The message carries no credentials.
4. Our endpoint verifies the SNS signature, then hands the role to a worker that calls `sts:AssumeRole` with your ExternalId and `sts:GetCallerIdentity` to confirm the account, and then probes Lightsail. Only if all of that succeeds is the connection saved.
5. Deploys assume the role again for each operation. Session names are `djangocloud-<customer id>`; the connection check uses `djangocloud-verify`.

The template is hosted as a single publicly readable S3 object. It contains the permissions policy and the public principal ARN, and takes your ExternalId as a stack parameter. It contains nothing about any customer.

## What the callback is and isn't trusted for

The SNS topic has to accept publishes from any AWS account, because the stack runs in yours. So a message proves nothing about who sent it. Authenticity comes from other checks:

* The SNS **signature** is verified with the certificate from an `sns.<region>.amazonaws.com` URL, and the **TopicArn** must be our own topic in our own account.
* CloudFormation's reply URL must be an `https://...amazonaws.com` host before we call it.
* The role is accepted only if **we can assume it with the customer's ExternalId**. The ExternalId is matched to exactly one customer. A forged message for a role that doesn't trust us with that ExternalId simply fails.
* The stack's account must equal the role's account, and the role name must be `djangocloud-deployer`.
* A callback may create a connection or refresh one in the same AWS account. It never moves a connection that has deployments to a different account.
* DjangoCloud's own AWS accounts are refused as targets.
* We always answer CloudFormation with success, so our availability can't roll back your role. Failures are shown on the AWS settings page instead.

## Process isolation inside DjangoCloud

The web process, which serves the dashboard and API, holds **no AWS credentials**. It validates input and queues work. Only the worker process holds the identity that can call `sts:AssumeRole`, so a web-tier compromise doesn't by itself yield AWS credentials. Customers' role ARNs and ExternalIds are stored, but are useless without that identity.

## Permissions

| Area | Scope |
|---|---|
| Lightsail | `lightsail:*` on all resources (needed to create and manage container services, databases, registries) |
| Service Quotas | read quotas, request increases, create the Service Quotas service-linked role |
| KMS | grants and data-key calls on keys in the account, used for encrypted Lightsail resources |
| CodeBuild | `codebuild:*` only on projects named `djangocloud-build*` |
| CloudWatch Logs | only the log group `/aws/codebuild/djangocloud-build` |
| S3 | `s3:*` only on buckets named `djangocloud-build-<account>-*` |
| IAM | create and put policies only on roles named `djangocloud-build-*`; `iam:PassRole` only for those roles, only to CodeBuild |

Nothing outside this table: no EC2, RDS, general S3, your own IAM users or roles, Organizations or billing.

## Seeing what happened

AssumeRole calls and everything done with the session appear in your CloudTrail. For example:

```bash
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=AssumeRole \
  --query 'Events[?contains(CloudTrailEvent, `djangocloud-`)].[EventTime,Username]' \
  --output table
```

Alert on role-session names starting with `djangocloud-` from principals other than the trusted principal above, and on changes to the role's trust policy.

## Revocation and ceilings

* **Kill switch:** delete the stack or the role. Existing sessions end within the hour (to cut them immediately, add an inline `Deny` with `aws:TokenIssueTime` to the role, or revoke active sessions in IAM).
* **Hard ceiling:** put the account in an AWS Organization and attach an SCP that limits services. The role can never exceed it. A dedicated AWS account for DjangoCloud workloads is the cleanest boundary.
* **Permissions boundary:** you may attach one to `djangocloud-deployer`, but it must allow what is listed above or deploys will fail.

## What this does not protect against

We prefer you hear these from us.

* **The trusted principal is ours.** It is an IAM user whose access key is a long-lived secret held by DjangoCloud's worker. Compromise of that key together with the stored ExternalIds would let an attacker assume customer roles. The ExternalId blocks cross-customer confusion; it is not a secret. Mitigations: the key is kept off the web tier (only the worker process has it), your role only accepts it together with your ExternalId, and every use is visible in your CloudTrail. The key also carries permissions for DjangoCloud's own infrastructure, so treat its protection as a core part of our own security.
* **The role is powerful inside its lane.** `lightsail:*` is account-wide, and the ability to create build roles and run CodeBuild means a malicious holder of the role could in principle reach more than the table suggests. We scope what we create, but you should treat the role as able to change anything running on Lightsail and the build environment. Use a dedicated account and an SCP if that matters for you.
* **Your running app is yours.** DjangoCloud doesn't protect your app's code, secrets or data, which live in your account.
* **The ExternalId can't be rotated by you today.** It is fixed for the life of your DjangoCloud account.

## Questions we get in security reviews

| Question | Answer |
|---|---|
| Does DjangoCloud store AWS credentials for Self-hosted? | Not with a role: only the role ARN, account id, region and ExternalId. With the access-key fallback, the secret is encrypted at rest and never shown again. |
| How long do credentials live? | At most one hour per STS session. |
| Can you act in my account without my knowing? | Every action is in your CloudTrail, under role-session names starting `djangocloud-`. |
| Is there confused-deputy protection? | Yes: a per-customer ExternalId required by the trust policy. |
| How do I revoke access? | Delete the role or stack. Takes effect on the next call. |
| Can the role touch other services? | Not by policy. See the table, and the caveat on build roles above. |
| Where does the control plane run? | In DjangoCloud's own AWS account, separate from yours. Customers' accounts are never used to run DjangoCloud itself. |

Found something we should know? See [Support](../../community-and-support/support/) or `/.well-known/security.txt` on the website.

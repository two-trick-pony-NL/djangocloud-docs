---
title: "Billing and your account"
description: "The plan fee is charged by card through Stripe. You need a card on file to create deployments."
---

## What you pay DjangoCloud

The plan fee is charged by card through Stripe: $0.99 a month on Self-hosted, and on Fully managed the servers and databases you run, starting at $10 for a Nano. You need a card on file to create deployments. Manage your card, invoices and subscription from **Settings → Billing** in the dashboard.

## What you pay AWS

On **Self-hosted** your app runs in your own AWS account, so AWS bills you directly for the servers and databases at AWS list prices. DjangoCloud doesn't see or charge for that. On **Fully managed** there is no AWS bill: the infrastructure is part of what you pay us. See [Pricing](../../reference/pricing/) for the size prices.

## If a payment fails

Stripe retries a failed card for a while. If the subscription ends up **unpaid** or **canceled**, your account is **suspended**:

* New deploys are refused, including pushes from GitHub, and the deployment log says why.
* Your running apps are not stopped by DjangoCloud.
* Update your card in **Settings → Billing**. As soon as the subscription is active again the suspension lifts and you can deploy.

## Invoices

Manage your payment details and see your invoices from the billing portal linked in **Settings → Billing**.

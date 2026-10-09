---
title: "Pricing"
description: "There are two parts to what a deployment costs: the DjangoCloud plan, and the servers and databases that run your app."
---

There are two parts to what a deployment costs: the DjangoCloud plan, and the servers and databases that run your app.

## Plans

| Plan | Price | What it is |
| --- | --- | --- |
| **Starter** | $0.99 a month | Bring your own cloud. Your app runs in your own AWS account and you pay AWS directly, at cost. The plan covers the tooling. |
| **Company** | from $9.99 a month | We host a simple Django app for you, infrastructure included. **Coming soon.** |
| **Enterprise** | from $49.99 a month | Hosting plus a managed Postgres database, a storage bucket and more headroom. **Coming soon.** |

See the [pricing section on the website](https://djangocloud.dev/#pricing) for the current feature lists.

## Servers

A server is one running instance of your app. A project running three Small instances is three Small servers.

On **Starter** you pay AWS the list price in the middle column, directly. On the hosted plans the price in the last column covers the server and the infrastructure around it: the AWS list price plus about $3, rounded up to the next $5, per instance.

| Size | vCPU | RAM | AWS list price / month | Hosted price / month |
| --- | --- | --- | --- | --- |
| Nano | 0.25 (shared) | 512 MB | $7 | $10 |
| Micro | 0.25 (shared) | 1 GB | $10 | $15 |
| Small | 0.5 (shared) | 1 GB | $15 | $20 |
| Medium | 1 | 2 GB | $40 | $45 |
| Large | 2 | 4 GB | $80 | $85 |
| XLarge | 4 | 8 GB | $160 | $165 |

Shared vCPU means the processor is shared with other workloads and can burst.

## Postgres databases

Managed Postgres, encrypted at rest. **High availability** adds a standby in a second zone for failover, at twice the AWS price before the same markup.

| Size | vCPU | RAM | SSD | AWS list price / month | Hosted price / month | Hosted, high availability / month |
| --- | --- | --- | --- | --- | --- | --- |
| Micro | 2 | 1 GB | 40 GB | $15 | $20 | $35 |
| Small | 2 | 2 GB | 80 GB | $30 | $35 | $65 |
| Medium | 2 | 4 GB | 120 GB | $60 | $65 | $125 |
| Large | 2 | 8 GB | 240 GB | $115 | $120 | $235 |
| XLarge | 4 | 16 GB | 480 GB | $245 | $250 | $495 |
| 2XLarge | 8 | 32 GB | 960 GB | $490 | $495 | $985 |

:::note
AWS prices change. The AWS columns are list prices at the time of writing, and the hosted prices are derived from them. Check the [AWS Lightsail pricing page](https://aws.amazon.com/lightsail/pricing/) for the current numbers.
:::

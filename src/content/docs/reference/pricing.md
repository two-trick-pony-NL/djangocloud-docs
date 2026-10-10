---
title: "Pricing"
description: "There are two parts to what a deployment costs: the DjangoCloud plan, and the servers and databases that run your app."
---

There are two parts to what a deployment costs: the DjangoCloud plan, and the servers and databases that run your app.

## Plans

| Plan | Price | What it is |
| --- | --- | --- |
| **Self-hosted** | $0.99 a month | Bring your own cloud. Your app runs in your own AWS account and you pay AWS directly, at list price. The plan covers the tooling. |
| **Fully managed** | from $10 a month | We run your app for you in a dedicated AWS account that we set up and look after, infrastructure included. The entry server, a Nano, is $10. |

See the [pricing page on the website](https://djangocloud.dev/pricing/) for the full feature lists and an example monthly cost.

## Servers

A server is one running instance of your app. A project running three Small instances is three Small servers.

On **Self-hosted** you pay AWS the list price in the middle column, directly. On **Fully managed** the price in the last column covers the server and the infrastructure around it: the AWS list price plus $5 per instance, except the Nano, which is $10.

| Size | vCPU | RAM | AWS list price / month | Fully managed price / month |
| --- | --- | --- | --- | --- |
| Nano | 0.25 (shared) | 512 MB | $7 | $10 |
| Micro | 0.25 (shared) | 1 GB | $10 | $15 |
| Small | 0.5 (shared) | 1 GB | $15 | $20 |
| Medium | 1 | 2 GB | $40 | $45 |
| Large | 2 | 4 GB | $80 | $85 |
| XLarge | 4 | 8 GB | $160 | $165 |

Shared vCPU means the processor is shared with other workloads and can burst.

## Postgres databases

Managed Postgres, encrypted at rest. **High availability** adds a standby in a second zone for failover and doubles the price. Databases are charged at the AWS list price with no surcharge: on **Self-hosted** AWS bills you, and on **Fully managed** we charge you the same amount.

| Size | vCPU | RAM | SSD | Price / month | With high availability / month |
| --- | --- | --- | --- | --- | --- |
| Micro | 2 | 1 GB | 40 GB | $15 | $30 |
| Small | 2 | 2 GB | 80 GB | $30 | $60 |
| Medium | 2 | 4 GB | 120 GB | $60 | $120 |
| Large | 2 | 8 GB | 240 GB | $115 | $230 |
| XLarge | 4 | 16 GB | 480 GB | $245 | $490 |
| 2XLarge | 8 | 32 GB | 960 GB | $490 | $980 |

:::note
AWS prices change. The AWS prices are list prices at the time of writing, and the Fully managed prices are derived from them. Check the [AWS Lightsail pricing page](https://aws.amazon.com/lightsail/pricing/) for the current numbers.
:::

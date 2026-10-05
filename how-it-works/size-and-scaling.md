# Server size and scaling

Each deployment runs on one or more identical **instances**. You choose the size of an instance and how many you run.

## Sizes

| Size | vCPU | RAM |
| --- | --- | --- |
| Nano | 0.25 (shared) | 512 MB |
| Micro | 0.25 (shared) | 1 GB |
| Small | 0.5 (shared) | 1 GB |
| Medium | 1 | 2 GB |
| Large | 2 | 4 GB |
| XLarge | 4 | 8 GB |

Prices are on the [Pricing](../reference/pricing.md) page.

## Changing size or instance count

Open your deployment, go to **Settings**, and choose a size and a number of instances between **1 and 20**. The change is recorded straight away and **applies on your next deploy**. It does not restart the running release.

On Starter, AWS bills you for the servers directly in your own AWS account. DjangoCloud does not charge for them.

## Choosing a size

* Start with **Nano** for a small app or a test.
* Gunicorn runs a fixed number of workers (default 2, set with `workers` in the [build settings](build-settings.md)). Each worker uses memory, so a memory-hungry app needs a bigger size or fewer workers.
* If a release keeps restarting or being killed, it may be running out of memory. Try the next size up.

## More than one instance

Instances don't share a filesystem or memory. Sessions, caches and uploaded files have to live outside the container. See [Persistent files and the ephemeral container](ephemeral-container.md).

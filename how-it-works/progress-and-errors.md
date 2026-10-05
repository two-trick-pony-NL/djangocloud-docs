# Progress and errors

Everything DjangoCloud does for you (checking your payment, preparing your environment, building, deploying, changing size) runs in the background, one step at a time. You can close the page; nothing stops.

## What's happening

Open your deployment and look at **What's happening**. Each step shows a status:

| Status | Meaning |
| --- | --- |
| Pending / Running | It is about to start, or working right now. |
| Waiting | Between steps: polling AWS, retrying after a hiccup, or waiting for an earlier step. |
| Succeeded | Done. |
| Needs attention | You have to fix something, for example a declined card. Then press **Retry**. |
| Failed | It can't continue, for example your build failed. The message says why. Fix it and press **Retry**, or deploy again. |

## When something goes wrong

* **Short hiccups fix themselves.** If AWS is busy or unreachable, DjangoCloud retries with increasing pauses, and the step says "Retrying automatically".
* **If it needs you**, the message tells you what to do in plain words. Retrying a step also restarts the steps that were waiting on it.
* **If it's on our side**, you'll see a general message and we are told automatically. You can still press **Retry**.
* **Nothing is lost if something restarts.** Work is saved after every step and picked up again.

Your build output and the last lines of your app's log (if it fails to start) appear in the **Logs** tab.

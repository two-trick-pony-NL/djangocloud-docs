# Custom domains

Serve your app on your own address, such as `app.example.com`, with HTTPS. Until you add one, your app is reachable on its default address, which already has HTTPS.

## Add a domain

1. Open your deployment and go to the **Domains** tab.
2. Choose **Add domain** and enter a domain you own, for example `example.com` or `app.example.com`.
3. DjangoCloud sets up DNS for it in your AWS environment and asks for an HTTPS certificate. The tab shows each step as it happens.
4. When it asks, change the domain's **nameservers** at the company where you registered it. The tab shows the exact nameservers and has a **Copy** button.
5. Wait. DNS changes usually spread within minutes but can take up to 48 hours. The page checks by itself, and the domain goes live as soon as it has. You can close the page: nothing is lost by waiting.

When it's live, the tab shows **Open site** and your app answers on `https://your-domain`.

## What you don't have to do

* You don't request or validate a certificate. DjangoCloud asks for it and adds the validation records for you.
* You don't edit `ALLOWED_HOSTS` or `CSRF_TRUSTED_ORIGINS`. Your app's [settings wrapper](../how-it-works/how-your-app-runs.md) accepts the domain once it is live, and the running app is updated **without a rebuild**.

## Things to know before you change nameservers

{% hint style="warning" %}
Changing a domain's nameservers moves **all** of its DNS to the zone DjangoCloud creates. Records you have elsewhere for that domain, such as email (MX), verification or other subdomains, stop working until they exist in the new zone.
{% endhint %}

* If you use the domain for email or other services, set up a **subdomain** such as `app.example.com` instead of the bare domain. For a subdomain, add `NS` records for it at your DNS provider, pointing at the same nameservers the tab shows, and leave the rest of the domain where it is.
* If the domain is used for nothing else, changing its nameservers is the simplest option.
* A deployment can have up to **5** domains.

## If something goes wrong

* Each step has a status. A step that needs you says what to do. A step that failed has a **Retry** button.
* While the nameservers are not yet set, the tab shows where your DNS points right now, so you can see whether your change has taken effect.
* A domain that never got anywhere (a typo, or a name AWS refused) can be **removed** from the tab.

## Remove a domain

Use **Disconnect** on a domain that is set up. Your site stops answering on that address, and the HTTPS certificate and the DNS records DjangoCloud created for it are deleted from your AWS environment. Your app stays live on its default address. Anything you set up yourself at your registrar, such as the nameserver change, is not touched, so point it back if you no longer want it.

Deleting the whole deployment deletes its domains' resources too. See [Deleting a deployment](../how-it-works/deleting-and-disconnecting.md).

{% hint style="info" %}
Custom domains are new. If a step stalls or fails in a way the message doesn't explain, tell us in [Slack](../community/support.md).
{% endhint %}

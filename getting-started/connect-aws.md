# Connect your AWS account

DjangoCloud runs your app in **your** AWS account, on Amazon Lightsail. You pay AWS directly for the servers, at AWS list prices. To do that it needs an IAM access key.

{% hint style="warning" %}
Create a dedicated IAM user for this. Never use your root account keys.
{% endhint %}

## Steps

1. In the AWS console open **IAM → Users → Create user**, for example `djangocloud`.
2. Attach this policy to the user:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["lightsail:*", "ecr:*", "sts:GetCallerIdentity"],
         "Resource": "*"
       }
     ]
   }
   ```

3. Under **Security credentials**, create an access key.
4. In the DjangoCloud dashboard open **AWS**, choose a [region](../reference/regions.md), and paste the access key ID and secret access key.

DjangoCloud checks the keys with AWS before saving them.

## How the keys are handled

* The secret is encrypted at rest and only used to deploy your projects.
* It is never shown again after you save it.
* You can revoke the key in IAM at any time, or **disconnect** your account in the dashboard.
* Disconnecting does not stop anything. Existing deployments keep running on AWS.

## Choosing a region

Pick the region closest to your users. All deployments created while a region is connected go there. See the [list of supported regions](../reference/regions.md).

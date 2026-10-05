# Connect your AWS account

DjangoCloud runs your app in **your** AWS account, on Amazon Lightsail. You pay AWS directly for the servers, at AWS list prices. To do that it needs an IAM access key.

{% hint style="warning" %}
Create a dedicated IAM user for this. Never use your root account keys.
{% endhint %}

## Steps

1. In the AWS console open **IAM → Users → Create user**, for example `djangocloud`.
2. Attach this policy to the user. It lets DjangoCloud run your app on Lightsail and set up a small build environment in your account (a build project, a private bucket for build inputs, a role and logs). It has no access to any other service:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "lightsail:*",
           "sts:GetCallerIdentity"
         ],
         "Resource": "*"
       },
       {
         "Effect": "Allow",
         "Action": [
           "servicequotas:GetServiceQuota",
           "servicequotas:GetAWSDefaultServiceQuota",
           "servicequotas:ListServiceQuotas",
           "servicequotas:RequestServiceQuotaIncrease",
           "servicequotas:GetRequestedServiceQuotaChange",
           "servicequotas:ListRequestedServiceQuotaChangeHistory",
           "servicequotas:ListRequestedServiceQuotaChangeHistoryByQuota"
         ],
         "Resource": "*"
       },
       {
         "Effect": "Allow",
         "Action": [
           "kms:CreateGrant",
           "kms:DescribeKey",
           "kms:ListAliases",
           "kms:ListGrants",
           "kms:Decrypt",
           "kms:GenerateDataKey",
           "kms:GenerateDataKeyWithoutPlaintext",
           "kms:ReEncrypt*"
         ],
         "Resource": "*"
       },
       {
         "Effect": "Allow",
         "Action": "codebuild:*",
         "Resource": "arn:aws:codebuild:*:*:project/djangocloud-build*"
       },
       {
         "Effect": "Allow",
         "Action": [
           "logs:CreateLogGroup",
           "logs:PutRetentionPolicy",
           "logs:GetLogEvents",
           "logs:DescribeLogStreams"
         ],
         "Resource": [
           "arn:aws:logs:*:*:log-group:/aws/codebuild/djangocloud-build",
           "arn:aws:logs:*:*:log-group:/aws/codebuild/djangocloud-build:*"
         ]
       },
       {
         "Effect": "Allow",
         "Action": "s3:*",
         "Resource": [
           "arn:aws:s3:::djangocloud-build-*-*",
           "arn:aws:s3:::djangocloud-build-*-*/*"
         ]
       },
       {
         "Effect": "Allow",
         "Action": [
           "iam:CreateRole",
           "iam:GetRole",
           "iam:PutRolePolicy",
           "iam:TagRole"
         ],
         "Resource": "arn:aws:iam::*:role/djangocloud-build-*"
       },
       {
         "Effect": "Allow",
         "Action": "iam:PassRole",
         "Resource": "arn:aws:iam::*:role/djangocloud-build-*",
         "Condition": {
           "StringEquals": {
             "iam:PassedToService": "codebuild.amazonaws.com"
           }
         }
       }
     ]
   }
   ```

3. Under **Security credentials**, create an access key.
4. In the DjangoCloud dashboard open **AWS**, choose a [region](../reference/regions.md), and paste the access key ID and secret access key.

DjangoCloud checks the keys with AWS before saving them.

## What this costs you

Your app's servers are billed by AWS at Lightsail list prices. Builds run in AWS CodeBuild in your account and cost a few cents each.

{% hint style="info" %}
If your AWS account is brand new, AWS may need some hours to enable builds for it the first time. DjangoCloud asks for it automatically and shows "Waiting for AWS to enable builds" on your deployment page, then continues on its own.
{% endhint %}

## How the keys are handled

* The secret is encrypted at rest and only used to deploy your projects.
* It is never shown again after you save it.
* You can revoke the key in IAM at any time, or **disconnect** your account in the dashboard.
* Disconnecting does not stop anything. Existing deployments keep running on AWS.

## Choosing a region

Pick the region closest to your users. All deployments created while a region is connected go there. See the [list of supported regions](../reference/regions.md).

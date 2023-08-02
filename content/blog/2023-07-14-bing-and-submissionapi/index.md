---
title: Live Update Bing through the Submission API in GitHub Actions
date: 2023-07-14
description: "This article covers an integration with the Microsoft Bing Submission API through GitHub Actions using a shell script to update the Microsoft Bing search engine with updated URLs in this blog implementation upon each deployment of the site."
keywords: ["gatsbyjs", "bing", "submission api", "github actions", "seo"]
openGraphImage: ../../../src/images/open-graph/bing.png
---

In a <Link to="/blog/2023-07-12-bing-and-indexnow/">previous post</Link>,
I discussed the challenges and delays associated with waiting for crawlers to
discover updated content and how to solve that issue for
[Microsoft Bing](https://www.bing.com) using
[IndexNow](https://www.indexnow.org/).

This article covers an integration with the
[Microsoft Bing Submission API](https://learn.microsoft.com/en-us/dotnet/api/microsoft.bing.webmaster.api.interfaces.iwebmasterapi.submiturlbatch?view=bing-webmaster-dotnet#Microsoft_Bing_Webmaster_Api_Interfaces_IWebmasterApi_SubmitUrlBatch_System_String_System_Collections_Generic_List_System_String__)
through [GitHub Actions](https://github.com/features/actions)
using a shell script to update the
[Microsoft Bing](https://www.bing.com) search engine with updated
URLs in this blog implementation upon each deployment of the site.

The evolving **GitHub repository** storing this blog and its implementation can be
found [here](https://github.com/jpfulton/blog).

## Table of Contents

## Prerequisites for the Bing Submission API

Prior to using the Bing Submission API, a number of steps need to be
performed to enable access to the API and establish ownership for
the site you are submitting URLs on behalf of.

### Establishing Ownership with the Bing Webmaster Tools

[Bing Webmaster Tools](https://www.bing.com/webmasters/) is the portal
for establishing site ownership with Bing and managing URL submission,
tracking search performance and managing search engine optimization.
I observed a number of quirks when running the webmaster tools portal in
both Chrome and Safari. Those quirks can be avoided by utilizing
[Microsoft Edge](https://www.microsoft.com/en-us/edge/) when running the
portal.

If you are already a verified owner of one or more sites with Google, it is possible
to import your properties and verified ownership direct into Bing via an exchange
with [Google Search Console](https://search.google.com/search-console/). Other methods
for verifying site ownership are also available.

### Generating an API Key

Within the [Bing Webmaster Tools](https://www.bing.com/webmasters/) portal,
click on the settings icon in the upper right corner of the navigation header.
Then select **API access** > **API Key** to generate or access an existing
key for use with the Bing APIs. Store this value in a _secure_ place for use
in later steps.

![Bing API Access Menu Screenshot](./bing-api-access-menu.png)

## Structure of an IndexNow Request

The body of an Submission API request is a simple JSON object. It contains only two
properties: the site URL and a list of URLs to be submitted to the crawler.
It may be submitted using an HTTP `POST` to
`https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch` with a query parameter
that contains the API key.
It is important to set the `Content-Type` header
to `application/json; charset=utf-8` for the request to be accepted by the API.

```json
POST /webmaster/api.svc/json/SubmitUrlbatch?​apikey=sampleapikeyEDECC1EA4AE341CC8B6 HTTP/1.1
Content-Type: application/json; charset=utf-8
Host: ssl.bing.com
{
  "siteUrl": "https://www.jpatrickfulton.dev",
  "urlList": [
    "https://www.jpatrickfulton.dev/",
    "https://www.jpatrickfulton.dev/blog/2023-06-23-samba-and-timemachine/",
    "https://www.jpatrickfulton.dev/blog/2023-07-01-build-gatsby-blog/",
    "https://www.jpatrickfulton.dev/blog/2023-07-02-publish-to-azure-swa/",
    "https://www.jpatrickfulton.dev/blog/2023-07-03-gatsby-vscode-support/",
    "https://www.jpatrickfulton.dev/blog/2023-07-05-swa-custom-404s/",
    "https://www.jpatrickfulton.dev/blog/2023-07-08-fix-csharp-macos-debugging/",
    "https://www.jpatrickfulton.dev/blog/2023-07-09-gatsby-og-images/",
    "https://www.jpatrickfulton.dev/blog/2023-07-12-bing-and-indexnow/",
    "https://www.jpatrickfulton.dev/blog/2023-07-13-google-and-indexingapi/",
    ]
}
```

## The GitHub Actions Workflow

A few steps are necessary to modify the GitHub workflow and prepare
the repository for a workflow step that uses a shell script to call
the Bing Submission API with URLs from the updated and recently released
site.

### Save the API Key as a Repository Secret

Navigate to your GitHub repository, and select
**Settings** > **Secrets and Variables** > **Actions** > **New Repository Secret**.
On the next screen create a new secret with the name `BING_API_KEY`
and paste in the contents of your API key from the steps
above which you stored in a _secure_ place.

![GitHub Secrets Screenshot](./github-secrets.png)

### Add the bing-url-submission-api.sh Shell Script

The URL structure of a generated [Gatsby](https://www.gatsbyjs.com/) site can be
derived from the structure of
the code that builds it. Therefore, a script that uses the structure of
the repository as its source material can be created that builds the URLs
of the pages that were generated is easy to create. Additionally, the
JSON structure of an Submission API request body is straight forward so creating
it in a shell script is possible with a series of `echo` commands directed
to a local working file. Once the temporary working file containing the JSON
request is created, `curl` can be used to submit the request to the Submission API.

```sh:title=bing-url-submission-api.sh {numberLines: true}{clipboardButton: true}
#!/usr/bin/env bash

# Configurable variables used in IndexNow call and URL construction
HOST="www.jpatrickfulton.dev"
BASE_URL="https://${HOST}"
BING_URL="https://ssl.bing.com"

BLOG_DIR=../../../content/blog/; # Location of /content/blog/ folder relative to tmp working dir

WORKING_DIR=$( pwd; );
TMP_DIR=$WORKING_DIR"/tmp";

LOCAL_CREDENTIALS_FILE=../bing-api-key.txt;
JSON_FILE=bing-submission-api-body.json;

# Create and enter the working directory if it does not exist
if [ ! -d $TMP_DIR ]
  then
    echo "Creating temporary working directory.";
    mkdir $TMP_DIR;
fi
cd $TMP_DIR;

echo "Building POST body from repository structure.";
if [ -f $JSON_FILE ]
  then
    rm $JSON_FILE;
fi

# Begin JSON body construction
touch $JSON_FILE;
echo "{" >> $JSON_FILE;
echo "  \"siteUrl\": \"${BASE_URL}\"," >> $JSON_FILE;
echo "  \"urlList\": [" >> $JSON_FILE;

# Add the root URL
echo "    \"${BASE_URL}/\"," >> $JSON_FILE;

# Iterate over folders in the /content/blog/ directory
# to create links to each individual generated blog page
BLOGS=($(ls $BLOG_DIR));
for BLOG in "${BLOGS[@]}"
do
  echo "    \"${BASE_URL}/blog/${BLOG}/\"," >> $JSON_FILE;
done

echo "    ]" >> $JSON_FILE;
echo "}" >> $JSON_FILE;
# JSON body construction complete

echo "JSON POST body contents:";
cat $JSON_FILE;
echo;

# Look for a local api key file
if [ -f $LOCAL_CREDENTIALS_FILE ]
  then
    echo "Using local API key file.";
    BING_API_KEY=$(cat $LOCAL_CREDENTIALS_FILE);
  else
    echo "No local API key file found...";
    echo "Using the BING_API_KEY environment variable...";

    if [ -z "${BING_API_KEY}" ]
      then
        echo "BING_API_KEY is not set or is empty. Exiting.";
        exit 1;
    fi
fi

echo "---";
echo "Updating Bing through POST to Submission API...";
echo;

# Construct the Bing API URL
BING_API_URL="${BING_URL}/webmaster/api.svc/json/SubmitUrlbatch?apikey=${BING_API_KEY}";

# Use curl to POST the JSON content to Bing IndexNow endpoint
curl $BING_API_URL \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$(cat $JSON_FILE)" \
  -s \
  -i;

echo;
echo "---";
echo "Done.";
```

The complete current version of this script is available at this
[location](https://github.com/jpfulton/blog/blob/main/.github/scripts/bing-url-submission-api.sh).

### Add the Workflow Step

In the continuous integration workflow for this site, I added a step
to the primary job following the step that builds and deploys the
generated output of site to [Azure](https://azure.microsoft.com). The step is
configured to _only_ run for pushes to the default branch to ensure that it
only executes following production releases.

By default, GitHub Actions workflows run in a fairly restrictive user context.
The script above performs a number of operations that require elevated
permissions to perform in that space like creating a working directory
and files within it. As a result, the script must run in `sudo` mode to
work correctly. Per the
[GitHub Actions Documentation](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#administrative-privileges),
a passwordless sudo mode is available in the workflow context which makes
executing the script fairly painless.

Additionally, take note of the `--preserve-env` flag passed to the `sudo`
command. By default, sudo will reset environment variables for the new
command context. However, this script needs to accept the `BING_API_KEY`
variable for use within. To ensure that environment variable is available
to the script, this flag is used. The configuration of sudo in the Github
runners environment allows the use of this flag.

> **-E, --preserve-env**
>
> Indicates to the security policy that the user wishes to preserve their
> existing environment variables. The security policy may return an error
> if the user does not have permission to preserve the environment.

```yaml {3,7}{numberLines: true}{clipboardButton: true}
- name: Update Bing via Submission API
  env:
    BING_API_KEY: ${{ secrets.BING_API_KEY }}
  if: github.event_name == 'push'
  working-directory: ".github/scripts"
  shell: bash
  run: sudo --preserve-env ./bing-url-submission-api.sh
```

The complete current version of this workflow can be found at this
[location](https://github.com/jpfulton/blog/blob/main/.github/workflows/cicd.yml).

## Proving it Works

Trigger a GitHub Actions workflow run with a push into the default branch.
In your repository, select the **Actions** tab, identify the workflow run
that was triggered, click on the **Build and Deploy** job, scroll to and
expand the output of the **Update Bing via Submission API** step and observe
the output. Its output will be similar to a local execution of the
`bing-url-submission-api.sh` script.

![GitHub Actions Output Screenshot](./github-actions-output.png)

The output of the command is listed below. We are looking for an HTTP `200`
status code to be returned from the API to indicate success of the operation
and a result body to be printed from curl that includes `d: null` per the
[API documentation](https://learn.microsoft.com/en-us/dotnet/api/microsoft.bing.webmaster.api.interfaces.iwebmasterapi.submiturlbatch?view=bing-webmaster-dotnet#Microsoft_Bing_Webmaster_Api_Interfaces_IWebmasterApi_SubmitUrlBatch_System_String_System_Collections_Generic_List_System_String__).
Both the lines showing these results are highlighted in the output listing below.
In the event that something has gone wrong (e.g. an incorrect API key), the output
body will include an error message and the status code will reflect an error state.

```sh {25,40}{numberLines: true}
Creating temporary working directory.
Building POST body from repository structure.
JSON POST body contents:
***
  "siteUrl": "https://www.jpatrickfulton.dev",
  "urlList": [
    "https://www.jpatrickfulton.dev/",
    "https://www.jpatrickfulton.dev/blog/2023-06-23-samba-and-timemachine/",
    "https://www.jpatrickfulton.dev/blog/2023-07-01-build-gatsby-blog/",
    "https://www.jpatrickfulton.dev/blog/2023-07-02-publish-to-azure-swa/",
    "https://www.jpatrickfulton.dev/blog/2023-07-03-gatsby-vscode-support/",
    "https://www.jpatrickfulton.dev/blog/2023-07-05-swa-custom-404s/",
    "https://www.jpatrickfulton.dev/blog/2023-07-08-fix-csharp-macos-debugging/",
    "https://www.jpatrickfulton.dev/blog/2023-07-09-gatsby-og-images/",
    "https://www.jpatrickfulton.dev/blog/2023-07-12-bing-and-indexnow/",
    "https://www.jpatrickfulton.dev/blog/2023-07-13-google-and-indexingapi/",
    ]
***

No local API key file found...
Using the BING_API_KEY environment variable...
---
Updating Bing through POST to Submission API...

HTTP/2 200
cache-control: private
content-length: 10
content-type: application/json; charset=utf-8
x-aspnet-version: 4.0.30319
x-powered-by: ASP.NET
x-cache: CONFIG_NOCACHE
accept-ch: Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Full-Version, Sec-CH-UA-Mobile, Sec-CH-UA-Model, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version
x-msedge-ref: Ref A: C718053753E740419333BAB03965822B Ref B: BN3EDGE0719 Ref C: 2023-07-14T19:31:38Z
set-cookie: _EDGE_S=F=1&SID=0E9E7BC8F5BF680638B06886F4BC69DD; path=/; httponly; domain=bing.com
set-cookie: _EDGE_V=1; path=/; httponly; expires=Wed, 07-Aug-2024 19:31:38 GMT; domain=bing.com
set-cookie: MUID=30B8B972B6976EEB2215AA3CB7946F35; samesite=none; path=/; secure; expires=Wed, 07-Aug-2024 19:31:38 GMT; domain=bing.com
set-cookie: MUIDB=30B8B972B6976EEB2215AA3CB7946F35; path=/; httponly; expires=Wed, 07-Aug-2024 19:31:38 GMT
date: Fri, 14 Jul 2023 19:31:37 GMT

***"d":null***
---
Done.
```

Return to the [Bing Webmaster Tools](https://www.bing.com/webmasters/) portal,
following a local run of the script or a GitHub Actions workflow execution.
Navigate to the **URL Submission** tab on the left hand navigation menu. After
a few minutes, you should observe the URLs that you submitted within the screen
and an adjustment to your remaining quota for the period noted at the bottom of
the page.

![Bing Url Submissions Screenshot](bing-url-submissions.png)

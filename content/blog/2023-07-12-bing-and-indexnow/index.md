---
title: Live Update Bing through IndexNow in GitHub Actions
date: 2023-07-12
description: ""
keywords: ["gatsbyjs", "bing", "indexnow", "github actions", "seo"]
openGraphImage: ./bing.png
---

[Microsoft Bing](https://www.bing.com)
[IndexNow](https://www.indexnow.org/)

> Without IndexNow, it can take days to weeks for search engines to discover
> that the content has changed, as search engines don’t crawl every URL often.
> With IndexNow, search engines know immediately the "URLs that have changed,
> helping them prioritize crawl for these URLs and thereby limiting organic
> crawling to discover new content."

The evolving **GitHub repository** storing this blog and its implementation can be
found [here](https://github.com/jpfulton/blog).

## Table of Contents

## Getting Started with Bing Webmaster Tools

[Bing Webmaster Tools](https://www.bing.com/webmasters/)
[Microsoft Edge](https://www.microsoft.com/en-us/edge)

## Creating and Hosting the API Key

[here](https://www.bing.com/indexnow)

## Structure of the IndexNow Request

The body of an IndexNow request is simple JSON object. It contains only four
properties: the host, api key, hosted key file location and a list of URLs.
In the case of Bing, it may be submitted using an HTTP `POST` to
`https://www.bing.com/indexnow`. It is important to set the `Content-Type` header
to `application/json; charset=utf-8` for the request to be accepted by the API.

```json
POST /IndexNow HTTP/1.1
Content-Type: application/json; charset=utf-8
Host: www.bing.com
{
  "host": "www.jpatrickfulton.dev",
  "key": "8846484b349642449a66629f496422f8",
  "keyLocation": "https://www.jpatrickfulton.dev/8846484b349642449a66629f496422f8.txt",
  "urlList": [
    "https://www.jpatrickfulton.dev/",
    "https://www.jpatrickfulton.dev/blog/2023-06-23-samba-and-timemachine/",
    "https://www.jpatrickfulton.dev/blog/2023-07-01-build-gatsby-blog/",
    "https://www.jpatrickfulton.dev/blog/2023-07-02-publish-to-azure-swa/",
    "https://www.jpatrickfulton.dev/blog/2023-07-03-gatsby-vscode-support/",
    "https://www.jpatrickfulton.dev/blog/2023-07-05-swa-custom-404s/",
    "https://www.jpatrickfulton.dev/blog/2023-07-08-fix-csharp-macos-debugging/",
    "https://www.jpatrickfulton.dev/blog/2023-07-09-gatsby-og-images/",
    ]
}
```

## Building and Submitting the Request via a Bash Shell Script

The URL structure of a generated Gatsby site can be derived from the structure of
the code that builds it. Therefore, a script that uses the structure of
the repository as its source material can be created that builds the URLs
of the pages that were generated is easy to create. Additionally, the
JSON structure of an IndexNow request body is straight forward so creating
it in a shell script is possible with a series of `echo` commands directed
to a local working file. Once the temporary working file containing the JSON
request is created, `curl` can be used to submit the request to the IndexNow API.

```sh:title=indexnow.sh {numberLines:true}
#!/usr/bin/env bash

# Configurable variables used in IndexNow call and URL construction
HOST="www.jpatrickfulton.dev"
BASE_URL="https://${HOST}"
BING_API_KEY="8846484b349642449a66629f496422f8"
BING_URL_TO_KEY_FILE="${BASE_URL}/${BING_API_KEY}.txt"
BING_URL="https://www.bing.com"

BLOG_DIR=../../../content/blog/; # Location of /content/blog/ folder relative to tmp working dir

WORKING_DIR=$( pwd; );
TMP_DIR=$WORKING_DIR"/tmp";
JSON_FILE=body.json;

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
echo "  \"host\": \"${HOST}\"," >> $JSON_FILE;
echo "  \"key\": \"${BING_API_KEY}\"," >> $JSON_FILE;
echo "  \"keyLocation\": \"${BING_URL_TO_KEY_FILE}\"," >> $JSON_FILE;
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
# JSON body constrction complete

echo "JSON POST body contents:";
cat $JSON_FILE;
echo;

echo "---";
echo "Updating Bing through POST to /IndexNow...";
echo;

# Use curl to POST the JSON content to Bing IndexNow endpoint
curl ${BING_URL}/IndexNow \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$(cat $JSON_FILE)" \
  -s \
  -i;

echo "---";
echo "Done.";
```

The complete current version of this script is available at this
[location](https://github.com/jpfulton/blog/blob/main/.github/scripts/indexnow.sh).

## The GitHub Actions Workflow Step

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

> The Linux and macOS virtual machines both run using passwordless sudo.
> When you need to execute commands or install tools that require more privileges
> than the current user, you can use sudo without needing to provide a password.

```yaml {5}{numberLines: true}
- name: Update Bing via IndexNow
  if: github.event_name == 'push'
  working-directory: ".github/scripts"
  shell: bash
  run: sudo ./indexnow.sh
```

The complete current version of this workflow can be found at this
[location](https://github.com/jpfulton/blog/blob/main/.github/workflows/cicd.yml).

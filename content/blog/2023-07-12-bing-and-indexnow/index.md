---
title: Live Update Bing through IndexNow in GitHub Actions
date: 2023-07-12
description: ""
keywords: ["gatsbyjs", "bing", "indexnow", "github actions", "seo"]
openGraphImage: ./bing.png
---

The evolving **GitHub repository** storing this blog and its implementation can be
found [here](https://github.com/jpfulton/blog).

## Table of Contents

## Getting Started with Bing Webmaster Tools

## Creating and Hosting the API Key

## Structure of the IndexNow Request

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

## The GitHub Actions Workflow

```yaml {numberLines: true}
- name: Update Bing via IndexNow
  if: github.event_name == 'push'
  working-directory: ".github/scripts"
  shell: bash
  run: sudo ./indexnow.sh
```

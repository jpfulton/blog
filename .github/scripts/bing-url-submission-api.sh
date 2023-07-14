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
# JSON body constrction complete

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

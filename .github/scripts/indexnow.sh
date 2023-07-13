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

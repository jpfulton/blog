#!/usr/bin/env bash

HOST="www.jpatrickfulton.dev"
BASE_URL="https://${HOST}"
BING_API_KEY="8846484b349642449a66629f496422f8"
BING_URL_TO_KEY_FILE="${BASE_URL}/${BING_API_KEY}.txt"
BING_URL="https://www.bing.com"

WORKING_DIR=$( pwd; );
TMP_DIR=$WORKING_DIR"/tmp";

if [ ! -d $TMP_DIR ]
  then
    echo "Creating temporary working directory.";
    mkdir $TMP_DIR;
fi

cd $TMP_DIR;

echo "Building POST body from repository structure.";
JSON_FILE=body.json;
if [ -f $JSON_FILE ]
  then
    rm $JSON_FILE;
fi

touch $JSON_FILE;
echo "{" >> $JSON_FILE;
echo "  \"host\": \"${HOST}\"," >> $JSON_FILE;
echo "  \"key\": \"${BING_API_KEY}\"," >> $JSON_FILE;
echo "  \"keyLocation\": \"${BING_URL_TO_KEY_FILE}\"," >> $JSON_FILE;
echo "  \"urlList\": [" >> $JSON_FILE;

echo "    \"${BASE_URL}/\"," >> $JSON_FILE;

BLOG_DIR=../../../content/blog/;
BLOGS=($(ls $BLOG_DIR));
for BLOG in "${BLOGS[@]}"
do
  echo "    \"${BASE_URL}/blog/${BLOG}/\"," >> $JSON_FILE;
done

echo "    ]" >> $JSON_FILE;
echo "}" >> $JSON_FILE;

echo "JSON POST body contents:";
cat $JSON_FILE;
echo;

echo "---";
echo "Updating Bing through POST to /IndexNow...";
echo;

curl ${BING_URL}/IndexNow \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$(cat $JSON_FILE)" \
  -i;

echo "---";
echo "Done.";
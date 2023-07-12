#!/usr/bin/bash

BASE_URL="https://www.jpatrickfulton.dev"
BING_API_KEY="8846484b349642449a66629f496422f8"
BING_URL_TO_KEY_FILE="${BASE_URL}/${BING_API_KEY}.txt"
BING_URL="https://www.bing.com"

WORKING_DIR=$( pwd; );
TMP_DIR=$WORKING_DIR"/tmp";

while getopts o: flag
do
  case "${flag}" in
    o) OPERATING_SYSTEM=${OPTARG};;
  esac
done

EASYINDEX_CLI_VERSION="1.0.6";
if [ $OPERATING_SYSTEM == "macos" ]
  then
    EASYINDEX_CLI_OS="darwin_amd64";
  else
    EASYINDEX_CLI_OS="linux_amd64";
fi
EASYINDEX_CLI_URL="https://github.com/usk81/easyindex-cli/releases/download/v${EASYINDEX_CLI_VERSION}/easyindex-cli_${EASYINDEX_CLI_VERSION}_${EASYINDEX_CLI_OS}.tar.gz";

echo "Using operating system: $OPERATING_SYSTEM";
echo "Using easyindex_cli URL: $EASYINDEX_CLI_URL";

if [ ! -d $TMP_DIR ]
  then
    echo "Creating temporary working directory.";
    mkdir $TMP_DIR;
fi

cd $TMP_DIR;

EASYINDEX_CLI=./easyindex-cli
if [ ! -f $EASYINDEX_CLI ]
  then
    echo "Fetching easyindex_cli binary.";
    curl -L $EASYINDEX_CLI_URL | tar xz;
fi

echo "Building URL list from repository structure.";
URL_FILE=urls.csv;
if [ -f $URL_FILE ]
  then
    rm $URL_FILE;
fi

touch $URL_FILE;
echo "url" >> $URL_FILE;
echo "${BASE_URL}/" >> $URL_FILE;

BLOG_DIR=../../content/blog/;
BLOGS=($(ls $BLOG_DIR));
for BLOG in "${BLOGS[@]}"
do
  echo "${BASE_URL}/blog/${BLOG}/" >> $URL_FILE;
done

echo "URL File contents:";
cat $URL_FILE;

echo "---";
echo "Updating Bing through IndexNow...";
$EASYINDEX_CLI indexnow \
  -H $BASE_URL \
  -k $BING_API_KEY \
  -f $BING_URL_TO_KEY_FILE \
  -e $BING_URL \
  --csv $URL_FILE;

echo "Done.";
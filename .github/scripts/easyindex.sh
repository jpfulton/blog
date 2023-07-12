#!/usr/bin/env bash

LOCAL_CREDENTIALS_FILE=../credentials.json
CREDENTIALS_FILE=credentials.json

HOST="www.jpatrickfulton.dev"
BASE_URL="https://${HOST}"

WORKING_DIR=$( pwd; );
TMP_DIR=$WORKING_DIR"/tmp";

while getopts o: flag
do
  case "${flag}" in
    o) OPERATING_SYSTEM=${OPTARG};;
  esac
done

EASYINDEX_CLI_VERSION="1.0.6";
if [[ $OPERATING_SYSTEM == "macos" ]]
  then
    EASYINDEX_CLI_OS="darwin_amd64";
  else
    OPERATING_SYSTEM="linux";
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

if [ -f $LOCAL_CREDENTIALS_FILE ]
  then
    echo "Using local service account credentials.";
    cp $LOCAL_CREDENTIALS_FILE $CREDENTIALS_FILE;
  else
    echo "No local service account credentials file found...";
    echo "Using the GOOGLE_CREDENTIALS_JSON environment variable...";

    if [ -z "${GOOGLE_CREDENTIALS_JSON}" ]
      then
        echo "GOOGLE_CREDENTIALS_JSON is not set or is empty. Exiting.";
        exit 1;
    fi

    touch $CREDENTIALS_FILE;
    echo $GOOGLE_CREDENTIALS_JSON >> $CREDENTIALS_FILE;
fi

echo "Building URL list from repository structure.";
URL_FILE=urls.csv;
if [ -f $URL_FILE ]
  then
    rm $URL_FILE;
fi

touch $URL_FILE;
echo "\"notification_type\",\"url\"" >> $URL_FILE;
echo "\"URL_UPDATED\",\"${BASE_URL}/\"" >> $URL_FILE;

BLOG_DIR=../../../content/blog/;
BLOGS=($(ls $BLOG_DIR));
for BLOG in "${BLOGS[@]}"
do
  echo "\"URL_UPDATED\",\"${BASE_URL}/blog/${BLOG}/\"" >> $URL_FILE;
done

echo "URL File contents:";
cat $URL_FILE;

echo "---";
echo "Updating Google through Indexing API...";
$EASYINDEX_CLI google \
  -d \
  -c $URL_FILE;

echo;
echo "Done.";
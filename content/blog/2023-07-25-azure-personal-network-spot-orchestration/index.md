---
title: "Extend a Personal Network to Azure: Spot Instance Orchestration"
date: 2023-07-25
description: "In the last post, we developed a resilient mechanism to gracefully shutdown an interruptible workflow on an Azure Spot Virtual Machine. In this post, we create an external orchestration to restart the spot instances once capacity has been freed within the Azure data center."
keywords: ["azure", "IaaS", "virtual machine", "virtual networking", "vpn"]
openGraphImage: ../../../src/images/open-graph/azure.png
---

In the <Link to="/blog/2023-07-24-azure-personal-network-spot-instance/">last post</Link>,
we developed a resilient mechanism to gracefully shutdown an interruptible
workflow on an
[Azure Spot Virtual Machine](https://azure.microsoft.com/en-us/products/virtual-machines/spot).
In this post, we create an external orchestration to restart the spot instances
once capacity has been freed within the Azure data center.

import SeriesLinks from "../2023-07-18-azure-personal-network/seriesLinks.js"

<SeriesLinks />

## Table of Contents

## Tag the Virtual Machine(s)

## Create a Service Principal

```sh
#!/usr/bin/env bash

SUBSCRIPTION_ID="";
RESOURCE_GROUP="";
SP_NAME="";

az ad sp create-for-rbac
  --name $SP_NAME \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP \
  --create-cert;
```

```json
{
  "appId": "a77793d9-d99f-4309-a629-150db0977169",
  "displayName": "az-personal-network-monitor-sp",
  "fileWithCertAndPrivateKey": "/Users/josephpfulton/tmp3wenah5y.pem",
  "password": null,
  "tenant": "d3a3db1f-a65f-427b-a6eb-b74b29cd2d56"
}
```

The service principal creation script can be found
[here](https://github.com/jpfulton/example-linux-configs/blob/main/home/jpfulton/create-azure-rbac-sp-for-resource-group.sh).

## Move and Protect the Service Principal PEM

## Install the Monitoring Script

`/usr/local/sbin`

```sh
#!/usr/bin/env bash

RESOURCE_GROUP="personal-network";
SP_APP_ID="a77793d9-d99f-4309-a629-150db0977169"; # REPLACE WITH YOUR SP APPID
SP_TENANT_ID="d3a3db1f-a65f-427b-a6eb-b74b29cd2d56"; # REPLACE WITH YOUR SP TENANTID

# ensure this script is running as root or sudo
if [ $(id -u) -ne 0 ]
  then
    echo "This script must be run as root or in a sudo context. Exiting.";
    exit 1;
fi

CONFIG_DIR="/etc/azure";
LOCK_FILE="${CONFIG_DIR}/deallocation-monitor.lock";
if [ ! -d $CONFIG_DIR ]
 then
  echo "Configuration directory does not exist. Creating...";
  mkdir $CONFIG_DIR;
fi

# This script can be long running. Use a lock file.
if [ -f $LOCK_FILE ]
 then
  echo "Found lock file.";
  RUNNING_PID=$(cat $LOCK_FILE);
  if [ ! -n "$(ps -p $RUNNING_PID -o pid=)" ]
   then
    echo "Lock file is stale. Removing and continuing...";
    rm $LOCK_FILE;
   else
    echo "Another instance of this script is running at PID: ${RUNNING_PID}. Exiting...";
    exit 0;
  fi
 else
  touch $LOCK_FILE;
  echo $BASHPID > $LOCK_FILE;
fi

# Attempt az login using service principal
SP_PEM_FILE="${CONFIG_DIR}/sp.pem";
if [ ! -f $SP_PEM_FILE ]
 then
  echo "Azure Service Principal PEM not found. Create one prior to using this script...";
  rm $LOCK_FILE;
  exit 1;
 else
  az account show > /dev/null 2>&1;
  if [ $? -ne 0 ]
   then
    echo "Logging in with Azure Service Principal PEM...";
    az login \
     --service-principal \
     --username ${SP_APP_ID} \
     --tenant ${SP_TENANT_ID} \
     --password ${SP_PEM_FILE} > /dev/null 2>&1;

    if [ $? -ne 0 ]
     then
      echo "Error: Unable to login. Exiting.";
      rm $LOCK_FILE;
      exit 1;
    fi
   else
    echo "Already logged in to Azure. Continuing...";
  fi
fi

echo "Querying for deallocated VMs tagged for restart after eviction...";
SPOT_ALLOCATION_QUERY="
 [?
  billingProfile.maxPrice != null &&
  powerState == 'VM deallocated' &&
  tags.AttemptRestartAfterEviction &&
  tags.AttemptRestartAfterEviction == 'true'
 ].{Name:name}";

DEALLOCATED_VM_NAMES=$(az vm list -g ${RESOURCE_GROUP} -d -o tsv --query "${SPOT_ALLOCATION_QUERY}");

VM_NAMES_ARRAY=($DEALLOCATED_VM_NAMES);
ARRAY_LENGTH=${#VM_NAMES_ARRAY[@]};

if [ $ARRAY_LENGTH -ge 1 ]
 then
  echo "Found ${ARRAY_LENGTH} deallocated VM(s) tagged for restart after eviction.";

  for (( i=0; i<$ARRAY_LENGTH; i++ ));
  do
   echo "Attempting to start VM: ${VM_NAMES_ARRAY[i]}";
   az vm start -g ${RESOURCE_GROUP} --name ${VM_NAMES_ARRAY[i]};
  done

 else
  echo "No deallocated VMs tagged for restart after eviction discovered.";
fi

## Remove lock file.
rm $LOCK_FILE;
```

A current version of this monitoring and orchestration script can be found
[here](https://github.com/jpfulton/example-linux-configs/blob/main/usr/local/sbin/monitor-and-restart-spot-vms.sh).

## Install the Crontab Snippet

```sh
# /etc/cron.d/az-spot-monitor: crontab entries for the az spot vm monitor script

SHELL=/bin/sh
PATH=/usr/sbin:/usr/bin:/sbin:/bin

* * * * * root ( /usr/local/sbin/monitor-and-restart-spot-vms.sh ) 2>&1 | logger -t az-spot-monitor

```

A current version of this crontab snippet can be found
[here](https://github.com/jpfulton/example-linux-configs/blob/main/etc/cron.d/az-spot-monitor).

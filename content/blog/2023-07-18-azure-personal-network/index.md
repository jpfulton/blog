---
title: "Extend a Personal Network to Azure: Overview"
date: 2023-07-18
description: "This series of posts examines the creation of a hybrid workflow between an on-premise network and cloud hosted virtual network connected by virtual private networking technology. An emphasis will be placed on managing cloud costs while maintaining performance and security. While the example is based on bridging a home network with cloud resources, an adaptation of the example can easily be applied to small business networks and applications."
keywords:
  [
    "azure",
    "IaaS",
    "virtual machine",
    "virtual network",
    "vpn",
    "hybrid workflow",
    "azure cli",
  ]
openGraphImage: ../../../src/images/open-graph/azure.png
---

In a world of cloud computing and remote work,
[hybrid](https://azure.microsoft.com/en-in/resources/cloud-computing-dictionary/what-are-private-public-hybrid-clouds/)
workflows and bridges
between on-premise networks and cloud-based virtual networks are becoming
more common.

This series of posts examines the creation of a hybrid workflow between an
on-premise network and cloud hosted virtual network connected by
[virtual private networking](https://en.wikipedia.org/wiki/Virtual_private_network)
technology. An emphasis will be placed on managing cloud
costs while maintaining performance and security. While the example is based
on bridging a home network with cloud resources, an adaptation of the example
can easily be applied to small business networks and applications.

Using [Microsoft Azure](https://azure.microsoft.com/en-us) as a cloud provider,
this series will discuss the creation of an
[infrastructure-as-a-service](https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-azure/azure-iaas/)
hybrid workflow that connects an on-premise network to a cloud network. Within
the cloud network, a series of virtual machines will be created to provide backup
and network services to workstations on the local network.

import SeriesLinks from "./seriesLinks.js"

<SeriesLinks />

## Table of Contents

## Prerequisites

The series makes a series of assumptions for a user that is following along.
It assumes:

- You have already signed up for Azure and have an active subscription
- You have either a macOS or linux workstation from which you are working
- You have installed the Azure CLI to your workstation
- You have a basic working knowledge of the `bash` shell

The steps needed to cover these prerequisites are covered in sections below.

## Existing On-premise Network Structure

For reference, the on-premise network is structured in the
`10.0.0.0/16` address space. It includes several separate subnets
that are described below.

| Subnet       | Name      | Description               |
| ------------ | --------- | ------------------------- |
| 10.0.0.0/24  | Wifi      | Wifi Network Clients      |
| 10.0.10.0/24 | Wired LAN | Wired LAN Clients         |
| 10.0.11.0/24 | OpenVPN   | OpenVPN Network Clients   |
| 10.0.12.0/24 | WireGuard | WireGuard Network Clients |

## Target Cloud Network Structure

To avoid address space conflicts and routing tricks, the cloud network
will be created on a complementary address space: `10.10.0.0/16`. Its
subnet design will follow the table below.

| Subnet        | Name    | Description             |
| ------------- | ------- | ----------------------- |
| 10.10.0.0/24  | Default | Default Subnet          |
| 10.10.10.0/24 | OpenVPN | OpenVPN Network Clients |

## Get a Jump on Things

While these steps are covered in posts within the series, to accelerate
the process of following along, you can take the following steps in
advance to prepare a local workstation and an Azure subscription.

### Install the Azure CLI

The Azure CLI is used throughout the series and is a valuable tool
for interacting with an Azure environment.

On macOS,
[Homebrew](https://brew.sh)
can be used with this
[guide](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-macos)
to install the Azure CLI. On a linux workstation, _**following**_ careful review,
this
[script](https://github.com/jpfulton/example-linux-configs/blob/main/home/jpfulton/install-az-cli-with-extensions.sh)
can be used to install the Azure CLI and other
extensions that will be used along the way. Alternatively, these
[manual steps](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-linux?pivots=apt#option-2-step-by-step-installation-instructions)
can be applied to get the Azure CLI installed.

### Prepare an Azure Subscription

The Azure subscription that you use to follow the guides in this series
may require some features and providers to be enabled. The next sections
cover listing those providers and features. Missing ones can then be enabled
as needed.

#### List the Registered Providers

The next command uses the Azure CLI to list registered providers
for a subscription. The main providers used in this series are
`Microsoft.Compute` and `Microsoft.Network`. Look for those in the output.
Should they missing, use this
[guide](https://learn.microsoft.com/en-us/cli/azure/provider?view=azure-cli-latest#az-provider-register)
from Microsoft to get the registered.

```bash {13, 23}{outputLines:2-37}{numberLines: true}
az provider list --query "sort_by([?registrationState=='Registered'].{Namespace: namespace, Registered: registrationState}, &Namespace)" -o table
Namespace                           Registered
----------------------------------  ------------
Microsoft.ADHybridHealthService     Registered
Microsoft.Advisor                   Registered
Microsoft.AlertsManagement          Registered
Microsoft.Authorization             Registered
Microsoft.AzureActiveDirectory      Registered
Microsoft.Billing                   Registered
Microsoft.ChangeAnalysis            Registered
Microsoft.ClassicSubscription       Registered
Microsoft.Commerce                  Registered
Microsoft.Compute                   Registered
Microsoft.Consumption               Registered
Microsoft.CostManagement            Registered
Microsoft.Diagnostics               Registered
Microsoft.EventGrid                 Registered
Microsoft.Features                  Registered
Microsoft.GuestConfiguration        Registered
Microsoft.ManagedIdentity           Registered
Microsoft.MarketplaceNotifications  Registered
Microsoft.MarketplaceOrdering       Registered
Microsoft.Network                   Registered
Microsoft.OperationalInsights       Registered
Microsoft.OperationsManagement      Registered
Microsoft.PolicyInsights            Registered
Microsoft.Portal                    Registered
Microsoft.ResourceGraph             Registered
Microsoft.ResourceHealth            Registered
Microsoft.Resources                 Registered
Microsoft.Security                  Registered
Microsoft.SerialConsole             Registered
Microsoft.Sql                       Registered
Microsoft.Storage                   Registered
Microsoft.Web                       Registered
microsoft.insights                  Registered
microsoft.support                   Registered
```

#### List the Enabled Features of Microsoft.Compute

Additionally, the `Microsoft.Compute/EncryptionAtHost` feature of the
`Microsoft.Compute` provider is needed in this series to enable
end-to-end managed disk encryption from the virtual machines to the
Azure storage system. Use the following command to see if it is registered
for your subscription.

```bash {4}{outputLines: 2-4}{numberLines: true}
az feature list --namespace Microsoft.Compute --query "[?properties.state=='Registered'].{Name: name, Registered: properties.state}" -o table
Name                                Registered
----------------------------------  ------------
Microsoft.Compute/EncryptionAtHost  Registered
```

If the feature is missing from the output of the command, use the steps in
the next section.

#### Enable the Encrypt at Host Azure Feature

Following the Azure
[documentation](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-host-based-encryption-portal?tabs=azure-cli),
run the following commands to leverage the Azure CLI to enable
`EncryptionAtHost` for the subscription.

```bash {outputLines: 3-11}
az login
az feature register --name EncryptionAtHost  --namespace Microsoft.Compute
Once the feature 'EncryptionAtHost' is registered, invoking 'az provider register -n Microsoft.Compute' is required to get the change propagated
{
  "id": "/subscriptions/4913be3f-a345-4652-9bba-767418dd25e3/providers/Microsoft.Features/providers/Microsoft.Compute/features/EncryptionAtHost",
  "name": "Microsoft.Compute/EncryptionAtHost",
  "properties": {
    "state": "Registering"
  },
  "type": "Microsoft.Features/providers/features"
}
```

Check the status of the registration using the following command.
Wait a few minutes until the output shows `Registered`.

```bash {outputLines: 2-9}
az feature show --name EncryptionAtHost --namespace Microsoft.Compute
{
  "id": "/subscriptions/4913be3f-a345-4652-9bba-767418dd25e3/providers/Microsoft.Features/providers/Microsoft.Compute/features/EncryptionAtHost",
  "name": "Microsoft.Compute/EncryptionAtHost",
  "properties": {
    "state": "Registered"
  },
  "type": "Microsoft.Features/providers/features"
}
```

Propagate the change per output of earlier command.

```bash
az provider register -n Microsoft.Compute
```

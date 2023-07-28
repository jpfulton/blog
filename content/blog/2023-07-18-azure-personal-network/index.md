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
  ]
openGraphImage: ../../../src/images/open-graph/azure.png
---

In a world of cloud computing and remote work, hybrid workflows and bridges
between on-premise networks and cloud-based virtual networks are becoming
more common.

This series of posts examines the creation of a hybrid workflow between an
on-premise network and cloud hosted virtual network connected by virtual
private networking technology. An emphasis will be placed on managing cloud
costs while maintaining performance and security. While the example is based
on bridging a home network with cloud resources, an adaptation of the example
can easily be applied to small business networks and applications.

Using [Microsoft Azure](https://azure.microsoft.com/en-us) as a cloud provider,

[Firewalla](https://firewalla.com)

import SeriesLinks from "./seriesLinks.js"

<SeriesLinks />

## Table of Contents

## Prerequisites

## Existing Network Structure

`10.0.0.0/16`

| Subnet       | Name      | Description               |
| ------------ | --------- | ------------------------- |
| 10.0.0.0/24  | Wifi      | Wifi Network Clients      |
| 10.0.10.0/24 | Wired LAN | Wired LAN Clients         |
| 10.0.11.0/24 | OpenVPN   | OpenVPN Network Clients   |
| 10.0.12.0/24 | WireGuard | WireGuard Network Clients |

## Target Cloud Network Structure

`10.10.0.0/16`

| Subnet        | Name    | Description             |
| ------------- | ------- | ----------------------- |
| 10.10.0.0/24  | Default | Default Subnet          |
| 10.10.10.0/24 | OpenVPN | OpenVPN Network Clients |

## Get a Jump on Things

### Install the Azure CLI

[macOS guide](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-macos)

[script](https://github.com/jpfulton/example-linux-configs/blob/main/home/jpfulton/install-az-cli-with-extensions.sh)

### Prepare an Azure Subscription

#### List the Registered Providers

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

```bash {4}{outputLines: 2-4}{numberLines: true}
az feature list --namespace Microsoft.Compute --query "[?properties.state=='Registered'].{Name: name, Registered: properties.state}" -o table
Name                                Registered
----------------------------------  ------------
Microsoft.Compute/EncryptionAtHost  Registered
```

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

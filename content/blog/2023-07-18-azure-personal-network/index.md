---
title: "Extend a Personal Network to Azure: Overview"
date: 2023-07-18
description: ""
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
more and more common.

This series of posts examines the creation of a hybrid workflow between an
on-premise network and cloud hosted virtual network connected by virtual
private networking technology. An emphasis will be placed on managing cloud
costs while maintaining performance and security. While the example is based
on bridging a home network with cloud resources, an adaptation of the example
can easily be applied to small business networks and applications.

[Microsoft Azure](https://azure.microsoft.com/en-us)

import SeriesLinks from "./seriesLinks.js"

<SeriesLinks />

## Table of Contents

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

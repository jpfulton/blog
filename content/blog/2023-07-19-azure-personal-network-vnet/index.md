---
title: "Extend a Personal Network to Azure: Virtual Networking"
date: 2023-07-19
description: ""
keywords: ["azure", "IaaS", "virtual machine", "virtual networking", "vpn"]
openGraphImage: ../../../src/images/open-graph/azure.png
---

- Overview and Objectives
- Virtual Networking and VPN Gateway
- Virtual Machine for Samba
- Replace Azure VPN Gateway with an OpenVPN Server
- Setup Firewalla OpenVPN Server Connection
- Right-size the Virtual Machines
- Resize the Managed Backup Data Disk

## Table of Contents

## Create a Resource Group

![Create Resource Group Screenshot](./resource-group/azure-create-resource-group-2.png)

## Create a Virtual Network

![Create a Virtual Network Screenshot](./vnet/azure-create-virtual-network.png)

![Create a Virtual Network Screenshot 2](./vnet/azure-create-virtual-network-2.png)

![Create a Virtual Network Screenshot 3](./vnet/azure-create-virtual-network-3.png)

## Create and Link a Private DNS Zone

![Create a Private DNS Zone](./private-dns-zone/azure-create-private-dns-zone.png)

![Create a Private DNS Zone 2](./private-dns-zone/azure-create-private-dns-zone-2.png)

![Private DNS Zone Screenshot](./private-dns-zone/azure-private-dns-zone.png)

![Link Zone to Virtual Network](./private-dns-zone/azure-private-dns-zone-add-vnet-link.png)

## Create a NAT Gateway

![Create a NAT Gateway](./nat-gateway/azure-create-nat-gateway.png)

![Create a NAT Gateway 2](./nat-gateway/azure-create-nat-gateway-2.png)

![Create a NAT Gateway 3](./nat-gateway/azure-create-nat-gateway-3.png)

## Create a VPN Gateway

[documentation](https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal)

[generate certs documentation](https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-certificates-point-to-site-linux)

[create client configs documentation](https://learn.microsoft.com/en-us/azure/vpn-gateway/point-to-site-vpn-client-cert-linux)

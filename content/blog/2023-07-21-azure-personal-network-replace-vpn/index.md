---
title: "Extend a Personal Network to Azure: OpenVPN Server"
date: 2023-07-21
description: ""
keywords: ["azure", "IaaS", "virtual machine", "virtual networking", "vpn"]
openGraphImage: ../../../src/images/open-graph/azure.png
---

import SeriesLinks from "../2023-07-18-azure-personal-network/seriesLinks.js"

<SeriesLinks />

## Table of Contents

## Create a Virtual Machine

![Create Virtual Machine](./openvpn-server/create-vm.png)

![Create Virtual Machine Step 2](./openvpn-server/create-vm-2.png)

![Create Virtual Machine Step 3](./openvpn-server/create-vm-3.png)

![Create Virtual Machine Step 4](./openvpn-server/create-vm-4.png)

## Configure the Virtual Machine

### Update all Packages

```bash
sudo apt update
sudo apt list --upgradeable
sudo apt upgrade
```

### Set up Local Firewall

[doc on disabling ipv6 rules](https://tecadmin.net/setup-ufw-for-firewall-on-ubuntu-and-debian/#:~:text=Enable%2FDisable%20IPv6,yes”%20or%20“no”.&text=After%20making%20changes%20disable%20and%20enable%20the%20firewall%20to%20apply%20changes.)

```bash {outputLines: 2-3, 5-6, 8-12}
sudo ufw allow ssh
port 22
Rules updated
sudo ufw enable
Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
Firewall is active and enabled on system startup
sudo ufw status numbered
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    Anywhere
```

Note that the Azure NSG will prevent access to SSH from the public IP.
This is useful for quickly enabling external access if needed in a pinch.

### Set up OpenVPN Server

[documentation](https://ubuntu.com/server/docs/service-openvpn)

```bash
sudo apt install openvpn easy-rsa
```

### Generate Certificates and Keys

```bash
sudo -s
cd /etc/openvpn/easy-rsa
./easyrsa init-pki
./easyrsa build-ca
./easyrsa gen-req ubuntu-vpn-server nopass
./easyrsa gen-dh
./easyrsa sign-req server ubuntu-vpn-server
cp pki/dh.pem pki/ca.crt pki/issued/ubuntu-vpn-server.crt pki/private/ubuntu-vpn-server.key /etc/openvpn/

./easyrsa gen-req home-client nopass
./easyrsa sign-req client home-client
exit
```

```bash
cd /etc/openvpn
sudo openvpn --genkey secret ta.key
```

Edit `/etc/sysctl.conf`` and uncomment the following line to enable IP forwarding.

`#net.ipv4.ip_forward=1`

Then reload sysctl.

```bash
sudo sysctl -p /etc/sysctl.conf
```

### Configure the Server

#### Create the OpenVPN Server Configuration File

#### Start the OpenVPN Service

```bash
sudo systemctl start openvpn@homeserver
sudo systemctl status openvpn@homeserver
```

```bash
sudo journalctl -u openvpn@homeserver -xe
```

#### Create a DNS Entry for the Server Public IP

#### Configure the Local Server Firewall

```bash {outputLines: 3-8}
sudo ufw allow proto udp from 0.0.0.0/0 to any port 1194
sudo ufw status numbered
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    Anywhere
[ 2] 1194/udp                   ALLOW IN    Anywhere
```

```bash {outputLines: 3-9}
sudo ufw route allow in on tun0 out on eth0
sudo ufw status numbered
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    Anywhere
[ 2] 1194/udp                   ALLOW IN    Anywhere
[ 3] Anywhere on eth0           ALLOW FWD   Anywhere on tun0
```

`/etc/ufw/before.rules` Add to top of file

```sh
# NAT table rules
*nat
:POSTROUTING ACCEPT [0:0]

# Forward traffic through eth0 - Change to match your out-interface
-A POSTROUTING -s 10.10.10.0/24 -o eth0 -j MASQUERADE

# don't delete the 'COMMIT' line or these nat table rules won't
# be processed
COMMIT
# End NAT table rules
```

```bash
sudo ufw disable && sudo ufw enable
```

#### Configure the Server Public IP Network Security Group

![Configure Network Security Group](./openvpn-server/configure-nsg.png)

### Configure the Client

### Create the Client Configuration File

`/etc/openvpn/ca.crt`

`/etc/openvpn/ta.key`

`/etc/openvpn/easy-rsa/pki/issued/home-client.crt`

`/etc/openvpn/easy-rsa/pki/private/home-client.key`

### Copy the Client Configuration File to Local

```bash
scp -i ~/.ssh/ubuntu-vpn-server_key.pem jpfulton@ubuntu-vpn-server.private.jpatrickfulton.com:/home/jpfulton/azure-personal-network.ovpn .
```

## Tear Down the Azure Virtual Network Gateway

### Remove the Virtual Network Gateway Resource

![Remove Network Gateway](./remove-vpn-gateway/delete-vpn-gateway.png)

### Remove the Public IP

![Remove Public IP](./remove-vpn-gateway/delete-public-ip.png)

### Remove the Gateway Subnet from the Virtual Network

![Remove Gateway Subnet](./remove-vpn-gateway/delete-gateway-subnet.png)

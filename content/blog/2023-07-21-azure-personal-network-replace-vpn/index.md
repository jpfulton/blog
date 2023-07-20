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

## Replace Azure Network Gateway with a Linux OpenVPN Server

### Update all Packages

```bash
sudo apt update
sudo apt list --upgradeable
sudo apt upgrade
```

### Set up Local Firewall

```bash {outputLines: 2-3, 5-6, 8-12}
sudo ufw allow proto tcp from 10.10.0.0/16 to any port 22
port 22
Rules updated
sudo ufw enable
Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
Firewall is active and enabled on system startup
sudo ufw status numbered
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    10.10.0.0/16
```

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

#### Create a DNS Entry for the Server Public IP

#### Configure the Local Server Firewall

```bash {outputLines: 3-9}
sudo ufw allow proto udp from 0.0.0.0/0 to any port 1194
sudo ufw status numbered
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    10.10.0.0/16
[ 2] 22/tcp                     ALLOW IN    172.16.0.0/24
[ 3] 1194/udp                   ALLOW IN    Anywhere
```

```bash {outputLines: 3-10}
sudo ufw route allow in on tun0 out on eth0
sudo ufw status numbered
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    10.10.0.0/16
[ 2] 22/tcp                     ALLOW IN    172.16.0.0/24
[ 3] 1194/udp                   ALLOW IN    Anywhere
[ 4] Anywhere on eth0           ALLOW FWD   Anywhere on tun0
```

`/etc/ufw/before.rules` Add to top of file

```sh
# NAT table rules
*nat
:POSTROUTING ACCEPT [0:0]

# Forward traffic through eth0 - Change to match you out-interface
-A POSTROUTING -s 10.10.8.0/24 -o eth0 -j MASQUERADE

# don't delete the 'COMMIT' line or these nat table rules won't
# be processed
COMMIT
# End NAT table rules
```

```bash
sudo ufw disable && sudo ufw enable
```

#### Configure the Server Public IP Network Security Group

### Configure the Client

### Create the Client Configuration File

`/etc/openvpn/ca.crt`

`/etc/openvpn/ta.key`

`/etc/openvpn/easy-rsa/pki/issued/home-client.crt`

`/etc/openvpn/easy-rsa/pki/private/home-client.key`

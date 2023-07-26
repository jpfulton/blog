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

Firstly, we need to create a virtual machine attached to our existing
virtual network and in the resource group to host the OpenVPN tunnel.
From the Azure portal, navigate to the resource group and select
**Create** from the toolbar. Search for **virtual machine** in the Marketplace
and select **Create**.

On the create virtual machine screen, provide a name for the server, select
`Ubuntu Server 22.04 LTS` as the image and select `Standard_B2s` as the
size. Supply an initial username and then select **Next: Disks**.

![Create Virtual Machine](./openvpn-server/create-vm.png)

On the disks step, change the `OS Disk Type` to
`Standard HDD (locally-redundant storage)`. Move on the networking step.

![Create Virtual Machine Step 2](./openvpn-server/create-vm-2.png)

On the networking step, select the virtual network resource and ensure
a new public IP address is created for the NIC. Move on to the management
step.

![Create Virtual Machine Step 3](./openvpn-server/create-vm-3.png)

From the management step, select the `Login with Azure AD` checkbox
and then select **Review + create** to validate and complete the deployment.
The PEM file will be downloaded at the start of the process.

![Create Virtual Machine Step 4](./openvpn-server/create-vm-4.png)

## Configure the Virtual Machine

### Login via SSH using the PEM File

Move the PEM file downloaded during the deployment to your `~/.ssh` folder
and use it to log into the newly created server. The username must match
the one you selected during the virtual machine creation process and the private
IP may be found on the **Networking** tab on the newly created virtual machine
in the portal.

```bash
ssh -i ~/.ssh/ubuntu-vpn-server_key.pem username@10.10.0.5
```

### Update all Packages

Update the packages from the base image using the following commands.

```bash
sudo apt update
sudo apt list --upgradeable
sudo apt upgrade
```

### Set up Local Firewall

Next, we need to set up the local firewall. Neither the on-premise network
nor the virtual network use IPv6. As a result, we should disable IPv6 on
the firewall using the following this
[guide](https://tecadmin.net/setup-ufw-for-firewall-on-ubuntu-and-debian/).

Set up a rule to allow ssh and enable the firewall with the following
commands.

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

Note that the Azure NSG will prevent access to ssh from the public IP.
This is particularly useful for quickly enabling external access by modifying the
NSG in a pinch.

### Install the OpenVPN and Easy-RSA Packages

Use the package manager to install the `openvpn` and `easy-rsa` packages.
The `easy-rsa` package will be used for generating keys for the tunnel.

```bash
sudo apt install openvpn easy-rsa
```

### Generate Certificates and Keys

The first step is to copy the `easy-rsa` scripts to the `/etc/openvpn`
folder and create a certificate authority folder.

```bash
sudo make-cadir /etc/openvpn/easy-rsa
```

Enter an interactive shell as root for the following steps with
this command.

```bash
sudo -s
```

Navigate to the `/etc/openvpn/easy-rsa` folder. The following commands
initialize the public key infrastructure and generates a certificate
authority that will be used to sign subsequent public / private key pairs.

```bash
cd /etc/openvpn/easy-rsa
./easyrsa init-pki
./easyrsa build-ca
```

Next, we need to create a set of
[Diffie Hellman parameters](https://en.wikipedia.org/wiki/Diffie–Hellman_key_exchange)
to be used by the server.

```bash
./easyrsa gen-dh
```

Finally, we generate a certificate for the the server and sign it
with the certificate authority.

```bash
./easyrsa gen-req ubuntu-vpn-server nopass
./easyrsa sign-req server ubuntu-vpn-server
```

Copy the outputs of the previous command to the `/etc/openvpn` folder
where they will be used in the OpenVPN server configuration file.

```bash
cp pki/dh.pem pki/ca.crt pki/issued/ubuntu-vpn-server.crt pki/private/ubuntu-vpn-server.key /etc/openvpn/
```

With the server certificates and Diffie Hellman parameters ready for the
server configuration, we need to create a certificate for the client. Ideally,
each OpenVPN client will use a separate certificate to allow them to be
identified by the server and also revoked if needed. The outputs from
these commands will be used in separate step when creating the client
configuration file.

```bash
./easyrsa gen-req home-client nopass
./easyrsa sign-req client home-client
```

Exit the interactive shell.

```bash
exit
```

The last secret needed for the OpenVPN configuration is a
TLS authorization key. This key will be used in
[TLS authentication](https://openvpn.net/community-resources/hardening-openvpn-security/)
where it will participate in the creation of an
[HMAC](https://en.wikipedia.org/wiki/HMAC) signature for all SSL/TLS
handshake packets to mitigate DoS attacks against the server.
That secret is generated with the following commands.

```bash
cd /etc/openvpn
sudo openvpn --genkey secret ta.key
```

### Configure the Server

- `HMAC` packet signature validation using a pre-shared key and `SHA256` hashing
- `AES-256-GCM` data channel cipher
- Disallows reuse of client certificates
- Drops to unprivileged execution context following initialization

#### Create the OpenVPN Server Configuration File

Create a server configuration file based on this example in
`/etc/openvpn` folder. Line 1 needs to be configured to represent the
subnet on which VPN clients will receive their IP addresses. Line 29 requires
configuration to match the address space of the Azure virtual network.

```sh:title=/etc/openvpn/homeserver.conf {1,29}{numberLines: true}
server 10.10.10.0 255.255.255.0
topology subnet

proto udp
port 1194
dev tun

auth SHA256
cipher AES-256-GCM

ca ca.crt
cert server.crt
key server.key  # This file should be kept secret
dh dh.pem
tls-auth ta.key 0 # This file should be kept secret

;duplicate-cn # Uncomment to allow multiple clients using the same cert for debugging
keepalive 10 120
max-clients 5
explicit-exit-notify 1

persist-key
persist-tun

user nobody
group nogroup

# Push a route to the virtual network address space
push "route 10.10.0.0 255.255.0.0"

# Push the internal Azure virtual network DNS server
push "route 168.63.129.16 255.255.255.255"
push "dhcp-option DNS 168.63.129.16"

status /var/log/openvpn/openvpn-status.log
verb 3
```

A current version of this configuration file is available
[here](https://github.com/jpfulton/example-linux-configs/blob/main/etc/openvpn/server.conf).

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

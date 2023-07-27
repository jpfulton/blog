---
title: "Extend a Personal Network to Azure: VPN Gateway"
date: 2023-07-19
description: "The Azure VPN Gateway is a high availability resource designed to provide virtual private networking tunnels to Azure virtual networks. It can be configured to connect an on-premise network to the cloud and also to support point-to-site clients. Among its primary advantages is the ability to manage the resource through the Azure Portal or Azure CLI. In this post, we will create an Azure VPN Gateway to connect an on-premise network to a virtual network in the cloud."
keywords:
  [
    "azure",
    "IaaS",
    "virtual network",
    "openvpn",
    "vpn gateway",
    "strongswan",
    "ipsec",
    "linux",
  ]
openGraphImage: ../../../src/images/open-graph/azure.png
---

The
[Azure VPN Gateway](https://azure.microsoft.com/en-us/products/vpn-gateway)
is a high availability resource designed to provide virtual private networking
tunnels to Azure virtual networks. It can be configured to connect an on-premise
network to the cloud and also to support point-to-site clients. Among its primary
advantages is the ability to manage the resource through the Azure Portal or
Azure CLI. In this post, we will create an Azure VPN Gateway to connect an
on-premise network to a virtual network in the cloud.

With support for OpenVPN, IKEv2 and/or SSTP, the Azure VPN Gateway is implemented
through two or more Azure-managed virtual machines that are placed on a `GatewaySubnet`
within the virtual network.

Selecting the correct SKU is important while setting up the resource. The monthly
cost differences are significant between various models of the resource as are
the capabilities, aggregate bandwidth support and management features. While
the `Basic` SKU is most economical, it has limited features and cannot support
the `IKEv2` and `OpenVPN` tunnel types which provide cross-platform support
in a point-to-site configuration. Additionally, resources of the `Basic` SKU
cannot be resized to other SKUs. They must first be deleted and new resources
in their place. To provide cross-platform support, this post will use the
`VpnGw1`.

As this type of Azure resource is best suited for enterprise applications,
later this post series, we will replace the VPN gateway resource with a
custom implementation based on a self-managed Ubuntu virtual machine. If you
wish to skip ahead, that post is
available <Link to="/blog/2023-07-21-azure-personal-network-replace-vpn/">here</Link>.

import SeriesLinks from "../2023-07-18-azure-personal-network/seriesLinks.js"

<SeriesLinks />

## Table of Contents

## Create a VPN Gateway

From the resource group created in
the <Link to="/blog/2023-07-19-azure-personal-network-vnet/">previous post</Link>,
select **Create** from the toolbar and search for **VPN Gateway** in the marketplace.

Enter a name for the resource, select `VpnGw1` for the SKU and select the correct
virtual network. Select **Review + create** to validate and start the deployment.

![Create VPN Gateway](./vpn-gateway/azure-create-virtual-net-gateway-2.png)

## Configure the VPN Gateway

Once the resource is created, which may take several minutes, there are a number
of configuration steps that must be taken to generate certificates, create
client configuration files and set up the point-to-site feature. These steps
were taken on an on-premise Ubuntu linux server running `Ubuntu 22.04.2 LTS`.
Select a location where the generated keys may be kept _**securely**_ and
revisited as new client certificates are needed.

### Generate a Root Certificate

[generate certs documentation](https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-certificates-point-to-site-linux)

```bash
sudo apt update
sudo apt install strongswan
sudo apt install strongswan-pki
sudo apt install libstrongswan-extra-plugins
sudo apt install libtss2-rc0
```

```bash
ipsec pki --gen --outform pem > caKey.pem
ipsec pki --self --in caKey.pem --dn "CN=VPN CA" --ca --outform pem > caCert.pem
```

```bash
openssl x509 -in caCert.pem -outform der | base64 -w0 > my-root-cert.txt
```

### Configure Point-to-site

![Configure VPN Gateway](./vpn-gateway/azure-config-virtual-net-gateway.png)

## Create a Client Configuration

### Download the Client Configuration Template

![VPN Client Zip Contents](./vpn-gateway/zip-contents.png)

### OpenVPN Client Configuration Template

```sh
client
remote azuregateway-e287007a-007c-45ee-bbd1-a9f9f4ac4e9a-55b827be7af2.vpn.azure.com 443
verify-x509-name 'e287007a-007c-45ee-bbd1-a9f9f4ac4e9a.vpn.azure.com' name
remote-cert-tls server

dev tun
proto tcp
resolv-retry infinite
nobind

auth SHA256
cipher AES-256-GCM
persist-key
persist-tun

tls-timeout 30
tls-version-min 1.2
key-direction 1

log openvpn.log
verb 3

# P2S CA root certificate
<ca>
-----BEGIN CERTIFICATE-----
MIID...
-----END CERTIFICATE-----
</ca>

# Pre Shared Key
<tls-auth>
-----BEGIN OpenVPN Static key V1-----
8a50...
-----END OpenVPN Static key V1-----
</tls-auth>

# P2S client certificate
# Please fill this field with a PEM formatted client certificate
# Alternatively, configure 'cert PATH_TO_CLIENT_CERT' to use input from a PEM certificate file.
<cert>
$CLIENTCERTIFICATE
</cert>

# P2S client certificate private key
# Please fill this field with a PEM formatted private key of the client certificate.
# Alternatively, configure 'key PATH_TO_CLIENT_KEY' to use input from a PEM key file.
<key>
$PRIVATEKEY
</key>
```

### Generate a Client Certificate

[create client configs documentation](https://learn.microsoft.com/en-us/azure/vpn-gateway/point-to-site-vpn-client-cert-linux)

```sh:title=gen-client-key.sh
#!/usr/bin/env bash
PASSWORD="password"
USERNAME="Home"

ipsec pki --gen --outform pem > "${USERNAME}Key.pem"
ipsec pki --pub --in "${USERNAME}Key.pem" | ipsec pki --issue --cacert caCert.pem --cakey caKey.pem --dn "CN=${USERNAME}" --san "${USERNAME}" --flag clientAuth --outform pem > "${USERNAME}Cert.pem"

openssl pkcs12 -in "${USERNAME}Cert.pem" -inkey "${USERNAME}Key.pem" -certfile caCert.pem -export -out "${USERNAME}.p12" -password "pass:${PASSWORD}"
```

```bash
openssl pkcs12 -in "Home.p12" -nodes -out "profileinfo.txt"
```

### Assemble the Client Configuration File

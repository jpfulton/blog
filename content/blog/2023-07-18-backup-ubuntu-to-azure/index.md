---
title: Backup an Ubuntu Desktop to Azure
date: 2023-07-18
description: ""
keywords:
  [
    "Ubuntu",
    "linux",
    "backup",
    "azure",
    "IaaS",
    "virtual machine",
    "virtual networking",
    "vpn",
  ]
openGraphImage: ../../../src/images/open-graph/azure.png
---

## Table of Contents

## Create a Resource Group

## Create a Virtual Network

## Create and Link a Private DNS Zone

`168.63.129.16` Azure DNS Server

## Create a NAT Gateway

## Create a VPN Gateway

[documentation](https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal)

[generate certs documentation](https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-certificates-point-to-site-linux)

[create client configs documentation](https://learn.microsoft.com/en-us/azure/vpn-gateway/point-to-site-vpn-client-cert-linux)

## Create a Data Disk

## Create a Virtual Machine

### Configure the Virtual Machine

### Access the Virtual Machine via SSH

#### Use the Downloaded Private Key

#### Use Azure AD Authentication for SSH

[documentation](https://learn.microsoft.com/en-us/azure/active-directory/devices/howto-vm-sign-in-azure-ad-linux#configure-role-assignments-for-the-vm)

```bash {outputLines: 4-37}
az login
az extension add --name ssh
az extension show --name ssh
{
  "extensionType": "whl",
  "metadata": {
    "author": "Microsoft Corporation",
    "author_email": "azpycli@microsoft.com",
    "azext.isPreview": false,
    "azext.minCliCoreVersion": "2.45.0",
    "classifiers": [
      "Development Status :: 4 - Beta",
      "Intended Audience :: Developers",
      "Intended Audience :: System Administrators",
      "Programming Language :: Python",
      "Programming Language :: Python :: 3",
      "Programming Language :: Python :: 3.6",
      "Programming Language :: Python :: 3.7",
      "Programming Language :: Python :: 3.8",
      "License :: OSI Approved :: MIT License"
    ],
    "description": "SSH into Azure VMs using RBAC and AAD OpenSSH Certificates.  The client generates (or uses existing) OpenSSH keys that are then signed by AAD into OpenSSH certificates for access to Azure VMs with the AAD Extension installed.\n",
    "filename": "/Users/josephpfulton/.azure/cliextensions/ssh/ssh-2.0.0.dist-info",
    "home_page": "https://github.com/Azure/azure-cli-extensions/tree/main/src/ssh",
    "license": "MIT",
    "metadata_version": "2.0",
    "name": "ssh",
    "requires_dist": [
      "oschmod (==0.3.12)"
    ],
    "summary": "SSH into Azure VMs using RBAC and AAD OpenSSH Certificates",
    "version": "2.0.0"
  },
  "name": "ssh",
  "path": "/Users/josephpfulton/.azure/cliextensions/ssh",
  "version": "2.0.0"
}
```

```bash
az ssh vm --ip 10.10.0.4
```

### Update All Packages

```bash
sudo apt update
sudo apt list --upgradeable
sudo apt upgrade
```

### Mount and Format the Data Disk

```bash {2}{numberLines: true}{outputLines: 2-8}
ls -la /dev/sd*
brw-rw---- 1 root disk 8,  0 Jul 18 03:06 /dev/sda
brw-rw---- 1 root disk 8, 16 Jul 18 03:06 /dev/sdb
brw-rw---- 1 root disk 8, 17 Jul 18 03:06 /dev/sdb1
brw-rw---- 1 root disk 8, 30 Jul 18 03:06 /dev/sdb14
brw-rw---- 1 root disk 8, 31 Jul 18 03:06 /dev/sdb15
brw-rw---- 1 root disk 8, 32 Jul 18 03:06 /dev/sdc
brw-rw---- 1 root disk 8, 33 Jul 18 03:06 /dev/sdc1
```

```bash {6}{numberLines: true}{outputLines: 2-13}
lsblk
NAME    MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop0     7:0    0  63.4M  1 loop /snap/core20/1950
loop1     7:1    0 111.9M  1 loop /snap/lxd/24322
loop2     7:2    0  53.3M  1 loop /snap/snapd/19457
sda       8:0    0   512G  0 disk
sdb       8:16   0    30G  0 disk
├─sdb1    8:17   0  29.9G  0 part /
├─sdb14   8:30   0     4M  0 part
└─sdb15   8:31   0   106M  0 part /boot/efi
sdc       8:32   0     8G  0 disk
└─sdc1    8:33   0     8G  0 part /mnt
sr0      11:0    1   628K  0 rom
```

```bash
sudo fdisk /dev/sda
```

`p` to view current partitions

`n` then `p` to create a new primary partition, accept defaults

`sudo mkfs.ext4 /dev/sda1`

`sudo mkdir /backup`

`sudo mount -t ext4 -o rw /dev/sda1 /backup`

```bash {6-7}{numberLines: true}{outputLines: 2-14}
lsblk
NAME    MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop0     7:0    0  63.4M  1 loop /snap/core20/1950
loop1     7:1    0 111.9M  1 loop /snap/lxd/24322
loop2     7:2    0  53.3M  1 loop /snap/snapd/19457
sda       8:0    0   512G  0 disk
└─sda1    8:1    0   512G  0 part /backup
sdb       8:16   0    30G  0 disk
├─sdb1    8:17   0  29.9G  0 part /
├─sdb14   8:30   0     4M  0 part
└─sdb15   8:31   0   106M  0 part /boot/efi
sdc       8:32   0     8G  0 disk
└─sdc1    8:33   0     8G  0 part /mnt
sr0      11:0    1   628K  0 rom
```

Edit `/etc/fstab` with `sudo vim /etc/fstab`

```sh:title=/etc/fstab {5}{numberLines: true}
# CLOUD_IMG: This file was created/modified by the Cloud Image build process
UUID=1c12acfb-8f0c-440f-b6b7-6c22c1f36e1e /  ext4 discard,errors=remount-ro 0 1
UUID=B6C3-B75F /boot/efi vfat umask=0077 0 1
/dev/disk/cloud/azure_resource-part1 /mnt auto defaults,nofail,x-systemd.requires=cloud-init.service,_netdev,comment=cloudconfig 0 2
/dev/sda1 /backup ext4 rw 0 0
```

Restart with `sudo shutdown -r` to prove fstab changes, won't boot if you failed.

### Encrypt the Disks

[documentation](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/disk-encryption-linux?tabs=azcliazure%2Cenableadecli%2Cefacli%2Cadedatacli)

[encrypt at host documentation](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-host-based-encryption-portal?tabs=azure-powershell)

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

Wait a few minutes or more until the output shows `Registered`.

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

To propagate the change per output of earlier command.

```bash
az provider register -n Microsoft.Compute
```

Stop the virtual machine. Then Disks > Additional Settings > Encryption at host: Yes, Save.

Start the VM. Log in.

### Install Samba

```bash
sudo apt install samba
```

#### Create Dedicated Samba User and Group

```bash
sudo addgroup smbgroup
sudo adduser --system --no-create-home smbuser smbgroup
```

#### Create Share Folders and Change Ownership

```bash {outputLines: 7-12}
cd /backup
sudo mkdir applebackups
sudo mkdir linuxbackups
sudo chown smbuser:smbgroup applebackups
sudo chown smbuser:smbgroup linuxbackups
ls -la
total 32
drwxr-xr-x  5 root    root      4096 Jul 18 04:31 .
drwxr-xr-x 20 root    root      4096 Jul 18 03:51 ..
drwxr-xr-x  2 smbuser smbgroup  4096 Jul 18 04:26 applebackups
drwxr-xr-x  3 smbuser smbgroup  4096 Jul 18 04:45 linuxbackups
drwx------  2 root    root     16384 Jul 18 03:38 lost+found
```

#### Create Samba Users for Share Access

```bash
sudo adduser --no-create-home --shell /sbin/nologin applebackup
sudo smbpasswd -a applebackup
```

```bash
sudo adduser --no-create-home --shell /sbin/nologin linuxbackup
sudo smbpasswd -a linuxbackup
```

#### Edit /etc/samba/smb.conf to Configure Samba

```bash
sudo vim /etc/samba/smb.conf
```

#### Restart the Samba Service

```bash
sudo systemctl restart samba
```

## Monitor Disk Usage

### Monitor from a Command

```bash {outputLines:2-10}
df -H
Filesystem      Size  Used Avail Use% Mounted on
/dev/root        32G  2.5G   29G   8% /
tmpfs           2.1G     0  2.1G   0% /dev/shm
tmpfs           811M  4.7M  806M   1% /run
tmpfs           5.3M     0  5.3M   0% /run/lock
/dev/sdb15      110M  6.4M  104M   6% /boot/efi
/dev/sda1       540G  111G  402G  22% /backup
/dev/sdc1       8.4G   29k  8.0G   1% /mnt
tmpfs           406M  4.1k  406M   1% /run/user/1000
```

### Setup Monitoring and System Status using the MOTD

`/etc/update-motd.d/`

```bash
sudo apt install neofetch
sudo apt install inxi
```

```bash
sudo vim /etc/update-motd.d/01-custom
```

```sh:title=/etc/update-motd.d/01-custom
#!/bin/sh
echo
echo "General System Information:"
echo
/usr/bin/neofetch --disable title --color_blocks off

echo
echo "System Disk Usage:"
/usr/bin/inxi -D -p
```

```bash
sudo chmod a+x /etc/update-motd.d/01-custom
```

Logout and log back in.

```txt
Welcome to Ubuntu 22.04.2 LTS (GNU/Linux 5.15.0-1041-azure x86_64)

General System Information:

            .-/+oossssoo+/-.
        `:+ssssssssssssssssss+:`           OS: Ubuntu 22.04.2 LTS x86_64
      -+ssssssssssssssssssyyssss+-         Host: Virtual Machine Hyper-V UEFI R
    .ossssssssssssssssssdMMMNysssso.       Kernel: 5.15.0-1041-azure
   /ssssssssssshdmmNNmmyNMMMMhssssss/      Uptime: 13 hours, 50 mins
  +ssssssssshmydMMMMMMMNddddyssssssss+     Packages: 793 (dpkg), 4 (snap)
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    Shell: bash 5.1.16
.ssssssssdMMMNhsssssssssshNMMMdssssssss.   Resolution: 1024x768
+sssshhhyNMMNyssssssssssssyNMMMysssssss+   Terminal: run-parts
ossyNMMMNyMMhsssssssssssssshmmmhssssssso   CPU: Intel Xeon E5-2673 v3 (2) @ 2.3
ossyNMMMNyMMhsssssssssssssshmmmhssssssso   Memory: 425MiB / 3863MiB
+sssshhhyNMMNyssssssssssssyNMMMysssssss+
.ssssssssdMMMNhsssssssssshNMMMdssssssss.
 /sssssssshNMMMyhhyyyyhdNMMMNhssssssss/
  +sssssssssdmydMMMMMMMMddddyssssssss+
   /ssssssssssshdmNNNNmyNMMMMhssssss/
    .ossssssssssssssssssdMMMNysssso.
      -+sssssssssssssssssyyyssss+-
        `:+ssssssssssssssssss+:`
            .-/+oossssoo+/-.


System Disk Usage:
Drives:
  Local Storage: total: 550 GiB used: 109.32 GiB (19.9%)
  ID-1: /dev/sda model: Virtual Disk size: 512 GiB
  ID-2: /dev/sdb model: Virtual Disk size: 30 GiB
  ID-3: /dev/sdc model: Virtual Disk size: 8 GiB
Partition:
  ID-1: / size: 28.89 GiB used: 2.62 GiB (9.1%) fs: ext4 dev: /dev/sdb1
  ID-2: /backup size: 502.89 GiB used: 106.7 GiB (21.2%) fs: ext4 dev: /dev/sda1
  ID-3: /boot/efi size: 104.4 MiB used: 6 MiB (5.8%) fs: vfat dev: /dev/sdb15
  ID-4: /mnt size: 7.77 GiB used: 28 KiB (0.0%) fs: ext4 dev: /dev/sdc1
```

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

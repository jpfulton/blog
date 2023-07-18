---
title: Backup an Ubuntu Desktop to Azure
date: 2023-07-18
description: ""
keywords: ["Ubuntu", "linux", "backup", "azure"]
# openGraphImage: ./time-machine.png
---

## Table of Contents

## Create a Resource Group

## Create a Virtual Network

## Create a NAT Gateway

## Create a VPN Gateway

[documentation](https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal)

[generate certs documentation](https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-certificates-point-to-site-linux)

[create client configs documentation](https://learn.microsoft.com/en-us/azure/vpn-gateway/point-to-site-vpn-client-cert-linux)

## Create a Data Disk

## Create a Virtual Machine

## Configure the Virtual Machine

### Update All Packages

`sudo apt update`

`sudo apt list --upgradeable`

`sudo apt upgrade`

### Mount and Format the Data Disk

```bash
ls -la /dev/sd*
brw-rw---- 1 root disk 8,  0 Jul 18 03:06 /dev/sda
brw-rw---- 1 root disk 8, 16 Jul 18 03:06 /dev/sdb
brw-rw---- 1 root disk 8, 17 Jul 18 03:06 /dev/sdb1
brw-rw---- 1 root disk 8, 30 Jul 18 03:06 /dev/sdb14
brw-rw---- 1 root disk 8, 31 Jul 18 03:06 /dev/sdb15
brw-rw---- 1 root disk 8, 32 Jul 18 03:06 /dev/sdc
brw-rw---- 1 root disk 8, 33 Jul 18 03:06 /dev/sdc1
```

```bash
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

```bash
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

```sh
# CLOUD_IMG: This file was created/modified by the Cloud Image build process
UUID=1c12acfb-8f0c-440f-b6b7-6c22c1f36e1e /  ext4 discard,errors=remount-ro 0 1
UUID=B6C3-B75F /boot/efi vfat umask=0077 0 1
/dev/disk/cloud/azure_resource-part1 /mnt auto defaults,nofail,x-systemd.requires=cloud-init.service,_netdev,comment=cloudconfig 0 2
/dev/sda1 /backup ext4 rw 0 0
```

Restart with `sudo shutdown -r` to prove fstab changes, won't boot if you failed.

### Install Samba

#### Create Dedicated Samba User and Group

`sudo addgroup smbgroup`

`sudo adduser --system --no-create-home smbuser smbgroup`

#### Create Share Folders and Change Ownership

```bash
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

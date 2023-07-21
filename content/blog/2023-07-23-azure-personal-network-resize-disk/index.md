---
title: "Extend a Personal Network to Azure: Resize Data Disk"
date: 2023-07-23
description: ""
keywords: ["azure", "IaaS", "virtual machine", "virtual networking", "vpn"]
openGraphImage: ../../../src/images/open-graph/azure.png
---

[Azure guide](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks?tabs=ubuntu)

import SeriesLinks from "../2023-07-18-azure-personal-network/seriesLinks.js"

<SeriesLinks />

## Table of Contents

## Identify the Disk

```bash {outputLines: 2-10}
df -Th
Filesystem     Type   Size  Used Avail Use% Mounted on
/dev/root      ext4    29G  6.9G   23G  24% /
tmpfs          tmpfs  1.9G     0  1.9G   0% /dev/shm
tmpfs          tmpfs  773M  2.6M  771M   1% /run
tmpfs          tmpfs  5.0M     0  5.0M   0% /run/lock
/dev/sda1      ext4   503G  251G  227G  53% /backup
/dev/sdb15     vfat   105M  6.1M   99M   6% /boot/efi
/dev/sdc1      ext4   7.8G   28K  7.4G   1% /mnt
tmpfs          tmpfs  387M  4.0K  387M   1% /run/user/1000
```

```bash {outputLines: 2-6}
sudo ls -alF /dev/disk/azure/scsi1/
total 0
drwxr-xr-x 2 root root  80 Jul 19 15:58 ./
drwxr-xr-x 3 root root 180 Jul 19 15:58 ../
lrwxrwxrwx 1 root root  12 Jul 19 15:58 lun0 -> ../../../sda
lrwxrwxrwx 1 root root  13 Jul 19 15:58 lun0-part1 -> ../../../sda1
```

## Create a Snapshot

## Expand the Disk without Downtime

> You can expand your managed disks without deallocating your VM.
> The host cache setting of your disk doesn't change whether or not you can
> expand a data disk without deallocating your VM.

Only supported for data disks. Check for other criteria in the documentation.

## Detect the Disk Size Change

```bash {outputLines: 2-11}
sudo fdisk -l /dev/sda
Disk /dev/sda: 512 GiB, 549755813888 bytes, 1073741824 sectors
Disk model: Virtual Disk
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disklabel type: dos
Disk identifier: 0x98e21008

Device     Boot Start        End    Sectors  Size Id Type
/dev/sda1        2048 1073741823 1073739776  512G 83 Linux
```

```bash
echo 1 | sudo tee /sys/class/block/sda/device/rescan
```

```bash {outputLines: 2-11}
sudo fdisk -l /dev/sda
Disk /dev/sda: 1 TiB, 1099511627776 bytes, 2147483648 sectors
Disk model: Virtual Disk
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disklabel type: dos
Disk identifier: 0x98e21008

Device     Boot Start        End    Sectors  Size Id Type
/dev/sda1        2048 1073741823 1073739776  512G 83 Linux
```

## Resize the Partition

### Shutdown Samba

```bash
sudo systemctl stop smbd
```

### Unmount the Partition

```bash
sudo umount /dev/sda1
```

### Use fdisk

```bash {outputLines: 2-43}
sudo fdisk /dev/sda
Welcome to fdisk (util-linux 2.37.2).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.


Command (m for help): d
Selected partition 1
Partition 1 has been deleted.

Command (m for help): n
Partition type
   p   primary (0 primary, 0 extended, 4 free)
   e   extended (container for logical partitions)
Select (default p):

Using default response p.
Partition number (1-4, default 1):
First sector (2048-2147483647, default 2048):
Last sector, +/-sectors or +/-size{K,M,G,T,P} (2048-2147483647, default 2147483647):

Created a new partition 1 of type 'Linux' and of size 1024 GiB.
Partition #1 contains a ext4 signature.

Do you want to remove the signature? [Y]es/[N]o: n

Command (m for help): p

Disk /dev/sda: 1 TiB, 1099511627776 bytes, 2147483648 sectors
Disk model: Virtual Disk
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disklabel type: dos
Disk identifier: 0x98e21008

Device     Boot Start        End    Sectors  Size Id Type
/dev/sda1        2048 2147483647 2147481600 1024G 83 Linux

Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.
```

`d`

`n`

Do not remove the signature.

```bash {outputLines: 2-8, 10-12}
sudo e2fsck -f /dev/sda1
e2fsck 1.46.5 (30-Dec-2021)
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
/dev/sda1: 10184/33554432 files (80.3% non-contiguous), 68024720/134217472 blocks
sudo resize2fs /dev/sda1
resize2fs 1.46.5 (30-Dec-2021)
Resizing the filesystem on /dev/sda1 to 268435200 (4k) blocks.
The filesystem on /dev/sda1 is now 268435200 (4k) blocks long.
```

### Remount the Partition

```bash {outputLines: 3-8, 10-18}
sudo mount /dev/sda1 /backup
ls -la /backup/
total 32
drwxr-xr-x  5 root    root      4096 Jul 18 04:31 .
drwxr-xr-x 22 root    root      4096 Jul 19 15:58 ..
drwxr-xr-x  2 smbuser smbgroup  4096 Jul 21 18:54 applebackups
drwxr-xr-x  3 smbuser smbgroup  4096 Jul 18 04:45 linuxbackups
drwx------  2 root    root     16384 Jul 18 03:38 lost+found
df -Th
Filesystem     Type   Size  Used Avail Use% Mounted on
/dev/root      ext4    29G  6.9G   23G  24% /
tmpfs          tmpfs  1.9G     0  1.9G   0% /dev/shm
tmpfs          tmpfs  773M  2.6M  771M   1% /run
tmpfs          tmpfs  5.0M     0  5.0M   0% /run/lock
/dev/sdb15     vfat   105M  6.1M   99M   6% /boot/efi
/dev/sdc1      ext4   7.8G   28K  7.4G   1% /mnt
tmpfs          tmpfs  387M  4.0K  387M   1% /run/user/1000
/dev/sda1      ext4  1007G  251G  706G  27% /backup
```

### Start Samba

```bash
sudo systemctl start smbd
sudo systemctl status smbd
```

## Reboot System

```bash
sudo reboot
```

Log in. Check the mounts. Validate that /dev/sdX devices have not reordered.
Fix /etc/fstab and reboot as necessary.

## Remove the Disk Snapshot

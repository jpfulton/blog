---
title: Samba and macOS Time Machine
date: 2023-06-23
description: "Here is a temporary article description."
keywords: ["Ubuntu", "macOS", "samba", "time machine"]
---

## Samba Configuration

`/etc/samba/smb.conf`.

```sh{numberLines: true}
### Time Machine Compatability ###
min protocol = SMB2
vfs objects = fruit streams_xattr
fruit:metadata = stream
fruit:model = MacSamba
fruit:posix_rename = yes
fruit:veto_appledouble = no
fruit:wipe_intentionally_left_blank_rfork = yes
fruit:delete_empty_adfiles = yes
server min protocol = SMB2
```

```sh{numberLines: true}
### WINS Support ###
wins support = yes
dns proxy = yes
```

```sh{numberLines: true}
[backupshare]
comment = Apple Backup Shared Folder by Samba Server on Ubuntu
path = /mnt/samba/AppleBackups
fruit:time machine = yes
force user = smbuser
force group = smbgroup
read only = no
browseable = yes
create mask = 0664
force create mode = 0664
directory mask = 0775
force directory mode = 0775
```

The complete example configuration file can be found
[here](https://github.com/jpfulton/example-linux-configs/blob/main/etc/samba/smb.conf).

<InArticleAdBlock></InArticleAdBlock>

## macOS Settings

![Time Machine Settings Screenshot](./timemaching-settings.png)

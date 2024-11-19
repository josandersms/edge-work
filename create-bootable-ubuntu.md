# Create a Bootable Ubuntu Image on USB

## Enter chroot environment
```bash
sudo su -
```

## Prerequisites
Install the following prerequisites
```bash
apt install git python3 -y
```

## Create a working directory
```bash
mkdir ubuntu
cd ubuntu
```

## Download the latest ISO
```bash
wget https://releases.ubuntu.com/22.04/ubuntu-22.04.5-live-server-amd64.iso
```

## Mount the ISO locally to copy files
```bash
mkdir mnt
mount -o loop ubuntu-22.04.5-live-server-amd64.iso mnt
```

## Modify the grub boot file

### Copy the existing boot file
```bash
mkdir tmp
cp --no-preserve=all mnt/boot/grub/grub.cfg tmp/grub.cfg
```

### Modify boot file for autoinstall quiet
Modify `tmp/grub.cfg` in the first section “Try or Install Ubuntu Server” to include ‘autoinstall quiet’ after ’linux /casper/vmlinuz.’

```bash
sed -i 's/linux	\/casper\/vmlinuz  ---/linux	\/casper\/vmlinuz autoinstall quiet ---/g' tmp/grub.cfg
```

### Reduce the boot menu timeout
The reduced timeout means that the boot menu prompt is only up for 1 second before moving forward with the ‘autoinstall quiet.’
```bash
sed -i 's/timeout=30/timeout=1/g' tmp/grub.cfg
```

## Rebuild the modified ISO

### Setup lifefs-editor
```bash
apt install xorriso squashfs-tools python3-debian gpg liblz4-tool python3-pip -y
git clone https://github.com/mwhudson/livefs-editor
cd livefs-editor/
python3 -m pip install .
cd ..
```

### Use livefs-edit to create a newly modified ISO
```bash
livefs-edit ubuntu-22.04.5-live-server-amd64.iso ubuntu-22.04.5-live-server-amd64-modded.iso --cp /root/tmp/grub.cfg new/iso/boot/grub/grub.cfg
```

## Copy the ISO to the USB drive

### Plug in the USB drive and find it
Typically, the USB drive is sda, or /dev/sda
```bash
lsblk
```

### Ensure the USB drive is not mounted
```bash
sudo umount /dev/sda /dev/sda1
```

### Copy the contents to the USB drive
```bash
sudo dd bs=4M if=ubuntu-22.04.5-live-server-amd64-modded.iso of=/dev/sda conv=fdatasync status=progress
```

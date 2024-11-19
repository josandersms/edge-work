# Create a Cloud Init USB

## Ensure the USB drive is not mounted
```bash
sudo umount /dev/sda /dev/sda1
```

## Format the USB drive
Note that the USB drive _*must*_ be FAT32
```bash
sudo mkfs.vfat -I -F 32 -n 'CIDATA' /dev/sda
```
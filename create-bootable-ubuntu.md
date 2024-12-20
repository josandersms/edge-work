# Create a Bootable Ubuntu Image on USB

## Create a working directory
```bash
mkdir ubuntu
cd ubuntu
```

## Prerequisites
1. Install the following prerequisites via `apt`
```bash
apt install qemu-utils qemu-system xorriso squashfs-tools git python3-debian gpg liblz4-tool python3-pip -y
```

2. Install livefs-editor 
```bash
git clone https://github.com/mwhudson/livefs-editor
cd livefs-editor
python3 -m pip install .
```

## Download the latest Ubuntu server ISO
```bash
wget https://releases.ubuntu.com/22.04/ubuntu-22.04.5-live-server-amd64.iso
```

## Cloud-init
First, we need to create the necessary cloud-init files for automation and configuration.  
> Examples of cloud-init config can be found at: [https://docs.cloud-init.io/en/latest/reference/examples.html](https://docs.cloud-init.io/en/latest/reference/examples.html)  
>  
> Autoinstall configuration from Ubuntu can be found at: [https://canonical-subiquity.readthedocs-hosted.com/en/latest/reference/autoinstall-reference.html](https://canonical-subiquity.readthedocs-hosted.com/en/latest/reference/autoinstall-reference.html)

### Create the necessary files
Cloud-init requires two files to exist, but only one with actual information. The `meta-data` file will remain empty, but we will place configuration in the `user-data` file.

```bash
touch user-data
touch meta-data
```

### Edit the user-data file
Use your favorite editor and open the user-data file. 

```bash
nano user-data
```
Once open, use the following as a starting configuration.
> NOTE: For the password, you will need to generate this using `mkpasswd` which is part of the `whois` package (`apt install whois`) OR `openssl passwd`. The below example was generated with `mkpasswd --method=SHA-512`.

Some key elements to take note of are:
- `cloud_final_modules` - Required to run Ansible and Ubuntu Drivers as part of cloud-init final.
- `drivers`: `install` - automatically install third party drivers, here we use `true`.
- `identity`: `hostname` - this is the name of the server being loaded, here we use `ubuntu-server`.
- `identity`: `username` - the username for the admin user, here we use `myuser`.
- `identity`: `password` - the hashed password, created with `mkpasswd --method=SHA-512`.
- `keyboard`: `layout` - which keyboard layout to use, here we use `us` and no `variant`.
- `late-commands` - this is an array of comamnds to run after the installation has been completed. Here, we change the grub boot timeout to `5` seconds.
- `locale` - this is the system locale, here we use `en_US`.
- `package_update` - Update the package manager, equivalent of `apt update` on Ubuntu, here we use `true`.
- `package_upgrade` - Upgrade packages in the package manager, equivalent of `apt upgrade -y` on Ubuntu, here we use `true`.
- `packages` - this is an array of packages to have installed automatically.
- `ssh`: `install-server` - whether or not to install the SSH server, here we use `true`.
- `ssh`: `allow-pwd` - whether or not to allow passwords or only allow certificates, here we use `true` to allow passwords.
- `ssh`: `emit_keys_to_console` - we don't want to show any ssh keys on the initial boot, so we use `false` here.
- `storage`: `layout` - we create a recovery partition by specifying `name` of `direct` and `reset-partition` of `true`.
- `user-data`: `ansible` - Because we are in the cloud-init `autoinstall` module, in order to execute additional tasks not supported by the module (such as during the `final` stage of cloud-init), we must place them under the `user-data` section. This is the only method that can be used with `autoinstall` to kick off `Ansible` on first boot/end of install.
- `user-data`: `ansible`: `install_method` - How to install ansible, options are `distro` or `pip`, here we use `distro`.
- `user-data`: `ansible`: `package_name` - Since we are using Ansible Pull, we opt for `ansible-core` here.
- `user-data`: `ansible`: `pull`: `playbook_name` - The playbook to execute, staying in line with typical `ansible-pull` repositories, this is `local.yml`.
- `user-data`: `ansible`: `pull`: `url` - The path to the actual Git repository that stores the Ansible files. This must be appended with the `.git` extension, and will always assume `main` brainch.
- `user-data`: `timezone` - the time zone for the machine, here we use `America/Chicago` for Central time in the United States.
```yaml
#cloud-config
autoinstall:
  version: 1
  cloud_final_modules:
  - ansible
  - ubuntu_drivers
  drivers:
    install: true
  identity:
    hostname: ubuntu-server
    username: myuser
    # "password12345" - created with `mkpasswd --method=SHA-512`
    password: "$6$dFP80U5oilyxAzY6$e4YKVt8jhDVYe08ILgAL66WULgbUsW/g9mmFMxAnUsSHlT9R/vbJexsYeura0U7tVpl4CNvnE9L3.IEmrAOBM0"
  keyboard:
    layout: us
    toggle: null
    variant: ""
  late-commands:
    - sed -ie 's/GRUB_TIMEOUT=.*/GRUB_TIMEOUT=5/' /target/etc/default/grub
  locale: en_US
  package_update: true
  package_upgrade: true
  packages:
    - build-essential
    - curl
    - file
    - git
    - procps
    - wget
  ssh:
    allow-pwd: true
    emit_keys_to_console: false
    install-server: true
  # Enable reset partition
  storage:
    layout:
      name: direct
      reset-partition: true
  user-data:
    ansible:
      install_method: distro
      package_name: ansible-core
      pull:
        playbook_name: local.yml
        url: "https://github.com/josandersms/edge-ansible.git"
    timezone: America/Chicago


```

## Grub boot file
GRUB (also known as GNU GRUB or GNU Grand Unified Bootloader) is a bootloader and boot manager for Linux and other Unix-based OSes. GRUB starts after BIOS finishes the necessary hardware tests and loads it from the Master Boot Record (MBR). Once loaded, GRUB takes control of the system and loads the Linux kernel.

### Create a new Grub boot file
```bash
touch grub.cfg
```

### Modify boot file
Use your favorite editor and open the `grub.cfg` file. 

```bash
nano grub.cfg
```
Once open, use the following as a starting configuration.

Some key elements to take note of are:
- `set timeout=0` - don't wait to begin installation.
- `menuentry "Try or Install Ubuntu Server"` - the `linux /casper/vmlinuz` command is appended with `autoinstall` to kick off auto installation and is directed to look for cloud-init `user-data` and `meta-data` files in the root of the iso. 
> NOTE: To use cloud-init scrips from a remote source, change `ds='nocloud;s=/cdrom/'` to `ds='nocloud;s=https://your-uri-here/path/to/user-data_and_meta-data'`

```
set timeout=0

loadfont unicode

set menu_color_normal=white/black
set menu_color_highlight=black/light-gray

menuentry "Try or Install Ubuntu Server" {
        set gfxpayload=keep
        linux /casper/vmlinuz autoinstall ds='nocloud;s=/cdrom/' ---
        # linux /casper/vmlinuz autoinstall ds='nocloud;s=https://sapocecldevex001.z22.web.core.windows.net/' ---
        initrd /casper/initrd
}
menuentry "Ubuntu Server with the HWE kernel" {
        set gfxpayload=keep
        linux   /casper/hwe-vmlinuz  ---
        initrd  /casper/hwe-initrd
}
grub_platform
if [ "$grub_platform" = "efi" ]; then
menuentry 'Boot from next volume' {
        exit 1
}
menuentry 'UEFI Firmware Settings' {
        fwsetup
}
else
menuentry 'Test memory' {
        linux16 /boot/memtest86+.bin
}
fi
```

## Rebuild the modified ISO
We must rebuild into a modified ISO (with at least our `grub.cfg`). If you are using the integrated option of cloud-init, as in you will be deploying the `user-data` and `meta-data` files with the ISO go to option [A](#option-a---deploy-integrated-cloud-init). If you are using the remote placement of cloud-init, as in you will be placing `user-data` and `meta-data` on an https server for pull, go to option [B](#option-b---deploy-remote-cloud-init).
> NOTE: Do ***NOT*** modify the `/new/iso` path, which is the root of the new iso created by `livefs-edit`.

> NOTE: You can name the output file whatever you'd like, here we are using `ubuntu-22.04.5-live-server-amd64-modified.iso`.

### Option A - Deploy integrated cloud-init
```bash 
sudo livefs-edit ./ubuntu-22.04.5-live-server-amd64.iso ./ubuntu-22.04.5-live-server-amd64-modified.iso --cp ~/ubuntu/grub.cfg new/iso/boot/grub/grub.cfg --cp ~/ubuntu/meta-data new/iso/meta-data --cp ~/ubuntu/user-data new/iso/user-data
```

### Option B - Deploy remote cloud-init
```bash 
sudo livefs-edit ./ubuntu-22.04.5-live-server-amd64.iso ./ubuntu-22.04.5-live-server-amd64-modified.iso --cp ~/ubuntu/grub.cfg new/iso/boot/grub/grub.cfg
```

## Test the installation

### Create a temporary image container
```bash
truncate -s 10G image.img
```

### Start the installation in a VM
> NOTE: The path after `-cdrom` should be the exact name and path that you used previously to create the modified ISO, here it is `~/ubuntu/ubuntu-22.04.5-live-server-amd64-modified.iso`

```bash
sudo kvm -m 2048 -drive file=~/ubuntu/image.img,format=raw,cache=none,if=virtio -cdrom ~/ubuntu/ubuntu-22.04.5-live-server-amd64-modified.iso --cpu host
```

### Wait and login
1. Once the installation has completed, the VM should automatically restart and present a login prompt.  
1. If you're using Ansible as above, the playbook specified will immediately begin executing - once it is complete, you can login (you may have to press `enter` on your keyboard to get the prompt).
1. Use the username and password from the `cloud-init` step before in the `user-data` file.
1. After you have logged in, you can issue `exit` to logout, and then shut down the VM.

## (OPTIONAL) Copy the ISO to the USB drive
If the test was successful, you can copy the ISO to a usb drive if desired.

### Plug in the USB drive and find it
Typically, the USB drive is sda, or /dev/sda
```bash
lsblk
```

### Ensure the USB drive is not mounted
```bash
sudo umount /dev/sda /dev/sda1
```

### (OPTIONAL) Prepare the USB drive
If the target installation device does not support UEFI, then converting the partition table of the USB drive from GPT to MBR will sometimes correct installation issues, particularly in relation to `GRUB Error: can't find command "grub_platform"` which then leads to a blinking cursor black screen after selecting any GRUB entry.

> NOTE: The commands below are sourced from a comment on bug `1905491` at [https://bugs.launchpad.net/ubuntu/+source/casper/+bug/1905491/comments/8](https://bugs.launchpad.net/ubuntu/+source/casper/+bug/1905491/comments/8), please reference this comment for further background and information.

```bash
sudo fdisk -l /dev/sda
sudo gdisk /dev/sda
```

In the prompts following the `gdisk` command, enter `r` for Recovery/transformation menu, then `g` for `convert GPT into MBR and exit`, then `w` for `write the MBR partition table to disk and exit`, and finally `y` for `Finalize and exit`.

Finally, re-check the disk
```bash
sudo fdisk -l /dev/sda
```

### Copy the contents to the USB drive
> NOTE: This assumes that your modified ISO from previous steps was named `ubuntu-22.04.5-live-server-amd64-modified.iso`.

```bash
sudo dd bs=4M if=ubuntu-22.04.5-live-server-amd64-modified.iso of=/dev/sda conv=fdatasync status=progress
```

#
# Copyright (C) 2024-2025 Zexshia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#


# Get module version and author from module.prop
MODVER=$(grep "^version=" "$MODPATH/module.prop" | cut -d '=' -f2)
AUTHOR=$(grep "^author=" "$MODPATH/module.prop" | cut -d '=' -f2)
device_codename=$(getprop ro.product.board)
chip=$(getprop ro.hardware)

# List of system paths to replace (if any)
REPLACE=""

# Display banner
ui_print ""
ui_print "              Konyaku Tweaks             "
ui_print ""
ui_print "- Build Date    : 22/06/2025"
ui_print "- Author        : ${AUTHOR}"
ui_print "- Version       : ${MODVER}"
ui_print "- Device        : $(getprop ro.product.board)"
ui_print "- Build Date    : $(getprop ro.build.date)"

# Check Encore dependencies 
if [ ! -d /data/adb/modules/encore ]; then
  ui_print " "  
  ui_print "- Please install Encore first!"
  abort
  else
  ui_print "- Encore is installed"
fi
ui_print "- Installing..."

# Extracting module files
ui_print "- Creating module directories..."
mkdir -p /data/adb/.config/konyaku
ui_print "- Extracting system directories..."
extract -o "$ZIPFILE" 'system/*' -d "$MODPATH" >&2
ui_print "- Extracting service.sh..."
unzip -o "$ZIPFILE" 'service.sh' -d "$MODPATH" >&2

# Checking bypass
checkpath() {
    if [ -e "$1" ]; then
        return 0 
    fi
    return 1  
}

# Installing toast
if pm list packages | grep -q bellavita.toast; then
    ui_print "- Bellavita Toast is already installed."
else
    ui_print "- Extracting Bellavita Toast..."
    unzip -o "$ZIPFILE" 'toast.apk' -d "$MODPATH" >&2
    ui_print "- Installing Bellavita Toast..."
    pm install "$MODPATH/toast.apk"
    rm "$MODPATH/toast.apk"
fi

# Check device chipset
chipset=$(grep "Hardware" /proc/cpuinfo | uniq | cut -d ':' -f 2 | sed 's/^[ \t]*//')
[ -z "$chipset" ] && chipset="$(getprop ro.board.platform) $(getprop ro.hardware)"
case "$chipset" in
    *mt* | *MT*) 
        soc=1
        ui_print "- Implementing tweaks for MediaTek $chip"
        
        ;;
    *)  
        ui_print "! Unsupported chipset detected: $chipset"
        ui_print "! This is Only for MediaTek."
        abort
        ;;
esac

# Cleanup module directories
rm -rf "$MODPATH/assets"
rm -rf "$MODPATH/toast.apk"

# Final permission setup
ui_print "- Setting Permissions..."
set_perm_recursive "$MODPATH/system/bin" 0 2000 0777 0777
chmod +x "$MODPATH/system/bin/AZenith" 
chmod +x "$MODPATH/system/bin/Zirelia" 
chmod +x "$MODPATH/system/bin/Zirelia_profiler" 
chmod +x "$MODPATH/system/bin/AZenith_Utility" 
chmod +x "$MODPATH/system/bin/bypassCharge" 
chmod +x "$MODPATH/system/bin/preload_sys" 
ui_print "- Installation complete!"

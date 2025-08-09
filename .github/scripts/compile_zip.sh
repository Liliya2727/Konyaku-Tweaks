#!/bin/env bash

if [ -z "$GITHUB_WORKSPACE" ]; then
	echo "This script should only run on GitHub action!" >&2
	exit 1
fi

# Make sure we're on right directory
cd "$GITHUB_WORKSPACE" || {
	echo "Unable to cd to GITHUB_WORKSPACE" >&2
	exit 1
}

# Put critical files and folders here
need_integrity=(
	"mainfiles/system/bin"
	"mainfiles/META-INF"
	"mainfiles/service.sh"
	"mainfiles/uninstall.sh"
	"mainfiles/module.prop"
    "mainfiles/toast.apk"
)

# Version info
version="$(cat version)"
version_code="$(git rev-list HEAD --count)"
release_code="$(git rev-parse --short HEAD)-Release"
sed -i "s/version=.*/version=$version ($release_code)/" modules/module.prop
sed -i "s/versionCode=.*/versionCode=$version_code/" modules/module.prop

# Compile Gamelist
paste -sd '|' - <"$GITHUB_WORKSPACE/gamelist.txt" >"$GITHUB_WORKSPACE/modules/gamelist.txt"

# Copy module files
cp -r ./script/* modules/system/bin
cp -r ./preloadbin/* modules/system/bin
cp LICENSE ./modules

# Remove .sh extension from scripts
find modules/system/bin -maxdepth 1 -type f -name "*.sh" -exec sh -c 'mv -- "$0" "${0%.sh}"' {} \;

# Parse version info to module prop
zipName="Konyaku-Tweaks-$version-$release_code"
echo "zipName=$zipName" >>"$GITHUB_OUTPUT"

# Generate sha256sum for integrity checkup
for file in "${need_integrity[@]}"; do
	bash .github/scripts/generatesha256.sh "$file"
done

# Zip the file
cd ./modules || {
	echo "Unable to cd to ./modules" >&2
	exit 1
}

zip -r9 ../"$zipName" * -x *placeholder* *.map .shellcheckrc
zip -z ../"$zipName" <<EOF
$version-$release_code
Build Date $(date +"%a %b %d %H:%M:%S %Z %Y")
EOF

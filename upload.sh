#!/bin/bash

DEVPATH="dev"
SRCPATH="src"
EXCLUDES="includes.js development.html"

cd $DEVPATH

echo "1) Copying $DEVPATH/* to $SRCPATH/*"
echo "   -> Skipping: $EXCLUDES"
for file in $(ls *); do
	if [[ "$EXCLUDES" != *"$file"* ]]; then
		echo "$file"
	fi
done

cd ..

echo '2) Using gapps to upload'
#gapps upload

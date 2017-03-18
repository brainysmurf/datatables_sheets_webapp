#!/bin/bash

DEVPATH="dev"
SRCPATH="src"
EXCLUDES="development.html"

cd $DEVPATH

echo "1) Copying $DEVPATH/* to $SRCPATH/*"
echo "   -> Skipping: $EXCLUDES"
for file in $(ls *); do
	if [[ "$EXCLUDES" != *"$file"* ]]; then
		cp "$file" "../$SRCPATH/$file"
	fi
done

cd ..

echo '2) Using gapps to upload'
gapps upload

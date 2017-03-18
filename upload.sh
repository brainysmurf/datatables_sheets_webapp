#!/bin/bash

DEVPATH="dev"
SRCPATH="src"

cd $DEVPATH

echo "1) Clearing $SRCPATH"
rm $SRCPATH/*
echo "2) Copying $DEVPATH/* to $SRCPATH/*"
echo '   -> Skipping include.js'
for file in $(ls *); do
	if [ $file != "include.js" ]; then
		cp $file ../$SRCPATH/
	fi
done

cd ..

echo '2) Using gapps to upload'
gapps upload

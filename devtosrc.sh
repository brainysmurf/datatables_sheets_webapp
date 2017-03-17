#!/bin/bash

DEVPATH="dev"
SRCPATH="src"

#trap "rm $SRCPATH/*.ejs; exit" SIGHUP SIGINT SIGTERM

cd $DEVPATH

for file in $(ls *); do
	if [ $file != "include.js" ]; then
		cp $file ../$SRCPATH/
	fi
done

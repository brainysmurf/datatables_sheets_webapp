#!/bin/bash

OLD=`pwd`
DEVPATH="dev"
TESTPATH="test"

trap "echo; echo Removing previously created files; rm $DEVPATH/*.ejs; exit" SIGHUP SIGINT SIGTERM

cd $DEVPATH

echo "Adding .ejs files to $DEVPATH/"
for file in $(ls *.html); do
	ln -s "$file" "${file/%.html/.ejs}"
done

cd ..

nodemon $TESTPATH/server.js
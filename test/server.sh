#!/bin/bash

DEVPATH="dev"
TESTPATH="test"

trap "echo; echo Removing .ejs files; rm $DEVPATH/*.ejs; exit" SIGHUP SIGINT SIGTERM

cd $DEVPATH

echo "Adding .ejs files to $DEVPATH/"
for file in $(ls *.html); do
	ln -s "$file" "${file/%.html/.ejs}"
done

cd ..

nodemon -V 	-w dev -w test $TESTPATH/server.js "$@"
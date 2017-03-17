#!/bin/bash

OLD=`pwd`
SRCPATH="dev"
TESTPATH="test"

trap "rm $SRCPATH/*.ejs; exit" SIGHUP SIGINT SIGTERM

cd $SRCPATH

for file in $(ls *.html); do
	ln -s "$file" "${file/%.html/.ejs}"
done

cd ..

nodemon $TESTPATH/server.js
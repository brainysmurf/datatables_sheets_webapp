# Datatables for Sheets

Proof of concept, using Google sheet as backend, datatable to make a webapp frontend. 

The (simple) app itself does the following for a Google Sheet:

* Using a Google Sheet as a source, display it in a datatable

## Getting Started: Run the app

* Make a new google app *standalone script* on your domain, note the project ID.
* Clone this repo. Note that most of the code lives in `dev/`
* Install node.js
* `npm install`
* Authenticate with [gapps](https://www.npmjs.com/package/node-google-apps-script), init with the project ID noted above
* `./upload`
* Refresh your GAS script to see the code applied.
* In the "interface.gs" file change the ID of an example spreadsheet
* Select "Project" -> "Run as web app"

You can now display spreadsheet data through an instance of datatables

## Getting Started: Develop the app

* Run the app, as above
* Install nodemon to your system path: `npm install nodemon -g`
* Install mocha `npm install mocha`
* Install the dependencies: `npm install`
* Run the app locally, running `test/server.sh`
* Load `http://localhost:8888/Sidebar` in your browser of choice (must support [Proxy](http://caniuse.com/#search=proxy))
* Any changes in the `dev/` folder automatically reflect in the browser (after refresh)
* Publish to the cloud with `./upload`, which copies files to `src/` and then run `gapps upload` for you (which uses `src/` as the source to copy to the cloud)
* Changes are now reflected in the cloud (reload and test)




# Gamified Journal

Example demonstration of a complete Google Apps Script application developed on the local machine, complete with js linting/hinting, unit tests ... it even functions in the browser.

Proof of concept of a local development / push toolchain for Google Apps Scripting. Please note this is currently under active development.

## Getting Started: Run the app

* Make a new google app *standalone script* on your domain, note the project ID.
* Clone this repo. Note that most of the code lives in `dev/`
* Install node.js
* `npm install`
* Authenticate with [gapps](https://www.npmjs.com/package/node-google-apps-script), init with the project ID noted above
* `./upload`
* Refresh your GAS script to see the code applied.
* Select "Project" -> "Test as add on"

You now have a gamified journal running on a document. (Full add-on support has not been completed yet.)

## Getting Started: Develop with the app

* Run the app, as above
* Run the app locally, running `test/server.sh` (Browser must support [Proxy](http://caniuse.com/#search=proxy))
* Any changes in the `dev/` folder automatically reflect in the browser upon saving
* Publish to the cloud with `./upload`, which copies files to `src/` and then run `gapps upload` for you (which uses `src/` as the source to copy to the cloud)
* Changes are now reflected in the cloud (reload and test)

### Screen shots

Tests with Mocha:
`$ npm test`
![alt text][mocha]

Runs locally in the browser:
`$ test/server.sh`
![alt text][browser]


[mocha]: http://brainysmurf.github.io/img/testsWithMocha.png "npm test"
[browser]: http://brainysmurf.github.io/img/runsInBrowser.png "test/server.sh"


# Details

## How does it work?

Lots of mocking. You can write your javascript code as if you were writing for the cloud, but locally calls to things like `google.script.run` are mocked. 

It also uses [gas-local](https://github.com/mzagorny/gas-local) that works by putting the code that works on the cloud as expected, but can be called locally. Templates also have access to that code.

One of the key design decisions that makes this work is the templating package chosen: [ejs](http://ejs.co). That uses a php-style of templating that is very similar to the templating language that Apps Script uses. The minor differences were easy to code up a work-around.

## Why did you make the decision to put code in `dev/` and copy over to `src/`?

Reasons. (To be written.)

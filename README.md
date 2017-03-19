# Gamified Journal

Proof of concept of a local development / push toolchain for Google Apps Scripting. This is an example Google Apps Script application developed on the local machine, complete with js linting/hinting, unit tests ... its features were even tested via a local browser.

The (simple) app itself does the following for a Google Doc:

* Provides a countdown (from 15 minutes)
* Updates the document in the style of a journal
* Reports the number of words typed and how long they spent typing it

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

## Getting Started: Develop the app

* Run the app, as above
* Run the app locally, running `test/server.sh` (Browser must support [Proxy](http://caniuse.com/#search=proxy))
* Any changes in the `dev/` folder automatically reflect in the browser upon saving
* Publish to the cloud with `./upload`, which copies files to `src/` and then run `gapps upload` for you (which uses `src/` as the source to copy to the cloud)
* Changes are now reflected in the cloud (reload and test)

### Screen shots

Tests with Mocha:
`$ npm test`
![alt text][mocha]

Use live, functional tests in the browser:
`$ test/server.sh`
![alt text][browser]

[mocha]: http://brainysmurf.github.io/img/testsWithMocha.png "nm test"
[browser]: http://brainysmurf.github.io/img/runsInBrowser.png "test/server.sh"


# Details

## How to use it?

You can write your javascript code as if you were writing for the cloud, but locally calls to things like `google.script.run` are mocked. 

It uses [gas-local](https://github.com/mzagorny/gas-local) that works by putting the code that works on the cloud as expected, but can be called locally. Templates also have access to that code.

One of the key design decisions that makes this work is the templating package chosen: [ejs](http://ejs.co). That uses a php-style of templating that is very similar to the templating language that Apps Script uses. The minor differences were easy to code up a work-around.

## Why did you make the decision to put code in `dev/` and copy over to `src/`?

The differences in the local stack compared to the Apps Script stack can be seen most striking in getting a templating language working for both endpoints. This was only possible to do by having two different code paths happen, executing according to whether it was on a production environment (Google's cloud) or in a development environment. On a production environment we include javascript and css files by (according to [best practices](https://developers.google.com/apps-script/guides/html/best-practices)) using an `include()` function, which is hand-written App Script code function declaration living in the global scope. The templating language on node.js also has an include function, but if the include function is defined that takes precedence. So instead, we can put include function in the `src/` directory, for the production side, and in `dev/` the templating feature will remain intact for node.js. 

This was only possible unless a strong distiction was made between the two, thus the idea to have a `dev/` folder instead of developing within `src/`.

## How do you "virtualize" the Google API calls, like DocumentApp?

Using [gas-local](https://github.com/mzagorny/gas-local), there is a way to load them up into a context, the next step was passing it onto the templating feature, which already included a way to pass around a global context with the `include()` call.

So we can just set up a fake object that includes a DocumentApp property, which has a method for `getActiveDocument`, which return an object that has a `getBody` method, and so on. We also need to save state as we go, and for this, the javascript closure pattern is quite useful. If needed, we could also use the [sinon](http://sinonjs.org) package.

## How do you get google.script.run to work on the local browser?

This is probably the most curious aspect to the whole aspect of the Google stack. The client side browser must have a way of communicating with the execution APIs, and this is the way to interface with it. Locally, we can't virtualize it, because this is client-side code running in the browser, after the template has produced the html/css/javascript. So instead the design decision was to enable the ability for the local environment to include a `development.html` file, but does nothing when in production. 

So, thus, in the templating code you can have a comment, like this:

```
<? /* do nothing, I am just a comment */ ?>
```

And since we already have include code running on the local machine, I figured design-wise the most elegant way to do this would be to have a special statement that would get converted into a normal include statement, but in production wouldn't get converted, and would remain as a comment:

```
<?= /* include('development.html'); /* ?>  <!-- NOTE: The equals is what is expected on the Google side, for unescaped code -->
```

Before sending this code onto the templating engine, we convert that into a normal include call, so it looks like this:

```
<?- include('development.html'); ?>  <!-- NOTE: The hyphen is what is expected on the local side, for unescaped code -->
```

And it'll be included. But on production, it'll do nothing since it'll still be just a comment!

Inside of `development.html` are all the bits that make the local browser work, including code to implement `google.script.run`. Work that is left to do is to figure out how to abstract that away so we can more conveniently reuse that code, instead of having to re-invent the wheel.
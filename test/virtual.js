/*
	Interfaces with gas-local in order to bring what is normally server-side code
	into the local node.js stack, i.e. "virtualizing" it

	Creates an object virtual that contains all code in source folders
	Also has method .virtual which creates one as well, which is used to pass on
	virtualized code into templating files
*/

'use strict';

let gas = require('gas-local');
const sourcePath = 'dev';

var googleRunScript = {
	successHandlers: [],
	failureHandlers: [],
	userObject: {},
	withSuccessHandler: function(func) {
		this.successHandlers.push(func);
		return this;
	},
	withFailureHandler: function(func) {
		this.failureHandlers.push(func);
		return this;
	},
	withUserObject: function(obj) {
		this.userObject = obj;
		return this;
	},
};

var getter = {

	/*
		Get function allows us to add a __noSuchMethod__ feature onto
		googleRunScript above

		Limitations, because we are returning a promise, we cannot call it
	*/
	get: function(target, name) {

		// If already defined, i.e. with.. method, use that...
		if (name in target) {
			return target[name];

		// otherwise this is something that needs to be emulated...
		} else {
			// just returning virtual[name] will not allow us to call handlers
			// so let's return a promise

			var promise = new Promise(
				function (resolve, reject) {
					try {
						var result = virtual[name](/* the arg would go here */);
						resolve(result);
					} catch(err) {
						reject(err)
					}
				}
			);
			promise.then(
				function (args) {
					target.successHandlers.forEach(function (func) {
						// call the success handlers
						func(args, target.userObject);
					});
				}
			).catch(
				function (args) {
					target.failureHandlers.forEach(function (func) {
						func(args, target.userObject);
					});
				}
			);

			// Need to wrap in a function in order for it to be called
			// This means we canNOT use argument to call anything...
			return function () { promise };
		}

	}
};


let MockedObjects = {
	google: {
		script: {
			run: new Proxy(googleRunScript, getter),
			host: {
				close: function() { window.close(); },
				origin: '',
				editor: {
					focus: function () { /* TBI */; },
				},
			}
		}
	},
	production: false,

	__proto__: gas.globalMockDefault,
};
var virtual = gas.require('./' + sourcePath, MockedObjects);

// Passed into include in order to ensure templates have virtual source too
virtual.virtual = function () { 
	gas.require('./' + sourcePath, MockedObjects);
};

module.exports = virtual;
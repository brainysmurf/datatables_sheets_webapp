(function () {
'use strict';

let moment = require('moment');
let gas = require('gas-local');
let assert = require('chai').assert;

// Mocks
let MockedObjects = {
	Moment: moment,
	DocumentApp: {

	},
	__proto__: gas.globalMockDefault,
};
MockedObjects.Moment.load = function () {};  // load is part of GAS ecosystem

let virtual = gas.require('./src', MockedObjects);

class UiMocker {
	constructor() {
		this.items = [];
	}
	createMenu(menuTitle) {
		return this; 
	}
	addItem(display, func) { 
		this.items.push(func);
		return this;
	}
	addSeparator() { 
		return this;
	}
	addToUi() { 
		return null;
	}
}

describe("Integration tests", function () {

	var ui = new UiMocker();
	virtual.app.createMenus(ui);

	it("Menus have actual corresponding functions", function () {
		ui.items.forEach(function(menuItem) {
			assert.typeOf(virtual[menuItem], 'function');
		});
	});

});

})();
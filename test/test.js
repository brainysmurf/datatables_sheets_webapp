(function () {
'use strict';

let assert = require('chai').assert;
let virtual = require('./virtual.js');

describe("Integration tests", function () {

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

	var ui = new UiMocker();
	virtual.app.createMenus(ui);

	it("Menus have actual corresponding functions", function () {
		ui.items.forEach(function(menuItem) {
			assert.typeOf(virtual[menuItem], 'function');
		});
	});

});

})();
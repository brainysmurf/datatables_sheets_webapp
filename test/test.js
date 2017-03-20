(function () {
	'use strict';

	let assert = require('chai').assert;
	let virtual = require('./virtual.js');


	describe("Core document functions", function () {

		it("insertHROnTop modifies body", function () {
			var body = virtual.app.insertHROnTop();
			assert.equal(body.body.length, 3);
			assert.equal(body.getText(), "\n<hr>\n");
		});

		it("insertTextOnTop modifies body", function () {
			var body = virtual.app.insertTextOnTop('sample');
			assert.equal(body.body.length, 1);
			assert.equal(body.getText(), 'sample')
		});

		it("countWords treats whitespace accurately", function () {
			assert.equal(virtual.app.countWords('one two three'), 3);
			assert.equal(virtual.app.countWords('one two\nthree'), 3);
			assert.equal(virtual.app.countWords('one1 two 33three'), 3);
			assert.equal(virtual.app.countWords('   one1\ntwo 33three   '), 3);
			assert.equal(virtual.app.countWords('Skldfjslkdjflskdfjsd lksdj flksjdf lksjdfl; skdjflskdfj sldkfj sldkjf slkdfjlsdk'), 8);
		});

		it("wordsFromBody detects horizontal rule", function () {
			virtual.app.insertHROnTop();
			var body = virtual.app.insertTextOnTop('Hey hey hey hey hey hey');
			virtual.app.insertHROnTop();
			var body = virtual.app.insertTextOnTop('four words here now');
			var wordInfo = virtual.app.wordsFromBody(body)
			assert.equal(wordInfo.count, 4);
		});
	});


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
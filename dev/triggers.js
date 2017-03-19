'use strict';

function onOpen(event) {
	if (event.authMode == ScriptApp.AuthMode.NONE) {
		return;
	}
    var ui = DocumentApp.getUi();
    app.onOpen(ui);
}

function onInstall(event) {
	app.createMenus();
}
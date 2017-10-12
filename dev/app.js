/*
  main program
  Builds an app object on the global context; all properties are functions
  Which means no actual code (other than assignments) is executed at initial loading

  Usage:

  //
  // file.js
  // =======
  function onOpen() {
    app.onOpen();  // app will already be defined in the global context
  }
*/

'use strict';

/*
  Build upon the globalContext (passed as this below) to define all our variables in the "app" variable
  We'll have all the virtualized stuff there in the local stack (thus, name conflicts are still possible)
*/
(function(globalContext) {

  globalContext.app = {};

  app.getActiveSpreadsheet = function () {
    return SpreadsheetApp.getActiveSpreadsheet();
  },

  app.showAlert = function (title, prompt, buttons) {
    var ui = DocumentApp.getUi(); // Same variations.

    var result = ui.alert(
       title,
       prompt,
       buttons);

    // Process the user's response.
    if (result == ui.Button.YES) {
      // User clicked "Yes".
      return true;
    } else {
      // User clicked "No" or X in the title bar.
      return false;
    }
  };

  app.showPrompt = function(title, prompt, buttons) {
    var ui = DocumentApp.getUi(); // Same variations.

    var result = ui.prompt(title, prompt, buttons);

    // Process the user's response.
    var button = result.getSelectedButton();
    var text = result.getResponseText();
    if (button == ui.Button.OK) {
      return text;
    } else if (button == ui.Button.CANCEL) {
      return null;
    }
    return "";
  };

  app.onOpen = function(ui) {
    var html = HtmlService.createTemplateFromFile('Sidebar').evaluate()
      .setTitle('Datatables for Sheets')

    ui.showSidebar(html);
  };

  app.createMenus = function(ui) {
    ui.createMenu('Datatables for Sheets')
      .addItem('Open Sidebar', 'onOpen')
  };



})(this);

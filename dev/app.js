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

  app.moment = Moment.load();

  // Define the paragraph styles that will be used
  app.TIMEKEY = 'timeStart';

  app.getActiveDocument = function () {
    return DocumentApp.getActiveDocument();
  },

  app.getActiveDocumentBody = function () {
    return app.getActiveDocument().getBody();
  };

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
      .setTitle('Gamified Journal')

    ui.showSidebar(html);
  };

  app.createMenus = function(ui) {
    ui.createMenu('Gamified Journal')
      .addItem('Open Sidebar', 'onOpen')
  };

  app.insertHROnTop = function() {
    var body = app.getActiveDocumentBody();
    body.insertParagraph(0, '\n');
    body.insertHorizontalRule(0);
    body.insertParagraph(0, '\n');
    return body;
  };

  app.insertTextOnTop = function(textToInsert, heading, select) {
    var doc = DocumentApp.getActiveDocument();

    select = typeof select == 'undefined' ? false : select;

    var body = app.getActiveDocumentBody();
    var par = body.insertParagraph(0, textToInsert);
    par.setHeading(heading);
    
    if (select) {
      var rangeBuilder = doc.newRange();
      rangeBuilder.addElement(par);
      doc.setSelection(rangeBuilder.build());
    }
    return body;
  };

  app.words = function() {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    return app.wordsFromBody(body);
  };

  /* 
    Extracts the words the user entered most recently, by finding the horizontal rule
  */
  app.wordsFromBody =function(body) {
    var finished = false;
    var userEntered = "";

    for (var i = 0; i < body.getNumChildren(); i++) {
      var child = body.getChild(i);    

      if (!finished) {
        userEntered += " " + child.getText();
      }

      if (child.getNumChildren() > 0) {
        for (var c = 0; c < child.getNumChildren(); c++) {
          var embeddedChild = child.getChild(c);
          if (embeddedChild.getType() == DocumentApp.ElementType.HORIZONTAL_RULE) {
            finished = true;
          }
        }
      }
    }
    
    return {count: app.countWords(userEntered), text: userEntered};
  };

  /*
    Counts how many words appear in string {s}
    Actually it just converts things to spaces and then counts the whitespaces
  */
  app.countWords = function(s) {
      s = s.replace(/(^\s*)|(\s*$)/gi, "");  // exclude  start and end white-space
      s = s.replace(/[\s]/g, ' ');           // convert all remaining whitespaces to spaces
      s = s.replace(/[ ]{2,}/gi, " ");       // 2 or more spaces changed to 1
      return s.split(' ').length; 
  };

})(this);

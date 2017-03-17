'use script';

var app = {};

(function() {
  app.moment = Moment.load();

  // Define the paragraph styles that will be used
  app.TIMEKEY = 'timeStart';

  app.getActiveDocumentBody = function () {
    var doc = DocumentApp.getActiveDocument();
    return doc.getBody();
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
      .setTitle('My custom sidebar')
      .setWidth(350);

    ui.showSidebar(html);

  };

  app.createMenus = function(ui) {
    ui.createMenu('Gamified Journal')
      .addItem('Start', 'start')
      .addSeparator()
      .addItem('Finished!', 'finish');
  };

  app.insertHROnTop = function() {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    body.insertParagraph(0, '\n');
    body.insertHorizontalRule(0);
    body.insertParagraph(0, '\n');
  };

  app.insertTextOnTop = function(textToInsert, heading, select) {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var par = body.insertParagraph(0, textToInsert);
    par.setHeading(heading);
    
    if (select) {
      var rangeBuilder = doc.newRange();
      rangeBuilder.addElement(par);
      doc.setSelection(rangeBuilder.build());
    }
  };

  app.testCalcTimeElasped = function() {
    var userProperties = PropertiesService.getUserProperties();  
    var then = app.moment(userProperties.getProperty('timeStart'));
    var now = app.moment(app.moment().format());
    var result = calcTimeElapsed(then, now);
  };

  app.calcTimeElapsed = function(now, then) {
    var duration = app.moment.duration(then.diff(now));
    return Math.round(duration.asMinutes());
  };

  app.words = function() {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    return app.wordsFromBody(body);
  };

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

  app.countWords = function(s) {
      s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
      s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
      s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
      return s.split(' ').length; 
  };

  app.emailAgents= function(body) {
      var user = Session.getActiveUser(),
          doc = DocumentApp.getActiveDocument(),
          newBody = doc.getUrl() + '\n\n' + body,
          subject = '[' + doc.getName() + '] New Entry by ' + user.getEmail();
      
      var agent = PropertiesService.getScriptProperties().getProperty('notify_email');
      if (agent) {
        MailApp.sendEmail(agent, subject, body);
      }
      Logger.log(agent);
  };
})();
//
var moment = Moment.load();
Logger.log('hi');

// Define the paragraph styles that will be used
var TIMEKEY = 'timeStart';


function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}

function getActiveDocumentBody() {
  var doc = DocumentApp.getActiveDocument();
  return doc.getBody();
}

function showAlert(title, prompt, buttons) {
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
}

function showPrompt(title, prompt, buttons) {
  var ui = DocumentApp.getUi(); // Same variations.

  Logger.log(buttons);
  var result = ui.prompt(title, prompt, buttons);

  // Process the user's response.
  var button = result.getSelectedButton();
  var text = result.getResponseText();
  if (button == ui.Button.OK) {
    return text;
  } else if (button == ui.Button.CANCEL) {
    return null
  }
  return ""
}

function createMenus(ui) {
  ui.createMenu('Learning Journal')
      .addItem('Start…', 'start')
      .addItem('Finished!', 'finish')
      .addSeparator()
      .addItem('Notifications', 'notify')
      .addToUi();
}

function onOpen() {
  var ui = DocumentApp.getUi();

  createMenus(ui);

  if (showAlert(
      "Are you ready to start the timer?", 
      'After clicking "Yes", begin writing. When you are done writing, you can click on "Learning Journal" and "Finished" to get a report of how long you wrote, and how many words you have written.', 
      DocumentApp.getUi().ButtonSet.YES_NO)
      ) {
    start()
  }
}

function test_notify() {
  notify('hello', 'hi');
}

function notify() {

  var agent = PropertiesService.getScriptProperties().getProperty('notify_email');
  if (!agent) {
    var prompt = "No one is currently notified. Add an email below.";
  } else {
    var prompt = "Right now " + agent + " receives an email. To change, type below";
  }

  var result = showPrompt(
    "Who to notify after clicking 'Finished'?", 
    prompt,
    DocumentApp.getUi().ButtonSet.OK_CANCEL)
  if (result) {
      //TODO: Validate
      var scriptProperties = PropertiesService.getScriptProperties();
      scriptProperties.setProperty('notify_email', result)
  }
}


function tryThis() {
  var file = DriveApp.getFileById(DocumentApp.getActiveDocument().getId());
  Logger.log(file);
  Logger.log(file.getOwner().getEmail());
}

function insertHROnTop() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  body.insertParagraph(0, '\n');
  body.insertHorizontalRule(0);
  body.insertParagraph(0, '\n');
}

function insertTextOnTop(textToInsert, heading, select) {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var par = body.insertParagraph(0, textToInsert);
  par.setHeading(heading);
  
  if (select) {
    var rangeBuilder = doc.newRange();
    rangeBuilder.addElement(par);
    doc.setSelection(rangeBuilder.build());
  }
}

function testCalcTimeElasped() {
  var userProperties = PropertiesService.getUserProperties();  
  var then = moment(userProperties.getProperty('timeStart'));
  var now = moment(moment().format());
  var result = calcTimeElapsed(then, now);
  Logger.log(result);
}

function calcTimeElapsed(now, then) {
  Logger.log(then.format("HH:mm:ss"));

  var duration = moment.duration(then.diff(now));
  return Math.round(duration.asMinutes());
}

function words() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  return wordsFromBody(body);
}

function test() {
  start();
  finish();
}

function start() {
  var NORMAL = DocumentApp.ParagraphHeading.NORMAL;
  var userProperties = PropertiesService.getUserProperties();  
  userProperties.setProperties({'timeStart': moment().format() });  
  insertHROnTop();
  insertTextOnTop("Start writing!", NORMAL, true);
}

function emailAgents(body) {
    var user = Session.getActiveUser();
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getUrl() + '\n\n' + body;
    var subject = '[' + doc.getName() + '] New Entry by ' + user.getEmail()
    
    var agent = PropertiesService.getScriptProperties().getProperty('notify_email');
    if (agent) {
      MailApp.sendEmail(agent, subject, body);
    }
    Logger.log(agent);
}

function finish() {
  var HEADER1 = DocumentApp.ParagraphHeading.HEADING1;
  var HEADER2 = DocumentApp.ParagraphHeading.HEADING2;

  var userProperties = PropertiesService.getUserProperties();  
  var timeStart = userProperties.getProperty('timeStart'); 
  if (timeStart != "") {
    var now = moment(moment().format());
    var then = moment(timeStart);
    var result = calcTimeElapsed(then, now);
  
    var wds = words();
  
    var title = "(You spent " + result + " minutes to write " + wds.count + " words!)";
  
    insertTextOnTop(title, HEADER2, false);
    insertTextOnTop(moment().format('MMMM Do YYYY'), HEADER1, false);
    
    // clear it to indicate usage
    userProperties.setProperties({'timeStart': ""});
    
    emailAgents(wds.text);
    
  } else {
    showAlert("Oops!", "You have to click on 'Start' in the 'Learning Journal' menu first!", DocumentApp.getUi().ButtonSet.OK);
  }
}
'use strict';

function start() {
    var NORMAL = DocumentApp.ParagraphHeading.NORMAL,
        userProperties = PropertiesService.getUserProperties();    
    userProperties.setProperties({'timeStart': moment().format() });    
    app.insertHROnTop();
    app.insertTextOnTop("Start writing!", NORMAL, true);
}

function finish() {
    var HEADER1 = DocumentApp.ParagraphHeading.HEADING1,
        HEADER2 = DocumentApp.ParagraphHeading.HEADING2;

    var userProperties = PropertiesService.getUserProperties();    
    var timeStart = userProperties.getProperty('timeStart'); 
    if (timeStart !== "") {
        var now = moment(moment().format());
        var then = moment(timeStart);
        var result = calcTimeElapsed(then, now);
    
        var wds = words();
    
        var title = "(You spent " + result + " minutes to write " + wds.count + " words!)";
    
        app.insertTextOnTop(title, HEADER2, false);
        app.insertTextOnTop(moment().format('MMMM Do YYYY'), HEADER1, false);
        
        // clear it to indicate usage
        userProperties.setProperties({'timeStart': ""});
        
        app.emailAgents(wds.text);
        
    } else {
        app.showAlert("Oops!", "You have to click on 'Start' in the 'Learning Journal' menu first!", DocumentApp.getUi().ButtonSet.OK);
    }
}

function notify() {
    var agent = PropertiesService.getScriptProperties().getProperty('notify_email'),
        prompt = "";
        
    if (!agent) {
        prompt = "No one is currently notified. Add an email below.";
    } else {
        prompt = "Right now " + agent + " receives an email. To change, type below";
    }

    var result = app.showPrompt(
        "Who to notify after clicking 'Finished'?", 
        prompt,
        DocumentApp.getUi().ButtonSet.OK_CANCEL
    );

    if (result) {
            //TODO: Validate
            var scriptProperties = PropertiesService.getScriptProperties();
            scriptProperties.setProperty('notify_email', result);
    }
}
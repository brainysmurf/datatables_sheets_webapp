/*
    Functions that interface between the client-side frontend and the google backend
    On local run these are not directly called, but mimicked with placeholder behaviour
    On production is called by google.run.script on the client-side browser
*/

'use strict';

/*
    Called when user clicks on Start button
    Updates the document to have a horizontal rule and command text
*/
function start() {
    var NORMAL = DocumentApp.ParagraphHeading.NORMAL;
    app.insertHROnTop();
    app.insertTextOnTop("Start writing!", NORMAL, true);
}

/* 
    Called when user clicks on Finish.
    Updates the document to contain a readout of the date and information 
    about the entry.
*/
function finish(duration) {
    if (typeof duration == 'undefined') {
        // do what?
    }

    var HEADER1 = DocumentApp.ParagraphHeading.HEADING1,
        HEADER2 = DocumentApp.ParagraphHeading.HEADING2,
        wds = app.words(),
        mom = app.moment().startOf('day')
                          .seconds(duration),
        numMinutes = mom.format('mm'),
        numSeconds = mom.format('ss'),
                             
        title = "(You spent " + numMinutes + " minutes and " + numSeconds + " seconds to write " + wds.count + " words!)";

    app.insertTextOnTop(title, HEADER2, false);
    app.insertTextOnTop(app.moment().format('MMMM Do YYYY'), HEADER1, false);
}

/*
    Just a placeholder at the moment
*/
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

/* 
    Just a placeholder at the moment
*/
function getEmailList() {
    return JSON.stringify(['example@example.com']);
}

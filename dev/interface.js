/*
    Functions that interface between the client-side frontend and the google backend
    On local run these are not directly called, but mimicked
*/

'use strict';

/*
    Creates an area for writing by making a hr and 
*/
function start() {
    var NORMAL = DocumentApp.ParagraphHeading.NORMAL;
    app.insertHROnTop();
    app.insertTextOnTop("Start writing!", NORMAL, true);
}

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
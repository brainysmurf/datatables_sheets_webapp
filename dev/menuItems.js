'use strict';

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
        numMinutes = app.moment().startOf('day')
                                .seconds(15457)
                                .format('mm'),
        title = "(You spent " + numMinutes + " minutes to write " + wds.count + " words!)";

    app.insertTextOnTop(title, HEADER2, false);
    app.insertTextOnTop(app.moment().format('MMMM Do YYYY'), HEADER1, false);
        
    // app.emailAgents(wds.text);

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
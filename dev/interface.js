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

function returnData() {
    var ssId = '177yLqYuE2JUsuKPCUeqH5DtlBmNuPSwp7fxM73Mb-gk',
        rangeNotation = 'just use DataRange';

    var data = SpreadsheetApp.openById(ssId).getDataRange().getValues();
    var template = HtmlService.createTemplateFromFile('Template').getRawContent();
    var filters = HtmlService.createTemplateFromFile('Filters').getRawContent();

    return {
        columns: data[0],
        rows: data.slice(1),
        template: template,
        filters: filters
    };
}

/*
    Functions that interface between the client-side frontend and the google backend
    On local run these are not directly called, but mimicked with placeholder behaviour
    On production is called by google.run.script on the client-side browser
*/

'use strict';


function returnData(ssId, rangeNotation) {

    var data = Sheets.Spreadsheets.Values.get(ssId, rangeNotation).values,
        template = HtmlService.createTemplateFromFile('Template').getRawContent();

    return {
        columns: data[0],
        rows: data.slice(1),
        template: template,
        selector: '#theDatatable'
    };
}

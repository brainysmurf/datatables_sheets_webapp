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

    var data = SpreadsheetApp.openById(ssId).getDataRange().getValues(),
        columns = [], rows = [];
    
    data[0].forEach(function (column) {
        columns.push({name: column});
    });
    
    data.slice(1).forEach(function (row) {
      rows.push(row);
    });
    var ret = {columns: columns, rows: rows};
    
    return ret;
}

function saveInfo() {
    return;
}


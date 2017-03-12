(function () {
'use strict';

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

})();
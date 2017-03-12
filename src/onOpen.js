(function () {
'use strict';

function onOpen() {
    var ui = DocumentApp.getUi();

    app.createMenus(ui);

    var result = app.showAlert(
        "Are you ready to start the timer?",
        'After clicking "Yes", begin writing. When you are done writing, you can click on "Learning Journal" and "Finished" to get a report of how long you wrote, and how many words you have written.',
        DocumentApp.getUi().ButtonSet.YES_NO
    );

    if (result) {
        start();
    }
}

})();
'use strict';

function doGet(ui) {
    return HtmlService.createTemplateFromFile('Main').evaluate();
}
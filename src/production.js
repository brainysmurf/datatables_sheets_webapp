/* 
	Variables that only apply to a production instance of our stack; i.e. Google side 
*/
'use strict';

// Can be used in templates:
var production = true;

// A "virutal()" call is used on the local clientside during includes
// in order to pass it a virtualized copy of the code to make include statements
// work properly on that side
// On production, it just needs to be an empty call, avoiding NameError
var virtual = function () { 
	return {}; 
};

/*
  In Google stack this is used by html templates to seperate 
  client-side js and css into different files, per best practice.
  In node.js this is not used, as it is overwritten by ejs.js
  native include call
  Note: ejs uses .ejs suffix for filenames but google stack requires
  .html/.css; this can be resolved by using symlinks 
*/
function include(filename, ignore) {
	return HtmlService.createHtmlOutputFromFile(filename)
	    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
	    .getContent();
}
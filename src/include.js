'use strict';

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
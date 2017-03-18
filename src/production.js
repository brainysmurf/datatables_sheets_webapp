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
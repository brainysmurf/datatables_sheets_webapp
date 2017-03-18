let connect = require('connect');
let http = require('http');
let fs = require('fs');
let ejs = require('ejs');
let path = require('path');
let virtual = require('./virtual.js');
const sourcePath = 'dev';

(function () { 
	let server = connect();

	server.use(function(req, res, next) {
		if (req.url === '/') {
			console.log("Blank path sent in, enter a view");
			next();
		} else {
			var basename = req.url + '.html',
				filePath = path.join(sourcePath, basename),
				params = virtual;
				options = {delimiter: "?", filename: filePath};

			// Read in file contents directly, so we can manipulate it
			var data = fs.readFileSync(filePath, 'utf-8');
			//

			// Convert google template for not escaping
			// into compatible form for ejs
			var result = data.replace(/<\?!=/g, '<?-');
			//

			// Take the commented-out include and convert it
			// It's commented out so it doesn't run on production, but does on local
			// TODO: Incorporate whitespace into the regexp
			result = result.replace(/<\?\/\*include\((.*)\);\*\/\?\>/g, '<?- include($1); ?>');
			//	

			// Render the modified result
			var html = ejs.render(result, params, options);
			//

			// Got the html, now send on the modified response to the browser
			res.end(html);
		}
	});

	// launch the server so we can use localhost and play around with it on our browser
	http.createServer(server).listen(8888);
})();
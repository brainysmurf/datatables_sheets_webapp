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
			console.log("Blank path sent in, enter a view")
			next()
		} else {
			var basename = req.url + '.html',
				filePath = path.join(sourcePath, basename),
				params = virtual;
				options = {delimiter: "?", filename: filePath},
				data = fs.readFileSync(filePath, 'utf-8'),

				// Convert google template for not escaping
				// into compatible form for ejs
				result = data.replace(/<\?!=/g, '<?-'),
				// 

				//
				result = result.replace(/<\?\/\*include\((.*)\);\*\/\?\>/g, '<?- include($1); ?>'),
				//

				html = ejs.render(result, params, options);

			// Got the html, now send on the modified response to the browser
			console.log(html);
			res.end(html);
		}
	});

		// load up virtual global space, too right?
		// var html = ejs.render(contents, {});

	http.createServer(server).listen(8888);
})();
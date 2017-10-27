let connect = require('connect');
let http = require('http');
let fs = require('fs');
let ejs = require('ejs');
let path = require('path');
let virtual = require('./virtual.js');
let queryString = require('query-string');
const sourcePath = 'dev';

var queries = {};

// Read in queries
process.argv.slice(2).forEach(function (val, index, array) {
	// pass along as query
	//console.log(index + ': ' + val);
	try {
		var htmlAsQuery = fs.readFileSync('dev/' + val + ".html", 'utf-8');
		queries[val.toLowerCase()] = htmlAsQuery;
	} catch (e) {
		console.log(e)
	}
});

function raise404 (res) {
	res.writeHead(404, {"Content-Type": "text/html"});
	fs.createReadStream("404.html").pipe(res);
}

(function () { 
	let server = connect();

	server.use(function(req, res, next) {
		if (req.url === '/') {
			console.log("Blank path sent in, enter a view");
			raise404(res);
			next();
		} else {
			console.log(req.url);
			var endpoint = req.url.match(/(.*)\??.*/g)[1],
				basename = endpoint + '.html',
				filePath = path.join(sourcePath, basename),
				params = virtual;
				options = {delimiter: "?", filename: filePath};
			console.log('endpoint: ' + endpoint);
			// Read in file contents directly, so we can manipulate it
			try {
				var data = fs.readFileSync(filePath, 'utf-8');
			} catch (e) {
				raise404(res);
				next();
				console.log("No html file found")
				return;
			}

			if (queries) {
				// reroute them so that the client-side js has access to them
				res.writeHead(302, {Location: req.url + "?" + queryString.stringify(queries)});
				res.end();
			} else {
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
		}
	});

	// launch the server so we can use localhost and play around with it on our browser
	http.createServer(server).listen(8888);
})();
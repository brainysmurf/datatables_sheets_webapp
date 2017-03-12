let connect = require('connect');
let http = require('http');
let fs = require('fs');
let ejs = require('ejs');
let path = require('path');

(function () { 
	let server = connect();

	server.use(function(req, res, next) {
		var params = {},
			options = {delimiter: "?", filename: 'src/Notification.html'},
			data = fs.readFileSync('src/Notification.html', 'utf-8'),
			result = data.replace(/<\?!=/g, '<?-'),
			html = ejs.render(result, params, options);

		console.log(html);
		res.end(html);
	});

		// load up virtual global space, too right?
		// var html = ejs.render(contents, {});

	http.createServer(server).listen(8888);
})()
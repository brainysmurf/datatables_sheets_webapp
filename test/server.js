let connect = require('connect');
let http = require('http');
let fs = require('fs');
let ejs = require('ejs');
let path = require('path');

(function () { 
	let server = connect();

	server.use(function(req, res, next) {
		console.log(req.url);
		var params = {delimiter: "?"};
		ejs.renderFile('src/Notification.html', params, function(err, result) {
			if (err) {
				console.log("Does not exist");
				console.log(err);
				next();
			} else {
				console.log(result);
				res.end(result);
			}
		});

		// load up virtual global space, too right?
		// var html = ejs.render(contents, {});

	});

	http.createServer(server).listen(8888);
})()
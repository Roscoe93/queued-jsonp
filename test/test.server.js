const express = require("express");
const app = express();
const http = require("http");

app.get(/api/, (req, resp) => {
	let { time, callback } = req.query;
	console.log(time);
	let ret = {
		time
	};
	setTimeout(() => {
		resp.end(`${callback}(${JSON.stringify(ret)})`);
	}, time);
});

http.createServer(app).listen(8888, err => {
	if (!err) console.log(`test server listening @8888`);
});

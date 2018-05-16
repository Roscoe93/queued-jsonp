const jsonp = require("../src/index");

let arr = [];
for (let i = 0; i < 100; i++) {
	let time = 500 + Math.round(Math.random() * 500);
	arr.push(time);
}

arr.map(time => {
	jsonp
		.fetch({
			url: `http://localhost:8888/api/?time=${time}`,
			callback: "callback",
			cbFunctionName: "a123",
			cache: false,
			noCacheParam: false
		})
		.then(({ time: restime }) => {
			if (restime == time) {
				console.log(`passed`);
			}
		});
});

const path = require("path");

module.exports = {
	entry: "./test/test.js",
	output: {
		path: path.resolve(__dirname, "test"),
		filename: "test-dist.js"
	},
  mode: "development"
};

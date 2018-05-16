"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require("babel-runtime/helpers/extends");

var _extends4 = _interopRequireDefault(_extends3);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

exports.sendRequest = sendRequest;

var _url = require("url");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sendRequest(_ref) {
	var url = _ref.url,
	    cbFunctionName = _ref.cbFunctionName,
	    callback = _ref.callback,
	    timeout = _ref.timeout,
	    extraParams = _ref.extraParams;

	if (!url) throw "should have url";
	return new _promise2.default(function (resolve, reject) {
		var script = document.createElement("script");
		var res = void 0;

		var timer = setTimeout(function () {
			if (script) {
				script.onload = script.onerror = noop;
				script.parentNode && script.parentNode.removeChild(script);
				script = null;
				reject("timeout:" + timeout + "ms");
			}
		}, timeout);

		window[cbFunctionName] = function (data) {
			res = data;
		};
		script.onload = function () {
			clearTimeout(timer);
			window[cbFunctionName] = undefined;
			script.parentNode && script.parentNode.removeChild(script);
			script = null;
			return resolve(res);
		};
		script.onerror = function (e) {
			clearTimeout(timer);
			window[cbFunctionName] = undefined;
			script.parentNode && script.parentNode.removeChild(script);
			script = null;
			return reject(e);
		};

		var urlParams = (0, _extends4.default)({}, extraParams, (0, _defineProperty3.default)({}, callback, cbFunctionName));

		script.src = mergeURLParams(url, urlParams);
		document.body.appendChild(script);
	});
}

function mergeURLParams(urlString, params) {
	var oURL = (0, _url.parse)(urlString, true);
	oURL.query = (0, _assign2.default)(oURL.query, params);
	delete oURL.search; // 触发url parseQueryString
	return (0, _url.format)(oURL, true);
}

function noop() {}
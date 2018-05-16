// @ts-check
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.fetch = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var run = function () {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(task) {
		var data;
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;
						_context.next = 3;
						return (0, _request.sendRequest)(task);

					case 3:
						data = _context.sent;

						task.resolve(data);
						_context.next = 10;
						break;

					case 7:
						_context.prev = 7;
						_context.t0 = _context["catch"](0);

						task.reject(_context.t0);

					case 10:
						_context.prev = 10;

						next(task.cbFunctionName);
						return _context.finish(10);

					case 13:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, this, [[0, 7, 10, 13]]);
	}));

	return function run(_x) {
		return _ref.apply(this, arguments);
	};
}();

var _url = require("url");

var _request = require("./request");

var _pool = require("./pool");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * usage:
 * request url like this: ${url}?${callback}=${cbFunctionName}
 * if set cache = false :${url}?${callback}=${cbFunctionName}&__${someRandomNumber}=${someOtherRandomNumber}]
 *
 * @param {Object} conf - 请求配置
 * @param {String} conf.url - 接口地址
 * @param {String} [conf.callback] - window下的回调函数名
 * @param {String} [conf.cbFunctionName] - 传递给接口的回调字段名
 * @param {String} [conf.cache] - 是否缓存结果
 * @param {Number} [conf.timeout] - 超时，毫秒数
 * @param {Boolean} [conf.noCacheParam] - 不添加额外参数实现缓存
 */
function fetch(conf) {
	var mergedConf = (0, _extends3.default)({
		callback: "callback",
		cbFunctionName: "callback_" + new Date().getTime(),
		cache: false,
		timeout: 10000,
		noCacheParam: false
	}, conf);

	return new _promise2.default(function (resolve, reject) {
		var task = (0, _extends3.default)({}, mergedConf, {
			extraParams: {},
			resolve: resolve,
			reject: reject
		});
		var cbFunctionName = mergedConf.cbFunctionName;

		// 根据cache策略修改回调函数名/增加防cache参数
		if (!mergedConf.cache) {
			var random = Math.round(Math.random() * 1e8);
			if (mergedConf.noCacheParam) {
				cbFunctionName = cbFunctionName + "_rnd_" + random;
			} else {
				task.extraParams.__rnd = random;
			}
		}
		task.cbFunctionName = cbFunctionName;

		if (window[cbFunctionName] || (0, _pool.exists)(cbFunctionName)) {
			(0, _pool.add)(cbFunctionName, task);
		} else {
			run(task);
		}
	});
}

function next(cbFunctionName) {
	var task = (0, _pool.get)(cbFunctionName);
	if (task) {
		run(task);
	}
}

exports.fetch = fetch;
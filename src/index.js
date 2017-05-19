/*
 * @Author: Roscoe
 * @Date:   2016-08-04 21:50:35
 * @Last Modified by:   Roscoe
 * @Last Modified time: 2016-09-27 15:16:19
 */

'use strict';
import { parse, format } from 'url';
const queue = [];

/**
 * usage:
 * request url like this: ${url}?${callback}=${cbFunctionName}
 * if set cache = false :${url}?${callback}=${cbFunctionName}&__${someRandomNumber}=${someOtherRandomNumber}
 *
 * @param {Object} option
 */
function fetch({
	url,
	callback = 'callback',
	cbFunctionName = `callback_${(new Date()).getTime()}`,
	cache = false
}) {
	return new Promise((resolve, reject) => {
		let task = ({
			url,
			callback,
			cbFunctionName,
			cache,
			resolve,
			reject
		});

		if (window[cbFunctionName] || queue.includes(request => request.cbFunctionName == cbFunctionName)) {
			queue.push(task);
		} else {
			run(task);
		}
	});
}

function next(cbFunctionName) {
	let task;
	let idx = queue.findIndex(request => request.cbFunctionName == cbFunctionName);
	if (idx !== -1) {
		task = queue.splice(idx, 1)[0];
	}
	if (task) {
		run(task);
	}
}

function run(task) {
	sendJsonpRequest(task).then(data => {
		task.resolve(data);
		next(task.cbFunctionName);
	}).catch(e => {
		task.reject(e);
		next(task.cbFunctionName);
	});
}

function sendJsonpRequest({ url, callback, cbFunctionName, cache }) {
	return new Promise((resolve, reject) => {
		let script = document.createElement('script');
		let res;
		window[cbFunctionName] = (data) => {
			res = data;
		};
		script.onload = () => {
			resolve(res);
			script.parentNode && script.parentNode.removeChild(script);
			window[cbFunctionName] = undefined;
		};
		script.onerror = (e) => {
			reject(e);
			window[cbFunctionName] = undefined;
		};

		let params = {}
		params[callback] = cbFunctionName;

		//如果不开cache，再后面拼个随机串
		let random = Math.ceil(Math.random() * 10e6);
		if (!cache) {
			params.__jsonpRnd = random;
		}

		script.src = mergeURLParams(url, params);
		document.body.appendChild(script);
	});
}

function mergeURLParams(urlString, params) {
	let oURL = parse(urlString, true);
	oURL.query = Object.assign(oURL.query, params);
	delete oURL.search; // 触发url parseQueryString
	return format(oURL, true);
}
export { fetch };
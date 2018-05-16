import { parse, format } from "url";

export function sendRequest({
	url,
	cbFunctionName,
	callback,
	timeout,
	extraParams
}) {
	if (!url) throw "should have url";
	return new Promise((resolve, reject) => {
		let script = document.createElement("script");
		let res;

		let timer = setTimeout(() => {
			if (script) {
				script.onload = script.onerror = noop;
				script.parentNode && script.parentNode.removeChild(script);
				script = null;
				reject(`timeout:${timeout}ms`);
			}
		}, timeout);

		window[cbFunctionName] = data => {
			res = data;
		};
		script.onload = () => {
			clearTimeout(timer);
			window[cbFunctionName] = undefined;
			script.parentNode && script.parentNode.removeChild(script);
			script = null;
			return resolve(res);
		};
		script.onerror = e => {
			clearTimeout(timer);
			window[cbFunctionName] = undefined;
			script.parentNode && script.parentNode.removeChild(script);
			script = null;
			return reject(e);
		};

		let urlParams = {
			...extraParams,
			[callback]: cbFunctionName
		};

		script.src = mergeURLParams(url, urlParams);
		document.body.appendChild(script);
	});
}

function mergeURLParams(urlString, params) {
	let oURL = parse(urlString, true);
	oURL.query = Object.assign(oURL.query, params);
	delete oURL.search; // 触发url parseQueryString
	return format(oURL, true);
}

function noop() {}

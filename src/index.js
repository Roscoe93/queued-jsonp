// @ts-check
"use strict";
import { parse, format } from "url";
import { sendRequest } from "./request";
import { get, add, exists } from "./pool";

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
	let mergedConf = {
		callback: "callback",
		cbFunctionName: `callback_${new Date().getTime()}`,
		cache: false,
		timeout: 10000,
		noCacheParam: false,
		...conf
	};

	return new Promise((resolve, reject) => {
		let task = {
			...mergedConf,
			extraParams: {},
			resolve,
			reject
		};
		let cbFunctionName = mergedConf.cbFunctionName;

		// 根据cache策略修改回调函数名/增加防cache参数
		if (!mergedConf.cache) {
			let random = Math.round(Math.random() * 1e8);
			if (mergedConf.noCacheParam) {
				cbFunctionName = `${cbFunctionName}_rnd_${random}`;
			} else {
				task.extraParams.__rnd = random;
			}
		}
		task.cbFunctionName = cbFunctionName;

		if (window[cbFunctionName] || exists(cbFunctionName)) {
			add(cbFunctionName, task);
		} else {
			run(task);
		}
	});
}

function next(cbFunctionName) {
	let task = get(cbFunctionName);
	if (task) {
		run(task);
	}
}

async function run(task) {
	try {
		let data = await sendRequest(task);
		task.resolve(data);
	} catch (error) {
		task.reject(error);
	} finally {
		next(task.cbFunctionName);
	}
}

export { fetch };

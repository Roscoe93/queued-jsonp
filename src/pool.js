// @ts-check
const pool = {};

function add(key, item) {
	if (!pool[key]) {
		pool[key] = [];
	}
	pool[key].push(item);
}

function get(key) {
	try {
		const item = pool[key].shift();
		if (pool[key].length == 0) {
			delete pool[key];
		}
		return item;
	} catch (error) {
		return null;
	}
}

function exists(key) {
	return pool[key] && pool[key].length > 0;
}
export { add, get, exists };

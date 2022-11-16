/**
 * 操作cookie，包含写入，读取，删除
 */
function set(name: string, value: any, param: any) {
	let savedValue = "";
	if (typeof value === "object") {
		savedValue = JSON.stringify(value);
	} else {
		savedValue = value;
	}
	const cookie = [
		name,
		"=",
		encodeURIComponent(savedValue),
		"; domain=",
		param?.domain,
		"; path=/;",
	].join("");
	document.cookie = cookie;
}

function get(name: string) {
	let result: any = document.cookie.match(new RegExp(`${name}=([^;]+)`));
	result = result != null ? result[1] : "";
	return decodeURIComponent(result);
}

function remove(name: any, param: { domain: any }) {
	document.cookie = [
		name,
		"=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=",
		param?.domain || "",
	].join("");
}

function clearCookie(param: { domain: string }) {
	const date = new Date();
	date.setTime(date.getTime() - 10000);
	const keys = document.cookie.match(/[^ =;]+(?=\\=)/g);
	if (keys) {
		for (let i = keys.length; i--; ) {
			document.cookie =
				`${keys[i]}=; expires=Thu, 01-Jan-1970 00:00:01 GMT` +
					`; path=/;domain=${param?.domain}` || "";
		}
	}
}

export default {
	set,
	get,
	remove,
	clearCookie,
};

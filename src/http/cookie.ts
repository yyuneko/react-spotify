function set(name: string, value: any) {
  let savedValue: string;

  if (typeof value === "object") {
    savedValue = JSON.stringify(value);
  } else {
    savedValue = value;
  }

  document.cookie = [
    name,
    "=",
    encodeURIComponent(savedValue),
    "; path=/;",
  ].join("");
}

function get(name: string) {
  let result: any = document.cookie.match(new RegExp(`${name}=([^;]+)`));
  result = result != null ? result[1] : "";

  return decodeURIComponent(result);
}

function remove(name: any) {
  document.cookie = [
    name,
    "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/;",
  ].join("");
}

function clearCookie() {
  const date = new Date();
  date.setTime(date.getTime() - 10000);
  const keys = document.cookie.match(/[^ =;]+(?=\\=)/g);

  if (keys) {
    for (let i = keys.length; i--; ) {
      document.cookie =
        `${keys[i]}=; expires=Thu, 01-Jan-1970 00:00:01 GMT` + "; path=/;" ||
        "";
    }
  }
}

export default {
  set,
  get,
  remove,
  clearCookie,
};

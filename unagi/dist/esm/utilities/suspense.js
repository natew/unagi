import { hashKey } from "./hash.js";
function wrapPromise(promise) {
  let status = "pending";
  let response;
  const suspender = promise.then((res) => {
    status = "success";
    response = res;
  }, (err) => {
    status = "error";
    response = err;
  });
  const read = () => {
    switch (status) {
      case "pending":
        throw suspender;
      case "error":
        throw response;
      default:
        return response;
    }
  };
  return { read };
}
const browserCache = {};
function query(key, fn, preload = false) {
  const stringKey = hashKey(key);
  if (browserCache[stringKey]) {
    const entry2 = browserCache[stringKey];
    if (preload)
      return void 0;
    if (entry2.error)
      throw entry2.error;
    if (entry2.response)
      return entry2.response;
    if (!preload)
      throw entry2.promise;
  }
  const entry = {
    promise: fn().then((response) => entry.response = response).catch((error) => entry.error = error)
  };
  browserCache[stringKey] = entry;
  if (!preload)
    throw entry.promise;
  return void 0;
}
const suspendFunction = (key, fn) => query(key, fn);
const preloadFunction = (key, fn) => query(key, fn, true);
export {
  preloadFunction,
  suspendFunction,
  wrapPromise
};
//# sourceMappingURL=suspense.js.map

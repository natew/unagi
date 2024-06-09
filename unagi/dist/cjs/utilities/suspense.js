"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var suspense_exports = {};
__export(suspense_exports, {
  preloadFunction: () => preloadFunction,
  suspendFunction: () => suspendFunction,
  wrapPromise: () => wrapPromise
});
module.exports = __toCommonJS(suspense_exports);
var import_hash = require("./hash.js");
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
  const stringKey = (0, import_hash.hashKey)(key);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  preloadFunction,
  suspendFunction,
  wrapPromise
});
//# sourceMappingURL=suspense.js.map

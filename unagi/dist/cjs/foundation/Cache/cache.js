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
var cache_exports = {};
__export(cache_exports, {
  deleteItemFromCache: () => deleteItemFromCache,
  generateDefaultCacheControlHeader: () => generateDefaultCacheControlHeader,
  getItemFromCache: () => getItemFromCache,
  isStale: () => isStale,
  setItemInCache: () => setItemInCache
});
module.exports = __toCommonJS(cache_exports);
var import_log = require("../../utilities/log/index.js");
var import_runtime = require("../runtime.js");
var import_strategies = require("./strategies/index.js");
function getCacheControlSetting(userCacheOptions, options) {
  if (userCacheOptions && options) {
    return {
      ...userCacheOptions,
      ...options
    };
  } else {
    return userCacheOptions || (0, import_strategies.CacheShort)();
  }
}
function generateDefaultCacheControlHeader(userCacheOptions) {
  return (0, import_strategies.generateCacheControlHeader)(getCacheControlSetting(userCacheOptions));
}
async function getItemFromCache(request) {
  const cache = (0, import_runtime.getCache)();
  if (!cache) {
    return;
  }
  const response = await cache.match(request);
  if (!response) {
    (0, import_log.logCacheApiStatus)("MISS", request.url);
    return;
  }
  (0, import_log.logCacheApiStatus)("HIT", request.url);
  return response;
}
async function setItemInCache(request, response, userCacheOptions) {
  const cache = (0, import_runtime.getCache)();
  if (!cache) {
    return;
  }
  const cacheControl = getCacheControlSetting(userCacheOptions);
  request.headers.set("cache-control", generateDefaultCacheControlHeader(getCacheControlSetting(cacheControl, {
    maxAge: (cacheControl.maxAge || 0) + (cacheControl.staleWhileRevalidate || 0)
  })));
  const cacheControlString = generateDefaultCacheControlHeader(getCacheControlSetting(cacheControl));
  response.headers.set("cache-control", cacheControlString);
  response.headers.set("real-cache-control", cacheControlString);
  response.headers.set("cache-put-date", new Date().toUTCString());
  (0, import_log.logCacheApiStatus)("PUT", request.url);
  await cache.put(request, response);
}
async function deleteItemFromCache(request) {
  const cache = (0, import_runtime.getCache)();
  if (!cache)
    return;
  (0, import_log.logCacheApiStatus)("DELETE", request.url);
  await cache.delete(request);
}
function isStale(request, response) {
  const responseDate = response.headers.get("cache-put-date");
  const cacheControl = response.headers.get("real-cache-control");
  let responseMaxAge = 0;
  if (cacheControl) {
    const maxAgeMatch = cacheControl.match(/max-age=(\d*)/);
    if (maxAgeMatch && maxAgeMatch.length > 1) {
      responseMaxAge = parseFloat(maxAgeMatch[1]);
    }
  }
  if (!responseDate) {
    return false;
  }
  const ageInMs = new Date().valueOf() - new Date(responseDate).valueOf();
  const age = ageInMs / 1e3;
  const result = age > responseMaxAge;
  if (result) {
    (0, import_log.logCacheApiStatus)("STALE", request.url);
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteItemFromCache,
  generateDefaultCacheControlHeader,
  getItemFromCache,
  isStale,
  setItemInCache
});
//# sourceMappingURL=cache.js.map

"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var cache_sub_request_exports = {};
__export(cache_sub_request_exports, {
  deleteItemFromCache: () => deleteItemFromCache,
  generateSubRequestCacheControlHeader: () => generateSubRequestCacheControlHeader,
  getItemFromCache: () => getItemFromCache,
  isStale: () => isStale,
  setItemInCache: () => setItemInCache
});
module.exports = __toCommonJS(cache_sub_request_exports);
var import_hash = require("../../utilities/hash.js");
var import_runtime = require("../runtime.js");
var CacheApi = __toESM(require("./cache.js"));
var import_strategies = require("./strategies/index.js");
function getKeyUrl(key) {
  return `https://shopify.dev/?${key}`;
}
function getCacheOption(userCacheOptions) {
  return userCacheOptions || (0, import_strategies.CacheShort)();
}
function generateSubRequestCacheControlHeader(userCacheOptions) {
  return CacheApi.generateDefaultCacheControlHeader(getCacheOption(userCacheOptions));
}
async function getItemFromCache(key) {
  const cache = (0, import_runtime.getCache)();
  if (!cache) {
    return;
  }
  const url = getKeyUrl((0, import_hash.hashKey)(key));
  const request = new Request(url);
  const response = await CacheApi.getItemFromCache(request);
  if (!response) {
    return;
  }
  return [await response.json(), response];
}
async function setItemInCache(key, value, userCacheOptions) {
  const cache = (0, import_runtime.getCache)();
  if (!cache) {
    return;
  }
  const url = getKeyUrl((0, import_hash.hashKey)(key));
  const request = new Request(url);
  const response = new Response(JSON.stringify(value));
  await CacheApi.setItemInCache(request, response, getCacheOption(userCacheOptions));
}
async function deleteItemFromCache(key) {
  const cache = (0, import_runtime.getCache)();
  if (!cache)
    return;
  const url = getKeyUrl((0, import_hash.hashKey)(key));
  const request = new Request(url);
  await CacheApi.deleteItemFromCache(request);
}
function isStale(key, response) {
  return CacheApi.isStale(new Request(getKeyUrl((0, import_hash.hashKey)(key))), response);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteItemFromCache,
  generateSubRequestCacheControlHeader,
  getItemFromCache,
  isStale,
  setItemInCache
});
//# sourceMappingURL=cache-sub-request.js.map

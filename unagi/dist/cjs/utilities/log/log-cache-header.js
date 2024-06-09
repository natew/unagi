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
var log_cache_header_exports = {};
__export(log_cache_header_exports, {
  collectQueryCacheControlHeaders: () => collectQueryCacheControlHeaders,
  logCacheControlHeaders: () => logCacheControlHeaders
});
module.exports = __toCommonJS(log_cache_header_exports);
var import_kolorist = require("kolorist");
var import_hash = require("../hash.js");
var import_log = require("./log.js");
var import_utils = require("./utils.js");
const color = import_kolorist.gray;
function collectQueryCacheControlHeaders(request, queryKey, cacheControlHeader) {
  request.ctx.queryCacheControl.push({
    name: (0, import_utils.findQueryName)((0, import_hash.hashKey)(queryKey)),
    header: cacheControlHeader
  });
}
function logCacheControlHeaders(type, request, response) {
  const log = (0, import_log.getLoggerWithContext)(request);
  if (!log.options().showCacheControlHeader) {
    return;
  }
  log.debug(color(`\u250C\u2500\u2500 Cache control header for ${(0, import_utils.parseUrl)(type, request.url)}`));
  if (response) {
    log.debug(color(`\u2502 ${response.cacheControlHeader}`));
  }
  const queryList = request.ctx.queryCacheControl;
  const longestQueryNameLength = queryList.reduce((max, query) => Math.max(max, query.name.length), 0);
  if (queryList.length > 0) {
    log.debug(color("\u2502"));
    queryList.forEach((query) => {
      log.debug(color(`\u2502 query ${query.name.padEnd(longestQueryNameLength + 1)}${query.header}`));
    });
  }
  log.debug(color("\u2514\u2500\u2500"));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  collectQueryCacheControlHeaders,
  logCacheControlHeaders
});
//# sourceMappingURL=log-cache-header.js.map

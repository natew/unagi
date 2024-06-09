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
var log_exports = {};
__export(log_exports, {
  Logger: () => import_log.Logger,
  collectQueryCacheControlHeaders: () => import_log_cache_header.collectQueryCacheControlHeaders,
  collectQueryTimings: () => import_log_query_timeline.collectQueryTimings,
  getLoggerWithContext: () => import_log.getLoggerWithContext,
  log: () => import_log.log,
  logCacheApiStatus: () => import_log_cache_api_status.logCacheApiStatus,
  logCacheControlHeaders: () => import_log_cache_header.logCacheControlHeaders,
  logQueryTimings: () => import_log_query_timeline.logQueryTimings,
  logServerResponse: () => import_log.logServerResponse,
  setLogger: () => import_log.setLogger
});
module.exports = __toCommonJS(log_exports);
var import_log = require("./log.js");
var import_log_cache_header = require("./log-cache-header.js");
var import_log_cache_api_status = require("./log-cache-api-status.js");
var import_log_query_timeline = require("./log-query-timeline.js");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Logger,
  collectQueryCacheControlHeaders,
  collectQueryTimings,
  getLoggerWithContext,
  log,
  logCacheApiStatus,
  logCacheControlHeaders,
  logQueryTimings,
  logServerResponse,
  setLogger
});
//# sourceMappingURL=index.js.map

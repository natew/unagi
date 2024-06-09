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
var log_cache_api_status_exports = {};
__export(log_cache_api_status_exports, {
  logCacheApiStatus: () => logCacheApiStatus
});
module.exports = __toCommonJS(log_cache_api_status_exports);
var import_kolorist = require("kolorist");
var import__ = require(".");
function logCacheApiStatus(status, url) {
  if (!import__.log.options().showCacheApiStatus) {
    return;
  }
  let queryName;
  import__.log.debug((0, import_kolorist.gray)(`[Cache] ${status == null ? void 0 : status.padEnd(8)} ${queryName ? `query ${queryName}` : url}`));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  logCacheApiStatus
});
//# sourceMappingURL=log-cache-api-status.js.map

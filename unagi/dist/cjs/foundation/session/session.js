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
var session_exports = {};
__export(session_exports, {
  emptySessionImplementation: () => emptySessionImplementation,
  emptySyncSessionImplementation: () => emptySyncSessionImplementation,
  getSyncSessionApi: () => getSyncSessionApi
});
module.exports = __toCommonJS(session_exports);
var import_suspense = require("../../utilities/suspense.js");
function getSyncSessionApi(request, componentResponse, log, session) {
  const sessionPromises = {};
  return session ? {
    get() {
      if (!sessionPromises.getPromise) {
        sessionPromises.getPromise = (0, import_suspense.wrapPromise)(session.get(request));
      }
      return sessionPromises.getPromise.read();
    }
  } : emptySyncSessionImplementation(log);
}
const emptySessionImplementation = function(log) {
  return {
    async get() {
      log.warn("No session adapter has been configured!");
      return {};
    },
    async set(key, value) {
      log.warn("No session adapter has been configured!");
    },
    async destroy() {
      log.warn("No session adapter has been configured!");
      return;
    }
  };
};
const emptySyncSessionImplementation = function(log) {
  return {
    get() {
      log.warn("No session adapter has been configured!");
      return {};
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  emptySessionImplementation,
  emptySyncSessionImplementation,
  getSyncSessionApi
});
//# sourceMappingURL=session.js.map

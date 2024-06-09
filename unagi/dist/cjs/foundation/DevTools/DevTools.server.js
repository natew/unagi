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
var DevTools_server_exports = {};
__export(DevTools_server_exports, {
  DevTools: () => DevTools
});
module.exports = __toCommonJS(DevTools_server_exports);
var import_react = __toESM(require("react"));
var import_locale = require("../../utilities/locale/index.js");
var import_ServerRequestProvider = require("../ServerRequestProvider/index.js");
var import_DevTools_client = require("./DevTools.client.js");
function DevTools() {
  const serverRequest = (0, import_ServerRequestProvider.useServerRequest)();
  const { shopifyConfig } = serverRequest.ctx;
  const {
    defaultLanguageCode: languageCode,
    defaultCountryCode: countryCode,
    storeDomain,
    storefrontApiVersion
  } = shopifyConfig || {};
  const settings = {
    locale: (0, import_locale.getLocale)(languageCode, countryCode),
    storeDomain,
    storefrontApiVersion
  };
  return /* @__PURE__ */ import_react.default.createElement(import_DevTools_client.DevTools, {
    dataFromServer: { settings }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DevTools
});
//# sourceMappingURL=DevTools.server.js.map

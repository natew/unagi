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
var Settings_client_exports = {};
__export(Settings_client_exports, {
  Settings: () => Settings
});
module.exports = __toCommonJS(Settings_client_exports);
var import_react = __toESM(require("react"));
var import_Table = require("./Table.js");
const KEY_MAP = {
  locale: "Locale",
  storeDomain: "Domain",
  storefrontApiVersion: "API Version"
};
function Settings(props) {
  const items = Object.entries(props).map(([key, value]) => {
    return {
      key: KEY_MAP[key],
      value,
      type: typeof value
    };
  });
  return /* @__PURE__ */ import_react.default.createElement(import_Table.Table, {
    items
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Settings
});
//# sourceMappingURL=Settings.client.js.map

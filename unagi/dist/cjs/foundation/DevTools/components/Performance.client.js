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
var Performance_client_exports = {};
__export(Performance_client_exports, {
  Performance: () => Performance
});
module.exports = __toCommonJS(Performance_client_exports);
var import_react = __toESM(require("react"));
var import_Heading = require("./Heading.js");
function Performance({ navigations }) {
  const navigationsMarkup = navigations.map(({ url, ttfb, fcp, size, duration, type }) => /* @__PURE__ */ import_react.default.createElement("li", {
    key: url,
    style: { padding: "0.5em 0", borderBottom: "1px solid" }
  }, /* @__PURE__ */ import_react.default.createElement(Item, {
    label: type,
    value: url.replace("http://localhost:3000", "")
  }), /* @__PURE__ */ import_react.default.createElement("div", {
    style: { display: "flex" }
  }, /* @__PURE__ */ import_react.default.createElement(Item, {
    label: "TTFB",
    value: ttfb
  }), /* @__PURE__ */ import_react.default.createElement(Item, {
    label: "Duration",
    value: duration
  }), /* @__PURE__ */ import_react.default.createElement(Item, {
    label: "FCP",
    value: fcp
  }))));
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(import_Heading.Heading, null, "Performance"), /* @__PURE__ */ import_react.default.createElement("ul", null, navigationsMarkup));
}
const Item = ({ label, value, unit }) => {
  if (!value) {
    return null;
  }
  const val = typeof value === "string" ? /* @__PURE__ */ import_react.default.createElement("span", {
    style: { fontWeight: "bold" }
  }, value) : `${Math.round(value)}${unit || "ms"}`;
  return /* @__PURE__ */ import_react.default.createElement("span", {
    style: {
      fontFamily: "monospace",
      padding: "0 2em 0 0"
    }
  }, label && label.padEnd(10), val);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Performance
});
//# sourceMappingURL=Performance.client.js.map

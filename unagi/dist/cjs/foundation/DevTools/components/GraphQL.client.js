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
var GraphQL_client_exports = {};
__export(GraphQL_client_exports, {
  GraphQL: () => GraphQL
});
module.exports = __toCommonJS(GraphQL_client_exports);
var import_react = __toESM(require("react"));
const import_meta = {};
function GraphQL() {
  const [warnings, setWarnings] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    if (import_meta.hot) {
      import_meta.hot.on("unagi-dev-tools", ({ type, data }) => {
        if (type === "warn") {
          setWarnings((state) => [...state || [], data]);
        }
      });
    }
  }, []);
  const warningsMarkup = warnings ? warnings.map((war, i) => /* @__PURE__ */ import_react.default.createElement("li", {
    key: war + i
  }, /* @__PURE__ */ import_react.default.createElement("pre", null, war))) : null;
  return /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("ul", {
    style: {
      fontFamily: "monospace",
      paddingTop: "1em",
      fontSize: "0.9em"
    }
  }, warningsMarkup));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GraphQL
});
//# sourceMappingURL=GraphQL.client.js.map

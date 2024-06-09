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
var RouteParamsProvider_client_exports = {};
__export(RouteParamsProvider_client_exports, {
  RouteParamsContext: () => RouteParamsContext,
  RouteParamsProvider: () => RouteParamsProvider,
  useBasePath: () => useBasePath
});
module.exports = __toCommonJS(RouteParamsProvider_client_exports);
var import_react = __toESM(require("react"));
const RouteParamsContext = (0, import_react.createContext)({
  routeParams: {},
  basePath: "/"
});
const RouteParamsProvider = ({ children, routeParams, basePath }) => {
  return /* @__PURE__ */ import_react.default.createElement(RouteParamsContext.Provider, {
    value: { routeParams, basePath }
  }, children);
};
function useBasePath() {
  const router = (0, import_react.useContext)(RouteParamsContext);
  return router.basePath;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RouteParamsContext,
  RouteParamsProvider,
  useBasePath
});
//# sourceMappingURL=RouteParamsProvider.client.js.map

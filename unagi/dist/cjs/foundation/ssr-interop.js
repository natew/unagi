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
var ssr_interop_exports = {};
__export(ssr_interop_exports, {
  META_ENV_SSR: () => META_ENV_SSR,
  useEnvContext: () => useEnvContext
});
module.exports = __toCommonJS(ssr_interop_exports);
var import_react = require("react");
const META_ENV_SSR = false;
const reactContextType = Symbol.for("react.context");
function useEnvContext(serverGetter, clientFallback) {
  return clientFallback && clientFallback.$$typeof === reactContextType ? (0, import_react.useContext)(clientFallback) : clientFallback;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  META_ENV_SSR,
  useEnvContext
});
//# sourceMappingURL=ssr-interop.js.map

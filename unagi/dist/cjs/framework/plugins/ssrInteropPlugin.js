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
var ssrInteropPlugin_exports = {};
__export(ssrInteropPlugin_exports, {
  default: () => ssrInteropPlugin_default
});
module.exports = __toCommonJS(ssrInteropPlugin_exports);
var ssrInteropPlugin_default = () => {
  return {
    name: "vite-plugin-ssr-interop",
    enforce: "pre",
    transform(code, id, options = {}) {
      if (options.ssr && id.includes("foundation/ssr-interop")) {
        return {
          code: code.replace(/(\s*META_ENV_SSR\s*=\s*)false/, "$1import.meta.env.SSR").replace(/\/\/@SSR\s*/g, ""),
          map: { mappings: "" }
        };
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=ssrInteropPlugin.js.map

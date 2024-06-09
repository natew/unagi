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
var hydrationAutoImportPlugin_exports = {};
__export(hydrationAutoImportPlugin_exports, {
  default: () => hydrationAutoImportPlugin_default
});
module.exports = __toCommonJS(hydrationAutoImportPlugin_exports);
var import_path = __toESM(require("path"));
var import_magic_string = __toESM(require("magic-string"));
var import_vite = require("vite");
const UNAGI_ENTRY_FILE = "unagi-entry-client.jsx";
var hydrationAutoImportPlugin_default = () => {
  let config;
  return {
    name: "vite-plugin-hydration-auto-import",
    enforce: "pre",
    configResolved(_config) {
      config = _config;
    },
    resolveId(id, importer) {
      console.log("hydartion autio", id, importer);
      if ((/^\/?@tamagui\/unagi\/entry-client$/.test(id) || id.endsWith(import_path.default.sep + UNAGI_ENTRY_FILE)) && (0, import_vite.normalizePath)(importer || "").endsWith("/index.html")) {
        return import_path.default.join(config.root, UNAGI_ENTRY_FILE + "?virtual");
      }
      return null;
    },
    load(id) {
      if (id.includes(UNAGI_ENTRY_FILE + "?virtual")) {
        const code = new import_magic_string.default(`import renderUnagi from '@tamagui/unagi/entry-client';
export default renderUnagi((props) => props.children);`);
        return {
          code: code.toString(),
          map: { mappings: "" }
        };
      }
      return null;
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=hydrationAutoImportPlugin.js.map

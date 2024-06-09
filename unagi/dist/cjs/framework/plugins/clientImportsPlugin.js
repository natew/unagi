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
var clientImportsPlugin_exports = {};
__export(clientImportsPlugin_exports, {
  default: () => clientImportsPlugin
});
module.exports = __toCommonJS(clientImportsPlugin_exports);
function clientImportsPlugin() {
  return {
    name: "unagi:client-imports",
    enforce: "pre",
    async resolveId(source, importer, { ssr }) {
      console.log("resolving client", source, importer);
      if (ssr)
        return;
      if (/\.server\.(j|t)sx?/.test(importer ?? ""))
        return;
      if ("@tamagui/unagi" !== source)
        return;
      const resolution = await this.resolve("@tamagui/unagi/client", importer, {
        skipSelf: true
      });
      if (resolution) {
        return resolution.id;
      }
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=clientImportsPlugin.js.map

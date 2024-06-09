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
var unagiRscPlugin_exports = {};
__export(unagiRscPlugin_exports, {
  default: () => unagiRscPlugin_default
});
module.exports = __toCommonJS(unagiRscPlugin_exports);
var import_plugin = __toESM(require("@tamagui/unagi/vendor/react-server-dom-vite/plugin.js"));
var import_virtualFilesPlugin = require("./virtualFilesPlugin.js");
function unagiRscPlugin_default(options) {
  return (0, import_plugin.default)({
    serverBuildEntries: [import_virtualFilesPlugin.UNAGI_DEFAULT_SERVER_ENTRY, import_virtualFilesPlugin.VIRTUAL_PROXY_UNAGI_ROUTES_ID],
    isServerComponentImporterAllowed(importer, source) {
      console.log("source", source);
      return source.includes(import_virtualFilesPlugin.UNAGI_DEFAULT_SERVER_ENTRY) || /(index|entry-server|tamagui\.config)\.[jt]s/.test(importer) || /\.test\.[tj]sx?$/.test(importer);
    },
    ...options
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=unagiRscPlugin.js.map

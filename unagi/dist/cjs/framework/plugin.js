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
var plugin_exports = {};
__export(plugin_exports, {
  default: () => plugin_default,
  unagiPlugin: () => unagiPlugin
});
module.exports = __toCommonJS(plugin_exports);
var import_vite_plugin = require("@tamagui/vite-plugin");
var import_plugin_react = __toESM(require("@vitejs/plugin-react"));
var import_vite_plugin_inspect = __toESM(require("vite-plugin-inspect"));
var import_clientImportsPlugin = __toESM(require("./plugins/clientImportsPlugin.js"));
var import_clientMiddlewarePlugin = __toESM(require("./plugins/clientMiddlewarePlugin.js"));
var import_configPlugin = __toESM(require("./plugins/configPlugin.js"));
var import_hydrationAutoImportPlugin = __toESM(require("./plugins/hydrationAutoImportPlugin.js"));
var import_middlewarePlugin = __toESM(require("./plugins/middlewarePlugin.js"));
var import_platformEntryPlugin = __toESM(require("./plugins/platformEntryPlugin.js"));
var import_ssrInteropPlugin = __toESM(require("./plugins/ssrInteropPlugin.js"));
var import_unagiRscPlugin = __toESM(require("./plugins/unagiRscPlugin.js"));
var import_virtualFilesPlugin = __toESM(require("./plugins/virtualFilesPlugin.js"));
const unagiPlugin = (options = {
  configPath: "unagi.config"
}) => {
  return [
    process.env.VITE_INSPECT && (0, import_vite_plugin_inspect.default)(),
    (0, import_configPlugin.default)(),
    (0, import_clientMiddlewarePlugin.default)(),
    (0, import_clientImportsPlugin.default)(),
    (0, import_middlewarePlugin.default)(options),
    (0, import_virtualFilesPlugin.default)(options),
    (0, import_plugin_react.default)(),
    (0, import_hydrationAutoImportPlugin.default)(),
    (0, import_ssrInteropPlugin.default)(),
    (0, import_vite_plugin.tamaguiPlugin)({
      config: "tamagui.config.ts",
      components: ["tamagui"]
    }),
    (0, import_unagiRscPlugin.default)(),
    (0, import_platformEntryPlugin.default)()
  ];
};
var plugin_default = unagiPlugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  unagiPlugin
});
//# sourceMappingURL=plugin.js.map

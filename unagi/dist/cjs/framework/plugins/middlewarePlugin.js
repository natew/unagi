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
var middlewarePlugin_exports = {};
__export(middlewarePlugin_exports, {
  default: () => middlewarePlugin_default
});
module.exports = __toCommonJS(middlewarePlugin_exports);
var import_fs = require("fs");
var import_path = __toESM(require("path"));
var import_body_parser = __toESM(require("body-parser"));
var import_cache = require("../cache.js");
var import_middleware = require("../middleware.js");
var import_virtualFilesPlugin = require("./virtualFilesPlugin.js");
var middlewarePlugin_default = (pluginOptions) => {
  return {
    name: "unagi:middleware",
    async configureServer(server) {
      const resolve = (p) => import_path.default.resolve(server.config.root, p);
      async function getIndexTemplate(url) {
        const indexHtml = await import_fs.promises.readFile(resolve("index.html"), "utf-8");
        return await server.transformIndexHtml(url, indexHtml);
      }
      server.middlewares.use(import_body_parser.default.raw({ type: "*/*" }));
      return () => server.middlewares.use((0, import_middleware.unagiMiddleware)({
        dev: true,
        indexTemplate: getIndexTemplate,
        getServerEntrypoint: () => server.ssrLoadModule(import_virtualFilesPlugin.UNAGI_DEFAULT_SERVER_ENTRY),
        devServer: server,
        cache: (pluginOptions == null ? void 0 : pluginOptions.devCache) ? new import_cache.InMemoryCache() : void 0
      }));
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=middlewarePlugin.js.map

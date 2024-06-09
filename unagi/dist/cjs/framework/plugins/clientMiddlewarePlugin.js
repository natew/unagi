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
var clientMiddlewarePlugin_exports = {};
__export(clientMiddlewarePlugin_exports, {
  default: () => clientMiddlewarePlugin_default
});
module.exports = __toCommonJS(clientMiddlewarePlugin_exports);
var import_vite = require("vite");
var clientMiddlewarePlugin_default = () => {
  return {
    name: "vite-plugin-unagi-client-middleware",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;
        try {
          if (/\.client\.[jt]sx?\?v=/.test(url) && !/\/node_modules\//.test(url)) {
            const result = await server.transformRequest(url, { html: false });
            if (result) {
              return (0, import_vite.send)(req, res, result.code, "js", {
                etag: result.etag,
                cacheControl: "no-cache",
                headers: server.config.server.headers,
                map: result.map
              });
            }
          }
        } catch (e) {
          next(e);
        }
        next();
      });
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=clientMiddlewarePlugin.js.map

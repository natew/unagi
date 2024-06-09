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
var middleware_exports = {};
__export(middleware_exports, {
  unagiMiddleware: () => unagiMiddleware
});
module.exports = __toCommonJS(middleware_exports);
let entrypointError = null;
function unagiMiddleware({
  dev,
  cache,
  indexTemplate,
  getServerEntrypoint,
  devServer
}) {
  if (dev && devServer) {
    globalThis.__viteDevServer = devServer;
  }
  const webPolyfills = !globalThis.fetch || !globalThis.ReadableStream ? import("../utilities/webPolyfill.js") : void 0;
  return async function(request, response, next) {
    try {
      await webPolyfills;
      const entrypoint = await Promise.resolve(getServerEntrypoint()).catch((error) => {
        entrypointError = error;
      });
      const handleRequest = (entrypoint == null ? void 0 : entrypoint.default) ?? entrypoint;
      if (typeof handleRequest !== "function") {
        if (entrypointError) {
          throw entrypointError;
        } else {
          throw new Error('Something is wrong in your project. Make sure to add "export default renderUnagi(...)" in your server entry file.');
        }
      }
      entrypointError = null;
      await handleRequest(request, {
        dev,
        cache,
        indexTemplate,
        streamableResponse: response
      });
    } catch (e) {
      if (dev && devServer)
        devServer.ssrFixStacktrace(e);
      response.statusCode = 500;
      try {
        const template = typeof indexTemplate === "function" ? await indexTemplate(request.originalUrl ?? request.url ?? "") : indexTemplate;
        const html = template.replace(`<div id="root"></div>`, `<div id="root"><pre><code>${e.stack}</code></pre></div>`);
        response.write(html);
        next(e);
      } catch (_e) {
        response.write(e.stack);
        next(e);
      }
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  unagiMiddleware
});
//# sourceMappingURL=middleware.js.map

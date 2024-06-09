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
var viteception_exports = {};
__export(viteception_exports, {
  viteception: () => viteception
});
module.exports = __toCommonJS(viteception_exports);
var import_vite = require("vite");
async function viteception(paths, options) {
  const isWorker = process.env.WORKER;
  delete process.env.WORKER;
  const server = await (0, import_vite.createServer)({
    clearScreen: false,
    server: { middlewareMode: "ssr" },
    ...options
  });
  if (isWorker) {
    process.env.WORKER = isWorker;
  }
  const loaded = await Promise.all(paths.map((path) => server.ssrLoadModule(path)));
  await server.close();
  return { server, loaded };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  viteception
});
//# sourceMappingURL=viteception.js.map

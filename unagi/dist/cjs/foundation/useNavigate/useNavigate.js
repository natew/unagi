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
var useNavigate_exports = {};
__export(useNavigate_exports, {
  buildPath: () => buildPath,
  useNavigate: () => useNavigate
});
module.exports = __toCommonJS(useNavigate_exports);
var import_BrowserRouter_client = require("../Router/BrowserRouter.client.js");
var import_RouteParamsProvider_client = require("../useRouteParams/RouteParamsProvider.client.js");
function useNavigate() {
  const router = (0, import_BrowserRouter_client.useRouter)();
  const routeBasePath = (0, import_RouteParamsProvider_client.useBasePath)();
  return (path, options = { replace: false, reloadDocument: false }) => {
    path = buildPath(options.basePath ?? routeBasePath, path);
    const state = {
      ...options == null ? void 0 : options.clientState,
      scroll: (options == null ? void 0 : options.scroll) ?? true
    };
    if (options == null ? void 0 : options.replace) {
      router.history.replace(path, state);
    } else {
      router.history.push(path, state);
    }
  };
}
function buildPath(basePath, path) {
  if (path.startsWith("http") || path.startsWith("//"))
    return path;
  let builtPath = path;
  if (basePath !== "/") {
    const pathFirstChar = path.charAt(0);
    const basePathLastChar = basePath.charAt(basePath.length - 1);
    builtPath = pathFirstChar === "/" && basePathLastChar === "/" ? basePath + path.substring(1) : basePathLastChar !== "/" && pathFirstChar !== "/" ? basePath + "/" + path : basePath + path;
  }
  return builtPath;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buildPath,
  useNavigate
});
//# sourceMappingURL=useNavigate.js.map

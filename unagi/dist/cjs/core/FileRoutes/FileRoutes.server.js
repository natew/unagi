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
var FileRoutes_server_exports = {};
__export(FileRoutes_server_exports, {
  FileRoutes: () => FileRoutes,
  createPageRoutes: () => createPageRoutes
});
module.exports = __toCommonJS(FileRoutes_server_exports);
var import_react = __toESM(require("react"));
var import_matchPath = require("../../utilities/matchPath.js");
var import_log = require("../../utilities/log/index.js");
var import_apiRoutes = require("../../utilities/apiRoutes.js");
var import_ServerRequestProvider = require("../ServerRequestProvider/index.js");
var import_RouteParamsProvider_client = require("../useRouteParams/RouteParamsProvider.client.js");
function FileRoutes({ routes, basePath, dirPrefix }) {
  const request = (0, import_ServerRequestProvider.useServerRequest)();
  const { routeRendered, serverProps } = request.ctx.router;
  if (routeRendered)
    return null;
  if (!routes) {
    const fileRoutes = request.ctx.hydrogenConfig.routes;
    routes = fileRoutes.files;
    dirPrefix ?? (dirPrefix = fileRoutes.dirPrefix);
    basePath ?? (basePath = fileRoutes.basePath);
  }
  basePath ?? (basePath = "/");
  const pageRoutes = (0, import_react.useMemo)(() => createPageRoutes(routes, basePath, dirPrefix), [routes, basePath, dirPrefix]);
  let foundRoute, foundRouteDetails;
  for (let i = 0; i < pageRoutes.length; i++) {
    foundRouteDetails = (0, import_matchPath.matchPath)(serverProps.pathname, pageRoutes[i]);
    if (foundRouteDetails) {
      foundRoute = pageRoutes[i];
      break;
    }
  }
  if (foundRoute) {
    request.ctx.router.routeRendered = true;
    request.ctx.router.routeParams = foundRouteDetails.params;
    return /* @__PURE__ */ import_react.default.createElement(import_RouteParamsProvider_client.RouteParamsProvider, {
      routeParams: foundRouteDetails.params,
      basePath
    }, /* @__PURE__ */ import_react.default.createElement(foundRoute.component, {
      params: foundRouteDetails.params,
      ...serverProps
    }));
  }
  return null;
}
function createPageRoutes(pages, topLevelPath = "*", dirPrefix = "") {
  const topLevelPrefix = topLevelPath.replace("*", "").replace(/\/$/, "");
  const keys = Object.keys(pages);
  const routes = keys.map((key) => {
    var _a;
    const path = (0, import_apiRoutes.extractPathFromRoutesKey)(key, dirPrefix);
    const exact = !/\[(?:[.]{3})(\w+?)\]/.test(key);
    if (!pages[key].default && !pages[key].api) {
      (_a = import_log.log) == null ? void 0 : _a.warn(`${key} doesn't export a default React component or an API function`);
    }
    return {
      path: topLevelPrefix + path,
      component: pages[key].default,
      exact
    };
  }).filter((route) => route.component);
  return [
    ...routes.filter((route) => !route.path.includes(":")),
    ...routes.filter((route) => route.path.includes(":"))
  ];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FileRoutes,
  createPageRoutes
});
//# sourceMappingURL=FileRoutes.server.js.map

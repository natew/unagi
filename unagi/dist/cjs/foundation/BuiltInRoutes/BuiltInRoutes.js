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
var BuiltInRoutes_exports = {};
__export(BuiltInRoutes_exports, {
  getBuiltInRoute: () => getBuiltInRoute
});
module.exports = __toCommonJS(BuiltInRoutes_exports);
var import_healthCheck = require("./healthCheck.js");
const builtInRoutes = [
  {
    pathname: "/__health",
    resource: import_healthCheck.HealthCheck
  }
];
function getBuiltInRoute(url) {
  for (const route of builtInRoutes) {
    if (url.pathname === route.pathname || route.regex && route.regex.test(url.pathname)) {
      return route.resource;
    }
  }
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getBuiltInRoute
});
//# sourceMappingURL=BuiltInRoutes.js.map

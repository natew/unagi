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
var useRouteParams_exports = {};
__export(useRouteParams_exports, {
  useRouteParams: () => useRouteParams
});
module.exports = __toCommonJS(useRouteParams_exports);
var import_ssrInterop = require("../ssrInterop.js");
var import_RouteParamsProvider_client = require("./RouteParamsProvider.client.js");
function useRouteParams() {
  const router = (0, import_ssrInterop.useEnvContext)((req) => req.ctx.router, import_RouteParamsProvider_client.RouteParamsContext);
  return router.routeParams;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useRouteParams
});
//# sourceMappingURL=useRouteParams.js.map

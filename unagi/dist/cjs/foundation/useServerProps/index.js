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
var useServerProps_exports = {};
__export(useServerProps_exports, {
  useServerProps: () => import_use_server_props.useServerProps
});
module.exports = __toCommonJS(useServerProps_exports);
var import_use_server_props = require("./use-server-props.js");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useServerProps
});
//# sourceMappingURL=index.js.map

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
var constants_exports = {};
__export(constants_exports, {
  EVENT_PATHNAME: () => EVENT_PATHNAME,
  EVENT_PATHNAME_REGEX: () => EVENT_PATHNAME_REGEX,
  RSC_PATHNAME: () => RSC_PATHNAME
});
module.exports = __toCommonJS(constants_exports);
const RSC_PATHNAME = "/__rsc";
const EVENT_PATHNAME = "/__event";
const EVENT_PATHNAME_REGEX = new RegExp(`^${EVENT_PATHNAME}/`);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EVENT_PATHNAME,
  EVENT_PATHNAME_REGEX,
  RSC_PATHNAME
});
//# sourceMappingURL=constants.js.map

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
var strategies_exports = {};
__export(strategies_exports, {
  CacheCustom: () => CacheCustom,
  CacheLong: () => CacheLong,
  CacheNone: () => CacheNone,
  CacheShort: () => CacheShort,
  NO_STORE: () => NO_STORE,
  generateCacheControlHeader: () => generateCacheControlHeader
});
module.exports = __toCommonJS(strategies_exports);
const PUBLIC = "public";
const PRIVATE = "private";
const NO_STORE = "no-store";
const optionMapping = {
  maxAge: "max-age",
  staleWhileRevalidate: "stale-while-revalidate",
  sMaxAge: "s-maxage",
  staleIfError: "stale-if-error"
};
function generateCacheControlHeader(cacheOptions) {
  const cacheControl = [];
  Object.keys(cacheOptions).forEach((key) => {
    if (key === "mode") {
      cacheControl.push(cacheOptions[key]);
    } else if (optionMapping[key]) {
      cacheControl.push(`${optionMapping[key]}=${cacheOptions[key]}`);
    }
  });
  return cacheControl.join(", ");
}
function CacheNone() {
  return {
    mode: NO_STORE
  };
}
function guardExpirableModeType(overrideOptions) {
  if ((overrideOptions == null ? void 0 : overrideOptions.mode) && (overrideOptions == null ? void 0 : overrideOptions.mode) !== PUBLIC && (overrideOptions == null ? void 0 : overrideOptions.mode) !== PRIVATE) {
    throw Error("'mode' must be either 'public' or 'private'");
  }
}
function CacheShort(overrideOptions) {
  guardExpirableModeType(overrideOptions);
  return {
    mode: PUBLIC,
    maxAge: 1,
    staleWhileRevalidate: 9,
    ...overrideOptions
  };
}
function CacheLong(overrideOptions) {
  guardExpirableModeType(overrideOptions);
  return {
    mode: PUBLIC,
    maxAge: 3600,
    staleWhileRevalidate: 82800,
    ...overrideOptions
  };
}
function CacheCustom(overrideOptions) {
  return overrideOptions;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CacheCustom,
  CacheLong,
  CacheNone,
  CacheShort,
  NO_STORE,
  generateCacheControlHeader
});
//# sourceMappingURL=index.js.map

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
var fetch_exports = {};
__export(fetch_exports, {
  decodeShopifyId: () => decodeShopifyId,
  fetchBuilder: () => fetchBuilder,
  graphqlRequestBody: () => graphqlRequestBody
});
module.exports = __toCommonJS(fetch_exports);
var import_version = require("../version.js");
const defaultHeaders = {
  "content-type": "application/json",
  "user-agent": `Unagi ${import_version.LIB_VERSION}`
};
function fetchBuilder(url, options = {}) {
  const requestInit = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers }
  };
  return async () => {
    const response = await fetch(url, requestInit);
    if (!response.ok) {
      throw response;
    }
    const data = await response.json();
    return data;
  };
}
function graphqlRequestBody(query, variables) {
  return JSON.stringify({
    query,
    variables
  });
}
function decodeShopifyId(id) {
  if (!id.startsWith("gid://")) {
    throw new Error("invalid Shopify ID");
  }
  return id;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decodeShopifyId,
  fetchBuilder,
  graphqlRequestBody
});
//# sourceMappingURL=fetch.js.map

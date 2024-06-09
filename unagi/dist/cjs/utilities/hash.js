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
var hash_exports = {};
__export(hash_exports, {
  hashKey: () => hashKey
});
module.exports = __toCommonJS(hash_exports);
function hashKey(queryKey) {
  const rawKeys = Array.isArray(queryKey) ? queryKey : [queryKey];
  let hash = "";
  for (const key of rawKeys) {
    if (key != null) {
      if (typeof key === "object") {
        if (!!key.body && typeof key.body === "string") {
          hash += key.body;
        } else {
          hash += JSON.stringify(key);
        }
      } else {
        hash += key;
      }
    }
  }
  return hash;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  hashKey
});
//# sourceMappingURL=hash.js.map

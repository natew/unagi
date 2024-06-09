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
var UnagiResponse_server_exports = {};
__export(UnagiResponse_server_exports, {
  UnagiResponse: () => UnagiResponse
});
module.exports = __toCommonJS(UnagiResponse_server_exports);
var import_react = __toESM(require("react"));
var import_strategies = require("../Cache/strategies/index.js");
var import_Redirect_client = __toESM(require("../Redirect/Redirect.client.js"));
class UnagiResponse extends Response {
  constructor(...args) {
    super(...args);
    this.wait = false;
    this.cacheOptions = (0, import_strategies.CacheShort)();
    this.proxy = Object.defineProperties(/* @__PURE__ */ Object.create(null), {
      status: { value: 200, writable: true },
      statusText: { value: "", writable: true }
    });
    return new Proxy(this, {
      get: (target, key) => target.proxy[key] ?? Reflect.get(target, key),
      set: (target, key, value) => Reflect.set(key in target.proxy ? target.proxy : target, key, value)
    });
  }
  doNotStream() {
    this.wait = true;
  }
  canStream() {
    return !this.wait;
  }
  cache(options) {
    if (options) {
      this.cacheOptions = options;
    }
    return this.cacheOptions;
  }
  get cacheControlHeader() {
    return (0, import_strategies.generateCacheControlHeader)(this.cacheOptions);
  }
  redirect(location, status = 307) {
    this.status = status;
    this.headers.set("location", location);
    return import_react.default.createElement(import_Redirect_client.default, { to: location });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UnagiResponse
});
//# sourceMappingURL=UnagiResponse.server.js.map

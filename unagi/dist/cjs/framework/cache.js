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
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var cache_exports = {};
__export(cache_exports, {
  InMemoryCache: () => InMemoryCache
});
module.exports = __toCommonJS(cache_exports);
var _store;
class InMemoryCache {
  constructor() {
    __privateAdd(this, _store, void 0);
    __privateSet(this, _store, /* @__PURE__ */ new Map());
  }
  add(request) {
    throw new Error("Method not implemented. Use `put` instead.");
  }
  addAll(requests) {
    throw new Error("Method not implemented. Use `put` instead.");
  }
  matchAll(request, options) {
    throw new Error("Method not implemented. Use `match` instead.");
  }
  async put(request, response) {
    var _a;
    if (request.method !== "GET") {
      throw new TypeError("Cannot cache response to non-GET request.");
    }
    if (response.status === 206) {
      throw new TypeError("Cannot cache response to a range request (206 Partial Content).");
    }
    if ((_a = response.headers.get("vary")) == null ? void 0 : _a.includes("*")) {
      throw new TypeError("Cannot cache response with 'Vary: *' header.");
    }
    __privateGet(this, _store).set(request.url, {
      body: new Uint8Array(await response.arrayBuffer()),
      status: response.status,
      headers: [...response.headers],
      timestamp: Date.now()
    });
  }
  async match(request) {
    var _a, _b;
    if (request.method !== "GET")
      return;
    const match = __privateGet(this, _store).get(request.url);
    if (!match) {
      return;
    }
    const { body, timestamp, ...metadata } = match;
    const headers = new Headers(metadata.headers);
    const cacheControl = headers.get("cache-control") || "";
    const maxAge = parseInt(((_a = cacheControl.match(/max-age=(\d+)/)) == null ? void 0 : _a[1]) || "0", 10);
    const swr = parseInt(((_b = cacheControl.match(/stale-while-revalidate=(\d+)/)) == null ? void 0 : _b[1]) || "0", 10);
    const age = (Date.now() - timestamp) / 1e3;
    const isMiss = age > maxAge + swr;
    if (isMiss) {
      __privateGet(this, _store).delete(request.url);
      return;
    }
    const isStale = age > maxAge;
    headers.set("cache", isStale ? "STALE" : "HIT");
    headers.set("date", new Date(timestamp).toUTCString());
    return new Response(body, {
      status: metadata.status ?? 200,
      headers
    });
  }
  async delete(request) {
    if (__privateGet(this, _store).has(request.url)) {
      __privateGet(this, _store).delete(request.url);
      return true;
    }
    return false;
  }
  keys(request) {
    const cacheKeys = [];
    for (const url of __privateGet(this, _store).keys()) {
      if (!request || request.url === url) {
        cacheKeys.push(new Request(url));
      }
    }
    return Promise.resolve(cacheKeys);
  }
}
_store = new WeakMap();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryCache
});
//# sourceMappingURL=cache.js.map

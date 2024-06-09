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
var ServerRequestProvider_exports = {};
__export(ServerRequestProvider_exports, {
  ServerRequestProvider: () => ServerRequestProvider,
  preloadRequestCacheData: () => preloadRequestCacheData,
  useRequestCacheData: () => useRequestCacheData,
  useServerRequest: () => useServerRequest
});
module.exports = __toCommonJS(ServerRequestProvider_exports);
var import_react = __toESM(require("react"));
var import_hash = require("../../utilities/hash.js");
var import_log = require("../../utilities/log/index.js");
var import_timing = require("../../utilities/timing.js");
const RequestContextSSR = (0, import_react.createContext)(null);
function requestCacheRSC() {
  return /* @__PURE__ */ new Map();
}
requestCacheRSC.key = Symbol.for("UNAGI_REQUEST");
function getInternalReactDispatcher() {
  return import_react.default.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current || {};
}
function isRsc() {
  return __UNAGI_TEST__ || !!getInternalReactDispatcher().isRsc;
}
function getCacheForType(resource) {
  const dispatcher = getInternalReactDispatcher();
  if (__UNAGI_TEST__ && !dispatcher.getCacheForType) {
    return globalThis.__jestRscCache ?? (globalThis.__jestRscCache = resource());
  }
  return dispatcher.getCacheForType(resource);
}
function ServerRequestProvider({ request, children }) {
  if (isRsc()) {
    const requestCache = getCacheForType(requestCacheRSC);
    requestCache.set(requestCacheRSC.key, request);
    return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, children);
  }
  return /* @__PURE__ */ import_react.default.createElement(RequestContextSSR.Provider, {
    value: request
  }, children);
}
function useServerRequest() {
  var _a;
  const request = isRsc() ? (_a = getCacheForType(requestCacheRSC)) == null ? void 0 : _a.get(requestCacheRSC.key) : (0, import_react.useContext)(RequestContextSSR);
  if (!request) {
    if (__UNAGI_TEST__) {
      return { ctx: {} };
    }
    throw new Error("No ServerRequest Context found");
  }
  return request;
}
function useRequestCacheData(key, fetcher) {
  const request = useServerRequest();
  const cache = request.ctx.cache;
  const cacheKey = (0, import_hash.hashKey)(key);
  if (!cache.has(cacheKey)) {
    let result2;
    let promise;
    cache.set(cacheKey, () => {
      if (result2 !== void 0) {
        (0, import_log.collectQueryTimings)(request, key, "rendered");
        return result2;
      }
      if (!promise) {
        const startApiTime = (0, import_timing.getTime)();
        const maybePromise = fetcher(request);
        if (!(maybePromise instanceof Promise)) {
          result2 = { data: maybePromise };
          return result2;
        }
        promise = maybePromise.then((data) => {
          result2 = { data };
          (0, import_log.collectQueryTimings)(request, key, "resolved", (0, import_timing.getTime)() - startApiTime);
        }, (error) => result2 = { error });
      }
      throw promise;
    });
  }
  const result = cache.get(cacheKey).call();
  if (result instanceof Promise)
    throw result;
  return result;
}
function preloadRequestCacheData(request) {
  const preloadQueries = request.getPreloadQueries();
  const { cache } = request.ctx;
  preloadQueries == null ? void 0 : preloadQueries.forEach((preloadQuery, cacheKey) => {
    (0, import_log.collectQueryTimings)(request, preloadQuery.key, "preload");
    if (!cache.has(cacheKey)) {
      let result;
      let promise;
      cache.set(cacheKey, () => {
        if (result !== void 0) {
          (0, import_log.collectQueryTimings)(request, preloadQuery.key, "rendered");
          return result;
        }
        if (!promise) {
          const startApiTime = (0, import_timing.getTime)();
          promise = preloadQuery.fetcher(request).then((data) => {
            result = { data };
            (0, import_log.collectQueryTimings)(request, preloadQuery.key, "resolved", (0, import_timing.getTime)() - startApiTime);
          }, (error) => {
            result = { error };
          });
        }
        return promise;
      });
    }
    cache.get(cacheKey).call();
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ServerRequestProvider,
  preloadRequestCacheData,
  useRequestCacheData,
  useServerRequest
});
//# sourceMappingURL=ServerRequestProvider.js.map

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
var hooks_exports = {};
__export(hooks_exports, {
  shouldPreloadQuery: () => shouldPreloadQuery,
  useQuery: () => useQuery
});
module.exports = __toCommonJS(hooks_exports);
var import_log = require("../../utilities/log/index.js");
var import_cache_sub_request = require("../Cache/cache-sub-request.js");
var import_strategies = require("../Cache/strategies/index.js");
var import_ServerRequestProvider = require("../ServerRequestProvider/index.js");
function useQuery(key, queryFn, queryOptions) {
  const request = (0, import_ServerRequestProvider.useServerRequest)();
  const withCacheIdKey = ["__QUERY_CACHE_ID__", ...typeof key === "string" ? [key] : key];
  const fetcher = cachedQueryFnBuilder(withCacheIdKey, queryFn, queryOptions);
  (0, import_log.collectQueryTimings)(request, withCacheIdKey, "requested");
  if (shouldPreloadQuery(queryOptions)) {
    request.savePreloadQuery({
      preload: queryOptions == null ? void 0 : queryOptions.preload,
      key: withCacheIdKey,
      fetcher
    });
  }
  return (0, import_ServerRequestProvider.useRequestCacheData)(withCacheIdKey, fetcher);
}
function shouldPreloadQuery(queryOptions) {
  var _a, _b;
  if (!queryOptions)
    return true;
  const hasCacheOverride = typeof ((_a = queryOptions == null ? void 0 : queryOptions.cache) == null ? void 0 : _a.mode) !== "undefined";
  const hasPreloadOverride = typeof (queryOptions == null ? void 0 : queryOptions.preload) !== "undefined";
  const cacheValue = (_b = queryOptions == null ? void 0 : queryOptions.cache) == null ? void 0 : _b.mode;
  const preloadValue = queryOptions == null ? void 0 : queryOptions.preload;
  if (hasPreloadOverride) {
    return !!preloadValue;
  }
  return hasCacheOverride ? cacheValue !== import_strategies.NO_STORE : true;
}
function cachedQueryFnBuilder(key, generateNewOutput, queryOptions) {
  const resolvedQueryOptions = {
    ...queryOptions ?? {}
  };
  const shouldCacheResponse = (queryOptions == null ? void 0 : queryOptions.shouldCacheResponse) ?? (() => true);
  async function useCachedQueryFn(request) {
    var _a, _b, _c, _d;
    const log = (0, import_log.getLoggerWithContext)(request);
    const cacheResponse = await (0, import_cache_sub_request.getItemFromCache)(key);
    if (cacheResponse) {
      const [output, response] = cacheResponse;
      (0, import_log.collectQueryCacheControlHeaders)(request, key, response.headers.get("cache-control"));
      if ((0, import_cache_sub_request.isStale)(key, response)) {
        const lockKey = ["lock", ...typeof key === "string" ? [key] : key];
        const revalidatingPromise = (0, import_cache_sub_request.getItemFromCache)(lockKey).then(async (lockExists) => {
          if (lockExists)
            return;
          await (0, import_cache_sub_request.setItemInCache)(lockKey, true, (0, import_strategies.CacheShort)({
            maxAge: 10
          }));
          try {
            const output2 = await generateNewOutput();
            if (shouldCacheResponse(output2)) {
              await (0, import_cache_sub_request.setItemInCache)(key, output2, resolvedQueryOptions == null ? void 0 : resolvedQueryOptions.cache);
            }
          } catch (e) {
            log.error(`Error generating async response: ${e.message}`);
          } finally {
            await (0, import_cache_sub_request.deleteItemFromCache)(lockKey);
          }
        });
        (_b = (_a = request.ctx.runtime) == null ? void 0 : _a.waitUntil) == null ? void 0 : _b.call(_a, revalidatingPromise);
      }
      return output;
    }
    const newOutput = await generateNewOutput();
    if (shouldCacheResponse(newOutput)) {
      const setItemInCachePromise = (0, import_cache_sub_request.setItemInCache)(key, newOutput, resolvedQueryOptions == null ? void 0 : resolvedQueryOptions.cache);
      (_d = (_c = request.ctx.runtime) == null ? void 0 : _c.waitUntil) == null ? void 0 : _d.call(_c, setItemInCachePromise);
    }
    (0, import_log.collectQueryCacheControlHeaders)(request, key, (0, import_cache_sub_request.generateSubRequestCacheControlHeader)(resolvedQueryOptions == null ? void 0 : resolvedQueryOptions.cache));
    return newOutput;
  }
  return useCachedQueryFn;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  shouldPreloadQuery,
  useQuery
});
//# sourceMappingURL=hooks.js.map

import {
  collectQueryCacheControlHeaders,
  collectQueryTimings,
  getLoggerWithContext
} from "../../utilities/log/index.js";
import {
  deleteItemFromCache,
  generateSubRequestCacheControlHeader,
  getItemFromCache,
  isStale,
  setItemInCache
} from "../Cache/cache-sub-request.js";
import { CacheShort, NO_STORE } from "../Cache/strategies/index.js";
import { useRequestCacheData, useServerRequest } from "../ServerRequestProvider/index.js";
function useQuery(key, queryFn, queryOptions) {
  const request = useServerRequest();
  const withCacheIdKey = ["__QUERY_CACHE_ID__", ...typeof key === "string" ? [key] : key];
  const fetcher = cachedQueryFnBuilder(withCacheIdKey, queryFn, queryOptions);
  collectQueryTimings(request, withCacheIdKey, "requested");
  if (shouldPreloadQuery(queryOptions)) {
    request.savePreloadQuery({
      preload: queryOptions == null ? void 0 : queryOptions.preload,
      key: withCacheIdKey,
      fetcher
    });
  }
  return useRequestCacheData(withCacheIdKey, fetcher);
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
  return hasCacheOverride ? cacheValue !== NO_STORE : true;
}
function cachedQueryFnBuilder(key, generateNewOutput, queryOptions) {
  const resolvedQueryOptions = {
    ...queryOptions ?? {}
  };
  const shouldCacheResponse = (queryOptions == null ? void 0 : queryOptions.shouldCacheResponse) ?? (() => true);
  async function useCachedQueryFn(request) {
    var _a, _b, _c, _d;
    const log = getLoggerWithContext(request);
    const cacheResponse = await getItemFromCache(key);
    if (cacheResponse) {
      const [output, response] = cacheResponse;
      collectQueryCacheControlHeaders(request, key, response.headers.get("cache-control"));
      if (isStale(key, response)) {
        const lockKey = ["lock", ...typeof key === "string" ? [key] : key];
        const revalidatingPromise = getItemFromCache(lockKey).then(async (lockExists) => {
          if (lockExists)
            return;
          await setItemInCache(lockKey, true, CacheShort({
            maxAge: 10
          }));
          try {
            const output2 = await generateNewOutput();
            if (shouldCacheResponse(output2)) {
              await setItemInCache(key, output2, resolvedQueryOptions == null ? void 0 : resolvedQueryOptions.cache);
            }
          } catch (e) {
            log.error(`Error generating async response: ${e.message}`);
          } finally {
            await deleteItemFromCache(lockKey);
          }
        });
        (_b = (_a = request.ctx.runtime) == null ? void 0 : _a.waitUntil) == null ? void 0 : _b.call(_a, revalidatingPromise);
      }
      return output;
    }
    const newOutput = await generateNewOutput();
    if (shouldCacheResponse(newOutput)) {
      const setItemInCachePromise = setItemInCache(key, newOutput, resolvedQueryOptions == null ? void 0 : resolvedQueryOptions.cache);
      (_d = (_c = request.ctx.runtime) == null ? void 0 : _c.waitUntil) == null ? void 0 : _d.call(_c, setItemInCachePromise);
    }
    collectQueryCacheControlHeaders(request, key, generateSubRequestCacheControlHeader(resolvedQueryOptions == null ? void 0 : resolvedQueryOptions.cache));
    return newOutput;
  }
  return useCachedQueryFn;
}
export {
  shouldPreloadQuery,
  useQuery
};
//# sourceMappingURL=hooks.js.map

import React, { createContext, useContext } from "react";
import { hashKey } from "../../utilities/hash.js";
import { collectQueryTimings } from "../../utilities/log/index.js";
import { getTime } from "../../utilities/timing.js";
const RequestContextSSR = createContext(null);
function requestCacheRSC() {
  return /* @__PURE__ */ new Map();
}
requestCacheRSC.key = Symbol.for("UNAGI_REQUEST");
function getInternalReactDispatcher() {
  return React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current || {};
}
function isRsc() {
  return __UNAGI_TEST__ || !!getInternalReactDispatcher().isRsc;
}
function getCacheForType(resource) {
  const dispatcher = getInternalReactDispatcher();
  if (__UNAGI_TEST__ && !dispatcher.getCacheForType) {
    return globalThis.__jestRscCache ??= resource();
  }
  return dispatcher.getCacheForType(resource);
}
function ServerRequestProvider({ request, children }) {
  if (isRsc()) {
    const requestCache = getCacheForType(requestCacheRSC);
    requestCache.set(requestCacheRSC.key, request);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
  }
  return /* @__PURE__ */ React.createElement(RequestContextSSR.Provider, {
    value: request
  }, children);
}
function useServerRequest() {
  var _a;
  const request = isRsc() ? (_a = getCacheForType(requestCacheRSC)) == null ? void 0 : _a.get(requestCacheRSC.key) : useContext(RequestContextSSR);
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
  const cacheKey = hashKey(key);
  if (!cache.has(cacheKey)) {
    let result2;
    let promise;
    cache.set(cacheKey, () => {
      if (result2 !== void 0) {
        collectQueryTimings(request, key, "rendered");
        return result2;
      }
      if (!promise) {
        const startApiTime = getTime();
        const maybePromise = fetcher(request);
        if (!(maybePromise instanceof Promise)) {
          result2 = { data: maybePromise };
          return result2;
        }
        promise = maybePromise.then((data) => {
          result2 = { data };
          collectQueryTimings(request, key, "resolved", getTime() - startApiTime);
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
    collectQueryTimings(request, preloadQuery.key, "preload");
    if (!cache.has(cacheKey)) {
      let result;
      let promise;
      cache.set(cacheKey, () => {
        if (result !== void 0) {
          collectQueryTimings(request, preloadQuery.key, "rendered");
          return result;
        }
        if (!promise) {
          const startApiTime = getTime();
          promise = preloadQuery.fetcher(request).then((data) => {
            result = { data };
            collectQueryTimings(request, preloadQuery.key, "resolved", getTime() - startApiTime);
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
export {
  ServerRequestProvider,
  preloadRequestCacheData,
  useRequestCacheData,
  useServerRequest
};
//# sourceMappingURL=ServerRequestProvider.js.map

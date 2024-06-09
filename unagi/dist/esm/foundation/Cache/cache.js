import { logCacheApiStatus } from "../../utilities/log/index.js";
import { getCache } from "../runtime.js";
import { CacheShort, generateCacheControlHeader } from "./strategies/index.js";
function getCacheControlSetting(userCacheOptions, options) {
  if (userCacheOptions && options) {
    return {
      ...userCacheOptions,
      ...options
    };
  } else {
    return userCacheOptions || CacheShort();
  }
}
function generateDefaultCacheControlHeader(userCacheOptions) {
  return generateCacheControlHeader(getCacheControlSetting(userCacheOptions));
}
async function getItemFromCache(request) {
  const cache = getCache();
  if (!cache) {
    return;
  }
  const response = await cache.match(request);
  if (!response) {
    logCacheApiStatus("MISS", request.url);
    return;
  }
  logCacheApiStatus("HIT", request.url);
  return response;
}
async function setItemInCache(request, response, userCacheOptions) {
  const cache = getCache();
  if (!cache) {
    return;
  }
  const cacheControl = getCacheControlSetting(userCacheOptions);
  request.headers.set("cache-control", generateDefaultCacheControlHeader(getCacheControlSetting(cacheControl, {
    maxAge: (cacheControl.maxAge || 0) + (cacheControl.staleWhileRevalidate || 0)
  })));
  const cacheControlString = generateDefaultCacheControlHeader(getCacheControlSetting(cacheControl));
  response.headers.set("cache-control", cacheControlString);
  response.headers.set("real-cache-control", cacheControlString);
  response.headers.set("cache-put-date", new Date().toUTCString());
  logCacheApiStatus("PUT", request.url);
  await cache.put(request, response);
}
async function deleteItemFromCache(request) {
  const cache = getCache();
  if (!cache)
    return;
  logCacheApiStatus("DELETE", request.url);
  await cache.delete(request);
}
function isStale(request, response) {
  const responseDate = response.headers.get("cache-put-date");
  const cacheControl = response.headers.get("real-cache-control");
  let responseMaxAge = 0;
  if (cacheControl) {
    const maxAgeMatch = cacheControl.match(/max-age=(\d*)/);
    if (maxAgeMatch && maxAgeMatch.length > 1) {
      responseMaxAge = parseFloat(maxAgeMatch[1]);
    }
  }
  if (!responseDate) {
    return false;
  }
  const ageInMs = new Date().valueOf() - new Date(responseDate).valueOf();
  const age = ageInMs / 1e3;
  const result = age > responseMaxAge;
  if (result) {
    logCacheApiStatus("STALE", request.url);
  }
  return result;
}
export {
  deleteItemFromCache,
  generateDefaultCacheControlHeader,
  getItemFromCache,
  isStale,
  setItemInCache
};
//# sourceMappingURL=cache.js.map

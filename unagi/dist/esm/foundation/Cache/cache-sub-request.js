import { hashKey } from "../../utilities/hash.js";
import { getCache } from "../runtime.js";
import * as CacheApi from "./cache.js";
import { CacheShort } from "./strategies/index.js";
function getKeyUrl(key) {
  return `https://shopify.dev/?${key}`;
}
function getCacheOption(userCacheOptions) {
  return userCacheOptions || CacheShort();
}
function generateSubRequestCacheControlHeader(userCacheOptions) {
  return CacheApi.generateDefaultCacheControlHeader(getCacheOption(userCacheOptions));
}
async function getItemFromCache(key) {
  const cache = getCache();
  if (!cache) {
    return;
  }
  const url = getKeyUrl(hashKey(key));
  const request = new Request(url);
  const response = await CacheApi.getItemFromCache(request);
  if (!response) {
    return;
  }
  return [await response.json(), response];
}
async function setItemInCache(key, value, userCacheOptions) {
  const cache = getCache();
  if (!cache) {
    return;
  }
  const url = getKeyUrl(hashKey(key));
  const request = new Request(url);
  const response = new Response(JSON.stringify(value));
  await CacheApi.setItemInCache(request, response, getCacheOption(userCacheOptions));
}
async function deleteItemFromCache(key) {
  const cache = getCache();
  if (!cache)
    return;
  const url = getKeyUrl(hashKey(key));
  const request = new Request(url);
  await CacheApi.deleteItemFromCache(request);
}
function isStale(key, response) {
  return CacheApi.isStale(new Request(getKeyUrl(hashKey(key))), response);
}
export {
  deleteItemFromCache,
  generateSubRequestCacheControlHeader,
  getItemFromCache,
  isStale,
  setItemInCache
};
//# sourceMappingURL=cache-sub-request.js.map

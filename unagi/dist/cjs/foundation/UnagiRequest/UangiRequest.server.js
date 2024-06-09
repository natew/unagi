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
var UangiRequest_server_exports = {};
__export(UangiRequest_server_exports, {
  HydrogenRequest: () => HydrogenRequest
});
module.exports = __toCommonJS(UangiRequest_server_exports);
var import_react_helmet_async = require("react-helmet-async");
var import_constants = require("../../constants.js");
var import_hash = require("../../utilities/hash.js");
var import_parse = require("../../utilities/parse.js");
var import_timing = require("../../utilities/timing.js");
let reqCounter = 0;
const generateId = typeof crypto !== "undefined" && !!crypto.randomUUID ? () => crypto.randomUUID() : () => `req${++reqCounter}`;
const preloadCache = /* @__PURE__ */ new Map();
const previouslyLoadedUrls = {};
const PRELOAD_ALL = "*";
class HydrogenRequest extends Request {
  constructor(input, init) {
    var __super = (...args) => {
      super(...args);
    };
    if (input instanceof Request) {
      __super(input, init);
    } else {
      __super(getUrlFromNodeRequest(input), getInitFromNodeRequest(input));
    }
    this.time = (0, import_timing.getTime)();
    this.id = generateId();
    this.normalizedUrl = decodeURIComponent(this.isRscRequest() ? normalizeUrl(this.url) : this.url);
    this.ctx = {
      cache: /* @__PURE__ */ new Map(),
      head: new import_react_helmet_async.HelmetData({}),
      router: {
        routeRendered: false,
        serverProps: {},
        routeParams: {}
      },
      queryCacheControl: [],
      queryTimings: [],
      analyticsData: {
        url: this.url,
        normalizedRscUrl: this.normalizedUrl
      },
      preloadQueries: /* @__PURE__ */ new Map(),
      scopes: /* @__PURE__ */ new Map()
    };
    this.cookies = this.parseCookies();
  }
  previouslyLoadedRequest() {
    if (previouslyLoadedUrls[this.normalizedUrl] > 1)
      return true;
    previouslyLoadedUrls[this.normalizedUrl] = previouslyLoadedUrls[this.normalizedUrl] ? 2 : 1;
    return false;
  }
  parseCookies() {
    const cookieString = this.headers.get("cookie") || "";
    return new Map(cookieString.split(";").map((chunk) => chunk.trim()).filter((chunk) => chunk !== "").map((chunk) => chunk.split(/=(.+)/)));
  }
  isRscRequest() {
    const url = new URL(this.url);
    return url.pathname === import_constants.RSC_PATHNAME;
  }
  savePreloadQuery(query) {
    if (query.preload === PRELOAD_ALL) {
      saveToPreloadAllPreload(query);
    } else {
      this.ctx.preloadQueries.set((0, import_hash.hashKey)(query.key), query);
    }
  }
  getPreloadQueries() {
    if (preloadCache.has(this.normalizedUrl)) {
      const combinedPreloadQueries = /* @__PURE__ */ new Map();
      const urlPreloadCache = preloadCache.get(this.normalizedUrl);
      mergeMapEntries(combinedPreloadQueries, urlPreloadCache);
      mergeMapEntries(combinedPreloadQueries, preloadCache.get(PRELOAD_ALL));
      return combinedPreloadQueries;
    } else if (preloadCache.has(PRELOAD_ALL)) {
      return preloadCache.get(PRELOAD_ALL);
    }
  }
  savePreloadQueries() {
    preloadCache.set(this.normalizedUrl, this.ctx.preloadQueries);
  }
  getBuyerIp() {
    return this.headers.get(this.ctx.buyerIpHeader ?? "x-forwarded-for");
  }
  cacheKey(lockKey = false) {
    const url = new URL(this.url);
    if (lockKey) {
      url.searchParams.set("cache-lock", "true");
    }
    return new Request(url.href, this);
  }
  async formData() {
    if (__HYDROGEN_WORKER__ || super.formData)
      return super.formData();
    const contentType = this.headers.get("Content-Type") || "";
    if (/multipart\/form-data/.test(contentType)) {
      throw new Error("multipart/form-data not supported");
    } else if (/application\/x-www-form-urlencoded/.test(contentType)) {
      let entries;
      try {
        entries = new URLSearchParams(await this.text());
      } catch (err) {
        throw new TypeError(void 0, { cause: err });
      }
      const formData = new FormData();
      for (const [name, value] of entries) {
        formData.append(name, value);
      }
      return formData;
    } else {
      throw new TypeError();
    }
  }
}
function mergeMapEntries(map1, map2) {
  map2 && map2.forEach((v, k) => map1.set(k, v));
}
function saveToPreloadAllPreload(query) {
  let setCache = preloadCache.get(PRELOAD_ALL);
  if (!setCache) {
    setCache = /* @__PURE__ */ new Map();
  }
  setCache == null ? void 0 : setCache.set((0, import_hash.hashKey)(query.key), query);
  preloadCache.set(PRELOAD_ALL, setCache);
}
function getUrlFromNodeRequest(request) {
  const url = request.originalUrl ?? request.url;
  if (url && !url.startsWith("/"))
    return url;
  const secure = request.headers["x-forwarded-proto"] === "https";
  return new URL(`${secure ? "https" : "http"}://${request.headers.host + url}`).toString();
}
function getInitFromNodeRequest(request) {
  const init = {
    headers: new Headers(request.headers),
    method: request.method,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : void 0
  };
  const remoteAddress = request.socket.remoteAddress;
  if (!init.headers.has("x-forwarded-for") && remoteAddress) {
    init.headers.set("x-forwarded-for", remoteAddress);
  }
  return init;
}
function normalizeUrl(rawUrl) {
  const url = new URL(rawUrl);
  const state = (0, import_parse.parseJSON)(url.searchParams.get("state") ?? "");
  const normalizedUrl = new URL((state == null ? void 0 : state.pathname) ?? "", url.origin);
  normalizedUrl.search = state == null ? void 0 : state.search;
  return normalizedUrl.toString();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HydrogenRequest
});
//# sourceMappingURL=UangiRequest.server.js.map

"use strict";
var import_http = require("http");
var import_vitest = require("vitest");
var import_strategies = require("../../Cache/strategies/index.js");
var import_constants = require("../../constants.js");
var import_useQuery = require("../../useQuery/index.js");
var import_HydrogenRequest_server = require("./HydrogenRequest.server.js");
(0, import_vitest.describe)("HydrogenRequest", () => {
  (0, import_vitest.it)("converts node request to Fetch API request", () => {
    const request = createHydrogenRequest("/", {
      "user-agent": "Shopify Computer"
    });
    (0, import_vitest.expect)(request.headers.get("user-agent")).toBe("Shopify Computer");
  });
  (0, import_vitest.describe)("Cookies", () => {
    (0, import_vitest.it)("creats a empty Map of cookies by default", () => {
      const request = createHydrogenRequest("/");
      (0, import_vitest.expect)(request.cookies.size).toBe(0);
    });
    (0, import_vitest.it)("provides just a really nice interface for Cookies", () => {
      const request = createHydrogenRequest("/", {
        cookie: "shopifyCartId=12345; favoriteFruit=apple;"
      });
      (0, import_vitest.expect)(request.cookies.size).toBe(2);
      (0, import_vitest.expect)(request.cookies.get("shopifyCartId")).toBe("12345");
    });
    (0, import_vitest.it)("handles JSON serialized Cookies", () => {
      const cookieKey = "productIds";
      const productIds = ["productId1=", "productId2="];
      const serializedProductIds = JSON.stringify(productIds);
      const request = createHydrogenRequest("/", {
        cookie: `shopifyCartId=12345; ${cookieKey}=${serializedProductIds}`
      });
      (0, import_vitest.expect)(JSON.parse(request.cookies.get(cookieKey))).toStrictEqual(productIds);
    });
  });
  (0, import_vitest.it)("Preloads queries with default cache", () => {
    (0, import_vitest.expect)((0, import_useQuery.shouldPreloadQuery)()).toBe(true);
    (0, import_vitest.expect)((0, import_useQuery.shouldPreloadQuery)({})).toBe(true);
    (0, import_vitest.expect)((0, import_useQuery.shouldPreloadQuery)({ cache: {} })).toBe(true);
  });
  (0, import_vitest.it)("Preloads queries with manual cache", () => {
    (0, import_vitest.expect)((0, import_useQuery.shouldPreloadQuery)({ cache: (0, import_strategies.CacheShort)() })).toBe(true);
    (0, import_vitest.expect)((0, import_useQuery.shouldPreloadQuery)({ cache: (0, import_strategies.CacheLong)() })).toBe(true);
  });
  (0, import_vitest.it)("Does not preload with no cache", () => {
    (0, import_vitest.expect)((0, import_useQuery.shouldPreloadQuery)({ cache: (0, import_strategies.CacheNone)() })).toBe(false);
  });
  (0, import_vitest.it)("Does not preload with default cache and preloading explicitly turned off", () => {
    (0, import_vitest.expect)((0, import_useQuery.shouldPreloadQuery)({ preload: false })).toBe(false);
    (0, import_vitest.expect)((0, import_useQuery.shouldPreloadQuery)({ cache: {}, preload: false })).toBe(false);
  });
  (0, import_vitest.it)("Does not preload with manual cache and preloading explicitly turned off", () => {
    (0, import_vitest.expect)((0, import_useQuery.shouldPreloadQuery)({ cache: (0, import_strategies.CacheShort)(), preload: false })).toBe(false);
    (0, import_vitest.expect)((0, import_useQuery.shouldPreloadQuery)({ cache: (0, import_strategies.CacheLong)(), preload: false })).toBe(false);
  });
  (0, import_vitest.it)("Preloads queries with caching disabled and preloading explicitly turned on", () => {
    (0, import_vitest.expect)((0, import_useQuery.shouldPreloadQuery)({ cache: (0, import_strategies.CacheNone)(), preload: true })).toBe(true);
  });
  (0, import_vitest.it)("saves preload queries", () => {
    const request = createHydrogenRequest(`https://localhost:3000/`);
    request.savePreloadQuery(createPreloadQueryEntry("test1", true));
    request.savePreloadQueries();
    const preloadQueries = request.getPreloadQueries();
    (0, import_vitest.expect)(preloadQueries).toBeDefined();
    (0, import_vitest.expect)(preloadQueries && preloadQueries.get("test1")).toMatchInlineSnapshot(`
      Object {
        "fetcher": [Function],
        "key": Array [
          "test1",
        ],
        "preload": true,
      }
    `);
  });
  (0, import_vitest.it)("get preload queries on sub-sequent load", () => {
    const request = createHydrogenRequest(`https://localhost:3000/`);
    request.savePreloadQuery(createPreloadQueryEntry("test1", true));
    request.savePreloadQueries();
    const request2 = createHydrogenRequest(`https://localhost:3000/`);
    const preloadQueries = request2.getPreloadQueries();
    (0, import_vitest.expect)(preloadQueries).toBeDefined();
    (0, import_vitest.expect)(preloadQueries && preloadQueries.get("test1")).toMatchInlineSnapshot(`
      Object {
        "fetcher": [Function],
        "key": Array [
          "test1",
        ],
        "preload": true,
      }
    `);
  });
  (0, import_vitest.it)("populates buyer IP using Node socket by default", () => {
    const request = createHydrogenRequest("/", void 0, "123.4.5.6");
    (0, import_vitest.expect)(request.getBuyerIp()).toBe("123.4.5.6");
  });
  (0, import_vitest.it)("allows buyer IP header to be overridden", () => {
    const request = createHydrogenRequest("/", { foo: "234.5.6.7" });
    request.ctx.buyerIpHeader = "foo";
    (0, import_vitest.expect)(request.getBuyerIp()).toBe("234.5.6.7");
  });
  (0, import_vitest.it)("provides a normalized URL for both RSC and standard requests", () => {
    const request = createHydrogenRequest("https://shopify.dev/foo?bar=baz");
    (0, import_vitest.expect)(request.normalizedUrl).toBe("https://shopify.dev/foo?bar=baz");
    const rscRequest = createHydrogenRequest(`https://shopify.dev${import_constants.RSC_PATHNAME}?state=${encodeURIComponent(JSON.stringify({ pathname: "/foo", search: "?bar=baz" }))}`);
    (0, import_vitest.expect)(rscRequest.normalizedUrl).toBe("https://shopify.dev/foo?bar=baz");
  });
});
function createHydrogenRequest(url, headers, remoteAddress) {
  const nodeRequest = new import_http.IncomingMessage();
  nodeRequest.method = "GET";
  nodeRequest.url = url;
  nodeRequest.headers = headers ?? {};
  nodeRequest.socket = { remoteAddress: remoteAddress ?? "127.0.0.1" };
  return new import_HydrogenRequest_server.HydrogenRequest(nodeRequest);
}
function createPreloadQueryEntry(key, preload) {
  return {
    key: [key],
    fetcher: createFetcher(key),
    preload
  };
}
function createFetcher(data) {
  return () => Promise.resolve(data);
}
//# sourceMappingURL=HydrogenRequest.test.js.map

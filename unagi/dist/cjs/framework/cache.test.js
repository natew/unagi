"use strict";
var import_vitest = require("vitest");
var import_cache = require("./cache");
(0, import_vitest.describe)("In-Memory Cache", () => {
  const clock = { timestamp: 0 };
  Date.now = import_vitest.vi.fn(() => clock.timestamp);
  const advanceTimeBy = (ms) => {
    clock.timestamp += ms;
  };
  (0, import_vitest.it)("uses cache control header to persist", async () => {
    const cache = new import_cache.InMemoryCache();
    const request = new Request("https://tamagui.dev/");
    const response = new Response("Hello World");
    response.headers.set("cache-control", "max-age=60");
    await cache.put(request, response);
    advanceTimeBy(59 * 1e3);
    const cachedResponse = await cache.match(request);
    (0, import_vitest.expect)(cachedResponse).toBeDefined();
    (0, import_vitest.expect)(cachedResponse.headers.get("cache-control")).toBe(response.headers.get("cache-control"));
    (0, import_vitest.expect)(cachedResponse.headers.get("cache")).toBe("HIT");
    advanceTimeBy(2 * 1e3);
    (0, import_vitest.expect)(await cache.match(request)).toBeUndefined();
  });
  (0, import_vitest.it)("supports stale-while-revalidate", async () => {
    const cache = new import_cache.InMemoryCache();
    const request = new Request("https://tamagui.dev/");
    const response = new Response("Hello World");
    response.headers.set("cache-control", "max-age=10, stale-while-revalidate=60");
    await cache.put(request, response);
    advanceTimeBy(9 * 1e3);
    let cachedResponse;
    cachedResponse = await cache.match(request);
    (0, import_vitest.expect)(cachedResponse).toBeDefined();
    (0, import_vitest.expect)(cachedResponse.headers.get("cache")).toBe("HIT");
    advanceTimeBy(2 * 1e3);
    cachedResponse = await cache.match(request);
    (0, import_vitest.expect)(cachedResponse).toBeDefined();
    (0, import_vitest.expect)(cachedResponse.headers.get("cache")).toBe("STALE");
    advanceTimeBy(60 * 1e3);
    (0, import_vitest.expect)(await cache.match(request)).toBeUndefined();
  });
  (0, import_vitest.it)("supports deleting cache entries", async () => {
    const cache = new import_cache.InMemoryCache();
    const request = new Request("https://tamagui.dev/");
    const response = new Response("Hello World");
    response.headers.set("cache-control", "max-age=10");
    await cache.put(request, response);
    advanceTimeBy(9 * 1e3);
    const cachedResponse = await cache.match(request);
    (0, import_vitest.expect)(cachedResponse).toBeDefined();
    (0, import_vitest.expect)(cachedResponse.headers.get("cache")).toBe("HIT");
    (0, import_vitest.expect)(await cache.delete(request)).toBeTruthy();
    (0, import_vitest.expect)(await cache.match(request)).toBeUndefined();
  });
  (0, import_vitest.it)("deletes entry when encountering cache MISS", async () => {
    const cache = new import_cache.InMemoryCache();
    const request = new Request("https://tamagui.dev/");
    const response = new Response("Hello World");
    response.headers.set("cache-control", "max-age=10");
    cache.put(request, response);
    advanceTimeBy(11 * 1e3);
    (0, import_vitest.expect)(await cache.match(request)).toBeUndefined();
    (0, import_vitest.expect)(await cache.delete(request)).toBeFalsy();
  });
  (0, import_vitest.it)("reads the body", async () => {
    const cache = new import_cache.InMemoryCache();
    const request = new Request("https://tamagui.dev/");
    const response = new Response("Hello World");
    await cache.put(request, response);
    const cachedResponse = await cache.match(request);
    (0, import_vitest.expect)(await cachedResponse.text()).toBe("Hello World");
  });
  (0, import_vitest.it)("does not cache non-GET requests", async () => {
    const cache = new import_cache.InMemoryCache();
    for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
      const request = new Request("https://tamagui.dev/", { method });
      const response = new Response("Hello World");
      await (0, import_vitest.expect)(cache.put(request, response)).rejects.toThrow("Cannot cache response to non-GET request");
    }
  });
  (0, import_vitest.it)("does not match non-GET requests", async () => {
    const cache = new import_cache.InMemoryCache();
    const request = new Request("https://tamagui.dev/");
    const response = new Response("Hello World");
    await cache.put(request, response);
    for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
      const request2 = new Request("https://tamagui.dev/", { method });
      (0, import_vitest.expect)(await cache.match(request2)).toBeUndefined();
    }
  });
  (0, import_vitest.it)("does not cache responses to a range request (status 206)", async () => {
    const cache = new import_cache.InMemoryCache();
    const request = new Request("https://tamagui.dev/", {
      headers: { Range: "bytes=0-10" }
    });
    const response = new Response("Hello World", { status: 206 });
    await (0, import_vitest.expect)(cache.put(request, response)).rejects.toThrow("Cannot cache response to a range request");
  });
  (0, import_vitest.it)("does not cache responses containing vary=* header", async () => {
    const cache = new import_cache.InMemoryCache();
    const request = new Request("https://tamagui.dev/");
    const response = new Response("Hello World");
    response.headers.set("vary", "*");
    await (0, import_vitest.expect)(cache.put(request, response)).rejects.toThrow(`Cannot cache response with 'Vary: *' header.`);
  });
  (0, import_vitest.it)("stores the response status", async () => {
    const cache = new import_cache.InMemoryCache();
    const request = new Request("https://tamagui.dev/");
    const response = new Response("Hello World", { status: 404 });
    await cache.put(request, response);
    const cachedResponse = await cache.match(request);
    (0, import_vitest.expect)(cachedResponse.status).toBe(404);
  });
});
//# sourceMappingURL=cache.test.js.map

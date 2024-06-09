class InMemoryCache {
  #store;
  constructor() {
    this.#store = /* @__PURE__ */ new Map();
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
    this.#store.set(request.url, {
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
    const match = this.#store.get(request.url);
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
      this.#store.delete(request.url);
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
    if (this.#store.has(request.url)) {
      this.#store.delete(request.url);
      return true;
    }
    return false;
  }
  keys(request) {
    const cacheKeys = [];
    for (const url of this.#store.keys()) {
      if (!request || request.url === url) {
        cacheKeys.push(new Request(url));
      }
    }
    return Promise.resolve(cacheKeys);
  }
}
export {
  InMemoryCache
};
//# sourceMappingURL=cache.js.map

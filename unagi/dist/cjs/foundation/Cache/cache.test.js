"use strict";
var import_cache_sub_request = require("./cache-sub-request.js");
var import_strategies = require("./strategies/index.js");
describe("generateSubRequestCacheControlHeader", () => {
  it("generates CacheShort caching strategy by default", () => {
    const header = (0, import_cache_sub_request.generateSubRequestCacheControlHeader)();
    expect(header).toBe("public, max-age=1, stale-while-revalidate=9");
  });
  it("override to private", () => {
    const header = (0, import_cache_sub_request.generateSubRequestCacheControlHeader)((0, import_strategies.CacheShort)({
      mode: "private"
    }));
    expect(header).toBe("private, max-age=1, stale-while-revalidate=9");
  });
  it("supports no-store", () => {
    const header = (0, import_cache_sub_request.generateSubRequestCacheControlHeader)((0, import_strategies.CacheNone)());
    expect(header).toBe("no-store");
  });
});
//# sourceMappingURL=cache.test.js.map

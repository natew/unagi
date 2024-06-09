"use strict";
var import_kolorist = require("kolorist");
var import_vitest = require("vitest");
var import__ = require("../index.js");
var import_log_cache_header = require("../log-cache-header.js");
let mockedLogger;
const QUERY_1 = "test1";
const QUERY_2 = "testing2";
const QUERY_3 = "testable3";
describe("cache header log", () => {
  beforeEach(() => {
    mockedLogger = {
      trace: import_vitest.vi.fn(),
      debug: import_vitest.vi.fn(),
      warn: import_vitest.vi.fn(),
      error: import_vitest.vi.fn(),
      fatal: import_vitest.vi.fn(),
      options: import_vitest.vi.fn(() => ({}))
    };
    (0, import__.setLogger)({ ...mockedLogger, showCacheControlHeader: true });
  });
  afterEach(() => {
    (0, import__.setLogger)(void 0);
  });
  it("should log cache control header for main request", () => {
    const request = {
      url: "http://localhost:3000/",
      ctx: {
        queryCacheControl: []
      }
    };
    const response = {
      cacheControlHeader: "public, max-age=1, stale-while-revalidate=9"
    };
    (0, import_log_cache_header.logCacheControlHeaders)("str", request, response);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request);
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot('"\u250C\u2500\u2500 Cache control header for http://localhost:3000/"');
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[1][1])).toMatchInlineSnapshot('"\u2502 public, max-age=1, stale-while-revalidate=9"');
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[2][1])).toMatchInlineSnapshot('"\u2514\u2500\u2500"');
  });
  it("should log cache control header for sub request", () => {
    const request = {
      url: "http://localhost:3000/react?state=%7B%22pathname%22%3A%22%2F%22%2C%22search%22%3A%22%22%7D",
      ctx: {
        queryCacheControl: []
      }
    };
    const response = {
      cacheControlHeader: "public, max-age=1, stale-while-revalidate=9"
    };
    (0, import_log_cache_header.logCacheControlHeaders)("rsc", request, response);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request);
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot('"\u250C\u2500\u2500 Cache control header for {\\"pathname\\":\\"/\\",\\"search\\":\\"\\"}"');
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[1][1])).toMatchInlineSnapshot('"\u2502 public, max-age=1, stale-while-revalidate=9"');
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[2][1])).toMatchInlineSnapshot('"\u2514\u2500\u2500"');
  });
  it("should log cache control header for main request and sub query request", () => {
    const request = {
      url: "http://localhost:3000/",
      ctx: {
        queryCacheControl: []
      }
    };
    const response = {
      cacheControlHeader: "public, max-age=1, stale-while-revalidate=9"
    };
    (0, import_log_cache_header.collectQueryCacheControlHeaders)(request, QUERY_1, "public, max-age=1, stale-while-revalidate=9");
    (0, import_log_cache_header.logCacheControlHeaders)("str", request, response);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request);
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot('"\u250C\u2500\u2500 Cache control header for http://localhost:3000/"');
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[1][1])).toMatchInlineSnapshot('"\u2502 public, max-age=1, stale-while-revalidate=9"');
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[2][1])).toMatchInlineSnapshot('"\u2502"');
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[3][1])).toMatchInlineSnapshot('"\u2502 query test1 public, max-age=1, stale-while-revalidate=9"');
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[4][1])).toMatchInlineSnapshot('"\u2514\u2500\u2500"');
  });
  it("should log cache control header for main request and several sub query requests", () => {
    const request = {
      url: "http://localhost:3000/",
      ctx: {
        queryCacheControl: []
      }
    };
    const response = {
      cacheControlHeader: "public, max-age=1, stale-while-revalidate=9"
    };
    (0, import_log_cache_header.collectQueryCacheControlHeaders)(request, QUERY_1, "public, max-age=1, stale-while-revalidate=9");
    (0, import_log_cache_header.collectQueryCacheControlHeaders)(request, QUERY_2, "public, max-age=2, stale-while-revalidate=10");
    (0, import_log_cache_header.collectQueryCacheControlHeaders)(request, QUERY_3, "public, max-age=3, stale-while-revalidate=11");
    (0, import_log_cache_header.logCacheControlHeaders)("str", request, response);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request);
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot('"\u250C\u2500\u2500 Cache control header for http://localhost:3000/"');
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[1][1])).toMatchInlineSnapshot('"\u2502 public, max-age=1, stale-while-revalidate=9"');
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[2][1])).toMatchInlineSnapshot('"\u2502"');
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[3][1])).toMatchInlineSnapshot('"\u2502 query test1     public, max-age=1, stale-while-revalidate=9"');
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[4][1])).toMatchInlineSnapshot('"\u2502 query testing2  public, max-age=2, stale-while-revalidate=10"');
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[5][1])).toMatchInlineSnapshot('"\u2502 query testable3 public, max-age=3, stale-while-revalidate=11"');
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[6][1])).toMatchInlineSnapshot('"\u2514\u2500\u2500"');
  });
});
//# sourceMappingURL=log-cache-header.vitest.js.map

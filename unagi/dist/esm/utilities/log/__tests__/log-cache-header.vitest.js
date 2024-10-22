import { stripColors } from "kolorist";
import { vi } from "vitest";
import { setLogger } from "../index.js";
import { collectQueryCacheControlHeaders, logCacheControlHeaders } from "../log-cache-header.js";
let mockedLogger;
const QUERY_1 = "test1";
const QUERY_2 = "testing2";
const QUERY_3 = "testable3";
describe("cache header log", () => {
  beforeEach(() => {
    mockedLogger = {
      trace: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
      options: vi.fn(() => ({}))
    };
    setLogger({ ...mockedLogger, showCacheControlHeader: true });
  });
  afterEach(() => {
    setLogger(void 0);
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
    logCacheControlHeaders("str", request, response);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request);
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot('"\u250C\u2500\u2500 Cache control header for http://localhost:3000/"');
    expect(stripColors(mockedLogger.debug.mock.calls[1][1])).toMatchInlineSnapshot('"\u2502 public, max-age=1, stale-while-revalidate=9"');
    expect(stripColors(mockedLogger.debug.mock.calls[2][1])).toMatchInlineSnapshot('"\u2514\u2500\u2500"');
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
    logCacheControlHeaders("rsc", request, response);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request);
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot('"\u250C\u2500\u2500 Cache control header for {\\"pathname\\":\\"/\\",\\"search\\":\\"\\"}"');
    expect(stripColors(mockedLogger.debug.mock.calls[1][1])).toMatchInlineSnapshot('"\u2502 public, max-age=1, stale-while-revalidate=9"');
    expect(stripColors(mockedLogger.debug.mock.calls[2][1])).toMatchInlineSnapshot('"\u2514\u2500\u2500"');
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
    collectQueryCacheControlHeaders(request, QUERY_1, "public, max-age=1, stale-while-revalidate=9");
    logCacheControlHeaders("str", request, response);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request);
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot('"\u250C\u2500\u2500 Cache control header for http://localhost:3000/"');
    expect(stripColors(mockedLogger.debug.mock.calls[1][1])).toMatchInlineSnapshot('"\u2502 public, max-age=1, stale-while-revalidate=9"');
    expect(stripColors(mockedLogger.debug.mock.calls[2][1])).toMatchInlineSnapshot('"\u2502"');
    expect(stripColors(mockedLogger.debug.mock.calls[3][1])).toMatchInlineSnapshot('"\u2502 query test1 public, max-age=1, stale-while-revalidate=9"');
    expect(stripColors(mockedLogger.debug.mock.calls[4][1])).toMatchInlineSnapshot('"\u2514\u2500\u2500"');
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
    collectQueryCacheControlHeaders(request, QUERY_1, "public, max-age=1, stale-while-revalidate=9");
    collectQueryCacheControlHeaders(request, QUERY_2, "public, max-age=2, stale-while-revalidate=10");
    collectQueryCacheControlHeaders(request, QUERY_3, "public, max-age=3, stale-while-revalidate=11");
    logCacheControlHeaders("str", request, response);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request);
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot('"\u250C\u2500\u2500 Cache control header for http://localhost:3000/"');
    expect(stripColors(mockedLogger.debug.mock.calls[1][1])).toMatchInlineSnapshot('"\u2502 public, max-age=1, stale-while-revalidate=9"');
    expect(stripColors(mockedLogger.debug.mock.calls[2][1])).toMatchInlineSnapshot('"\u2502"');
    expect(stripColors(mockedLogger.debug.mock.calls[3][1])).toMatchInlineSnapshot('"\u2502 query test1     public, max-age=1, stale-while-revalidate=9"');
    expect(stripColors(mockedLogger.debug.mock.calls[4][1])).toMatchInlineSnapshot('"\u2502 query testing2  public, max-age=2, stale-while-revalidate=10"');
    expect(stripColors(mockedLogger.debug.mock.calls[5][1])).toMatchInlineSnapshot('"\u2502 query testable3 public, max-age=3, stale-while-revalidate=11"');
    expect(stripColors(mockedLogger.debug.mock.calls[6][1])).toMatchInlineSnapshot('"\u2514\u2500\u2500"');
  });
});
//# sourceMappingURL=log-cache-header.vitest.js.map

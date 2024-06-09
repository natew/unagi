"use strict";
var import_vitest = require("vitest");
var import_kolorist = require("kolorist");
var import__ = require("../index.js");
var import_log_cache_api_status = require("../log-cache-api-status.js");
let mockedLogger;
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
    (0, import__.setLogger)({ ...mockedLogger, showCacheApiStatus: true });
  });
  afterEach(() => {
    (0, import__.setLogger)(void 0);
  });
  it("should log cache api status", () => {
    (0, import_log_cache_api_status.logCacheApiStatus)("HIT", "https://shopify.dev/?%22__QUERY_CACHE_ID__%22%22hydrogen-preview.myshopify.com%22%22unstable%22%22%7B%5C%22query%5C%22:%5C%22query%20shopInfo%20%7B%5C%5Cn%20%20shop");
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual({});
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot('"[Cache] HIT      query shopInfo"');
  });
});
//# sourceMappingURL=log-cache-api-status.vitest.js.map

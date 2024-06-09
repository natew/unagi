"use strict";
var import_kolorist = require("kolorist");
var import_vitest = require("vitest");
var import__ = require("../index.js");
var import_log_query_timeline = require("../log-query-timeline.js");
let mockedLogger;
const QUERY_1 = "test1";
const QUERY_2 = "testing2";
const time = 16409952e5;
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
    import_vitest.vi.spyOn(performance, "now").mockImplementation(() => time);
    (0, import__.setLogger)({ ...mockedLogger, showQueryTiming: true });
  });
  afterEach(() => {
    (0, import__.setLogger)(void 0);
  });
  it("should log query timing", () => {
    const request = {
      url: "http://localhost:3000/",
      ctx: {
        queryTimings: []
      },
      time: 1640995200200,
      previouslyLoadedRequest: () => false
    };
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_1, "requested");
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_1, "resolved", 100);
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_1, "rendered");
    (0, import_log_query_timeline.logQueryTimings)("ssr", request);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(`
      "\u250C\u2500\u2500 Query timings for http://localhost:3000/
      \u2502 -200.00ms  Requested  test1
      \u2502 -200.00ms  Resolved   test1 (Took 100.00ms)
      \u2502 -200.00ms  Rendered   test1
      \u2514\u2500\u2500"
    `);
  });
  it("should detect suspense waterfall", () => {
    const request = {
      url: "http://localhost:3000/",
      ctx: {
        queryTimings: []
      },
      time: 1640995200200,
      previouslyLoadedRequest: () => true
    };
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_1, "requested");
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_1, "resolved", 100);
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_1, "requested");
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_1, "rendered");
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_2, "requested");
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_2, "resolved", 100);
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_2, "requested");
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_2, "rendered");
    (0, import_log_query_timeline.logQueryTimings)("ssr", request);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(`
      "\u250C\u2500\u2500 Query timings for http://localhost:3000/
      \u2502 -200.00ms  Requested  test1
      \u2502 -200.00ms  Resolved   test1 (Took 100.00ms)
      \u2502 -200.00ms  Requested  test1
      \u2502 -200.00ms  Rendered   test1
      \u2502 Suspense waterfall detected
      \u2502 -200.00ms  Requested  testing2
      \u2502 -200.00ms  Resolved   testing2 (Took 100.00ms)
      \u2502 -200.00ms  Requested  testing2
      \u2502 -200.00ms  Rendered   testing2
      \u2514\u2500\u2500"
    `);
  });
  it("should detect unused query", () => {
    const request = {
      url: "http://localhost:3000/",
      ctx: {
        queryTimings: []
      },
      previouslyLoadedRequest: () => false,
      time: 1640995200200
    };
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_1, "requested");
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_1, "resolved", 100);
    (0, import_log_query_timeline.logQueryTimings)("ssr", request);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(`
      "\u250C\u2500\u2500 Query timings for http://localhost:3000/
      \u2502 -200.00ms  Requested  test1
      \u2502 -200.00ms  Resolved   test1 (Took 100.00ms)
      \u2502 Unused query detected: test1
      \u2514\u2500\u2500"
    `);
  });
  it("should detect multiple data load", () => {
    const request = {
      url: "http://localhost:3000/",
      ctx: {
        queryTimings: []
      },
      previouslyLoadedRequest: () => false,
      time: 1640995200200
    };
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_1, "requested");
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_1, "resolved", 100);
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_1, "resolved", 120);
    (0, import_log_query_timeline.collectQueryTimings)(request, QUERY_1, "rendered");
    (0, import_log_query_timeline.logQueryTimings)("ssr", request);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(`
      "\u250C\u2500\u2500 Query timings for http://localhost:3000/
      \u2502 -200.00ms  Requested  test1
      \u2502 -200.00ms  Resolved   test1 (Took 100.00ms)
      \u2502 -200.00ms  Resolved   test1 (Took 120.00ms)
      \u2502 -200.00ms  Rendered   test1
      \u2502 Multiple data loads detected: test1
      \u2514\u2500\u2500"
    `);
  });
});
//# sourceMappingURL=log-query-timeline.vitest.js.map

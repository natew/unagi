"use strict";
var import_kolorist = require("kolorist");
var import_vitest = require("vitest");
var import__ = require("../index.js");
let mockedLogger;
describe("log", () => {
  beforeEach(() => {
    mockedLogger = {
      trace: import_vitest.vi.fn(),
      debug: import_vitest.vi.fn(),
      warn: import_vitest.vi.fn(),
      error: import_vitest.vi.fn(),
      fatal: import_vitest.vi.fn(),
      options: import_vitest.vi.fn(() => ({}))
    };
    import_vitest.vi.spyOn(Date, "now").mockImplementation(() => 2100);
    import_vitest.vi.spyOn(performance, "now").mockImplementation(() => 2100);
    (0, import__.setLogger)(mockedLogger);
  });
  afterEach(() => {
    (0, import__.setLogger)(void 0);
  });
  it("should return the wrapped mockLogger instance when log is called", () => {
    import__.log.debug("test");
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect(import__.log.options()).toEqual({});
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual({});
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[0][1])).toEqual("test");
  });
  it("should return the mockLogger2 instance when setLogger is called", () => {
    const mockLogger2 = {
      trace: import_vitest.vi.fn(),
      debug: import_vitest.vi.fn(),
      warn: import_vitest.vi.fn(),
      error: import_vitest.vi.fn(),
      fatal: import_vitest.vi.fn(),
      options: import_vitest.vi.fn(() => ({}))
    };
    (0, import__.setLogger)({ ...mockLogger2, showCacheControlHeader: true });
    import__.log.debug("test");
    expect(mockLogger2.debug).toHaveBeenCalled();
    expect(import__.log.options()).toEqual({
      showCacheControlHeader: true
    });
    expect(mockLogger2.debug.mock.calls[0][0]).toEqual({});
    expect(mockLogger2.debug.mock.calls[0][1]).toEqual("test");
  });
  it("should set showCacheControlHeader option correctly", () => {
    (0, import__.setLogger)({ showCacheControlHeader: true });
    expect(import__.log.options()).toEqual({
      showCacheControlHeader: true
    });
  });
  it("should set showCacheApiStatus option correctly", () => {
    (0, import__.setLogger)({
      showCacheApiStatus: true
    });
    expect(import__.log.options()).toEqual({
      showCacheApiStatus: true
    });
  });
  it("should set multiple options correctly", () => {
    (0, import__.setLogger)({
      showCacheControlHeader: true
    });
    expect(import__.log.options()).toEqual({
      showCacheControlHeader: true
    });
    (0, import__.setLogger)({
      showCacheApiStatus: true,
      showCacheControlHeader: true
    });
    expect(import__.log.options()).toEqual({
      showCacheApiStatus: true,
      showCacheControlHeader: true
    });
  });
  it("should log 500 server response", () => {
    const request = {
      method: "GET",
      url: "http://localhost:3000/",
      time: 1e3
    };
    (0, import__.logServerResponse)("str", request, 500);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request);
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot('"GET streaming SSR     500 1100.00 ms http://localhost:3000/"');
  });
  it("should log 200 server response", () => {
    const request = {
      method: "GET",
      url: "http://localhost:3000/",
      time: 1e3
    };
    (0, import__.logServerResponse)("str", request, 200);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request);
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot('"GET streaming SSR     200 1100.00 ms http://localhost:3000/"');
  });
  it("should log 300 server response", () => {
    const request = {
      method: "GET",
      url: "http://localhost:3000/",
      time: 1e3
    };
    (0, import__.logServerResponse)("str", request, 301);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request);
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot('"GET streaming SSR     301 1100.00 ms http://localhost:3000/"');
  });
  it("should log 400 server response", () => {
    const request = {
      method: "GET",
      url: "http://localhost:3000/",
      time: 1e3
    };
    (0, import__.logServerResponse)("str", request, 404);
    expect(mockedLogger.debug).toHaveBeenCalled();
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request);
    expect((0, import_kolorist.stripColors)(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot('"GET streaming SSR     404 1100.00 ms http://localhost:3000/"');
  });
  ["trace", "debug", "warn", "error", "fatal"].forEach((method) => {
    it(`logs ${method}`, () => {
      ;
      import__.log[method](`unagi: ${method}`);
      expect(mockedLogger[method]).toHaveBeenCalled();
      expect(mockedLogger[method].mock.calls[0][0]).toEqual({});
      expect(mockedLogger[method].mock.calls[0][1]).toBe(`unagi: ${method}`);
    });
    it("gets logger for a given context", () => {
      const clog = (0, import__.getLoggerWithContext)({ url: "example.com" });
      clog[method](`unagi: ${method}`);
      expect(mockedLogger[method]).toHaveBeenCalled();
      expect(mockedLogger[method].mock.calls[0][0]).toEqual({
        url: "example.com"
      });
      expect(mockedLogger[method].mock.calls[0][1]).toBe(`unagi: ${method}`);
    });
    it("marks async calls for waitUntil", () => {
      const waitUntilPromises = [];
      const clog = (0, import__.getLoggerWithContext)({
        ctx: {
          runtime: { waitUntil: (p) => waitUntilPromises.push(p) }
        }
      });
      clog[method]("no promise 1");
      clog[method]("no promise 2");
      expect(waitUntilPromises).toHaveLength(0);
      (0, import__.setLogger)({ [method]: async () => null });
      clog[method]("promise 1");
      clog[method]("promise 2");
      expect(waitUntilPromises).toHaveLength(2);
    });
  });
});
//# sourceMappingURL=log.vitest.js.map

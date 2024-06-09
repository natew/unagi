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
var log_exports = {};
__export(log_exports, {
  getLoggerWithContext: () => getLoggerWithContext,
  log: () => log,
  logServerResponse: () => logServerResponse,
  setLogger: () => setLogger
});
module.exports = __toCommonJS(log_exports);
var import_kolorist = require("kolorist");
var import_timing = require("../timing.js");
var import_utils = require("./utils.js");
const defaultLogger = {
  trace(context, ...args) {
  },
  debug(context, ...args) {
    console.log(...args);
  },
  warn(context, ...args) {
    console.warn((0, import_kolorist.yellow)("WARN: "), ...args);
  },
  error(context, ...args) {
    console.error((0, import_kolorist.red)("ERROR: "), ...args);
  },
  fatal(context, ...args) {
    console.error((0, import_kolorist.red)("FATAL: "), ...args);
  },
  options: () => ({})
};
let currentLogger = defaultLogger;
function doLog(method, request, ...args) {
  var _a, _b, _c;
  const maybePromise = currentLogger[method](request, ...args);
  if (maybePromise instanceof Promise) {
    (_c = (_b = (_a = request == null ? void 0 : request.ctx) == null ? void 0 : _a.runtime) == null ? void 0 : _b.waitUntil) == null ? void 0 : _c.call(_b, maybePromise);
  }
}
function getLoggerWithContext(context) {
  return {
    trace: (...args) => doLog("trace", context, ...args),
    debug: (...args) => doLog("debug", context, ...args),
    warn: (...args) => doLog("warn", context, ...args),
    error: (...args) => doLog("error", context, ...args),
    fatal: (...args) => doLog("fatal", context, ...args),
    options: () => currentLogger.options()
  };
}
const log = getLoggerWithContext({});
function setLogger(config) {
  if (!config) {
    currentLogger = defaultLogger;
    return;
  }
  const options = {};
  currentLogger = { ...defaultLogger, ...config, options: () => options };
  for (const key of Object.keys(config)) {
    if (!(key in defaultLogger)) {
      delete currentLogger[key];
      options[key] = config[key];
    }
  }
}
const SERVER_RESPONSE_MAP = {
  str: "streaming SSR",
  rsc: "Server Components",
  ssr: "buffered SSR"
};
function logServerResponse(type, request, responseStatus) {
  const log2 = getLoggerWithContext(request);
  const coloredResponseStatus = responseStatus >= 500 ? (0, import_kolorist.red)(responseStatus) : responseStatus >= 400 ? (0, import_kolorist.yellow)(responseStatus) : responseStatus >= 300 ? (0, import_kolorist.lightBlue)(responseStatus) : (0, import_kolorist.green)(responseStatus);
  const fullType = SERVER_RESPONSE_MAP[type] || type;
  const styledType = (0, import_kolorist.italic)(fullType.padEnd(17));
  const paddedTiming = (((0, import_timing.getTime)() - request.time).toFixed(2) + " ms").padEnd(10);
  const url = (0, import_utils.parseUrl)(type, request.url);
  log2.debug(`${request.method} ${styledType} ${coloredResponseStatus} ${paddedTiming} ${url}`);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getLoggerWithContext,
  log,
  logServerResponse,
  setLogger
});
//# sourceMappingURL=log.js.map

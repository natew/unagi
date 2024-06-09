import { green, italic, lightBlue, red, yellow } from "kolorist";
import { getTime } from "../timing.js";
import { parseUrl } from "./utils.js";
const defaultLogger = {
  trace(context, ...args) {
  },
  debug(context, ...args) {
    console.log(...args);
  },
  warn(context, ...args) {
    console.warn(yellow("WARN: "), ...args);
  },
  error(context, ...args) {
    console.error(red("ERROR: "), ...args);
  },
  fatal(context, ...args) {
    console.error(red("FATAL: "), ...args);
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
  const coloredResponseStatus = responseStatus >= 500 ? red(responseStatus) : responseStatus >= 400 ? yellow(responseStatus) : responseStatus >= 300 ? lightBlue(responseStatus) : green(responseStatus);
  const fullType = SERVER_RESPONSE_MAP[type] || type;
  const styledType = italic(fullType.padEnd(17));
  const paddedTiming = ((getTime() - request.time).toFixed(2) + " ms").padEnd(10);
  const url = parseUrl(type, request.url);
  log2.debug(`${request.method} ${styledType} ${coloredResponseStatus} ${paddedTiming} ${url}`);
}
export {
  getLoggerWithContext,
  log,
  logServerResponse,
  setLogger
};
//# sourceMappingURL=log.js.map

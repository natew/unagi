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
var log_query_timeline_exports = {};
__export(log_query_timeline_exports, {
  collectQueryTimings: () => collectQueryTimings,
  logQueryTimings: () => logQueryTimings
});
module.exports = __toCommonJS(log_query_timeline_exports);
var import_kolorist = require("kolorist");
var import_hash = require("../hash.js");
var import_timing = require("../timing.js");
var import_log = require("./log.js");
var import_utils = require("./utils.js");
const color = import_kolorist.gray;
const TIMING_MAPPING = {
  requested: "Requested",
  rendered: "Rendered",
  resolved: "Resolved",
  preload: "Preload"
};
function collectQueryTimings(request, queryKey, timingType, duration) {
  const hashedKey = (0, import_hash.hashKey)(queryKey);
  request.ctx.queryTimings.push({
    name: (0, import_utils.findQueryName)(hashedKey),
    timingType,
    timestamp: (0, import_timing.getTime)(),
    duration
  });
}
function logQueryTimings(type, request) {
  const log = (0, import_log.getLoggerWithContext)(request);
  if (!__UNAGI_DEV__ && !log.options().showQueryTiming) {
    return;
  }
  const previouslyLoadedRequest = request.previouslyLoadedRequest();
  let logMessage = color(`\u250C\u2500\u2500 Query timings for ${(0, import_utils.parseUrl)(type, request.url)}`);
  let firstSuspenseWaterfallQueryName = "";
  const queryList = request.ctx.queryTimings;
  if (queryList.length > 0) {
    const requestStartTime = request.time;
    const detectSuspenseWaterfall = {};
    const detectMultipleDataLoad = {};
    const preloadedQueries = /* @__PURE__ */ new Set();
    let suspenseWaterfallDetectedCount = 0;
    queryList.forEach((query, index) => {
      if (query.timingType === "preload")
        preloadedQueries.add(query.name);
      if (query.timingType === "requested" || query.timingType === "preload") {
        detectSuspenseWaterfall[query.name] = true;
      } else if (query.timingType === "rendered") {
        delete detectSuspenseWaterfall[query.name];
      } else if (query.timingType === "resolved") {
        detectMultipleDataLoad[query.name] = detectMultipleDataLoad[query.name] ? detectMultipleDataLoad[query.name] + 1 : 1;
      }
      const loadColor = query.timingType === "preload" ? import_kolorist.green : color;
      const duration = query.duration;
      logMessage += color(`
\u2502 ${`${(query.timestamp - requestStartTime).toFixed(2)}ms`.padEnd(10)} ${loadColor(TIMING_MAPPING[query.timingType].padEnd(10))} ${query.name}${query.timingType === "resolved" ? ` (Took ${duration == null ? void 0 : duration.toFixed(2)}ms)` : ""}`);
      if (queryList.length >= index + 4 && Object.keys(detectSuspenseWaterfall).length === 0 && !preloadedQueries.has(query.name) && previouslyLoadedRequest) {
        if (!firstSuspenseWaterfallQueryName)
          firstSuspenseWaterfallQueryName = query.name;
        suspenseWaterfallDetectedCount++;
        const warningColor = suspenseWaterfallDetectedCount === 1 ? import_kolorist.yellow : import_kolorist.red;
        logMessage += `
${color(`\u2502 `)}${warningColor(`Suspense waterfall detected`)}`;
      }
    });
    const unusedQueries = Object.keys(detectSuspenseWaterfall);
    if (unusedQueries.length > 0) {
      unusedQueries.forEach((queryName) => {
        logMessage += `
${color(`\u2502 `)}${(0, import_kolorist.yellow)(`Unused query detected: ${queryName}`)}`;
      });
    }
    Object.keys(detectMultipleDataLoad).forEach((queryName) => {
      const count = detectMultipleDataLoad[queryName];
      if (count > 1) {
        logMessage += `
${color(`\u2502 `)}${(0, import_kolorist.yellow)(`Multiple data loads detected: ${queryName}`)}`;
      }
    });
  }
  logMessage += "\n" + color("\u2514\u2500\u2500");
  if (log.options().showQueryTiming) {
    log.debug(logMessage);
  } else if (firstSuspenseWaterfallQueryName) {
    log.debug((0, import_kolorist.yellow)("Suspense waterfall detected on query: " + firstSuspenseWaterfallQueryName));
    log.debug("  Add the `showQueryTiming` property to your Unagi configuration to see more information:");
    log.debug("  https://shopify.dev/custom-storefronts/unagi/framework/unagi-config#logger");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  collectQueryTimings,
  logQueryTimings
});
//# sourceMappingURL=log-query-timeline.js.map

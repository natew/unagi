import { gray, green, red, yellow } from "kolorist";
import { hashKey } from "../hash.js";
import { getTime } from "../timing.js";
import { getLoggerWithContext } from "./log.js";
import { findQueryName, parseUrl } from "./utils.js";
const color = gray;
const TIMING_MAPPING = {
  requested: "Requested",
  rendered: "Rendered",
  resolved: "Resolved",
  preload: "Preload"
};
function collectQueryTimings(request, queryKey, timingType, duration) {
  const hashedKey = hashKey(queryKey);
  request.ctx.queryTimings.push({
    name: findQueryName(hashedKey),
    timingType,
    timestamp: getTime(),
    duration
  });
}
function logQueryTimings(type, request) {
  const log = getLoggerWithContext(request);
  if (!__UNAGI_DEV__ && !log.options().showQueryTiming) {
    return;
  }
  const previouslyLoadedRequest = request.previouslyLoadedRequest();
  let logMessage = color(`\u250C\u2500\u2500 Query timings for ${parseUrl(type, request.url)}`);
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
      const loadColor = query.timingType === "preload" ? green : color;
      const duration = query.duration;
      logMessage += color(`
\u2502 ${`${(query.timestamp - requestStartTime).toFixed(2)}ms`.padEnd(10)} ${loadColor(TIMING_MAPPING[query.timingType].padEnd(10))} ${query.name}${query.timingType === "resolved" ? ` (Took ${duration == null ? void 0 : duration.toFixed(2)}ms)` : ""}`);
      if (queryList.length >= index + 4 && Object.keys(detectSuspenseWaterfall).length === 0 && !preloadedQueries.has(query.name) && previouslyLoadedRequest) {
        if (!firstSuspenseWaterfallQueryName)
          firstSuspenseWaterfallQueryName = query.name;
        suspenseWaterfallDetectedCount++;
        const warningColor = suspenseWaterfallDetectedCount === 1 ? yellow : red;
        logMessage += `
${color(`\u2502 `)}${warningColor(`Suspense waterfall detected`)}`;
      }
    });
    const unusedQueries = Object.keys(detectSuspenseWaterfall);
    if (unusedQueries.length > 0) {
      unusedQueries.forEach((queryName) => {
        logMessage += `
${color(`\u2502 `)}${yellow(`Unused query detected: ${queryName}`)}`;
      });
    }
    Object.keys(detectMultipleDataLoad).forEach((queryName) => {
      const count = detectMultipleDataLoad[queryName];
      if (count > 1) {
        logMessage += `
${color(`\u2502 `)}${yellow(`Multiple data loads detected: ${queryName}`)}`;
      }
    });
  }
  logMessage += "\n" + color("\u2514\u2500\u2500");
  if (log.options().showQueryTiming) {
    log.debug(logMessage);
  } else if (firstSuspenseWaterfallQueryName) {
    log.debug(yellow("Suspense waterfall detected on query: " + firstSuspenseWaterfallQueryName));
    log.debug("  Add the `showQueryTiming` property to your Unagi configuration to see more information:");
    log.debug("  https://shopify.dev/custom-storefronts/unagi/framework/unagi-config#logger");
  }
}
export {
  collectQueryTimings,
  logQueryTimings
};
//# sourceMappingURL=log-query-timeline.js.map

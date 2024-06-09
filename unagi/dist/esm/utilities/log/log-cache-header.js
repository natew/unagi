import { gray } from "kolorist";
import { hashKey } from "../hash.js";
import { getLoggerWithContext } from "./log.js";
import { findQueryName, parseUrl } from "./utils.js";
const color = gray;
function collectQueryCacheControlHeaders(request, queryKey, cacheControlHeader) {
  request.ctx.queryCacheControl.push({
    name: findQueryName(hashKey(queryKey)),
    header: cacheControlHeader
  });
}
function logCacheControlHeaders(type, request, response) {
  const log = getLoggerWithContext(request);
  if (!log.options().showCacheControlHeader) {
    return;
  }
  log.debug(color(`\u250C\u2500\u2500 Cache control header for ${parseUrl(type, request.url)}`));
  if (response) {
    log.debug(color(`\u2502 ${response.cacheControlHeader}`));
  }
  const queryList = request.ctx.queryCacheControl;
  const longestQueryNameLength = queryList.reduce((max, query) => Math.max(max, query.name.length), 0);
  if (queryList.length > 0) {
    log.debug(color("\u2502"));
    queryList.forEach((query) => {
      log.debug(color(`\u2502 query ${query.name.padEnd(longestQueryNameLength + 1)}${query.header}`));
    });
  }
  log.debug(color("\u2514\u2500\u2500"));
}
export {
  collectQueryCacheControlHeaders,
  logCacheControlHeaders
};
//# sourceMappingURL=log-cache-header.js.map

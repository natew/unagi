import { gray } from "kolorist";
import { log } from ".";
function logCacheApiStatus(status, url) {
  if (!log.options().showCacheApiStatus) {
    return;
  }
  let queryName;
  log.debug(gray(`[Cache] ${status == null ? void 0 : status.padEnd(8)} ${queryName ? `query ${queryName}` : url}`));
}
export {
  logCacheApiStatus
};
//# sourceMappingURL=log-cache-api-status.js.map

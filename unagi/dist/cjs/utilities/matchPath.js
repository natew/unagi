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
var matchPath_exports = {};
__export(matchPath_exports, {
  matchPath: () => matchPath
});
module.exports = __toCommonJS(matchPath_exports);
var import_path_to_regexp = require("path-to-regexp");
const cache = {};
const cacheLimit = 1e4;
let cacheCount = 0;
function compilePath(path, options) {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});
  if (pathCache[path])
    return pathCache[path];
  const keys = [];
  const regexp = (0, import_path_to_regexp.pathToRegexp)(path, keys, options);
  const result = { regexp, keys };
  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    cacheCount++;
  }
  return result;
}
function matchPath(pathname, options = {}) {
  const { path, exact = false, strict = false, sensitive = false } = options;
  const paths = [].concat(path);
  return paths.reduce((matched, path2) => {
    if (!path2 && path2 !== "")
      return null;
    if (matched)
      return matched;
    const { regexp, keys } = compilePath(path2, {
      end: exact,
      strict,
      sensitive
    });
    const match = regexp.exec(pathname);
    if (!match)
      return null;
    const [url, ...values] = match;
    const isExact = pathname === url;
    if (exact && !isExact)
      return null;
    return {
      path: path2,
      url: path2 === "/" && url === "" ? "/" : url,
      isExact,
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  matchPath
});
//# sourceMappingURL=matchPath.js.map

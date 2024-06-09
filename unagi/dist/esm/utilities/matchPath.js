import { pathToRegexp } from "path-to-regexp";
const cache = {};
const cacheLimit = 1e4;
let cacheCount = 0;
function compilePath(path, options) {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});
  if (pathCache[path])
    return pathCache[path];
  const keys = [];
  const regexp = pathToRegexp(path, keys, options);
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
export {
  matchPath
};
//# sourceMappingURL=matchPath.js.map

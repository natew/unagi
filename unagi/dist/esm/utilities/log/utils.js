function findQueryName(key) {
  var _a;
  if (key.length < 100) {
    return key.replace('"__QUERY_CACHE_ID__"', "").replace(/"/g, "");
  }
  return ((_a = key.match(/query\s+([^\s({]+)/)) == null ? void 0 : _a[1]) || "<unknown>";
}
function parseUrl(type, url) {
  return type === "rsc" ? decodeURIComponent(url.substring(url.indexOf("=") + 1)) : url;
}
export {
  findQueryName,
  parseUrl
};
//# sourceMappingURL=utils.js.map

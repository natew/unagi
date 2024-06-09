function htmlEncode(html) {
  return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
export {
  htmlEncode
};
//# sourceMappingURL=htmlEncoding.js.map

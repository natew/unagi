function getTime() {
  if (typeof performance !== "undefined" && performance.now) {
    return performance.now();
  } else {
    return Date.now();
  }
}
export {
  getTime
};
//# sourceMappingURL=timing.js.map

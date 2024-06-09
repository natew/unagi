function hashKey(queryKey) {
  const rawKeys = Array.isArray(queryKey) ? queryKey : [queryKey];
  let hash = "";
  for (const key of rawKeys) {
    if (key != null) {
      if (typeof key === "object") {
        if (!!key.body && typeof key.body === "string") {
          hash += key.body;
        } else {
          hash += JSON.stringify(key);
        }
      } else {
        hash += key;
      }
    }
  }
  return hash;
}
export {
  hashKey
};
//# sourceMappingURL=hash.js.map

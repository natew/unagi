const PUBLIC = "public";
const PRIVATE = "private";
const NO_STORE = "no-store";
const optionMapping = {
  maxAge: "max-age",
  staleWhileRevalidate: "stale-while-revalidate",
  sMaxAge: "s-maxage",
  staleIfError: "stale-if-error"
};
function generateCacheControlHeader(cacheOptions) {
  const cacheControl = [];
  Object.keys(cacheOptions).forEach((key) => {
    if (key === "mode") {
      cacheControl.push(cacheOptions[key]);
    } else if (optionMapping[key]) {
      cacheControl.push(`${optionMapping[key]}=${cacheOptions[key]}`);
    }
  });
  return cacheControl.join(", ");
}
function CacheNone() {
  return {
    mode: NO_STORE
  };
}
function guardExpirableModeType(overrideOptions) {
  if ((overrideOptions == null ? void 0 : overrideOptions.mode) && (overrideOptions == null ? void 0 : overrideOptions.mode) !== PUBLIC && (overrideOptions == null ? void 0 : overrideOptions.mode) !== PRIVATE) {
    throw Error("'mode' must be either 'public' or 'private'");
  }
}
function CacheShort(overrideOptions) {
  guardExpirableModeType(overrideOptions);
  return {
    mode: PUBLIC,
    maxAge: 1,
    staleWhileRevalidate: 9,
    ...overrideOptions
  };
}
function CacheLong(overrideOptions) {
  guardExpirableModeType(overrideOptions);
  return {
    mode: PUBLIC,
    maxAge: 3600,
    staleWhileRevalidate: 82800,
    ...overrideOptions
  };
}
function CacheCustom(overrideOptions) {
  return overrideOptions;
}
export {
  CacheCustom,
  CacheLong,
  CacheNone,
  CacheShort,
  NO_STORE,
  generateCacheControlHeader
};
//# sourceMappingURL=index.js.map

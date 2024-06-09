import {
  CacheShort,
  generateCacheControlHeader
} from "../Cache/strategies/index.js";
import Redirect from "../Redirect/Redirect.client.js";
import React from "react";
class HydrogenResponse extends Response {
  constructor(...args) {
    super(...args);
    this.wait = false;
    this.cacheOptions = CacheShort();
    this.proxy = Object.defineProperties(/* @__PURE__ */ Object.create(null), {
      status: { value: 200, writable: true },
      statusText: { value: "", writable: true }
    });
    return new Proxy(this, {
      get: (target, key) => target.proxy[key] ?? Reflect.get(target, key),
      set: (target, key, value) => Reflect.set(key in target.proxy ? target.proxy : target, key, value)
    });
  }
  doNotStream() {
    this.wait = true;
  }
  canStream() {
    return !this.wait;
  }
  cache(options) {
    if (options) {
      this.cacheOptions = options;
    }
    return this.cacheOptions;
  }
  get cacheControlHeader() {
    return generateCacheControlHeader(this.cacheOptions);
  }
  redirect(location, status = 307) {
    this.status = status;
    this.headers.set("location", location);
    return React.createElement(Redirect, { to: location });
  }
}
export {
  HydrogenResponse
};
//# sourceMappingURL=HydrogenResponse.server.js.map

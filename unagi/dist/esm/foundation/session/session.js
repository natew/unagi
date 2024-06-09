import { wrapPromise } from "../../utilities/suspense.js";
function getSyncSessionApi(request, componentResponse, log, session) {
  const sessionPromises = {};
  return session ? {
    get() {
      if (!sessionPromises.getPromise) {
        sessionPromises.getPromise = wrapPromise(session.get(request));
      }
      return sessionPromises.getPromise.read();
    }
  } : emptySyncSessionImplementation(log);
}
const emptySessionImplementation = function(log) {
  return {
    async get() {
      log.warn("No session adapter has been configured!");
      return {};
    },
    async set(key, value) {
      log.warn("No session adapter has been configured!");
    },
    async destroy() {
      log.warn("No session adapter has been configured!");
      return;
    }
  };
};
const emptySyncSessionImplementation = function(log) {
  return {
    get() {
      log.warn("No session adapter has been configured!");
      return {};
    }
  };
};
export {
  emptySessionImplementation,
  emptySyncSessionImplementation,
  getSyncSessionApi
};
//# sourceMappingURL=session.js.map

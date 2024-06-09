"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var BrowserRouter_client_exports = {};
__export(BrowserRouter_client_exports, {
  BrowserRouter: () => BrowserRouter,
  RouterContext: () => RouterContext,
  useLocation: () => useLocation,
  useRouter: () => useRouter
});
module.exports = __toCommonJS(BrowserRouter_client_exports);
var import_history = require("history");
var import_react = __toESM(require("react"));
var import_ssrInterop = require("../ssrInterop.js");
var import_useServerProps = require("../useServerProps.js");
const RouterContext = (0, import_react.createContext)(void 0);
let isFirstLoad = true;
const positions = {};
const BrowserRouter = ({ history: pHistory, children }) => {
  if (import_ssrInterop.META_ENV_SSR)
    return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, children);
  const history = (0, import_react.useMemo)(() => pHistory || (0, import_history.createBrowserHistory)(), [pHistory]);
  const [location, setLocation] = (0, import_react.useState)(history.location);
  const [scrollNeedsRestoration, setScrollNeedsRestoration] = (0, import_react.useState)(false);
  const { pending, locationServerProps, setLocationServerProps } = (0, import_useServerProps.useInternalServerProps)();
  useScrollRestoration({
    location,
    pending,
    serverProps: locationServerProps,
    scrollNeedsRestoration,
    onFinishNavigating: () => setScrollNeedsRestoration(false)
  });
  (0, import_react.useLayoutEffect)(() => {
    const unlisten = history.listen(({ location: newLocation, action }) => {
      positions[location.key] = window.scrollY;
      setLocationServerProps({
        pathname: newLocation.pathname,
        search: newLocation.search
      });
      setLocation(newLocation);
      const state = newLocation.state ?? {};
      const needsScrollRestoration = action === "POP" || !!state.scroll;
      setScrollNeedsRestoration(needsScrollRestoration);
    });
    return () => unlisten();
  }, [history, location, setScrollNeedsRestoration, setLocation, setLocationServerProps]);
  return /* @__PURE__ */ import_react.default.createElement(RouterContext.Provider, {
    value: {
      history,
      location
    }
  }, children);
};
function useRouter() {
  if (import_ssrInterop.META_ENV_SSR)
    return { location: {}, history: {} };
  const router = (0, import_react.useContext)(RouterContext);
  if (router)
    return router;
  throw new Error("Router hooks and <Link> component must be used within a <Router> component");
}
function useLocation() {
  return useRouter().location;
}
function useBeforeUnload(callback) {
  import_react.default.useEffect(() => {
    window.addEventListener("beforeunload", callback);
    return () => {
      window.removeEventListener("beforeunload", callback);
    };
  }, [callback]);
}
function useScrollRestoration({
  location,
  pending,
  serverProps,
  scrollNeedsRestoration,
  onFinishNavigating
}) {
  (0, import_react.useEffect)(() => {
    window.history.scrollRestoration = "manual";
  }, []);
  useBeforeUnload((0, import_react.useCallback)(() => {
    window.history.scrollRestoration = "auto";
  }, []));
  (0, import_react.useLayoutEffect)(() => {
    if (isFirstLoad || !scrollNeedsRestoration) {
      isFirstLoad = false;
      return;
    }
    const position = positions[location.key];
    const finishedNavigating = !pending && location.pathname === serverProps.pathname && location.search === serverProps.search;
    if (!finishedNavigating) {
      return;
    }
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView();
        onFinishNavigating();
        return;
      }
    }
    if (position) {
      window.scrollTo(0, position);
      onFinishNavigating();
      return;
    }
    window.scrollTo(0, 0);
    onFinishNavigating();
  }, [
    location.pathname,
    location.search,
    location.hash,
    location.key,
    pending,
    serverProps.pathname,
    serverProps.search,
    scrollNeedsRestoration,
    onFinishNavigating
  ]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BrowserRouter,
  RouterContext,
  useLocation,
  useRouter
});
//# sourceMappingURL=BrowserRouter.client.js.map

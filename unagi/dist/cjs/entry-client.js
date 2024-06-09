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
var entry_client_exports = {};
__export(entry_client_exports, {
  default: () => entry_client_default
});
module.exports = __toCommonJS(entry_client_exports);
var import_react_server_dom_vite = require("@tamagui/unagi/vendor/react-server-dom-vite");
var import_react = __toESM(require("react"));
var import_client = require("react-dom/client");
var import_react_error_boundary = require("react-error-boundary");
var import_virtual_error = __toESM(require("virtual__error.js"));
var import_constants = require("./constants.js");
var import_ServerPropsProvider = require("./foundation/ServerPropsProvider/index.js");
const import_meta = {};
let rscReader;
const cache = /* @__PURE__ */ new Map();
const flightChunks = [];
const FLIGHT_ATTRIBUTE = "data-flight";
function addElementToFlightChunks(el) {
  const chunk = el.getAttribute(FLIGHT_ATTRIBUTE);
  if (chunk) {
    flightChunks.push(chunk);
  }
}
document.querySelectorAll("[" + FLIGHT_ATTRIBUTE + "]").forEach(addElementToFlightChunks);
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement && node.tagName === "META" && node.hasAttribute(FLIGHT_ATTRIBUTE)) {
        addElementToFlightChunks(node);
      }
    });
  });
});
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
if (flightChunks.length > 0) {
  const contentLoaded = new Promise((resolve) => document.addEventListener("DOMContentLoaded", resolve));
  try {
    rscReader = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const write = (chunk) => {
          controller.enqueue(encoder.encode(chunk));
          return 0;
        };
        flightChunks.forEach(write);
        flightChunks.push = write;
        contentLoaded.then(() => {
          controller.close();
          observer.disconnect();
        });
      }
    });
  } catch (_) {
  }
}
const renderUnagi = async (ClientWrapper) => {
  const root = document.getElementById("root");
  if (!root) {
    console.error(`Could not find a root element <div id="root"></div> to render.`);
    return;
  }
  if (import_meta.hot) {
    import_meta.hot.on("unagi-browser-console", ({ type, data }) => {
      if (type === "warn") {
        console.warn(data);
      }
    });
  }
  let config;
  try {
    config = JSON.parse(root.dataset.clientConfig ?? "{}");
  } catch (error) {
    config = {};
    if (__UNAGI_DEV__) {
      console.warn("Could not parse client configuration in browser", error.message);
    }
  }
  const RootComponent = config.strictMode !== false ? import_react.StrictMode : import_react.Fragment;
  const ServerRequestProviderMock = () => null;
  (0, import_client.hydrateRoot)(root, /* @__PURE__ */ import_react.default.createElement(RootComponent, null, /* @__PURE__ */ import_react.default.createElement(ServerRequestProviderMock, null), /* @__PURE__ */ import_react.default.createElement(import_react_error_boundary.ErrorBoundary, {
    FallbackComponent: import_virtual_error.default ? ({ error }) => /* @__PURE__ */ import_react.default.createElement(CustomErrorWrapper, {
      error,
      errorPage: import_virtual_error.default
    }) : DefaultError
  }, /* @__PURE__ */ import_react.default.createElement(import_react.Suspense, {
    fallback: null
  }, /* @__PURE__ */ import_react.default.createElement(Content, {
    clientWrapper: ClientWrapper
  })))));
};
var entry_client_default = renderUnagi;
function Content({
  clientWrapper: ClientWrapper = ({ children }) => children
}) {
  const [serverProps, setServerProps] = (0, import_react.useState)({
    pathname: window.location.pathname,
    search: window.location.search
  });
  const [rscResponseFromApiRoute, setRscResponseFromApiRoute] = (0, import_react.useState)(null);
  const response = useServerResponse(serverProps, rscResponseFromApiRoute);
  (0, import_react.useEffect)(() => {
    setRscResponseFromApiRoute(null);
  }, [serverProps]);
  return /* @__PURE__ */ import_react.default.createElement(import_ServerPropsProvider.ServerPropsProvider, {
    initialServerProps: serverProps,
    setServerPropsForRsc: setServerProps,
    setRscResponseFromApiRoute
  }, /* @__PURE__ */ import_react.default.createElement(ClientWrapper, null, response.readRoot()));
}
function CustomErrorWrapper({
  error,
  errorPage
}) {
  const Error2 = import_react.default.lazy(errorPage);
  return /* @__PURE__ */ import_react.default.createElement(import_react_error_boundary.ErrorBoundary, {
    FallbackComponent: ({ error: errorRenderingCustomPage }) => {
      if (import_meta.env.DEV) {
        console.error("Error rendering custom error page:\n" + errorRenderingCustomPage);
      }
      return /* @__PURE__ */ import_react.default.createElement(DefaultError, {
        error
      });
    }
  }, /* @__PURE__ */ import_react.default.createElement(import_react.Suspense, {
    fallback: null
  }, /* @__PURE__ */ import_react.default.createElement(Error2, {
    error
  })));
}
function DefaultError({ error }) {
  return /* @__PURE__ */ import_react.default.createElement("div", {
    style: {
      padding: "2em",
      textAlign: "center"
    }
  }, /* @__PURE__ */ import_react.default.createElement("h1", {
    style: { fontSize: "2em", marginBottom: "1em", fontWeight: "bold" }
  }, "Something's wrong here..."), /* @__PURE__ */ import_react.default.createElement("div", {
    style: { fontSize: "1.1em" }
  }, /* @__PURE__ */ import_react.default.createElement("p", null, "We found an error while loading this page."), /* @__PURE__ */ import_react.default.createElement("p", null, "Please, refresh or go back to the", " ", /* @__PURE__ */ import_react.default.createElement("a", {
    href: "/",
    style: { textDecoration: "underline" }
  }, "home page"), ".")));
}
function useServerResponse(state, apiRouteRscResponse) {
  const key = JSON.stringify(state);
  if (apiRouteRscResponse) {
    cache.clear();
    cache.set(apiRouteRscResponse.url, apiRouteRscResponse.response);
    return apiRouteRscResponse.response;
  }
  let response = cache.get(key);
  if (response) {
    return response;
  }
  if (rscReader) {
    response = (0, import_react_server_dom_vite.createFromReadableStream)(rscReader);
    rscReader = null;
  } else {
    if (window.BOOMR && window.BOOMR.plugins && window.BOOMR.plugins.Unagi) {
      window.BOOMR.plugins.Unagi.trackSubPageLoadPerformance();
    }
    response = (0, import_react_server_dom_vite.createFromFetch)(fetch(`${import_constants.RSC_PATHNAME}?state=` + encodeURIComponent(key)));
  }
  cache.clear();
  cache.set(key, response);
  return response;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=entry-client.js.map

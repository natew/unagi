import {
  createFromFetch,
  createFromReadableStream
} from "@tamagui/unagi/vendor/react-server-dom-vite";
import React, {
  Fragment,
  StrictMode,
  Suspense,
  useEffect,
  useState
} from "react";
import { hydrateRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import CustomErrorPage from "virtual__error.js";
import { RSC_PATHNAME } from "./constants.js";
import { ServerPropsProvider } from "./foundation/ServerPropsProvider/index.js";
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
  if (import.meta.hot) {
    import.meta.hot.on("unagi-browser-console", ({ type, data }) => {
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
  const RootComponent = config.strictMode !== false ? StrictMode : Fragment;
  const ServerRequestProviderMock = () => null;
  hydrateRoot(root, /* @__PURE__ */ React.createElement(RootComponent, null, /* @__PURE__ */ React.createElement(ServerRequestProviderMock, null), /* @__PURE__ */ React.createElement(ErrorBoundary, {
    FallbackComponent: CustomErrorPage ? ({ error }) => /* @__PURE__ */ React.createElement(CustomErrorWrapper, {
      error,
      errorPage: CustomErrorPage
    }) : DefaultError
  }, /* @__PURE__ */ React.createElement(Suspense, {
    fallback: null
  }, /* @__PURE__ */ React.createElement(Content, {
    clientWrapper: ClientWrapper
  })))));
};
var entry_client_default = renderUnagi;
function Content({
  clientWrapper: ClientWrapper = ({ children }) => children
}) {
  const [serverProps, setServerProps] = useState({
    pathname: window.location.pathname,
    search: window.location.search
  });
  const [rscResponseFromApiRoute, setRscResponseFromApiRoute] = useState(null);
  const response = useServerResponse(serverProps, rscResponseFromApiRoute);
  useEffect(() => {
    setRscResponseFromApiRoute(null);
  }, [serverProps]);
  return /* @__PURE__ */ React.createElement(ServerPropsProvider, {
    initialServerProps: serverProps,
    setServerPropsForRsc: setServerProps,
    setRscResponseFromApiRoute
  }, /* @__PURE__ */ React.createElement(ClientWrapper, null, response.readRoot()));
}
function CustomErrorWrapper({
  error,
  errorPage
}) {
  const Error = React.lazy(errorPage);
  return /* @__PURE__ */ React.createElement(ErrorBoundary, {
    FallbackComponent: ({ error: errorRenderingCustomPage }) => {
      if (import.meta.env.DEV) {
        console.error("Error rendering custom error page:\n" + errorRenderingCustomPage);
      }
      return /* @__PURE__ */ React.createElement(DefaultError, {
        error
      });
    }
  }, /* @__PURE__ */ React.createElement(Suspense, {
    fallback: null
  }, /* @__PURE__ */ React.createElement(Error, {
    error
  })));
}
function DefaultError({ error }) {
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      padding: "2em",
      textAlign: "center"
    }
  }, /* @__PURE__ */ React.createElement("h1", {
    style: { fontSize: "2em", marginBottom: "1em", fontWeight: "bold" }
  }, "Something's wrong here..."), /* @__PURE__ */ React.createElement("div", {
    style: { fontSize: "1.1em" }
  }, /* @__PURE__ */ React.createElement("p", null, "We found an error while loading this page."), /* @__PURE__ */ React.createElement("p", null, "Please, refresh or go back to the", " ", /* @__PURE__ */ React.createElement("a", {
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
    response = createFromReadableStream(rscReader);
    rscReader = null;
  } else {
    if (window.BOOMR && window.BOOMR.plugins && window.BOOMR.plugins.Unagi) {
      window.BOOMR.plugins.Unagi.trackSubPageLoadPerformance();
    }
    response = createFromFetch(fetch(`${RSC_PATHNAME}?state=` + encodeURIComponent(key)));
  }
  cache.clear();
  cache.set(key, response);
  return response;
}
export {
  entry_client_default as default
};
//# sourceMappingURL=entry-client.js.map

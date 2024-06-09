import { createBrowserHistory } from "history";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from "react";
import { META_ENV_SSR } from "../ssrInterop.js";
import { useInternalServerProps } from "../useServerProps.js";
const RouterContext = createContext(void 0);
let isFirstLoad = true;
const positions = {};
const BrowserRouter = ({ history: pHistory, children }) => {
  if (META_ENV_SSR)
    return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
  const history = useMemo(() => pHistory || createBrowserHistory(), [pHistory]);
  const [location, setLocation] = useState(history.location);
  const [scrollNeedsRestoration, setScrollNeedsRestoration] = useState(false);
  const { pending, locationServerProps, setLocationServerProps } = useInternalServerProps();
  useScrollRestoration({
    location,
    pending,
    serverProps: locationServerProps,
    scrollNeedsRestoration,
    onFinishNavigating: () => setScrollNeedsRestoration(false)
  });
  useLayoutEffect(() => {
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
  return /* @__PURE__ */ React.createElement(RouterContext.Provider, {
    value: {
      history,
      location
    }
  }, children);
};
function useRouter() {
  if (META_ENV_SSR)
    return { location: {}, history: {} };
  const router = useContext(RouterContext);
  if (router)
    return router;
  throw new Error("Router hooks and <Link> component must be used within a <Router> component");
}
function useLocation() {
  return useRouter().location;
}
function useBeforeUnload(callback) {
  React.useEffect(() => {
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
  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);
  useBeforeUnload(useCallback(() => {
    window.history.scrollRestoration = "auto";
  }, []));
  useLayoutEffect(() => {
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
export {
  BrowserRouter,
  RouterContext,
  useLocation,
  useRouter
};
//# sourceMappingURL=BrowserRouter.client.js.map

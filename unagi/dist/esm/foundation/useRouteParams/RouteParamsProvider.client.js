import React, { createContext, useContext } from "react";
const RouteParamsContext = createContext({
  routeParams: {},
  basePath: "/"
});
const RouteParamsProvider = ({ children, routeParams, basePath }) => {
  return /* @__PURE__ */ React.createElement(RouteParamsContext.Provider, {
    value: { routeParams, basePath }
  }, children);
};
function useBasePath() {
  const router = useContext(RouteParamsContext);
  return router.basePath;
}
export {
  RouteParamsContext,
  RouteParamsProvider,
  useBasePath
};
//# sourceMappingURL=RouteParamsProvider.client.js.map

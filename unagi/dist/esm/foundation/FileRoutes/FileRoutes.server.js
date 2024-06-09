import React, { useMemo } from "react";
import { extractPathFromRoutesKey } from "../../utilities/apiRoutes.js";
import { log } from "../../utilities/log/index.js";
import { matchPath } from "../../utilities/matchPath.js";
import { useServerRequest } from "../ServerRequestProvider/index.js";
import { RouteParamsProvider } from "../useRouteParams/RouteParamsProvider.client.js";
function FileRoutes({ routes, basePath, dirPrefix }) {
  const request = useServerRequest();
  const { routeRendered, serverProps } = request.ctx.router;
  if (routeRendered)
    return null;
  if (!routes) {
    const fileRoutes = request.ctx.hydrogenConfig.routes;
    routes = fileRoutes.files;
    dirPrefix ??= fileRoutes.dirPrefix;
    basePath ??= fileRoutes.basePath;
  }
  basePath ??= "/";
  const pageRoutes = useMemo(() => createPageRoutes(routes, basePath, dirPrefix), [routes, basePath, dirPrefix]);
  let foundRoute, foundRouteDetails;
  for (let i = 0; i < pageRoutes.length; i++) {
    foundRouteDetails = matchPath(serverProps.pathname, pageRoutes[i]);
    if (foundRouteDetails) {
      foundRoute = pageRoutes[i];
      break;
    }
  }
  if (foundRoute) {
    request.ctx.router.routeRendered = true;
    request.ctx.router.routeParams = foundRouteDetails.params;
    return /* @__PURE__ */ React.createElement(RouteParamsProvider, {
      routeParams: foundRouteDetails.params,
      basePath
    }, /* @__PURE__ */ React.createElement(foundRoute.component, {
      params: foundRouteDetails.params,
      ...serverProps
    }));
  }
  return null;
}
function createPageRoutes(pages, topLevelPath = "*", dirPrefix = "") {
  const topLevelPrefix = topLevelPath.replace("*", "").replace(/\/$/, "");
  const keys = Object.keys(pages);
  const routes = keys.map((key) => {
    var _a;
    const path = extractPathFromRoutesKey(key, dirPrefix);
    const exact = !/\[(?:[.]{3})(\w+?)\]/.test(key);
    if (!pages[key].default && !pages[key].api) {
      (_a = log) == null ? void 0 : _a.warn(`${key} doesn't export a default React component or an API function`);
    }
    return {
      path: topLevelPrefix + path,
      component: pages[key].default,
      exact
    };
  }).filter((route) => route.component);
  return [
    ...routes.filter((route) => !route.path.includes(":")),
    ...routes.filter((route) => route.path.includes(":"))
  ];
}
export {
  FileRoutes,
  createPageRoutes
};
//# sourceMappingURL=FileRoutes.server.js.map

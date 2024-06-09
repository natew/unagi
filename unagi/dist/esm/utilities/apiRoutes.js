import { RSC_PATHNAME } from "../constants.js";
import { emptySessionImplementation } from "../foundation/session/session.js";
import { getLoggerWithContext, logServerResponse } from "../utilities/log/index.js";
import { matchPath } from "./matchPath.js";
let memoizedApiRoutes = [];
let memoizedRawRoutes = {};
function extractPathFromRoutesKey(routesKey, dirPrefix) {
  let path = routesKey.replace(dirPrefix, "").replace(/\.server\.(t|j)sx?$/, "").replace(/\/index$/i, "/").replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase()).replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`);
  if (path.endsWith("/") && path !== "/") {
    path = path.substring(0, path.length - 1);
  }
  return path;
}
function getApiRoutes({
  files: routes,
  basePath: topLevelPath = "",
  dirPrefix = ""
}) {
  if (!routes || memoizedRawRoutes === routes)
    return memoizedApiRoutes;
  const topLevelPrefix = topLevelPath.replace("*", "").replace(/\/$/, "");
  const keys = Object.keys(routes);
  const apiRoutes = keys.filter((key) => routes[key].api).map((key) => {
    const path = extractPathFromRoutesKey(key, dirPrefix);
    const exact = !/\[(?:[.]{3})(\w+?)\]/.test(key);
    return {
      path: topLevelPrefix + path,
      resource: routes[key].api,
      hasServerComponent: !!routes[key].default,
      exact
    };
  });
  memoizedApiRoutes = [
    ...apiRoutes.filter((route) => !route.path.includes(":")),
    ...apiRoutes.filter((route) => route.path.includes(":"))
  ];
  memoizedRawRoutes = routes;
  return memoizedApiRoutes;
}
function getApiRouteFromURL(url, routes) {
  let foundRoute, foundRouteDetails;
  for (let i = 0; i < routes.length; i++) {
    foundRouteDetails = matchPath(url.pathname, routes[i]);
    if (foundRouteDetails) {
      foundRoute = routes[i];
      break;
    }
  }
  if (!foundRoute)
    return null;
  return {
    resource: foundRoute.resource,
    params: foundRouteDetails.params,
    hasServerComponent: foundRoute.hasServerComponent
  };
}
async function renderApiRoute(request, route, unagiConfig, {
  session,
  suppressLog
}) {
  let response;
  const log = getLoggerWithContext(request);
  let cookieToSet = "";
  try {
    response = await route.resource(request, {
      params: route.params,
      unagiConfig,
      session: session ? {
        async get() {
          return session.get(request);
        },
        async set(key, value) {
          const data = await session.get(request);
          data[key] = value;
          cookieToSet = await session.set(request, data);
        },
        async destroy() {
          cookieToSet = await session.destroy(request);
        }
      } : emptySessionImplementation(log)
    });
    if (!(response instanceof Response || response instanceof Request)) {
      if (typeof response === "string" || response instanceof String) {
        response = new Response(response);
      } else if (typeof response === "object") {
        response = new Response(JSON.stringify(response), {
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
    }
    if (!response) {
      response = new Response(null);
    }
    if (cookieToSet) {
      response.headers.set("Set-Cookie", cookieToSet);
    }
  } catch (e) {
    log.error(e);
    response = new Response("Error processing: " + request.url, {
      status: 500
    });
  }
  if (!suppressLog) {
    logServerResponse("api", request, response.status ?? 200);
  }
  if (response instanceof Request) {
    const url = new URL(request.url);
    const newUrl = new URL(response.url, url);
    if (request.headers.get("Unagi-Client") === "Form-Action") {
      response.headers.set("Unagi-RSC-Pathname", newUrl.pathname + newUrl.search);
      return new Request(getRscUrl(url, newUrl), {
        headers: response.headers
      });
    } else {
      response.headers.set("Location", newUrl.href);
      response.headers.set("Cache-Control", "no-store");
      return new Response(null, {
        status: 303,
        headers: response.headers
      });
    }
  }
  return response;
}
function getRscUrl(currentUrl, newUrl) {
  const rscUrl = new URL(RSC_PATHNAME, currentUrl);
  const searchParams = new URLSearchParams({
    state: JSON.stringify({
      pathname: newUrl.pathname,
      search: newUrl.search
    })
  });
  rscUrl.search = searchParams.toString();
  return rscUrl.toString();
}
export {
  extractPathFromRoutesKey,
  getApiRouteFromURL,
  getApiRoutes,
  renderApiRoute
};
//# sourceMappingURL=apiRoutes.js.map

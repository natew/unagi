"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var apiRoutes_exports = {};
__export(apiRoutes_exports, {
  extractPathFromRoutesKey: () => extractPathFromRoutesKey,
  getApiRouteFromURL: () => getApiRouteFromURL,
  getApiRoutes: () => getApiRoutes,
  renderApiRoute: () => renderApiRoute
});
module.exports = __toCommonJS(apiRoutes_exports);
var import_constants = require("../constants.js");
var import_session = require("../foundation/session/session.js");
var import_log = require("../utilities/log/index.js");
var import_matchPath = require("./matchPath.js");
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
    foundRouteDetails = (0, import_matchPath.matchPath)(url.pathname, routes[i]);
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
  const log = (0, import_log.getLoggerWithContext)(request);
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
      } : (0, import_session.emptySessionImplementation)(log)
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
    (0, import_log.logServerResponse)("api", request, response.status ?? 200);
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
  const rscUrl = new URL(import_constants.RSC_PATHNAME, currentUrl);
  const searchParams = new URLSearchParams({
    state: JSON.stringify({
      pathname: newUrl.pathname,
      search: newUrl.search
    })
  });
  rscUrl.search = searchParams.toString();
  return rscUrl.toString();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extractPathFromRoutesKey,
  getApiRouteFromURL,
  getApiRoutes,
  renderApiRoute
});
//# sourceMappingURL=apiRoutes.js.map

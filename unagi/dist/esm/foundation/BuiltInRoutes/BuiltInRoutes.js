import { HealthCheck } from "./healthCheck.js";
const builtInRoutes = [
  {
    pathname: "/__health",
    resource: HealthCheck
  }
];
function getBuiltInRoute(url) {
  for (const route of builtInRoutes) {
    if (url.pathname === route.pathname || route.regex && route.regex.test(url.pathname)) {
      return route.resource;
    }
  }
  return null;
}
export {
  getBuiltInRoute
};
//# sourceMappingURL=BuiltInRoutes.js.map

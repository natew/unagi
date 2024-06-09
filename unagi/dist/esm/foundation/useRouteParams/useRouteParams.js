import { useEnvContext } from "../ssrInterop.js";
import { RouteParamsContext } from "./RouteParamsProvider.client.js";
function useRouteParams() {
  const router = useEnvContext((req) => req.ctx.router, RouteParamsContext);
  return router.routeParams;
}
export {
  useRouteParams
};
//# sourceMappingURL=useRouteParams.js.map

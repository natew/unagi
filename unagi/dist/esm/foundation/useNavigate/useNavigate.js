import { useRouter } from "../Router/BrowserRouter.client.js";
import { useBasePath } from "../useRouteParams/RouteParamsProvider.client.js";
function useNavigate() {
  const router = useRouter();
  const routeBasePath = useBasePath();
  return (path, options = { replace: false, reloadDocument: false }) => {
    path = buildPath(options.basePath ?? routeBasePath, path);
    const state = {
      ...options == null ? void 0 : options.clientState,
      scroll: (options == null ? void 0 : options.scroll) ?? true
    };
    if (options == null ? void 0 : options.replace) {
      router.history.replace(path, state);
    } else {
      router.history.push(path, state);
    }
  };
}
function buildPath(basePath, path) {
  if (path.startsWith("http") || path.startsWith("//"))
    return path;
  let builtPath = path;
  if (basePath !== "/") {
    const pathFirstChar = path.charAt(0);
    const basePathLastChar = basePath.charAt(basePath.length - 1);
    builtPath = pathFirstChar === "/" && basePathLastChar === "/" ? basePath + path.substring(1) : basePathLastChar !== "/" && pathFirstChar !== "/" ? basePath + "/" + path : basePath + path;
  }
  return builtPath;
}
export {
  buildPath,
  useNavigate
};
//# sourceMappingURL=useNavigate.js.map

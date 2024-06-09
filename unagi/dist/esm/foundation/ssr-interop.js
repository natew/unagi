import { useContext } from "react";
const META_ENV_SSR = false;
const reactContextType = Symbol.for("react.context");
function useEnvContext(serverGetter, clientFallback) {
  return clientFallback && clientFallback.$$typeof === reactContextType ? useContext(clientFallback) : clientFallback;
}
export {
  META_ENV_SSR,
  useEnvContext
};
//# sourceMappingURL=ssr-interop.js.map

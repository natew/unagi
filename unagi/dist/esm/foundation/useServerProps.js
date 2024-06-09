import { useContext } from "react";
import {
  ServerPropsContext
} from "./ServerPropsProvider/ServerPropsProvider.js";
function useServerProps() {
  const internalServerPropsContext = useContext(ServerPropsContext);
  if (!internalServerPropsContext) {
    return {};
  }
  return {
    serverProps: internalServerPropsContext.serverProps,
    setServerProps: internalServerPropsContext.setServerProps,
    pending: internalServerPropsContext.pending
  };
}
function useInternalServerProps() {
  return useContext(ServerPropsContext) ?? {};
}
export {
  useInternalServerProps,
  useServerProps
};
//# sourceMappingURL=useServerProps.js.map

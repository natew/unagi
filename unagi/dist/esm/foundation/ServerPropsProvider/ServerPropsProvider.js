import React, {
  createContext,
  useCallback,
  useMemo,
  useState,
  useTransition
} from "react";
const PRIVATE_PROPS = ["request", "response"];
const ServerPropsContext = createContext(null);
function ServerPropsProvider({
  initialServerProps,
  setServerPropsForRsc,
  setRscResponseFromApiRoute,
  children
}) {
  const [locationServerProps, setLocationServerProps] = useState(initialServerProps);
  const [serverProps, setServerProps] = useState({});
  const [pending, startTransition] = useTransition();
  const setServerPropsCallback = useCallback((input, propValue) => {
    startTransition(() => {
      setServerProps((prev) => getNewValue(prev, input, propValue));
      setServerPropsForRsc((prev) => getNewValue(prev, input, propValue));
    });
  }, [setServerProps, setServerPropsForRsc]);
  const setLocationServerPropsCallback = useCallback((input) => {
    startTransition(() => {
      setServerPropsForRsc(input);
      setServerProps({});
      setLocationServerProps(input);
    });
  }, [setServerProps, setServerPropsForRsc, setLocationServerProps]);
  const getProposedLocationServerPropsCallback = useCallback((input, propValue) => {
    return getNewValue(locationServerProps, input, propValue);
  }, [locationServerProps]);
  function getNewValue(prev, input, propValue) {
    let newValue;
    if (typeof input === "function") {
      newValue = input(prev);
    } else if (typeof input === "string") {
      newValue = { [input]: propValue };
    } else {
      newValue = input;
    }
    if (__UNAGI_DEV__) {
      const privateProp = PRIVATE_PROPS.find((prop) => prop in newValue);
      if (privateProp) {
        console.warn(`Custom "${privateProp}" property in server state is ignored. Use a different name.`);
      }
    }
    return {
      ...prev,
      ...newValue
    };
  }
  const value = useMemo(() => ({
    pending,
    locationServerProps,
    serverProps,
    setServerProps: setServerPropsCallback,
    setLocationServerProps: setLocationServerPropsCallback,
    getProposedLocationServerProps: getProposedLocationServerPropsCallback,
    setRscResponseFromApiRoute
  }), [
    pending,
    locationServerProps,
    serverProps,
    setServerPropsCallback,
    setLocationServerPropsCallback,
    getProposedLocationServerPropsCallback,
    setRscResponseFromApiRoute
  ]);
  return /* @__PURE__ */ React.createElement(ServerPropsContext.Provider, {
    value
  }, children);
}
export {
  ServerPropsContext,
  ServerPropsProvider
};
//# sourceMappingURL=ServerPropsProvider.js.map

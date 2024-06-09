"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var ServerPropsProvider_exports = {};
__export(ServerPropsProvider_exports, {
  ServerPropsContext: () => ServerPropsContext,
  ServerPropsProvider: () => ServerPropsProvider
});
module.exports = __toCommonJS(ServerPropsProvider_exports);
var import_react = __toESM(require("react"));
const PRIVATE_PROPS = ["request", "response"];
const ServerPropsContext = (0, import_react.createContext)(null);
function ServerPropsProvider({
  initialServerProps,
  setServerPropsForRsc,
  setRscResponseFromApiRoute,
  children
}) {
  const [locationServerProps, setLocationServerProps] = (0, import_react.useState)(initialServerProps);
  const [serverProps, setServerProps] = (0, import_react.useState)({});
  const [pending, startTransition] = (0, import_react.useTransition)();
  const setServerPropsCallback = (0, import_react.useCallback)((input, propValue) => {
    startTransition(() => {
      setServerProps((prev) => getNewValue(prev, input, propValue));
      setServerPropsForRsc((prev) => getNewValue(prev, input, propValue));
    });
  }, [setServerProps, setServerPropsForRsc]);
  const setLocationServerPropsCallback = (0, import_react.useCallback)((input) => {
    startTransition(() => {
      setServerPropsForRsc(input);
      setServerProps({});
      setLocationServerProps(input);
    });
  }, [setServerProps, setServerPropsForRsc, setLocationServerProps]);
  const getProposedLocationServerPropsCallback = (0, import_react.useCallback)((input, propValue) => {
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
  const value = (0, import_react.useMemo)(() => ({
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
  return /* @__PURE__ */ import_react.default.createElement(ServerPropsContext.Provider, {
    value
  }, children);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ServerPropsContext,
  ServerPropsProvider
});
//# sourceMappingURL=ServerPropsProvider.js.map

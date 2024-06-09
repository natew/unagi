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
var DevTools_client_exports = {};
__export(DevTools_client_exports, {
  DevTools: () => DevTools
});
module.exports = __toCommonJS(DevTools_client_exports);
var import_react = __toESM(require("react"));
var import_components = require("./components/index.js");
function DevTools({ dataFromServer }) {
  const [open, setOpen] = (0, import_react.useState)(false);
  const toggleOpen = (0, import_react.useCallback)(() => {
    setOpen((state) => !state);
  }, []);
  const [hasMounted, setHasMounted] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    setHasMounted(true);
  }, []);
  if (hasMounted) {
    return /* @__PURE__ */ import_react.default.createElement(import_components.Interface, {
      open,
      onClose: toggleOpen,
      onOpen: toggleOpen
    }, /* @__PURE__ */ import_react.default.createElement(import_components.Panels, {
      ...dataFromServer
    }));
  }
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DevTools
});
//# sourceMappingURL=DevTools.client.js.map

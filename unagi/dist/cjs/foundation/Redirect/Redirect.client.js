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
var Redirect_client_exports = {};
__export(Redirect_client_exports, {
  default: () => Redirect
});
module.exports = __toCommonJS(Redirect_client_exports);
var import_react = require("react");
var import_useNavigate = require("../../foundation/useNavigate/useNavigate.js");
function Redirect({ to }) {
  const navigate = (0, import_useNavigate.useNavigate)();
  (0, import_react.useEffect)(() => {
    if (to.startsWith("http")) {
      window.location.href = to;
    } else {
      navigate(to);
    }
  }, []);
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=Redirect.client.js.map

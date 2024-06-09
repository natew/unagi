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
var icons_exports = {};
__export(icons_exports, {
  CloseIcon: () => CloseIcon,
  UnagiIcon: () => UnagiIcon
});
module.exports = __toCommonJS(icons_exports);
var import_react = __toESM(require("react"));
const CloseIcon = () => /* @__PURE__ */ import_react.default.createElement("svg", {
  style: {
    height: "2.75em",
    width: "2.75em",
    padding: "1em"
  },
  viewBox: "0 0 460.775 460.775",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ import_react.default.createElement("path", {
  fill: "black",
  d: "M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55\n	c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55\n	c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505\n	c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55\n	l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719\n	c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
}));
const UnagiIcon = () => /* @__PURE__ */ import_react.default.createElement("svg", {
  style: {
    height: "2.5em",
    width: "2.5em"
  },
  width: "131",
  height: "130",
  viewBox: "0 0 131 130",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ import_react.default.createElement("path", {
  d: "M64.9548 106.281L27.1377 86.1894L40.0714 79.3723L54.6329 87.1049L66.851 80.6638L52.2895 72.9313L65.2231 66.0979L103.04 86.1894L90.1065 93.0064L76.35 85.6989L64.114 92.1563L77.8884 99.4638L64.9548 106.281Z",
  fill: "black"
}), /* @__PURE__ */ import_react.default.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M65.2247 25L105.178 46.2267L90.105 54.1716L76.3488 46.8642L66.2525 52.1924L80.028 59.5005L64.9532 67.446L25 46.2196L40.0734 38.2748L54.6349 46.0073L64.713 40.6944L50.1533 32.9628L65.2247 25ZM54.4262 32.9673L68.9896 40.7008L54.6315 48.27L40.0699 40.5374L29.276 46.2267L64.9569 65.1833L75.7495 59.4947L61.9761 52.1878L76.3518 44.6012L90.1087 51.9088L100.902 46.2196L65.2221 27.2634L54.4262 32.9673Z",
  fill: "black"
}));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CloseIcon,
  UnagiIcon
});
//# sourceMappingURL=icons.js.map

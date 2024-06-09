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
var Interface_client_exports = {};
__export(Interface_client_exports, {
  Interface: () => Interface
});
module.exports = __toCommonJS(Interface_client_exports);
var import_react = __toESM(require("react"));
var import_icons = require("./icons.js");
function Interface({ children, onClose, onOpen, ...props }) {
  const open = props.open;
  return /* @__PURE__ */ import_react.default.createElement("div", {
    id: "unagi-dev-tools",
    "aria-hidden": true,
    style: {
      position: "fixed",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      right: 0,
      bottom: 0,
      padding: "1.5em",
      maxWidth: "100%",
      flexWrap: "wrap"
    }
  }, /* @__PURE__ */ import_react.default.createElement("button", {
    type: "button",
    style: {
      position: "relative",
      background: "white",
      border: "1px solid",
      padding: "0em 0.5em 0.25em 1.25em",
      boxShadow: "10px 10px 0px black",
      display: "flex",
      alignItems: "center",
      color: "black"
    },
    onClick: onOpen
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    style: { textAlign: "left", flex: 1 }
  }, /* @__PURE__ */ import_react.default.createElement("span", {
    style: {
      fontFamily: "monospace",
      fontWeight: "bold",
      paddingRight: "0.5em"
    }
  }, "Dev tools")), " ", open ? /* @__PURE__ */ import_react.default.createElement(import_icons.CloseIcon, null) : /* @__PURE__ */ import_react.default.createElement(import_icons.UnagiIcon, null)), /* @__PURE__ */ import_react.default.createElement("div", {
    style: {
      display: open ? "block" : "none",
      position: "relative",
      top: "-1px",
      overflow: "scroll",
      color: "black",
      background: "white",
      border: "1px solid",
      boxShadow: "10px 10px 0px black",
      maxWidth: "50em",
      width: "100vw",
      height: "50vh"
    }
  }, children));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Interface
});
//# sourceMappingURL=Interface.client.js.map

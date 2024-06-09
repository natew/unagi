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
var Panels_exports = {};
__export(Panels_exports, {
  Panels: () => Panels
});
module.exports = __toCommonJS(Panels_exports);
var import_react = __toESM(require("react"));
var import_Performance_client = require("./Performance.client.js");
const isComponentPanel = (panel) => panel.component !== void 0;
function Panels({}) {
  const [selectedPanel, setSelectedPanel] = (0, import_react.useState)(0);
  const [navigations, setNavigations] = (0, import_react.useState)([]);
  const panels = getPanels({ performance: { navigations } });
  const panelComponents = panels.map((obj, index) => isComponentPanel(obj) ? /* @__PURE__ */ import_react.default.createElement("div", {
    key: obj.content,
    style: { display: selectedPanel === index ? "block" : "none" }
  }, obj.component) : null);
  return /* @__PURE__ */ import_react.default.createElement("div", {
    style: { display: "flex", height: "100%" }
  }, /* @__PURE__ */ import_react.default.createElement("div", {
    style: { borderRight: "1px solid", padding: "1em 0em" }
  }, panels.map((panel, index) => {
    const active = selectedPanel === index;
    const style = {
      padding: "0em 1.25em",
      fontWeight: "bold",
      textDecoration: active ? "underline" : "none",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    };
    if (isComponentPanel(panel)) {
      return /* @__PURE__ */ import_react.default.createElement("button", {
        key: panel.id,
        type: "button",
        style,
        onClick: () => setSelectedPanel(index)
      }, /* @__PURE__ */ import_react.default.createElement("span", null, panel.content));
    }
    return /* @__PURE__ */ import_react.default.createElement("a", {
      style,
      target: "_blank",
      rel: "noreferrer",
      href: panel.url,
      key: panel.url
    }, panel.content, /* @__PURE__ */ import_react.default.createElement("span", null, "\u2197"));
  })), /* @__PURE__ */ import_react.default.createElement("div", {
    style: { padding: "1em", width: "100%" }
  }, panelComponents[selectedPanel ? selectedPanel : 0]));
}
function getPanels({ performance }) {
  const panels = {
    performance: {
      content: "Performance",
      component: /* @__PURE__ */ import_react.default.createElement(import_Performance_client.Performance, {
        ...performance
      })
    },
    graphiql: {
      content: "GraphiQL",
      url: "/___graphql"
    }
  };
  return Object.keys(panels).map((key) => {
    return { ...panels[key], id: key };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Panels
});
//# sourceMappingURL=Panels.js.map

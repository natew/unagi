import React, { useState } from "react";
import { Performance } from "./Performance.client.js";
const isComponentPanel = (panel) => panel.component !== void 0;
function Panels({}) {
  const [selectedPanel, setSelectedPanel] = useState(0);
  const [navigations, setNavigations] = useState([]);
  const panels = getPanels({ performance: { navigations } });
  const panelComponents = panels.map((obj, index) => isComponentPanel(obj) ? /* @__PURE__ */ React.createElement("div", {
    key: obj.content,
    style: { display: selectedPanel === index ? "block" : "none" }
  }, obj.component) : null);
  return /* @__PURE__ */ React.createElement("div", {
    style: { display: "flex", height: "100%" }
  }, /* @__PURE__ */ React.createElement("div", {
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
      return /* @__PURE__ */ React.createElement("button", {
        key: panel.id,
        type: "button",
        style,
        onClick: () => setSelectedPanel(index)
      }, /* @__PURE__ */ React.createElement("span", null, panel.content));
    }
    return /* @__PURE__ */ React.createElement("a", {
      style,
      target: "_blank",
      rel: "noreferrer",
      href: panel.url,
      key: panel.url
    }, panel.content, /* @__PURE__ */ React.createElement("span", null, "\u2197"));
  })), /* @__PURE__ */ React.createElement("div", {
    style: { padding: "1em", width: "100%" }
  }, panelComponents[selectedPanel ? selectedPanel : 0]));
}
function getPanels({ performance }) {
  const panels = {
    performance: {
      content: "Performance",
      component: /* @__PURE__ */ React.createElement(Performance, {
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
export {
  Panels
};
//# sourceMappingURL=Panels.js.map

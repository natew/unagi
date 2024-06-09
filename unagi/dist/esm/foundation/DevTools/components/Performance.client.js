import React from "react";
import { Heading } from "./Heading.js";
function Performance({ navigations }) {
  const navigationsMarkup = navigations.map(({ url, ttfb, fcp, size, duration, type }) => /* @__PURE__ */ React.createElement("li", {
    key: url,
    style: { padding: "0.5em 0", borderBottom: "1px solid" }
  }, /* @__PURE__ */ React.createElement(Item, {
    label: type,
    value: url.replace("http://localhost:3000", "")
  }), /* @__PURE__ */ React.createElement("div", {
    style: { display: "flex" }
  }, /* @__PURE__ */ React.createElement(Item, {
    label: "TTFB",
    value: ttfb
  }), /* @__PURE__ */ React.createElement(Item, {
    label: "Duration",
    value: duration
  }), /* @__PURE__ */ React.createElement(Item, {
    label: "FCP",
    value: fcp
  }))));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Heading, null, "Performance"), /* @__PURE__ */ React.createElement("ul", null, navigationsMarkup));
}
const Item = ({ label, value, unit }) => {
  if (!value) {
    return null;
  }
  const val = typeof value === "string" ? /* @__PURE__ */ React.createElement("span", {
    style: { fontWeight: "bold" }
  }, value) : `${Math.round(value)}${unit || "ms"}`;
  return /* @__PURE__ */ React.createElement("span", {
    style: {
      fontFamily: "monospace",
      padding: "0 2em 0 0"
    }
  }, label && label.padEnd(10), val);
};
export {
  Performance
};
//# sourceMappingURL=Performance.client.js.map

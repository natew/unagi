import React from "react";
function Table({ items }) {
  const itemsMarkup = items.map(({ key, value }) => /* @__PURE__ */ React.createElement("div", {
    key,
    style: { display: "flex", paddingBottom: "1em", flexDirection: "column" }
  }, /* @__PURE__ */ React.createElement("span", {
    style: { fontWeight: "bold" }
  }, key), /* @__PURE__ */ React.createElement("span", {
    style: { width: "70%", fontFamily: "monospace" }
  }, value)));
  return /* @__PURE__ */ React.createElement("ul", null, itemsMarkup);
}
export {
  Table
};
//# sourceMappingURL=Table.js.map

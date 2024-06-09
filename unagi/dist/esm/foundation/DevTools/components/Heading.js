import React from "react";
function Heading({
  linkText,
  url,
  children
}) {
  return /* @__PURE__ */ React.createElement("span", {
    style: { display: "flex", alignItems: "baseline", padding: "0 0 0em" }
  }, /* @__PURE__ */ React.createElement("span", {
    style: { paddingRight: "0em", flex: 1, fontWeight: "bold" }
  }, children, " "), /* @__PURE__ */ React.createElement("a", {
    style: {
      color: "blue",
      fontFamily: "monospace",
      textDecoration: "underline"
    },
    href: url
  }, linkText));
}
export {
  Heading
};
//# sourceMappingURL=Heading.js.map

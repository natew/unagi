import React, { useEffect, useState } from "react";
function GraphQL() {
  const [warnings, setWarnings] = useState(null);
  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.on("unagi-dev-tools", ({ type, data }) => {
        if (type === "warn") {
          setWarnings((state) => [...state || [], data]);
        }
      });
    }
  }, []);
  const warningsMarkup = warnings ? warnings.map((war, i) => /* @__PURE__ */ React.createElement("li", {
    key: war + i
  }, /* @__PURE__ */ React.createElement("pre", null, war))) : null;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("ul", {
    style: {
      fontFamily: "monospace",
      paddingTop: "1em",
      fontSize: "0.9em"
    }
  }, warningsMarkup));
}
export {
  GraphQL
};
//# sourceMappingURL=GraphQL.client.js.map

import React from "react";
import { Table } from "./Table.js";
const KEY_MAP = {
  locale: "Locale",
  storeDomain: "Domain",
  storefrontApiVersion: "API Version"
};
function Settings(props) {
  const items = Object.entries(props).map(([key, value]) => {
    return {
      key: KEY_MAP[key],
      value,
      type: typeof value
    };
  });
  return /* @__PURE__ */ React.createElement(Table, {
    items
  });
}
export {
  Settings
};
//# sourceMappingURL=Settings.client.js.map

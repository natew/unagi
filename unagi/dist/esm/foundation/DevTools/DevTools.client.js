import React, { useCallback, useEffect, useState } from "react";
import { Interface, Panels } from "./components/index.js";
function DevTools({ dataFromServer }) {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setOpen((state) => !state);
  }, []);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (hasMounted) {
    return /* @__PURE__ */ React.createElement(Interface, {
      open,
      onClose: toggleOpen,
      onOpen: toggleOpen
    }, /* @__PURE__ */ React.createElement(Panels, {
      ...dataFromServer
    }));
  }
  return null;
}
export {
  DevTools
};
//# sourceMappingURL=DevTools.client.js.map

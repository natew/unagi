import { tamaguiPlugin } from "@tamagui/vite-plugin";
import reactPlugin from "@vitejs/plugin-react";
import inspect from "vite-plugin-inspect";
import clientImportsPlugin from "./plugins/clientImportsPlugin.js";
import clientMiddlewarePlugin from "./plugins/clientMiddlewarePlugin.js";
import configPlugin from "./plugins/configPlugin.js";
import hydrationAutoImportPlugin from "./plugins/hydrationAutoImportPlugin.js";
import middlewarePlugin from "./plugins/middlewarePlugin.js";
import platformEntryPlugin from "./plugins/platformEntryPlugin.js";
import ssrInteropPlugin from "./plugins/ssrInteropPlugin.js";
import unagiRscPlugin from "./plugins/unagiRscPlugin.js";
import virtualFilesPlugin from "./plugins/virtualFilesPlugin.js";
const unagiPlugin = (options = {
  configPath: "unagi.config"
}) => {
  return [
    process.env.VITE_INSPECT && inspect(),
    configPlugin(),
    clientMiddlewarePlugin(),
    clientImportsPlugin(),
    middlewarePlugin(options),
    virtualFilesPlugin(options),
    reactPlugin(),
    hydrationAutoImportPlugin(),
    ssrInteropPlugin(),
    tamaguiPlugin({
      config: "tamagui.config.ts",
      components: ["tamagui"]
    }),
    unagiRscPlugin(),
    platformEntryPlugin()
  ];
};
var plugin_default = unagiPlugin;
export {
  plugin_default as default,
  unagiPlugin
};
//# sourceMappingURL=plugin.js.map

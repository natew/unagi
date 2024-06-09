import reactServerDomVite from "@tamagui/unagi/vendor/react-server-dom-vite/plugin.js";
import { UNAGI_DEFAULT_SERVER_ENTRY, VIRTUAL_PROXY_UNAGI_ROUTES_ID } from "./virtualFilesPlugin.js";
function unagiRscPlugin_default(options) {
  return reactServerDomVite({
    serverBuildEntries: [UNAGI_DEFAULT_SERVER_ENTRY, VIRTUAL_PROXY_UNAGI_ROUTES_ID],
    isServerComponentImporterAllowed(importer, source) {
      console.log("source", source);
      return source.includes(UNAGI_DEFAULT_SERVER_ENTRY) || /(index|entry-server|tamagui\.config)\.[jt]s/.test(importer) || /\.test\.[tj]sx?$/.test(importer);
    },
    ...options
  });
}
export {
  unagiRscPlugin_default as default
};
//# sourceMappingURL=unagiRscPlugin.js.map

import reactServerDomVite from "@tamagui/unagi/vendor/react-server-dom-vite/plugin.js";
import { UNAGI_DEFAULT_SERVER_ENTRY, VIRTUAL_PROXY_UNAGI_ROUTES_ID } from "./virtualFilesPlugin.js";
function rscPlugin_default(options) {
  return reactServerDomVite({
    serverBuildEntries: [UNAGI_DEFAULT_SERVER_ENTRY, VIRTUAL_PROXY_UNAGI_ROUTES_ID],
    isServerComponentImporterAllowed(importer, source) {
      return source.includes(UNAGI_DEFAULT_SERVER_ENTRY) || /(index|entry-server|tamagui\.config)\.[jt]s/.test(importer) || /\.test\.[tj]sx?$/.test(importer);
    },
    ...options
  });
}
export {
  rscPlugin_default as default
};
//# sourceMappingURL=rscPlugin.js.map

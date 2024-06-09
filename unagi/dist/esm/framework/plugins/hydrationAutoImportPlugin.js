import path from "path";
import MagicString from "magic-string";
import { normalizePath } from "vite";
const UNAGI_ENTRY_FILE = "unagi-entry-client.jsx";
var hydrationAutoImportPlugin_default = () => {
  let config;
  return {
    name: "vite-plugin-hydration-auto-import",
    enforce: "pre",
    configResolved(_config) {
      config = _config;
    },
    resolveId(id, importer) {
      console.log("hydartion autio", id, importer);
      if ((/^\/?@tamagui\/unagi\/entry-client$/.test(id) || id.endsWith(path.sep + UNAGI_ENTRY_FILE)) && normalizePath(importer || "").endsWith("/index.html")) {
        return path.join(config.root, UNAGI_ENTRY_FILE + "?virtual");
      }
      return null;
    },
    load(id) {
      if (id.includes(UNAGI_ENTRY_FILE + "?virtual")) {
        const code = new MagicString(`import renderUnagi from '@tamagui/unagi/entry-client';
export default renderUnagi((props) => props.children);`);
        return {
          code: code.toString(),
          map: { mappings: "" }
        };
      }
      return null;
    }
  };
};
export {
  hydrationAutoImportPlugin_default as default
};
//# sourceMappingURL=hydrationAutoImportPlugin.js.map

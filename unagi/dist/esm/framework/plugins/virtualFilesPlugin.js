import { promises as fs } from "fs";
import path from "path";
import { normalizePath } from "vite";
import { viteception } from "../viteception.js";
const UNAGI_DEFAULT_SERVER_ENTRY = process.env.UNAGI_SERVER_ENTRY || "/src/App.server";
const VIRTUAL_PREFIX = "virtual__";
const PROXY_PREFIX = "proxy__";
const ERROR_FILE = "error.jsx";
const VIRTUAL_ERROR_FILE = VIRTUAL_PREFIX + ERROR_FILE;
const UNAGI_CONFIG_ID = "unagi.config.ts";
const VIRTUAL_UNAGI_CONFIG_ID = VIRTUAL_PREFIX + UNAGI_CONFIG_ID;
const VIRTUAL_PROXY_UNAGI_CONFIG_ID = VIRTUAL_PREFIX + PROXY_PREFIX + UNAGI_CONFIG_ID;
const UNAGI_ROUTES_ID = "unagi-routes.server.jsx";
const VIRTUAL_UNAGI_ROUTES_ID = VIRTUAL_PREFIX + UNAGI_ROUTES_ID;
const VIRTUAL_PROXY_UNAGI_ROUTES_ID = VIRTUAL_PREFIX + PROXY_PREFIX + UNAGI_ROUTES_ID;
var virtualFilesPlugin_default = (pluginOptions) => {
  let config;
  let server;
  return {
    name: "unagi:virtual-files",
    configResolved(_config) {
      config = _config;
    },
    configureServer(_server) {
      server = _server;
    },
    resolveId(source, importer) {
      console.log("virtual files", source, importer);
      if (source === VIRTUAL_UNAGI_CONFIG_ID) {
        return findUnagiConfigPath(config.root, pluginOptions.configPath).then((hcPath) => this.resolve(hcPath, importer, { skipSelf: true }));
      }
      if ([
        VIRTUAL_PROXY_UNAGI_CONFIG_ID,
        VIRTUAL_PROXY_UNAGI_ROUTES_ID,
        VIRTUAL_UNAGI_ROUTES_ID,
        VIRTUAL_ERROR_FILE
      ].includes(source)) {
        return "\0" + source;
      }
    },
    load(id) {
      if (id === "\0" + VIRTUAL_PROXY_UNAGI_CONFIG_ID) {
        return `import hc from '${VIRTUAL_UNAGI_CONFIG_ID}'; export default hc;`;
      }
      if (id === "\0" + VIRTUAL_PROXY_UNAGI_ROUTES_ID) {
        return `import hr from '${VIRTUAL_UNAGI_ROUTES_ID}'; export default hr;`;
      }
      if (id === "\0" + VIRTUAL_UNAGI_ROUTES_ID) {
        return importUnagiConfig().then((hc) => {
          var _a, _b;
          let routesPath = (typeof hc.routes === "string" ? hc.routes : (_a = hc.routes) == null ? void 0 : _a.files) ?? "/src/routes";
          if (routesPath.startsWith("./")) {
            routesPath = routesPath.slice(1);
          }
          if (!routesPath.includes("*")) {
            if (!routesPath.endsWith("/")) {
              routesPath += "/";
            }
            routesPath += "**/*.server.[jt](s|sx)";
          }
          const [dirPrefix] = routesPath.split("/*");
          let code = `export default {
  dirPrefix: '${dirPrefix}',
  basePath: '${((_b = hc.routes) == null ? void 0 : _b.basePath) ?? ""}',
  files: import.meta.globEager('${routesPath}')
};`;
          if (config.command === "serve") {
            code += `
import '${VIRTUAL_UNAGI_CONFIG_ID}';`;
          }
          return { code };
        });
      }
      if (id === "\0" + VIRTUAL_ERROR_FILE) {
        return importUnagiConfig().then((hc) => {
          const errorPath = hc.serverErrorPage ?? "/src/Error.{jsx,tsx}";
          const code = `const errorPage = import.meta.glob("${errorPath}");
 export default Object.values(errorPage)[0];`;
          return { code };
        });
      }
    }
  };
  async function importUnagiConfig() {
    if (server) {
      const loaded2 = await server.ssrLoadModule(VIRTUAL_PROXY_UNAGI_CONFIG_ID);
      return loaded2.default;
    }
    const { loaded } = await viteception([VIRTUAL_PROXY_UNAGI_CONFIG_ID]);
    return loaded[0].default;
  }
};
async function findUnagiConfigPath(root, userProvidedPath) {
  console.log("find", root, userProvidedPath);
  let configPath = userProvidedPath;
  if (!configPath) {
    const files = await fs.readdir(root);
    configPath = files.find((file) => /^unagi\.config\.[jt]s$/.test(file));
  }
  console.log("configPath", configPath);
  if (configPath) {
    configPath = normalizePath(configPath);
    if (!configPath.startsWith("/"))
      configPath = path.resolve(root, configPath);
  }
  console.log("configPath", configPath);
  return configPath || require.resolve("@tamagui/unagi/utilities/empty-unagi-config");
}
export {
  UNAGI_DEFAULT_SERVER_ENTRY,
  VIRTUAL_PROXY_UNAGI_CONFIG_ID,
  VIRTUAL_PROXY_UNAGI_ROUTES_ID,
  virtualFilesPlugin_default as default
};
//# sourceMappingURL=virtualFilesPlugin.js.map

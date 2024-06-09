"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var virtualFilesPlugin_exports = {};
__export(virtualFilesPlugin_exports, {
  UNAGI_DEFAULT_SERVER_ENTRY: () => UNAGI_DEFAULT_SERVER_ENTRY,
  VIRTUAL_PROXY_UNAGI_CONFIG_ID: () => VIRTUAL_PROXY_UNAGI_CONFIG_ID,
  VIRTUAL_PROXY_UNAGI_ROUTES_ID: () => VIRTUAL_PROXY_UNAGI_ROUTES_ID,
  default: () => virtualFilesPlugin_default
});
module.exports = __toCommonJS(virtualFilesPlugin_exports);
var import_fs = require("fs");
var import_path = __toESM(require("path"));
var import_vite = require("vite");
var import_viteception = require("../viteception.js");
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
    const { loaded } = await (0, import_viteception.viteception)([VIRTUAL_PROXY_UNAGI_CONFIG_ID]);
    return loaded[0].default;
  }
};
async function findUnagiConfigPath(root, userProvidedPath) {
  console.log("find", root, userProvidedPath);
  let configPath = userProvidedPath;
  if (!configPath) {
    const files = await import_fs.promises.readdir(root);
    configPath = files.find((file) => /^unagi\.config\.[jt]s$/.test(file));
  }
  console.log("configPath", configPath);
  if (configPath) {
    configPath = (0, import_vite.normalizePath)(configPath);
    if (!configPath.startsWith("/"))
      configPath = import_path.default.resolve(root, configPath);
  }
  console.log("configPath", configPath);
  return configPath || require.resolve("@tamagui/unagi/utilities/empty-unagi-config");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UNAGI_DEFAULT_SERVER_ENTRY,
  VIRTUAL_PROXY_UNAGI_CONFIG_ID,
  VIRTUAL_PROXY_UNAGI_ROUTES_ID
});
//# sourceMappingURL=virtualFilesPlugin.js.map
